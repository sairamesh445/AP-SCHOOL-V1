const base = 'https://myneta.info/AndhraPradesh2024/index.php?action=show_winners&sort=default';
const html = await fetch(base).then((r) => r.text());
const pages = [...html.matchAll(/show_winners[^"'<>]*/g)].map((m) => m[0]);
console.log('unique links', [...new Set(pages)].slice(0, 20));
for (const suffix of ['&page=2', '&page_no=2', '&start=50', '&limit=50&offset=50']) {
  const url = base + suffix;
  const h = await fetch(url).then((r) => r.text());
  const rows = (h.match(/<td>\d+<\/td>/g) || []).length;
  console.log(suffix, 'rows', rows);
}
