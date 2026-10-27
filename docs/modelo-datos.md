# Modelo de datos previsto

## Implementado en JSON

Medio: id estable, name, province, city, kind, topics, website, logo (null hasta obtenerlo), source, researchStatus, researchDate, liveStatus, lastCheckedAt, streams y notes. Todos los streams están vacíos; nunca inventar URL ni estado.

## Al pasar a PostgreSQL

- media: identidad editorial, descripción, ubicación, categorías, logo, estado de publicación.
- streams: media_id, proveedor, formato, URL pública validada, capacidades y autorización. Un medio admite varias señales.
- stream_checks: stream_id, fecha, resultado, evidencia y caducidad. Historial separado del estado actual.
- submissions: propuesta, autor autenticado, revisión, decisión, fecha y observaciones; no publicar directamente.
- media_members: relación de usuarios con medios y rol verificado.
- favorites: usuario y medio; mantener opción local para visitantes.
- programs y episodes: futura programación y enlaces al archivo original.

Autenticación y políticas de acceso deben proteger cambios y contactos privados. Guardar procedencia por campo cuando haya edición colaborativa. Confirmar duplicados por identificador de plataforma o URL canónica, no sólo nombre.
