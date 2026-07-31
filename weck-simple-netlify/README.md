# Weck AI Assistant — Versión Simple (Netlify)

Esta es una versión mínima: una sola página de chat + una función de Netlify.
No hay login, no hay base de datos, no hay vector search. La información de
la empresa está escrita directamente dentro de la función
(`netlify/functions/chat.js`), así que no necesitás Supabase ni configurar
nada de infraestructura. Ideal para probar el concepto en minutos.

## Lo que necesitás

- Una cuenta gratis en **[github.com](https://github.com)**
- Una cuenta gratis en **[netlify.com](https://netlify.com)**
- Una **API key de OpenAI** (desde [platform.openai.com](https://platform.openai.com/api-keys))

**No necesitás instalar Node.js en tu computadora para este método** — todo
se sube por la web y Netlify lo ejecuta en la nube.

## Paso 1 — Subir el código a GitHub (sin usar la terminal)

1. Entrá a [github.com](https://github.com) y creá una cuenta si no tenés
2. Hacé clic en el botón verde **"New"** (o el ícono **+** arriba a la
   derecha → "New repository")
3. Ponele un nombre, por ejemplo `weck-ai-assistant-simple`, dejalo en
   "Public" o "Private" (como prefieras), y hacé clic en **"Create repository"**
4. En la página del repositorio recién creado, buscá el link que dice
   **"uploading an existing file"**
5. Arrastrá y soltá **todos los archivos y carpetas de esta carpeta**
   (`index.html`, `netlify.toml`, y la carpeta `netlify/` completa con
   `functions/chat.js` adentro) en esa pantalla
6. Hacé clic en **"Commit changes"** al final de la página

## Paso 2 — Conectar con Netlify

1. Entrá a [app.netlify.com](https://app.netlify.com) y creá una cuenta
   (podés usar tu cuenta de GitHub para registrarte, es más rápido)
2. Hacé clic en **"Add new site" → "Import an existing project"**
3. Elegí **GitHub** y autorizá el acceso
4. Seleccioná el repositorio que acabás de crear
   (`weck-ai-assistant-simple`)
5. Netlify va a detectar automáticamente la configuración gracias al archivo
   `netlify.toml`. No hace falta tocar nada — hacé clic en **"Deploy site"**

## Paso 3 — Agregar tu API key de OpenAI

Esto es importante: la función necesita tu clave de OpenAI para funcionar.

1. Dentro del sitio en Netlify, andá a **"Site configuration" → "Environment
   variables"**
2. Hacé clic en **"Add a variable"**
3. Key: `OPENAI_API_KEY` — Value: pegá tu clave de OpenAI (empieza con `sk-`)
4. Guardá, y después andá a **"Deploys"** → **"Trigger deploy" → "Deploy
   site"** para que tome la nueva variable

## Paso 4 — Probarlo

Netlify te da una URL tipo `https://tu-sitio-123abc.netlify.app`. Entrá ahí,
y ya deberías poder chatear. Probá con las preguntas sugeridas o escribí la
tuya.

## Si algo no funciona

- **"OPENAI_API_KEY ist nicht konfiguriert"** → revisá el Paso 3, y que
  hayas re-deployado después de agregar la variable
- **Error de OpenAI** → revisá que tu cuenta de OpenAI tenga saldo/billing
  activo (las API keys nuevas a veces necesitan que cargues un mínimo de
  crédito en platform.openai.com/settings/billing)
- **La página no carga bien** → revisá que hayas subido también la carpeta
  `netlify/functions/` completa, no solo `index.html`

## Directorio de clientes incluido

Se incorporó el listado real de ~45 consultorios/prácticas clientas (nombre,
dirección, teléfono, e-mail, vacaciones registradas) directamente en
`KNOWLEDGE_BASE`, tomado del CRM interno (WECK DNTL CRM). Ahora se puede
preguntar, por ejemplo: "¿Cuál es el teléfono de la Praxis Dr. Amberger?" o
"¿Qué clientes están de vacaciones en agosto?".

## Datos en vivo de la app de fichaje (horas, horas extra, vacaciones)

A diferencia de todo lo anterior (que es texto fijo), las horas trabajadas,
horas extra y vacaciones **cambian todos los días**, así que no tiene sentido
"copiarlas" a un texto estático — se desactualizarían al instante. En cambio,
`chat.js` ahora **se conecta en vivo** a la base de datos Firebase de tu app
de Zeiterfassung (fichaje), usando el mismo proyecto Firebase que ya tenés
configurado ahí (`zeiterfassung-weck-dental`).

**Cómo funciona:** cuando detecta el nombre de un empleado en la pregunta
(por ejemplo "¿Cuántas horas extra tiene Mario este mes?"), la función:
1. Se autentica de forma anónima contra Firebase (igual que hace la propia
   app de fichaje)
2. Busca ese empleado en la colección `kv` de Firestore
3. Calcula horas trabajadas este mes, horas extra aprobadas, y días de
   vacaciones usados/restantes — a partir de los datos reales
4. Le pasa esos números al chat para que responda con la cifra actual

**Limitaciones que tenés que saber:**
- El cálculo que hace el chat es una **aproximación**: replica la lógica
  principal de la app (sumar horas por evento start/pause/end, sumar horas
  extra aprobadas, contar días hábiles de vacaciones), pero **no** reproduce
  el 100% de los ajustes finos que hace la app original (feriados,
  compensación por baja médica día por día, saldo de arrastre del sistema
  anterior). Para nóminas o pagos, seguí usando los reportes oficiales de la
  propia app de fichaje — este chat es para consultas rápidas, no para
  cálculos definitivos.
- Depende de que las reglas de seguridad de Firestore de tu proyecto
  `zeiterfassung-weck-dental` permitan lectura a usuarios autenticados de
  forma anónima (que es como ya funciona la propia app). Si en algún momento
  cambiás esas reglas, esta función puede dejar de tener acceso — el chat lo
  va a avisar en vez de inventar datos.
- Solo reconoce nombres que coincidan con `vorname`/`nachname` tal cual están
  guardados en la app (por ejemplo "Mario" o "Mario T.").

## Fahrplan de choferes (turnos, vacaciones, enfermedad)

Se sumó también la tercera app que compartiste (el "Fahrplan 2027" de los 9
choferes/Botendienst). Usa **la misma base de Firebase** que la de fichaje
(`zeiterfassung-weck-dental`), solo que guarda sus datos con el prefijo
`fahrplan_`, así que reutiliza toda la conexión que ya estaba armada.

**Fijo** (texto, no cambia): los 9 choferes, la plantilla semanal de turnos
(quién maneja qué turno cada día), horarios, feriados de 2027, y que el
derecho de vacaciones es de 8 días/año.

**En vivo** (consultado a Firestore en el momento): vacaciones y
enfermedades. Ahora podés preguntar:
- "¿Quién está enfermo hoy?" / "¿Quién está de vacaciones ahora?"
- "¿Cuándo estuvo enfermo Horst?" (te devuelve el historial completo)
- "¿Cuántos días de vacaciones le quedan a Carlo?"
- "¿Qué turno tiene Anja los jueves?" (esto sale del texto fijo, no necesita ir a la base)

**Limitación a tener en cuenta:** el reconocimiento de nombres es simple
(busca si el nombre completo o el primer nombre aparece en tu pregunta), así
que funciona mejor si escribís el nombre tal cual está en la lista de
choferes (por ejemplo "Vox" o "Andreas Franke"). Si preguntás algo genérico
como "¿quién está de baja?" sin nombrar a nadie, el chat te devuelve el
estado de los 9 choferes para hoy.

## Actualizar la información de la empresa

Todo el "conocimiento" está en el archivo `netlify/functions/chat.js`, en la
constante `KNOWLEDGE_BASE` al principio del archivo. Para agregar o corregir
información: editás ese texto directo en GitHub (botón del lápiz ✏️ en la
esquina del archivo), guardás el cambio, y Netlify vuelve a desplegar
automáticamente en 1-2 minutos.

## Siguiente paso natural

Cuando esta versión simple te convenza, podemos migrar a la versión completa
(con login por rol, subida de documentos, base de datos vectorial, vault de
contraseñas, etc.) que ya armamos en el proyecto `weck-ai-assistant`.
