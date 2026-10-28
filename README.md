# Señal Federal — prototipo local

Guía participativa de medios argentinos. Nombre provisional. Primera etapa sin dependencias, cuentas externas, claves ni cargos de infraestructura.

## Abrir

Requisito: Node.js instalado.

Desde esta carpeta, ejecutar `npm start` y abrir http://127.0.0.1:4173. Para validar el catálogo: `npm run check`.

## Qué funciona

- Catálogo inicial de 30 fichas en 12 jurisdicciones; búsqueda sin distinguir acentos; filtros por provincia, tipo, tema y estado.
- Favoritos guardados en el navegador, sin registro.
- Enlaces externos a sitios/canales y a las fuentes del relevamiento.
- Formulario que guarda borradores locales y permite exportarlos a JSON. No envía ni publica solicitudes.
- Diseño adaptable a celulares y computadoras.

## Límites de esta etapa

No hay cuentas, servidor de datos compartido, moderación operativa ni detección automática de directos. Hay un reproductor oficial de YouTube para fichas con video específico configurado; no se garantiza continuidad al cambiar de aplicación. El filtro en vivo devuelve un estado vacío explícito, porque todas las señales están sin verificar. Los monogramas son marcadores temporales, no logos oficiales. Las ubicaciones y categorías son una clasificación editorial preliminar, pendiente de confirmación con los medios. Los datos locales se pueden perder al borrar el almacenamiento del navegador y no se sincronizan entre dispositivos.

## Archivos

`dist/` es la web estática; `dist/data/media.json` es el catálogo editable. `docs/` contiene alcance, relevamiento y modelo de datos. `scripts/` contiene el servidor local y la validación. Sin instalación de paquetes.

## Siguiente etapa

Validar señales representativas y logos con sus responsables; ampliar cobertura a provincias faltantes y medios pequeños; evaluar audio directo en Android e iOS. Incorporar cuentas y solicitudes compartidas sólo cuando se decida abrir una prueba pública. No se creó ni contrató ningún servicio.

## Reproductor de YouTube

Radio Sudamericana tiene un video identificado en su sitio oficial. Tocá su nombre para abrirlo. Puede haber terminado y no se etiqueta como en vivo. El reproductor persiste al buscar o guardar favoritos y Cerrar detiene la reproducción. Abrir en YouTube queda siempre disponible. No se carga YouTube antes de seleccionar una señal. Los medios sin video específico conservan el acceso externo.

Pruebas: `node --test scripts/youtube.test.mjs`. Los tests validan enlaces y construcción del embed; no acreditan reproducción real ni compatibilidad móvil.

## Publicar en Vercel sin GitHub

Publicar desde la carpeta raíz `guia`, que contiene `vercel.json` y `dist`. Ejecutar `vercel --prod` en esa carpeta, vinculando el proyecto de Vercel correcto. La configuración del archivo indica un sitio estático sin instalación ni compilación, con salida `dist`.

Si se usa el panel: Framework Preset Other, Root Directory raíz del proyecto y Output Directory dist. No subir solamente index.html: también son necesarios theme.css, style.css, app.js, youtube.js y data/media.json. No agregar una regla que envíe las solicitudes de CSS/JS a index.html.

Después de publicar, comprobar /theme.css y /style.css: deben devolver CSS, no una página HTML o un error. Revisar también /app.js y /data/media.json. El archivo local no modifica publicaciones anteriores: hay que volver a desplegar.

## Muestra de cinco medios

La sección Para probar incluye Vorterix, Radio Sudamericana, La Coope, AIRE y Canal 10 Tucumán, con logos obtenidos de sus sitios oficiales. Tres ofrecen videos publicados (no vivos confirmados); dos mantienen acceso externo. Procedencia y pendientes en docs/muestra-piloto.md. Reiniciar npm start si el servidor anterior no mostraba imágenes SVG. Verificación visual de escritorio completada; prueba en teléfono real pendiente.

## Catálogo MongoDB

Conexión e importación inicial completadas: 30 medios en guia_federal.media. Reiniciar npm start para usar /api/media. Herramientas: npm run db:status, npm run db:seed y npm run db:live. Ver docs/mongodb.md para actualización manual y variables requeridas en Vercel. La detección automática todavía no está implementada.
