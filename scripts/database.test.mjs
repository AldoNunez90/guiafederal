import {test} from 'node:test';
import assert from 'node:assert/strict';
import {publicMedia} from '../server/public-media.js';
import handler from '../api/media.js';
test('La respuesta pública excluye contactos, secretos y datos internos',()=>{const result=publicMedia({id:'medio-001',name:'Medio',privateContact:'privado',password:'secreto',_id:'interno',streams:[{provider:'youtube',url:'https://youtu.be/xPpjabxyWc4',internalToken:'secreto'}]});assert.equal(result.password,undefined);assert.equal(result.privateContact,undefined);assert.equal(result._id,undefined);assert.equal(result.streams[0].internalToken,undefined);assert.equal(result.name,'Medio')});
test('La API pública rechaza escritura sin consultar la base',async()=>{const headers={};let body;const res={setHeader:(k,v)=>headers[k]=v,end:x=>body=x};await handler({method:'POST'},res);assert.equal(res.statusCode,405);assert.equal(headers.Allow,'GET');assert.equal(headers['Cache-Control'],'no-store');assert.ok(body)});
