import {test} from 'node:test';
import assert from 'node:assert/strict';
import {youtubeVideoId,youtubeEmbedURL,youtubeStream,currentLiveStream} from '../dist/youtube.js';
test('Acepta formatos oficiales de video',()=>{for(const url of ['https://www.youtube.com/watch?v=xPpjabxyWc4&t=20','https://youtu.be/xPpjabxyWc4','https://www.youtube.com/live/xPpjabxyWc4?feature=share','https://www.youtube.com/embed/xPpjabxyWc4'])assert.equal(youtubeVideoId(url),'xPpjabxyWc4')});
test('Rechaza canales, hosts ajenos, scripts e identificadores inválidos',()=>{for(const url of ['https://www.youtube.com/@luzutv','https://www.youtube.com/channel/UC123','https://youtube.com.evil.test/watch?v=xPpjabxyWc4','javascript:alert(1)','https://evil.test/xPpjabxyWc4','https://youtube.com/watch?v=abc','https://youtube.com/embed/live_stream?channel=UC123'])assert.equal(youtubeVideoId(url),null)});
test('Embed oficial con origen y reproducción inline',()=>{const u=new URL(youtubeEmbedURL('xPpjabxyWc4','http://localhost:4173'));assert.equal(u.hostname,'www.youtube.com');assert.equal(u.searchParams.get('playsinline'),'1');assert.equal(u.searchParams.get('origin'),'http://localhost:4173');assert.throws(()=>youtubeEmbedURL('../bad'))});
test('Elige únicamente una señal de YouTube válida',()=>{assert.equal(youtubeStream({streams:[]}),null);assert.equal(youtubeStream({streams:[{provider:'youtube',url:'https://youtube.com/@canal'}]}),null);assert.ok(youtubeStream({streams:[{provider:'youtube',url:'https://youtu.be/xPpjabxyWc4'}]}))});

test('Ver vivo requiere señal confirmada reciente y no grabación',()=>{
 const now=Date.parse('2026-10-28T15:00:00Z');const signal={provider:'youtube',url:'https://youtu.be/xPpjabxyWc4',status:'live',contentKind:'live',lastCheckedAt:'2026-10-28T14:59:00Z',expiresAt:'2026-10-28T15:04:00Z'};
 assert.ok(currentLiveStream({streams:[signal]},now));
 for(const patch of [{status:'unknown'},{contentKind:'published_video'},{expiresAt:'2026-10-28T14:59:59Z'},{lastCheckedAt:'2026-10-28T14:50:00Z'},{lastCheckedAt:'2026-10-28T15:01:00Z'},{lastCheckedAt:null},{url:'https://youtube.com/@canal'}])assert.equal(currentLiveStream({streams:[{...signal,...patch}]},now),null);
 assert.equal(currentLiveStream({streams:[]},now),null);
});
