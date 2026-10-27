# Primera integración de YouTube

Sin API key, servicios pagos ni detección automática. Catálogo JSON hasta conectar MongoDB. `youtubeChannel` conserva el canal oficial; `streams` admite videos específicos con procedencia. No se usa un handle de canal como identificador de video.

Enlace de Radio Sudamericana: https://www.youtube.com/watch?v=xPpjabxyWc4 obtenido del embed de https://www.radiosudamericana.com/ el 2026-10-23. El enlace fue publicado por el medio; no se verificó reproducción, disponibilidad de embed ni si sigue en vivo. Canal 10 publica un embed por channel ID; se conserva acceso al canal hasta identificar un video concreto. AIRE enlaza su canal en https://www.airedesantafe.com.ar/santa-fe/aire-transmitira-vivo-el-fan-fest-los-juegos-suramericanos-todo-el-sabado-n670604 .

Para actualizar una emisión: editar `streams` del medio con provider youtube, url de watch/live/youtu.be y fuente. Mantener liveStatus unknown hasta tener evidencia vigente. El formulario admite un enlace de video opcional en los borradores locales.

La instancia del iframe queda fuera de la lista para que filtros y favoritos no la reconstruyan. Cambiar de medio reemplaza el iframe; cerrarlo lo destruye. Sin reproductor oculto ni extracción de audio. Mínimo de 200 px de alto, controles oficiales y referrer para evitar ausencia de identidad del cliente. Ver https://developers.google.com/youtube/player_parameters . En móviles de poca altura no se fija al desplazar.

Verificación manual pendiente: tocar Radio Sudamericana, iniciar reproducción si el navegador bloquea autoplay, filtrar y guardar favorito sin interrupción, cambiar de medio, cerrar y verificar silencio; probar alternativa externa ante video terminado o embed bloqueado. Probar Android/iOS y cambio de aplicación sin prometer continuidad ni PiP. No se implementó un botón PiP propio.

## Resultado de la prueba de escritorio

Se comprobó en el navegador integrado la carga de video de Radio Sudamericana, su permanencia al filtrar por nombre y el desmontaje del iframe al cerrar, con devolución de foco al botón del medio. Esto no verifica el estado actual en vivo, audio, continuidad en otras aplicaciones ni comportamiento móvil. La prueba de Android/iOS continúa pendiente.
