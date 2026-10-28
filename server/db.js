import {MongoClient} from 'mongodb';
import {loadLocalCredentials} from './env.js';
loadLocalCredentials();
let connection;
export const databaseName=()=>process.env.MONGODB_DB||'guia_federal';
export function configured(){return Boolean(process.env.MONGODB_URI)}
export async function database(){
 if(!configured())throw new Error('DATABASE_NOT_CONFIGURED');
 if(!connection){
 let uri=process.env.MONGODB_URI;
 for(const [key,value] of [['username',process.env.MONGODB_USERNAME],['password',process.env.MONGODB_PASSWORD]]){
  if(value)uri=uri.replaceAll('<'+key+'>',encodeURIComponent(value)).replaceAll('<db_'+key+'>',encodeURIComponent(value));
 }
 const options={maxPoolSize:5,serverSelectionTimeoutMS:8000,connectTimeoutMS:8000};
 if(process.env.MONGODB_USERNAME&&process.env.MONGODB_PASSWORD)options.auth={username:process.env.MONGODB_USERNAME,password:process.env.MONGODB_PASSWORD};
 const client=new MongoClient(uri,options);
 connection=client.connect().then(()=>client).catch(async(error)=>{
 connection=undefined;await client.close();
 // Sólo categorías: nunca imprimir message, URI ni el error completo.
 const names=[error?.name,error?.cause?.name];
 const code=error?.code===18?'MONGO_AUTH_FAILED':names.includes('MongoServerSelectionError')?'MONGO_CONNECTION_TIMEOUT':names.some(n=>n==='MongoParseError'||n==='MongoInvalidArgumentError')?'MONGO_URI_INVALID':'MONGO_CONNECTION_FAILED';
 console.error('[catalog]',code);
 throw new Error('DATABASE_CONNECTION_FAILED');
 });
 }
 return (await connection).db(databaseName());
}
export async function closeDatabase(){if(connection){const client=await connection;connection=undefined;await client.close()}}
