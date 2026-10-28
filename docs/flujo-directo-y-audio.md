# Flujo directo, contadores y audio

La exportación de borradores se retiró del formulario público y del código. Era una función de la primera prueba local.

Cada propuesta válida crea directamente media en publicationStatus=draft y reviewStatus=pending, con ID derivado de la URL canónica. Aparece en la lista del panel sin pasar por otra bandeja. El administrador revisa y cambia Publicación a Publicado para aprobar; nunca se publica automáticamente contenido aportado por visitantes. El registro submissions sigue como procedencia y deduplicación interna. Reenviar no duplica ni reemplaza ediciones existentes. Los pendientes anteriores se migraron conservando sus fichas.

El panel incluye filtros con contadores: total, vivo confirmado vigente, fuera de línea confirmado, sin vivo confirmado, borradores y pendientes. Pendientes es subconjunto de borradores, no debe sumarse al resto. Los errores/cachés vencidas no se llaman offline. Los contadores se recalculan al cargar/actualizar la lista y guardar ediciones.

Radios: prioridad video confirmado > audio configurado > web. audioUrl es URL HTTPS de una señal directa publicada por el medio, sin retransmisión de nuestros servidores. Se integró control HTML audio con detener al cerrar y alternativa de web. Las fuentes iniciales son https://www.cadena3.com/ (StreamTheWorld radio3.mp3) y https://www.aconcaguaradio.com/ (server.streamcasthd.com/8756/stream). La disponibilidad real puede variar; no se promete reproducción en segundo plano. Audio configurado no certifica programación en vivo.

El panel permite editar audioUrl. La integración de un iframe específico de proveedor es otra modalidad: requiere autorización técnica para embeber, soporte móvil y respetar las condiciones del medio/proveedor; no cualquier sitio acepta estar dentro de un iframe. No se aceptan fragmentos HTML aportados por visitantes.

Cadena 3 estaba fuera del monitoreo por el límite de la prueba. Se activó y se separó su señal principal de las emisiones de La Popu mediante youtubeLiveTitleMatch. Vorterix estaba en el intervalo de espera de dos horas; consulta real forzada encontró un vivo vigente y lo guardó. Ahora hay seis canales monitorizados, con máximo aproximado de 72 búsquedas/día en actividad continua. La espera de descubrimiento sigue siendo de hasta dos horas, no se promete detección instantánea. Los videos activos se revalidan por visitas cada dos minutos.

Código local pendiente de publicación. Los cambios de datos en Atlas se aplicaron. Pruebas de audio en teléfonos reales quedan pendientes.
