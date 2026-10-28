# MongoDB — catálogo compartido

## Implementado

Base guia_federal, colección media. Documento por medio con id estable, ubicación, categorías, logos, accesos, canales y streams. publicationStatus controla publicación. streams conserva estado, video, última comprobación y vencimiento. Fechas de verificación de señales en ISO para compartir el condicional con la web.

Índices: id único; publicationStatus/province/kind para filtros futuros; texto español sobre name/city. Por ahora la API obtiene el catálogo completo y los filtros se ejecutan en el navegador, manteniendo la UX actual.

La API /api/media sólo acepta GET, devuelve campos públicos y nunca credenciales ni contactos privados. Se reutiliza una conexión con un pool de hasta cinco conexiones por instancia. Los errores al cliente son genéricos. Si falla Atlas, el navegador usa el catálogo JSON sin habilitar ningún vivo de respaldo. Consulta cambios una vez por minuto mientras la página está visible, sin reconstruir el reproductor. Favoritos e historial siguen locales.

## Uso local

Node 22 o superior. atlas-credentials.env permanece en la raíz del proyecto y está excluido de Git y de las subidas directas a Vercel. No moverlo a dist. Se cargan MONGODB_URI, MONGODB_USERNAME y MONGODB_PASSWORD. MONGODB_DB es opcional; predeterminado guia_federal. Nunca imprimir ni compartir el archivo.

- npm run db:status: comprueba conexión y cantidad de publicados.
- npm run db:seed: importa fichas nuevas con setOnInsert. Repetir no sobrescribe cambios de fichas existentes.
- npm start: servidor con API local; reiniciar cualquier servidor viejo.
- npm run db:live -- --id medio-019 --state live --url "https://www.youtube.com/watch?v=ID_DEL_VIDEO" --title "Programa": confirmar manualmente una emisión realmente en vivo. ID_DEL_VIDEO debe ser un identificador real de 11 caracteres.
- npm run db:live -- --id medio-019 --state offline: deshabilita el vivo. unknown también es válido.

Las confirmaciones manuales vencen a los cinco minutos. Esto evita dejar grabaciones como vivos y es un puente hacia el detector automático, no una forma de mantener directos durante horas. No se estableció ningún vivo ficticio para probar producción. No existe un endpoint de escritura ni un panel público; esas funciones requerirán autenticación.

## Vercel

El archivo de credenciales NO se publica. Configurar en Settings > Environment Variables las tres variables con sus valores desde el archivo local y opcionalmente MONGODB_DB=guia_federal; usar los entornos correspondientes y volver a desplegar. No usar prefijos PUBLIC o NEXT_PUBLIC. Framework Other, raíz guia, salida dist. npm ci instala también el controlador de la función Node en api/media.js.

El acceso de red de Atlas debe admitir las conexiones desde el entorno desplegado. No se modificó la lista de acceso, ni se abrió a todas las IP. Si local funciona y Vercel devuelve 503, revisar variables, acceso de red y permisos del usuario. El URI y las contraseñas se mantienen sólo del lado servidor.

## Verificaciones

Prueba real de conexión y primera importación: 30 documentos publicados. Tests: node --test scripts/database.test.mjs scripts/youtube.test.mjs. Comprobar en producción /api/media después del despliegue; la configuración de variables y la prueba remota aún están pendientes.
