import {parseArgs} from 'node:util';
import {database,closeDatabase} from '../server/db.js';
import {youtubeVideoId} from '../dist/youtube.js';
try{
 const {values:v}=parseArgs({options:{id:{type:'string'},state:{type:'string'},url:{type:'string'},title:{type:'string'}}});
 if(!v.id||!['live','offline','unknown'].includes(v.state)||v.state==='live'&&!youtubeVideoId(v.url))throw Error();
 const db=await database();const now=new Date();const update={liveStatus:v.state,lastCheckedAt:now.toISOString(),updatedAt:now};
 if(v.state==='live')update.streams=[{provider:'youtube',url:'https://www.youtube.com/watch?v='+youtubeVideoId(v.url),title:v.title||'Transmisión en vivo',status:'live',contentKind:'live',lastCheckedAt:now.toISOString(),expiresAt:new Date(now.getTime()+300000).toISOString()}];
 else {const m=await db.collection('media').findOne({id:v.id});if(!m)throw Error();update.streams=(m.streams||[]).map(s=>({...s,status:v.state,expiresAt:now.toISOString()}));}
 const result=await db.collection('media').updateOne({id:v.id},{$set:update});if(!result.matchedCount)throw Error();
 console.log('Estado actualizado: '+v.id+' → '+v.state+'. Las confirmaciones de vivo vencen a los cinco minutos.');
}catch{console.error('No se pudo actualizar. Uso: npm run db:live -- --id medio-019 --state live --url URL_YOUTUBE --title "Programa". Confirmá primero que la emisión está realmente en vivo.');process.exitCode=1}finally{await closeDatabase().catch(()=>{})}
