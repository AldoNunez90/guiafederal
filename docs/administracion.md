# Panel privado y búsqueda por personas

Acceso: /admin (también /admin.html). Usa las mismas variables de Atlas y dos variables sólo del servidor: ADMIN_PASSWORD (mínimo 16 caracteres) y ADMIN_SESSION_SECRET (mínimo 32). Se generaron valores locales aleatorios en atlas-credentials.env, sin mostrarlos. Copiar ambos a las variables de Vercel y redesplegar. La contraseña se consulta en ese archivo local; no compartirla ni subirla a Git. Reiniciar npm start para cargarla en local. Cualquier modificación del secreto invalida las sesiones anteriores.

Autenticación con cookie HttpOnly, SameSite Strict y Secure en Vercel, firmada y con vencimiento a ocho horas. Contraseña verificada sólo en el servidor. Cinco intentos por ventana de 15 minutos e IP; contadores temporales en MongoDB, con índice TTL. Sin registro de usuarios público. La página HTML es accesible, pero lista y escrituras requieren sesión válida. Escrituras con comprobación de origen, límite de tamaño y validación de campos. Conflictos de edición devuelven 409 sin sobrescribir datos de otra sesión.

Se editan nombre, provincia, localidad, tipo, temas, publicación, web, canal, logo y fondo. El logo puede ser URL HTTPS o ruta local assets/logos; no hay subida de archivos. Cambiar canal invalida la confirmación de vivo anterior. Borrador retira el medio de la consulta pública. No hay eliminación ni creación de medios en esta etapa.

Personas se guardan en media.people: id estable, name, aliases, role y program. Es una relación editorial por medio; una persona puede vincularse a varios. El panel permite agregar/quitar relaciones, no inventa nombres. Los roles son Conductor/a, Streamer, Panelista u Otro. Sólo nombres y alias públicos. La API pública expone esa relación y la búsqueda incluye nombres, alias y programa sin distinguir acentos. Por ahora se permite carga libre; en una etapa posterior se puede normalizar en una colección people y seleccionar identidades compartidas para evitar duplicados.

Vivos: fondo y borde diferenciados, punto rojo de pulso suave y etiqueta textual. El pulso respeta prefers-reduced-motion. Los colores nuevos están en theme.css. El destacado usa la misma confirmación vigente que habilita Ver vivo; no depende de un horario supuesto.

Pruebas: node --test scripts/*.test.mjs. Verificar en móvil /admin, acceso con contraseña, edición de persona y búsqueda pública. No se cargaron conductores reales sin verificar su vínculo con cada medio.
