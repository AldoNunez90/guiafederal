# Segunda prueba: catálogo federal, personas y propuestas

## Muestra

Diez fichas con marca oficial: las cinco previas y Aconcagua Radio (Mendoza), Cadena 3 y El Doce (Córdoba), Radio Universidad UNLP (Buenos Aires) y LM Neuquén en Vivo (Neuquén). Las marcas se tomaron de sus webs oficiales; no se generaron logos. Aconcagua no publica un canal de YouTube identificable en la página consultada: conserva web y programación, sin inventar canal ni vivo.

La importación conservadora sólo completa campos vacíos y añade relaciones nuevas; no borra alias ni personas existentes. Se aplicó a MongoDB. El snapshot JSON es respaldo y no reemplaza ediciones de Atlas.

## Fuentes de personas (28/10/2026)

- Aconcagua: Pablo Pérez Delgado, Pablo Segura, Emiliano Serrano y Andrea Sanhueza, según https://www.aconcaguaradio.com/ .
- UNLP: Ariel Valeri y Juliana Godoy, según https://www.radiouniversidad.unlp.edu.ar/shows/un-monton-de-gente/ .
- LM Neuquén: Yamil González, Luciano García Tauro (Lulo García Tauro), Agostina Palladino (Agos) y Nacho Maccarone. Fuente: https://www.lmneuquen.com/neuquen/lm-neuquen-vivo-como-es-la-nueva-apuesta-streaming-que-arranca-este-lunes-2-marzo-n1229849 . Es la presentación de programación de marzo: requiere revisión editorial si cambió el equipo.
- Cadena 3: Sergio Suppo, vinculado a dirección periodística, según https://www.cadena3.com/autor/sergio-suppo/362855 . No se le asigna conducción por inferencia.
- Radio Sudamericana: Clara Aquino De Costa / Sentirse Bien, según la indicación de programación de https://www.radiosudamericana.com/ .

No se completaron personas de los demás medios sin evidencia. Los doce vínculos nuevos son una muestra verificable, no una grilla completa.

## Personas compartidas

El panel ofrece seleccionar personas existentes y reutiliza su ID. Permite vincularlas a otro medio con rol/programa propio. La búsqueda pública encuentra todos los medios relacionados por nombre o alias y admite acentos. No se inventó un vínculo real sólo para probar dos medios: ese caso se verifica con datos simulados. Los nombres permanecen en cada vínculo; no hay edición global sincronizada de una identidad en esta etapa.

## Propuestas

El formulario ya envía a MongoDB. En esta prueba no requiere registro: el envío no acredita ser propietario. Las propuestas quedan pending, no aparecen en /api/media y sólo pueden verse con sesión privada. Límite de cinco por hora/IP y campo señuelo; validar HTTPS y tamaño, sin descargar ni ejecutar contenido de las URLs.

La bandeja del panel permite rechazar o aceptar como borrador. La aceptación reutiliza ID determinista y no crea duplicados al repetir. El editor permite verificar y luego publicar. Los enlaces de videos aportados quedan como contenido no confirmado: no habilitan Ver vivo. Propuestas del mismo sitio se deduplican por host/ruta; una solicitud anterior revisada requiere intervención del administrador para reenviarla. Si una revisión queda processing por corte del servidor, se permite retomarla a los cinco minutos.

Los borradores locales previos siguen exportables desde el formulario; no se envían automáticamente para evitar duplicaciones.

## Detector y tiempos

Se separó pilot (muestra visual) de liveMonitoring (comprobación). Se mantienen los cinco canales originales monitoreados: ampliar a diez sin cambiar frecuencia duplicaría búsquedas diarias. La búsqueda de nuevas emisiones sigue cada dos horas; las ya encontradas se revalidan cada dos minutos con visitantes. El cambio de canal descarta caché anterior; no hay procesos activos sin visitas. No se aumentó frecuencia sin conocer la cuota real del proyecto. Esta demora debe medirse antes de prometer una guía inmediata.

## Cómo probar

Publicar código y recursos nuevos. En /admin revisar la lista de personas y las propuestas. En la guía buscar Pablo Segura, Ariel Valeri, Lulo García Tauro y AO. Enviar una propuesta ficticia identificada como prueba, aceptar como borrador y verificar que no se publique hasta cambiar su estado. No usar nombres o relaciones ficticias en medios publicados.
