# Alcance y presupuesto

Fecha: 23 de octubre de 2026.

## Decisión inicial

Validar una web mobile local, sin pagos ni proveedores obligatorios. HTML/CSS/JavaScript con catálogo JSON portable; Node.js sólo para servir los archivos durante desarrollo. La base inicial es un archivo estructurado, no una base multiusuario. No se garantiza costo cero a cualquier escala.

## Etapas

1. Catálogo y navegación local: búsqueda, filtros, favoritos y borradores exportables.
2. Calidad de catálogo: validar 30 fichas, completar logos y contactos, ampliar provincias y pequeños medios. No usar audiencia como criterio de inclusión.
3. Prueba de reproducción: al menos un audio directo autorizado, un video directo y un canal YouTube. Probar teléfono bloqueado, cambio de app, auriculares, interrupciones y reconexión en Android/iOS. Hoy ninguna señal fue probada reproduciendo.
4. Prueba pública: elegir alojamiento gratuito, base compartida, autenticación y moderación. Supabase/PostgreSQL es una opción; revisar límites vigentes antes de usarla. No guardar secretos en el navegador. No permitir que usuarios aprueben sus propias solicitudes.
5. App móvil con React Native/Expo si la prueba justifica sostenerla; reutilizar datos y reglas.

## Costos evitados

Sin retransmisión propia, almacenamiento de grabaciones, API de pago, servicios de búsqueda, IA en producción ni dominios pagos. Los enlaces van al origen. Publicación en tiendas y dominio personalizado se evalúan después.

## Detección futura

Separar accesibilidad de señal y emisión realmente en vivo. Guardar estado desconocido ante falta de evidencia y caducar comprobaciones viejas. Usar tareas centrales con caché y frecuencia adaptativa. Un HTTP 200 no certifica reproducción ni contenido en directo. Respetar límites de API. Nunca consultar indiscriminadamente direcciones aportadas por usuarios: validar destino público, bloquear redes internas/redirecciones peligrosas y poner límites de tiempo y tamaño.

## Reproducción

YouTube requiere integración oficial y no permite ofrecer reproducción en segundo plano ni extracción de audio. Para escucha continua se necesita una señal independiente apta y autorizada. No prometer reproducción en segundo plano desde esta web antes de probar cada plataforma.

Fuentes: https://developers.google.com/youtube/terms/developer-policies y https://docs.expo.dev/versions/latest/sdk/audio/
