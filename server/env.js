import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
// Nunca importar este módulo desde dist. En Vercel se usan variables del proyecto.
export function loadLocalCredentials(){
 if(process.env.VERCEL)return;
 const file=fileURLToPath(new URL('../atlas-credentials.env',import.meta.url));
 if(existsSync(file))process.loadEnvFile(file);
}
