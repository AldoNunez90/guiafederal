import {refreshPilotLive} from '../server/youtube-live.js';
import {database,configured} from '../server/db.js';
import {publicMedia,publicProjection} from '../server/public-media.js';
export default async function handler(req,res){
 res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET'){res.setHeader('Allow','GET');res.statusCode=405;return res.end(JSON.stringify({error:'Método no permitido'}))}
 if(!configured()){res.statusCode=503;return res.end(JSON.stringify({error:'Catálogo no configurado'}))}
 try{const db=await database();try{await refreshPilotLive(db)}catch{console.error('[live-check] REFRESH_FAILED')}const docs=await db.collection('media').find({publicationStatus:'published'},{projection:publicProjection}).sort({province:1,name:1}).limit(5000).toArray();res.statusCode=200;res.end(JSON.stringify(docs.map(publicMedia)))}
 catch(error){if(error?.message!=='DATABASE_CONNECTION_FAILED')console.error('[catalog]',error?.code===13?'MONGO_PERMISSION_DENIED':error?.name==='MongoParseError'?'MONGO_URI_INVALID':'MONGO_QUERY_FAILED');res.statusCode=503;res.end(JSON.stringify({error:'Catálogo temporalmente no disponible'}))}
}
