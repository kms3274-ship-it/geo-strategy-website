import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { getStore } from '@netlify/blobs';

const FEED = 'https://rss.blog.naver.com/kimms3274.xml';
const MAX_AGE = 60 * 60 * 1000;

export function parseFeed(xml) {
  if (/<!DOCTYPE|<!ENTITY/i.test(xml) || XMLValidator.validate(xml) !== true) throw new Error('Invalid RSS');
  const channel = new XMLParser({ ignoreAttributes: true, parseTagValue: false }).parse(xml)?.rss?.channel;
  if (!channel) throw new Error('Missing RSS channel');
  const items = Array.isArray(channel.item) ? channel.item : channel.item ? [channel.item] : [];
  const seen = new Set();
  return items.flatMap(item => {
    try {
      const url = new URL(String(item.link));
      if (url.protocol !== 'https:' || url.hostname !== 'blog.naver.com' || !/^\/kimms3274\/\d+$/.test(url.pathname)) return [];
      url.search = ''; url.hash = '';
      const title = String(item.title || '').replace(/<[^>]*>/g, '').trim().slice(0, 300);
      const date = new Date(item.pubDate);
      if (!title || !Number.isFinite(date.getTime()) || seen.has(url.href)) return [];
      seen.add(url.href);
      return [{ title, url: url.href, date: date.toISOString() }];
    } catch { return []; }
  }).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
}

export async function loadPosts({ fetcher = fetch, store, now = Date.now() } = {}) {
  let cached;
  try { cached = await store?.get('latest', { type: 'json' }); } catch { /* RSS remains usable without storage. */ }
  if (cached?.posts?.length && now - cached.updatedAt < MAX_AGE) return { posts: cached.posts, stale: false };
  try {
    const response = await fetcher(FEED, { signal: AbortSignal.timeout(8000), headers: { Accept: 'application/rss+xml, application/xml' } });
    if (!response.ok) throw new Error('RSS unavailable');
    const xml = await response.text();
    if (xml.length > 2_000_000) throw new Error('RSS too large');
    const posts = parseFeed(xml);
    if (!posts.length) throw new Error('No public posts');
    try { await store?.setJSON('latest', { posts, updatedAt: now }); } catch { /* Still serve fresh posts. */ }
    return { posts, stale: false };
  } catch (error) {
    if (cached?.posts?.length) return { posts: cached.posts, stale: true };
    throw error;
  }
}

export default async function handler(request) {
  if (request.method !== 'GET') return new Response(null, { status: 405, headers: { Allow: 'GET' } });
  let store;
  try { store = getStore({ name: 'naver-blog-feed', consistency: 'strong' }); } catch { /* Local preview has no Blobs context. */ }
  try {
    const result = await loadPosts({ store });
    return Response.json(result, { headers: { 'Cache-Control': result.stale ? 'public, max-age=60' : 'public, max-age=300', 'Netlify-CDN-Cache-Control': result.stale ? 'public, s-maxage=60' : 'public, s-maxage=3600', 'X-Content-Type-Options': 'nosniff' } });
  } catch {
    return Response.json({ posts: [], unavailable: true }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
