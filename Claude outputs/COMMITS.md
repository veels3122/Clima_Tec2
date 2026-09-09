# ClimaTec — Rediseño visual: guía de commits

Todos los archivos de esta carpeta van dentro de `climate-mining-app/` (misma
estructura de carpetas: `static/css/`, `static/js/`, `templates/`,
`templates/etapa1/`). Ya quedaron probados corriendo la app Flask real con
tus datos (`clima_consolidado.csv`) y revisados con capturas de pantalla,
así que puedes copiar y pegar con confianza.

Antes de empezar: **avísale al grupo** antes de fusionar el commit 2 (toca
`base.html`, que es archivo compartido). Los demás commits solo agregan
archivos nuevos o tocan archivos que son tuyos (`templates/index.html`,
`templates/etapa1/*.html`).

Recomendación: crea una rama tipo `feature/rediseno-visual-2` a partir de tu
`feature/rediseno-visual` actual (o la que estés usando), y ve haciendo los
commits en orden — cada uno deja la app funcionando (nada queda a medias).

---

## Commit 1 — Infraestructura: hoja de estilos "Apogee" literal + ruleta + fondos

Archivos **nuevos** (agrégalos, no existen todavía):

- `static/css/apogee-hero.css`
- `static/css/ruleta.css`
- `static/css/fondos.css`
- `static/js/ruleta.js`
- `static/js/fondos.js`

Mensaje sugerido:

```
feat(diseno): agrega hojas de estilo y scripts base para el hero Apogee, la ruleta de navegacion y los fondos animados
```

Este commit por sí solo **no cambia nada visualmente todavía** (nada los
enlaza aún desde `base.html`/`index.html`), así que es 100% seguro de
fusionar primero.

---

## Commit 2 — Topbar y menú: reemplaza el desplegable "Etapa 1 ▾" por la ruleta

Archivo **modificado** (reemplaza el contenido completo por el de esta
carpeta):

- `templates/base.html`
- `static/js/site.js`

Qué cambia: la navegación central pasa a ser una "pill" tipo Apogee (Inicio
/ Etapa 1 ⌄ / Dataset / Fuentes + Repositorio / Ver el dataset), el menú
móvil pasa a ser un overlay con blur igual al de la referencia, y el
antiguo `<ul>` desplegable de "Etapa 1" desaparece: ahora ese botón abre la
"ruleta" (ver commit 1) con las 8 secciones.

⚠️ **Avisa al grupo antes de fusionar este commit** — toca `base.html`.

Mensaje sugerido:

```
feat(nav): reemplaza el submenu desplegable de Etapa 1 por la "ruleta" de secciones y porta la topbar al layout Apogee (nav pill + overlay movil)
```

---

## Commit 3 — Inicio: hero literal "Apogee" + ruleta de dimensiones

Archivo **modificado**:

- `templates/index.html`

Qué cambia: el hero de Inicio ahora sigue al pie de la letra las medidas de
espaciado/tipografía/tiempos de animación del prompt de Apogee (títulos,
botones, tarjeta de emisiones de CO2), y agrega arriba a la derecha la
"ruleta de dimensiones" (por ahora solo existe "Etapa 1"; al hacer clic se
convierte en la rueda de las 8 secciones). Se oculta sola al hacer scroll.

Mensaje sugerido:

```
feat(inicio): reconstruye el hero de Inicio siguiendo literalmente las medidas del prompt Apogee y agrega la ruleta de dimensiones
```

---

## Commits 4 a 11 — Un fondo animado distinto por cada sección de Etapa 1

Cada uno de estos toca **un solo archivo tuyo** (nadie más los edita), así
que puedes hacerlos en cualquier orden y por separado, uno por commit, tal
como pediste para que se note el progreso:

| Commit | Archivo | Fondo animado | Tema |
|---|---|---|---|
| 4 | `templates/etapa1/problema_contexto.html` | Bandas de calentamiento ("warming stripes") que laten desde un núcleo, con partículas de CO2 subiendo | Se referencia a sí misma: la propia metáfora visual del proyecto |
| 5 | `templates/etapa1/preguntas.html` | El Niño (naranja) y La Niña (azul) "peleando" mientras un haz de CO2 sube fuerte y baja gradualmente — **reacciona al scroll de toda la página**, no a un loop de tiempo | Pregunta principal y secundarias |
| 6 | `templates/etapa1/necesidades_informacion.html` | Red de nodos (Entidades, Variables, Periodo, Cobertura, Granularidad, Integración) con pulsos convergiendo a un nodo central | Necesidades de información |
| 7 | `templates/etapa1/fuentes_datos.html` | Mapa abstracto con las 5 instituciones fuente (OWID, NOAA, UNFCCC, IDEAM, UNGRD) enviando partículas de datos hacia un punto de consolidación | Fuentes de datos |
| 8 | `templates/etapa1/dataset.html` | Filas de celdas de colores consolidándose desde los costados hacia el centro, como varias fuentes uniéndose en una sola tabla | Dataset |
| 9 | `templates/etapa1/diccionario_datos.html` | Nube de etiquetas (nombres de variables reales) flotando lentamente | Diccionario de datos |
| 10 | `templates/etapa1/calidad_inicial.html` | Escáner que barre una grilla y revela huecos (valores nulos) al pasar | Calidad inicial |
| 11 | `templates/etapa1/limitaciones.html` | Niebla con grietas translúcidas a la deriva | Limitaciones y consideraciones |

Mensaje sugerido para cada uno (cambia el número y el nombre de la sección):

```
feat(fondos): agrega el fondo animado tematico de "<nombre de la seccion>"
```

---

## Qué NO toqué (por si el profe pregunta)

- `static/css/style.css` — no lo modifiqué. Todo lo nuevo vive en
  `apogee-hero.css` / `ruleta.css` / `fondos.css`, que se cargan **después**
  de `style.css` y solo sobreescriben la topbar, el hero de Inicio y la
  tarjeta de estadística. El resto del sitio (tablas, paneles, footer) se ve
  exactamente igual que antes.
- `app.py` — no lo toqué. Todos los datos que ves en las capturas
  (21.369 observaciones, 24 indicadores, etc.) salen de tu
  `clima_consolidado.csv` real: no inventé ningún número.
- Los 4 templates viejos sueltos en `templates/` (`calidad.html`,
  `dataset.html`, `problema.html`, `recoleccion.html`) no los usé ni los
  toqué — parecen quedar de una versión anterior, ni siquiera están
  enlazados desde `base.html`.

## Cómo lo probé

Levanté tu Flask real (con tu CSV real) en un entorno aislado y tomé
capturas de cada página con Chromium, incluyendo: hover y clic sobre la
ruleta, el overlay de secciones abierto desde cualquier página interior, el
menú móvil abierto, y los 8 fondos temáticos. También encontré y corregí un
bug real antes de entregarte esto: en el primer fotograma, `requestAnimationFrame`
a veces entrega un timestamp menor al esperado, lo que producía un radio de
círculo negativo en Canvas y tiraba una excepción en consola en la página de
"Problema y contexto". Ya está corregido en `fondos.js`.

## Pendiente / lo que necesito de ti

- El video de fondo del prompt de Apogee lo sustituí por el fondo animado
  que ya existe en tu sitio (`.atmosfera`, en `style.css`) porque no
  contábamos con un video real. Si más adelante quieres un video de verdad,
  pásamelo (un `.mp4` corto, oscuro, tipo nebulosa) y lo conecto sin tocar
  nada más.
- Si quieres que la "ruleta de dimensiones" del Inicio muestre ya un nombre
  específico para la futura Etapa 2, dime cómo se va a llamar y lo actualizo
  en `templates/base.html` (bloque `ruleta-dimensiones-data`).
