# ClimaTec — Lista exacta de imágenes/video que necesito

**Esta lista es solo de las 8 secciones de "Definición" (lo que antes se
llamaba Etapa 1), más el video de Inicio.** Todavía no están definidas las
imágenes/video de "Recolección de Datos" (Etapa 2 de Ana) porque ese contenido
aún no está integrado al diseño — esa lista sale después, una vez se sepa
exactamente qué páginas/secciones trae esa etapa.

Todo el código ya está listo para recibir los archivos de fotos (los 8 de
Definición): mientras no existan, el sitio se ve bien igual (usa el degradado
de color de respaldo que ya tenía cada sección), y en el momento en que
agregues el archivo con el **nombre exacto** en la carpeta indicada, aparece
solo — no hay que tocar código. El video de Inicio es distinto: ese sistema
(capa de `<video>` de fondo) todavía no existe en el código, hay que
construirlo — va a ser el primero, y ahí queda el patrón para cualquier otro
video que se agregue después.

**Carpeta destino para las fotos:** `static/img/fondos/` (créala si no existe;
no está en el repo porque es carpeta nueva). **Carpeta destino para video:**
`static/video/` (también nueva).

**Formato:** `.jpg` (fotos comprimidas, calidad ~80) salvo que se diga otra
cosa. Como cada foto lleva encima un "Ken Burns" (zoom+paneo lento) y un tinte
de color, no hace falta que sea perfecta: solo que sea real, nítida y de tema
correcto — el movimiento y el color los pone el CSS.

**Tamaño recomendado:** 1920×1080 (o más ancha) para que el zoom no se pixele.
Peso ideal: menos de 500 KB por imagen (usa TinyPNG o similar si pesan más) —
son 10 imágenes, no querés que el repo pese varios MB.

No importa de dónde las saques (banco de fotos, tus propias fotos, capturas de
NASA/NOAA, etc.) — dijiste que me las puedes pasar tú, así que aquí va
exactamente qué necesito de cada una.

---

## 1. Inicio — VIDEO, no imagen — `inicio.mp4`

Esto no es una foto con Ken Burns como el resto de la lista — es el video de
fondo que se pensó desde el principio para el hero de Inicio (la idea
original del estilo "Apogee", que al comienzo del proyecto se sustituyó por
un fondo genérico porque no había un video real todavía).

**Qué debe mostrar, tal como lo describiste:** el mar visto desde un costado,
a nivel del agua, como si la cámara estuviera parada justo en la superficie
viendo el mar moverse — no una toma aérea ni de dron, sino una vista lateral,
casi a la altura de las olas. El mar se ve caótico, agitado, con mucho
movimiento. De un lado del cielo, nubes grises cargadas; del otro, sol —
las dos cosas al tiempo, en tensión. De fondo, se alcanza a ver una tormenta
formándose. La sensación general debe ser de caos climático, no de mar en
calma ni de postal bonita.

**Formato:** `.mp4`, sin audio (el video va a reproducirse en loop, mute,
autoplay, de fondo), idealmente 1920×1080 o más ancho, unos 10-20 segundos
de loop que se pueda repetir sin que se note el corte. Peso: mientras más
liviano mejor (aunque sea a costa de algo de calidad), porque es lo primero
que carga cualquiera que entre a la página — si pesa mucho, se puede recortar
o comprimir después, no hace falta que la primera versión sea perfecta.

Si no consigues un video que cumpla exactamente esto, una alternativa
razonable es un video de stock de mar/tormenta visto desde un punto bajo
cercano al agua, con cielo dividido entre sol y nubes de tormenta — pero la
idea del "caos" (mar agitado, tormenta de fondo, luz en tensión) es lo que no
se puede perder, porque es la metáfora visual de todo el proyecto (cambio
climático como un problema que ya está en movimiento, no algo lejano o
tranquilo).

---

## 2. Problema y contexto — `problema.jpg`

**Tema:** algo que transmita "el problema" de forma directa y real —
por ejemplo, humo/emisiones industriales reales contra el cielo, una fábrica
o central térmica en actividad, o un paisaje visiblemente afectado (sequía,
deshielo). Tono oscuro/dramático (la sección usa acento frío/azul).

---

## 3. Preguntas de investigación — DOS fotos (El Niño / La Niña)

- `preguntas_la_nina.jpg` — foto satelital real de anomalías de temperatura
  superficial del Pacífico en fase **La Niña** (tonos azules/fríos en el
  Pacífico ecuatorial), o en su defecto una imagen de mar/tormenta con
  dominante azul-frío si no consigues el mapa satelital exacto.
- `preguntas_el_nino.jpg` — la misma idea pero en fase **El Niño** (tonos
  rojos/naranjas de anomalía cálida), incluso puede ser una imagen de calor
  extremo / sequía con dominante naranja-rojo si no hay mapa satelital.

Estas dos se **cruzan (crossfade)** automáticamente a medida que el usuario
hace scroll en la página: arriba se ve La Niña, al llegar abajo se ve El Niño.
No tienen que ser mapas oficiales de NOAA — cualquier par de fotos reales con
esas dos paletas de color funciona bien. Si quieres el mapa real de anomalía
SST, búscalo en climate.gov (sección ENSO) — no encontré un enlace de
descarga directa, solo una versión con parámetros de ancho fijo.

---

## 4. Necesidades de información — `necesidades.jpg`

**Tema:** algo que transmita "recolección/organización de datos" —
estaciones meteorológicas, un centro de monitoreo/servidores, o un mapa físico
con anotaciones. Tono ámbar/cálido (acento de esta sección).

---

## 5. Fuentes de datos — `fuentes.jpg` (la más importante de posicionar bien)

**Tema:** un **mapa real del mundo**, ideal en proyección equirectangular
(mapa rectangular donde el ancho completo = 360° de longitud y el alto
completo = 180° de latitud, SIN distorsión de proyección tipo Mercator). Esto
es necesario porque el código ya calculó la posición de cada pin (OWID, NOAA,
UNFCCC, IDEAM, UNGRD) usando latitud/longitud reales convertidas a
porcentaje — si el mapa no es equirectangular, los pines van a quedar
desalineados de sus ciudades reales.

**Opción lista para usar y ya verificada como equirectangular exacta**
(dominio público, NASA "Black Marble" — mundo de noche, luces de ciudades):
`https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/144000/144898/BlackMarble_2016_01deg.jpg`
(3600×1800 px — recomendado recortar/comprimir antes de usarla). Esta imagen
además le da un aire "tecnológico/de datos" muy acorde al tema.

Si prefieres un mapa de día en vez de noche, cualquier imagen de la Tierra en
proyección equirectangular sirve igual (por ejemplo, una versión aplanada del
"Blue Marble"), siempre que cubra el mundo completo sin recortes.

---

## 6. Dataset — `dataset.jpg`

**Tema:** algo relacionado con datos/tablas en el mundo físico — servidores,
un data center, o una superficie tipo cuadrícula/circuitos. Tono frío (acento
de esta sección).

---

## 7. Diccionario de datos — `diccionario.jpg`

**Tema:** libros/diccionarios reales, o algo que transmita "definiciones y
significado" — una biblioteca, páginas de un libro. Tono cálido (acento de
esta sección).

---

## 8. Calidad inicial — `calidad.jpg`

**Tema:** algo que transmita "revisión/control de calidad" — un microscopio,
una lupa sobre un documento, un laboratorio. Tono ámbar (acento de esta
sección).

---

## 9. Limitaciones — `limitaciones.jpg`

**Tema:** algo que transmita "límites/niebla/lo que no se puede ver" — niebla
real sobre un paisaje, una carretera que se pierde en la neblina. Tono verde
(acento de esta sección).

---

## Resumen rápido (para copiar/pegar en tu explorador de archivos)

```
static/video/inicio.mp4                      <- video, no foto
static/img/fondos/problema.jpg
static/img/fondos/preguntas_la_nina.jpg
static/img/fondos/preguntas_el_nino.jpg
static/img/fondos/necesidades.jpg
static/img/fondos/fuentes.jpg
static/img/fondos/dataset.jpg
static/img/fondos/diccionario.jpg
static/img/fondos/calidad.jpg
static/img/fondos/limitaciones.jpg
```

Puedes ir agregándolas de a una — cada commit puede incluir su propia
imagen/video junto con el archivo `.html` de esa sección (ver `COMMITS.md`).

## Pendiente aparte — "Recolección de Datos" (Etapa 2)

Todavía no hay lista para esta etapa: primero hay que integrar el contenido
real que subió Ana (ver el otro encargo, el de integración ClimaTec +
ClimaTec2) para saber cuántas páginas trae y de qué tratan, y ahí sí se arma
la lista de imágenes/video correspondiente, con el mismo criterio de esta —
un fondo por página, ligado a su contenido real.
