const list = document.getElementById('naver-posts');
const status = document.getElementById('naver-posts-status');
if (list && status) {
  fetch('/.netlify/functions/naver-posts', { signal: AbortSignal.timeout(12000) })
    .then(response => { if (!response.ok) throw new Error('Unavailable'); return response.json(); })
    .then(data => {
      if (!Array.isArray(data.posts) || !data.posts.length) throw new Error('Empty feed');
      const fragment = document.createDocumentFragment();
      for (const post of data.posts) {
        const url = new URL(post.url);
        if (url.protocol !== 'https:' || url.hostname !== 'blog.naver.com' || !/^\/kimms3274\/\d+$/.test(url.pathname)) continue;
        const date = new Date(post.date);
        if (!Number.isFinite(date.getTime())) continue;
        const link = document.createElement('a');
        link.className = 'article'; link.href = url.href;
        link.target = '_blank'; link.rel = 'noopener noreferrer';
        const body = document.createElement('div');
        const title = document.createElement('p'); title.textContent = post.title;
        const meta = document.createElement('small');
        const time = document.createElement('time'); time.dateTime = post.date;
        time.textContent = date.toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });
        meta.append(time, ' · 네이버 블로그에서 읽기 ↗');
        body.append(title, meta); link.append(body); fragment.append(link);
      }
      if (!fragment.childNodes.length) throw new Error('Invalid feed');
      list.replaceChildren(fragment);
      status.textContent = data.stale ? '최근에 불러온 글 목록입니다. 제목을 누르면 네이버 블로그가 새 탭으로 열립니다.' : '제목을 누르면 네이버 블로그 원문이 새 탭으로 열립니다.';
    })
    .catch(() => { status.textContent = '최신 글을 불러오지 못했습니다. 아래 네이버 블로그 바로가기를 이용해 주세요.'; });
}
