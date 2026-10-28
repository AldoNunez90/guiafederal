import {readFile} from 'node:fs/promises';
import {database,closeDatabase} from '../server/db.js';
try{const patches=JSON.parse(await readFile(new URL('../docs/catalog-enrichment.json',import.meta.url),'utf8'));const db=await database();let count=0;
for(const patch of patches){const current=await db.collection('media').findOne({id:patch.id});if(!current)continue;const update={updatedAt:new Date()};if(patch.fields){for(const [k,v] of Object.entries(patch.fields)){if(['pilot','researchDate','researchStatus'].includes(k)||current[k]===null||current[k]===undefined||current[k]==='')update[k]=v;}if(!current.logo){update.logo=patch.fields.logo;update.logoSource=patch.fields.logoSource;update.logoTheme=patch.fields.logoTheme;}}
if(patch.people){const existing=current.people||[];const names=new Set(existing.map(v=>v.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()));update.people=[...existing,...patch.people.filter(v=>!existing.some(x=>x.id===v.id)&&!names.has(v.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()))];}
await db.collection('media').updateOne({id:patch.id,updatedAt:current.updatedAt},{$set:update});count++;}
const ids=['medio-006','medio-009','medio-019','medio-021','medio-025'];await db.collection('media').updateMany({pilot:true,liveMonitoring:{$exists:false}},{$set:{liveMonitoring:false}});await db.collection('media').updateMany({id:{$in:ids}},{$set:{liveMonitoring:true}});
console.log('Enriquecimiento aplicado: '+count+' operaciones; datos existentes y personas conservados.');
}catch{console.error('Falló el enriquecimiento. No se muestran credenciales.');process.exitCode=1}finally{await closeDatabase().catch(()=>{})}
