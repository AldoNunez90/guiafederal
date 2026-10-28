# Detector de YouTube — primera etapa

Requiere YOUTUBE_API_KEY local y en Vercel (variable sólo del servidor), con YouTube Data API v3 habilitada. No usar clave en el frontend. No se consultó YouTube real: falta la clave. Pruebas simuladas completadas.

Al consultar /api/media se comprueban hasta cinco medios piloto. Si no hay clave, no se consulta YouTube ni se modifica el catálogo. No se creó una tarea cron: la comprobación se activa con visitas, y la web consulta cada minuto cuando está visible. Sin visitantes no hay comprobaciones ni consumo de YouTube.

Se resuelve el ID oficial a partir de youtubeChannel y se conserva en MongoDB. Se buscan emisiones eventType=live; luego videos.list confirma mismo canal, estado live, inicio efectivo, ausencia de fin, privacidad pública y permiso de embed. Las grabaciones, programados y videos no integrables no habilitan Ver vivo. Una confirmación vence a los cinco minutos. Los fallos no renuevan confirmaciones anteriores.

Para cuidar la cuota inicial: nuevas emisiones se buscan como máximo cada dos horas por medio (aproximadamente 60 búsquedas por día para cinco medios bajo uso continuo). Esto puede demorar hasta dos horas el descubrimiento de un nuevo vivo. Un vivo ya encontrado se revalida hasta cada dos minutos mientras haya consultas. La reserva se guarda en MongoDB para que visitantes concurrentes no multipliquen llamadas. Los fallos tienen una pausa de 15 minutos.

Las cuotas efectivas dependen del proyecto de Google. Comprobar en su consola y ajustar estrategia antes de ampliar el catálogo. No se pretende monitoreo inmediato con esta configuración conservadora.

Prueba manual: npm run db:detect. Respeta las mismas reservas/cachés que la API. Errores visibles como comprobación fallida sin mostrar respuestas que puedan contener credenciales. Los errores no confirman offline: se conserva unknown y se usa Abrir web cuando la confirmación previa vence.

Verificación: node --test scripts/live-detection.test.mjs scripts/youtube.test.mjs scripts/database.test.mjs. La validación real y la prueba en Vercel quedan pendientes hasta disponer de la clave.
