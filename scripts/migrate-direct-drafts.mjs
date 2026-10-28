import {database,closeDatabase} from '../server/db.js';
import {ensureSubmissionDraft} from '../server/submission-draft.js';
try{const db=await database();let count=0;for(const draft of await db.collection('submissions').find({status:'pending'}).toArray()){const mediaId=await ensureSubmissionDraft(db,draft);await db.collection('submissions').updateOne({_id:draft._id,status:'pending'},{$set:{mediaId}});count++}
 await db.collection('media').updateOne({id:'medio-016'},{$set:{liveMonitoring:true}});
 for(const [id,url,source] of [['medio-016','https://playerservices.streamtheworld.com/api/livestream-redirect/radio3.mp3','https://www.cadena3.com/'],['medio-010','https://server.streamcasthd.com/8756/stream','https://www.aconcaguaradio.com/']])await db.collection('media').updateOne({id,$or:[{audioUrl:{$exists:false}},{audioUrl:null}]},{$set:{audioUrl:url,audioSource:source,updatedAt:new Date()}});
 console.log('Pendientes incorporados a la lista: '+count+'. Cadena 3 monitoreada; audio oficial configurado en dos radios.');
}catch{console.error('Falló la migración de borradores/audio.');process.exitCode=1}finally{await closeDatabase().catch(()=>{})}
