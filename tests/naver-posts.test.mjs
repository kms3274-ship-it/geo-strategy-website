import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFeed, loadPosts } from '../netlify/functions/naver-posts.mjs';

const item = (id, title = '병원 검색 &amp; 선택', day = 24, host = 'blog.naver.com') => `<item><title>${title}</title><link>https://${host}/kimms3274/${id}?fromRss=true</link><pubDate>Tue, ${day} Nov 2026 08:00:00 +0900</pubDate></item>`;
const feed = items => `<rss><channel>${items}</channel></rss>`;
test('RSS titles are decoded; links are restricted and deduplicated; latest five are sorted', () => {
  const posts = parseFeed(feed(item(1) + item(1) + item(2, 'bad', 24, 'example.com') + Array.from({ length: 7 }, (_, i) => item(i + 3, `글 ${i}`, 23 - i)).join('')));
  assert.equal(posts.length, 5);
  assert.equal(posts[0].title, '병원 검색 & 선택');
  assert.equal(posts[0].url, 'https://blog.naver.com/kimms3274/1');
  assert.ok(posts.every(post => post.url.startsWith('https://blog.naver.com/kimms3274/')));
});
test('Malformed feeds and XML entities are rejected', () => {
  assert.throws(() => parseFeed('<rss>'));
  assert.throws(() => parseFeed('<!DOCTYPE rss><rss><channel/></rss>'));
});
test('Fresh cache avoids network; failure returns the last successful feed', async () => {
  const cached = { posts: parseFeed(feed(item(1))), updatedAt: 1000 };
  const store = { get: async () => cached };
  const fetcher = async () => { throw new Error('Network failure'); };
  assert.equal((await loadPosts({ store, fetcher, now: 2000 })).stale, false);
  const result = await loadPosts({ store, fetcher, now: 4_000_000 });
  assert.equal(result.stale, true);
  assert.deepEqual(result.posts, cached.posts);
});
test('New feed is persisted; storage failure does not hide fresh posts', async () => {
  let saved;
  const fetcher = async () => new Response(feed(item(1)));
  const store = { get: async () => null, setJSON: async (_, value) => { saved = value; } };
  assert.equal((await loadPosts({ store, fetcher, now: 123 })).posts.length, 1);
  assert.equal(saved.updatedAt, 123);
  assert.equal((await loadPosts({ fetcher, store: { get: async () => { throw Error(); } } })).posts.length, 1);
});
test('No cached feed and failed/empty RSS reports failure', async () => {
  await assert.rejects(loadPosts({ fetcher: async () => new Response('', { status: 503 }) }));
  await assert.rejects(loadPosts({ fetcher: async () => new Response(feed('')) }));
});
