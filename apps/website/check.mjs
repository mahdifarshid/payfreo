import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const publicDirectory = join(dirname(fileURLToPath(import.meta.url)), 'public');
const pages = ['index.html', 'docs.html', 'support.html'];
const expectedOrigin = 'https://mahdifarshid.github.io/payfreo/';

for (const page of pages) {
  const html = readFileSync(join(publicDirectory, page), 'utf8');

  assert.ok(/<html lang="en">/.test(html), `${page}: declare the document language`);
  assert.ok(/<meta\s+name="description"/.test(html), `${page}: add a description`);
  assert.ok(/<link\s+rel="canonical"/.test(html), `${page}: add a canonical URL`);
  assert.ok(/href="#main"/.test(html), `${page}: include a skip link`);
  assert.ok(/id="main"/.test(html), `${page}: provide a skip-link target`);

  for (const [, attribute, target] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    if (target.startsWith('./')) {
      const pathname = target === './' ? 'index.html' : target.slice(2).split('#')[0];
      assert.ok(
        existsSync(join(publicDirectory, pathname)),
        `${page}: missing ${attribute} ${target}`,
      );
    }

    if (target.startsWith('#')) {
      const fragment = target.slice(1);
      assert.ok(html.includes(`id="${fragment}"`), `${page}: missing target ${target}`);
    }
  }

  const canonical = page === 'index.html' ? expectedOrigin : `${expectedOrigin}${page}`;
  assert.ok(html.includes(`href="${canonical}"`), `${page}: canonical URL has the wrong base path`);
}

const sitemap = readFileSync(join(publicDirectory, 'sitemap.xml'), 'utf8');
for (const page of pages) {
  const url = page === 'index.html' ? expectedOrigin : `${expectedOrigin}${page}`;
  assert.ok(sitemap.includes(`<loc>${url}</loc>`), `sitemap.xml: missing ${url}`);
}
