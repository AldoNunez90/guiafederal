import {readFile} from 'node:fs/promises';
import {database,closeDatabase,databaseName} from '../server/db.js';
try{
 const records=JSON.parse(await readFile(new URL('../dist/data/media.json',import.meta.url),'utf8'));
 const db=await database();const collection=db.collection('media');
 await collection.createIndex({id:1},{unique:true});
 await collection.createIndex({publicationStatus:1,province:1,kind:1});
 await collection.createIndex({name:'text',city:'text'},{default_language:'spanish'});
 const result=await collection.bulkWrite(records.map(m=>({updateOne:{filter:{id:m.id},update:{$setOnInsert:{...m,publicationStatus:'published',createdAt:new Date(),updatedAt:new Date()}},upsert:true}})));
 console.log('Base: '+databaseName()+'. Nuevos medios: '+result.upsertedCount+'. Existentes conservados: '+result.matchedCount+'.');
}catch{console.error('No se pudo importar el catálogo. Revisá URI, usuario, permisos y acceso de red en Atlas. No se muestran credenciales.');process.exitCode=1}finally{await closeDatabase().catch(()=>{})}
