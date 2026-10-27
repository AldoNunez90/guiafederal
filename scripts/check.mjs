import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const media=JSON.parse(await readFile(new URL('../dist/data/media.json',import.meta.url),'utf8'));
assert.equal(media.length,30);assert.equal(new Set(media.map(m=>m.id)).size,media.length);
for(const m of media){assert.ok(m.name&&m.province&&m.city);assert.ok(['sitio_revisado','referencia','pendiente'].includes(m.researchStatus));assert.equal(m.liveStatus,'unknown');assert.equal(m.lastCheckedAt,null);for(const s of m.streams){assert.equal(s.provider,'youtube');assert.match(s.url,/^https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}$/);assert.ok(s.source);}for(const url of [m.source,m.website].filter(Boolean))assert.ok(['https:','http:'].includes(new URL(url).protocol));}
console.log(`Catálogo válido: ${media.length} fichas, ${new Set(media.map(m=>m.province)).size} jurisdicciones. Ningún estado en vivo inventado.`);
