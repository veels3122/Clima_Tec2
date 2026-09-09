// ClimaTec — fondos animados por seccion (Etapa 1).
// Un pequeno "motor" comun (resize con devicePixelRatio + requestAnimationFrame,
// apagado si el usuario pide "reduced motion") y ocho funciones de dibujo,
// una por seccion, elegidas segun el atributo data-fondo del .page-hero.
// Todo en Canvas 2D puro: sin librerias, sin video, sin imagenes externas.

(function () {
    'use strict';

    const REDUCIDO = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const PALETA = {
        frio: '#49c7e0',
        calido: '#ff6a4d',
        ambar: '#ffb454',
        ok: '#3ddc97',
        morado: '#c9b6ff',
        blanco: 'rgba(255,255,255,',
    };

    function motor(canvas, dibujar, { fija = false } = {}) {
        const ctx = canvas.getContext('2d');
        let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

        function medir() {
            const rect = fija
                ? { width: window.innerWidth, height: window.innerHeight }
                : canvas.parentElement.getBoundingClientRect();
            w = Math.max(1, Math.round(rect.width));
            h = Math.max(1, Math.round(rect.height));
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        medir();
        window.addEventListener('resize', medir);

        let inicio = performance.now();
        function frame(ahora) {
            // Math.max(0, ...): el timestamp que entrega requestAnimationFrame
            // puede corresponder a un instante ANTERIOR al performance.now()
            // que capturamos en "inicio" (es una particularidad conocida del
            // primer frame). Sin este clamp, "t" podia salir levemente
            // negativo una sola vez y algunas formas (radios de circulo,
            // etc.) recibian un valor negativo y Canvas2D lanzaba una
            // excepcion ("radius provided is negative").
            const t = Math.max(0, (ahora - inicio) / 1000);
            dibujar(ctx, w, h, t);
            if (!REDUCIDO) requestAnimationFrame(frame);
        }
        if (REDUCIDO) {
            dibujar(ctx, w, h, 0);
        } else {
            requestAnimationFrame(frame);
        }
    }

    function lerp(a, b, t) { return a + (b - a) * t; }
    function clamp01(x) { return Math.max(0, Math.min(1, x)); }
    function easeInOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }

    // ------------------------------------------------------------------
    // 1) PROBLEMA Y CONTEXTO — bandas de calentamiento ("warming stripes")
    // que laten desde un nucleo, con particulas de CO2 subiendo. Referencia
    // directa a la propia metafora visual del proyecto.
    // ------------------------------------------------------------------
    function fondoProblema(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const cx = w * 0.82, cy = h * 0.62;
        const bandas = 7;
        for (let i = bandas; i >= 0; i--) {
            const fase = (t * 0.12 + i / bandas) % 1;
            const r = Math.max(0, fase * Math.max(w, h) * 0.95);
            const mezcla = i / bandas;
            const color = i % 2 === 0 ? PALETA.frio : PALETA.calido;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.globalAlpha = (1 - fase) * 0.22;
            ctx.lineWidth = 14;
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        // Particulas de CO2 subiendo
        const n = 26;
        for (let i = 0; i < n; i++) {
            const semilla = i * 37.13;
            const x = (Math.sin(semilla) * 0.5 + 0.5) * w;
            const velocidad = 18 + (i % 5) * 6;
            const y = h - ((t * velocidad + semilla * 40) % (h + 40));
            const r = 1.4 + (i % 3);
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = PALETA.blanco + (0.12 + 0.1 * Math.sin(t + i)) + ')';
            ctx.fill();
        }
    }

    // ------------------------------------------------------------------
    // 2) PREGUNTAS — El Nino vs La Nina "peleando" mientras el CO2 sube
    // fuerte y luego baja gradualmente. Controlado por el SCROLL de toda
    // la pagina (no por tiempo), via el progreso global calculado en
    // calcularProgresoScroll().
    // ------------------------------------------------------------------
    function fondoPreguntas(ctx, w, h, t, progreso) {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#05070f';
        ctx.fillRect(0, 0, w, h);

        // Envolvente asimetrica: sube rapido, baja gradual (nunca de golpe).
        const p = progreso == null ? 0 : progreso;
        let envolvente;
        if (p < 0.7) {
            envolvente = Math.pow(p / 0.7, 1.4);
        } else {
            envolvente = 1 - easeInOutSine((p - 0.7) / 0.3) * 0.55;
        }

        const pelea = Math.sin(t * 0.9) * 0.5 + 0.5; // quien domina ahora
        const ninoX = lerp(w * 0.28, w * 0.5, pelea) ;
        const ninaX = lerp(w * 0.72, w * 0.5, pelea);
        const radioBase = Math.min(w, h) * (0.22 + 0.1 * envolvente);

        function blob(x, y, r, color, alpha) {
            const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
            grad.addColorStop(0, color);
            grad.addColorStop(1, 'transparent');
            ctx.globalAlpha = alpha;
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
        blob(ninoX, h * 0.42, radioBase * (0.85 + 0.3 * pelea), PALETA.calido, 0.55);
        blob(ninaX, h * 0.58, radioBase * (1.15 - 0.3 * pelea), PALETA.frio, 0.5);

        // Haz de calor de CO2 creciendo con la envolvente
        ctx.globalAlpha = 0.18 + 0.4 * envolvente;
        const g = ctx.createLinearGradient(0, h, 0, 0);
        g.addColorStop(0, 'rgba(255,106,77,.55)');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, h * (1 - envolvente * 0.6), w, h * envolvente * 0.6);

        // Particulas de CO2, cantidad segun la envolvente
        const nMax = 46;
        const n = Math.round(6 + nMax * envolvente);
        ctx.globalAlpha = 1;
        for (let i = 0; i < n; i++) {
            const semilla = i * 12.9;
            const x = ((Math.sin(semilla) * 0.5 + 0.5) * w + t * 6) % w;
            const y = h - ((t * (20 + (i % 6) * 5) + semilla * 50) % h);
            ctx.beginPath();
            ctx.arc(x, y, 1.6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,180,84,' + (0.15 + 0.35 * envolvente) + ')';
            ctx.fill();
        }
    }

    function calcularProgresoScroll() {
        const doc = document.documentElement;
        const total = doc.scrollHeight - window.innerHeight;
        if (total <= 0) return 0;
        return clamp01(window.scrollY / total);
    }

    // ------------------------------------------------------------------
    // 3) NECESIDADES DE INFORMACION — red de nodos convergiendo a un
    // nodo central (la pregunta), con pulsos viajando por cada arista.
    // ------------------------------------------------------------------
    function fondoNecesidades(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const cx = w * 0.8, cy = h * 0.5;
        const etiquetas = ['Entidades', 'Variables', 'Periodo', 'Cobertura', 'Granularidad', 'Integracion'];
        const radio = Math.min(w, h) * 0.34;
        const nodos = etiquetas.map((txt, i) => {
            const ang = (i / etiquetas.length) * Math.PI * 2 + t * 0.05;
            return { x: cx + Math.cos(ang) * radio, y: cy + Math.sin(ang) * radio * 0.62, txt };
        });

        nodos.forEach((n) => {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(cx, cy);
            ctx.strokeStyle = 'rgba(73,199,224,.18)';
            ctx.lineWidth = 1.4;
            ctx.stroke();

            const fase = (t * 0.35 + n.x * 0.01) % 1;
            const px = lerp(n.x, cx, fase);
            const py = lerp(n.y, cy, fase);
            ctx.beginPath();
            ctx.arc(px, py, 2.6, 0, Math.PI * 2);
            ctx.fillStyle = PALETA.ambar;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,.85)';
            ctx.fill();

            ctx.font = '11px "IBM Plex Mono", monospace';
            ctx.fillStyle = 'rgba(255,255,255,.55)';
            ctx.textAlign = n.x > cx ? 'left' : 'right';
            ctx.fillText(n.txt, n.x + (n.x > cx ? 9 : -9), n.y + 4);
        });

        ctx.beginPath();
        ctx.arc(cx, cy, 12 + Math.sin(t * 2) * 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,106,77,.85)';
        ctx.fill();
    }

    // ------------------------------------------------------------------
    // 4) FUENTES DE DATOS — mapa REAL (fuentes.jpg, ideal: NASA Black Marble
    // equirectangular, ver LISTA-DE-IMAGENES.md) con un pin en la posicion
    // geografica VERDADERA de cada institucion fuente, emitiendo un pulso
    // periodico ("notificacion" de dato entrante) hacia un punto de
    // consolidacion. Ya no se dibujan continentes esquematicos: la foto de
    // fondo (fondo-foto-fuentes, ver fondos.css) ya muestra el mundo real,
    // asi que este canvas solo pinta los pines/pulsos por ENCIMA de ella.
    //
    // Posiciones calculadas con proyeccion equirectangular a partir de
    // lat/lon reales (formula: x = (lon+180)/360, y = (90-lat)/180):
    //   OWID   -> Oxford, Reino Unido     (51.75 N, -1.25)
    //   IDEAM  -> Bogota, Colombia        (4.71 N, -74.07)
    //   NOAA   -> Silver Spring, EE.UU.   (38.99 N, -76.94)
    //   UNGRD  -> Bogota, Colombia        (3.50 N, -72.50 — desplazado un
    //             poco de IDEAM para que los dos pines no se encimen)
    //   UNFCCC -> Bonn, Alemania          (50.73 N, 7.10)
    // ------------------------------------------------------------------
    function fondoFuentes(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);

        const centro = { x: w * 0.5, y: h * 0.85 };
        const fuentes = [
            { x: 0.4965, y: 0.2125, nombre: 'OWID' },
            { x: 0.2863, y: 0.2834, nombre: 'NOAA' },
            { x: 0.5197, y: 0.2182, nombre: 'UNFCCC' },
            { x: 0.2942, y: 0.4738, nombre: 'IDEAM' },
            { x: 0.2986, y: 0.4806, nombre: 'UNGRD' },
        ];
        fuentes.forEach((f, i) => {
            const x = f.x * w, y = f.y * h;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(centro.x, centro.y);
            ctx.strokeStyle = 'rgba(61,220,151,.14)';
            ctx.lineWidth = 1;
            ctx.stroke();

            const fase = (t * 0.28 + i * 0.2) % 1;
            const px = lerp(x, centro.x, fase);
            const py = lerp(y, centro.y, fase);
            ctx.beginPath();
            ctx.arc(px, py, 2.4, 0, Math.PI * 2);
            ctx.fillStyle = PALETA.ok;
            ctx.fill();

            const pulso = 5 + Math.sin(t * 2.4 + i) * 1.5;
            ctx.beginPath();
            ctx.arc(x, y, pulso, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(73,199,224,.5)';
            ctx.lineWidth = 1.4;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();

            ctx.font = '10px "IBM Plex Mono", monospace';
            ctx.fillStyle = 'rgba(255,255,255,.6)';
            ctx.textAlign = 'center';
            ctx.fillText(f.nombre, x, y - pulso - 6);
        });

        ctx.beginPath();
        ctx.arc(centro.x, centro.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = PALETA.calido;
        ctx.fill();
    }

    // ------------------------------------------------------------------
    // 5) DATASET — filas de celdas consolidandose desde los lados hacia
    // el centro, como si varias fuentes se unieran en una sola tabla.
    // ------------------------------------------------------------------
    function fondoDataset(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const filas = 8, cols = 10;
        const colores = [PALETA.frio, PALETA.calido, PALETA.ambar, PALETA.ok];
        const cellW = w / (cols + 4), cellH = h / (filas + 2);
        for (let r = 0; r < filas; r++) {
            const dir = r % 2 === 0 ? 1 : -1;
            const avance = (Math.sin(t * 0.6 + r * 0.4) * 0.5 + 0.5);
            for (let c = 0; c < cols; c++) {
                const objetivoX = (2 + c) * cellW;
                const inicioX = dir > 0 ? -cellW * 2 : w + cellW * 2;
                const x = lerp(inicioX, objetivoX, clamp01(avance * 1.3 - c * 0.02));
                const y = (1 + r) * cellH;
                const color = colores[(r + c) % colores.length];
                ctx.globalAlpha = 0.16 + 0.1 * Math.sin(t + r + c);
                ctx.fillStyle = color;
                ctx.fillRect(x, y, cellW * 0.72, cellH * 0.5);
            }
        }
        ctx.globalAlpha = 1;
    }

    // ------------------------------------------------------------------
    // 6) DICCIONARIO DE DATOS — nube de etiquetas (glosario) flotando.
    // ------------------------------------------------------------------
    function fondoDiccionario(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const terminos = [
            ['co2_per_capita', PALETA.frio], ['ghg_excluding_lucf', PALETA.calido],
            ['iso_code', PALETA.ok], ['year', PALETA.ambar], ['population', PALETA.morado],
            ['temperature_change', PALETA.calido], ['methane', PALETA.frio],
            ['nitrous_oxide', PALETA.ambar], ['nivel_geografico', PALETA.ok],
        ];
        terminos.forEach(([txt, color], i) => {
            const semilla = i * 91.7;
            const x = (Math.sin(semilla * 0.7 + t * 0.05) * 0.5 + 0.5) * w;
            const y = ((Math.cos(semilla * 0.9) * 0.5 + 0.5) * h + t * (6 + i * 1.3)) % h;
            ctx.globalAlpha = 0.28;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.font = '11px "IBM Plex Mono", monospace';
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.22;
            ctx.textAlign = 'left';
            ctx.fillText(txt, x + 8, y + 4);
        });
        ctx.globalAlpha = 1;
    }

    // ------------------------------------------------------------------
    // 7) CALIDAD INICIAL — barrido de escaner sobre una grilla, revelando
    // huecos (valores nulos) al pasar.
    // ------------------------------------------------------------------
    function fondoCalidad(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const cols = 22, filas = 12;
        const cw = w / cols, ch = h / filas;
        const barridoX = (Math.sin(t * 0.5) * 0.5 + 0.5) * w;
        for (let r = 0; r < filas; r++) {
            for (let c = 0; c < cols; c++) {
                const x = c * cw, y = r * ch;
                const dist = Math.abs((x + cw / 2) - barridoX);
                const cerca = clamp01(1 - dist / (w * 0.08));
                const esFalla = ((r * 31 + c * 17) % 23) === 0;
                ctx.globalAlpha = 0.05 + cerca * 0.18;
                ctx.fillStyle = esFalla && cerca > 0.4 ? PALETA.calido : PALETA.frio;
                ctx.fillRect(x + 1, y + 1, cw - 2, ch - 2);
            }
        }
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = 'rgba(255,255,255,.9)';
        ctx.fillRect(barridoX - 1, 0, 2, h);
        ctx.globalAlpha = 1;
    }

    // ------------------------------------------------------------------
    // 8) LIMITACIONES — niebla con grietas translucidas a la deriva.
    // ------------------------------------------------------------------
    function fondoLimitaciones(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const grietas = 5;
        for (let i = 0; i < grietas; i++) {
            const semilla = i * 53.1;
            const ox = (Math.sin(semilla) * 0.5 + 0.5) * w;
            const oy = (Math.cos(semilla * 1.3) * 0.5 + 0.5) * h;
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            let x = ox, y = oy;
            for (let s = 0; s < 6; s++) {
                x += Math.sin(t * 0.1 + i + s) * 26;
                y += 22 + Math.cos(t * 0.08 + i + s) * 10;
                ctx.lineTo(x, y);
            }
            ctx.strokeStyle = 'rgba(255,180,84,' + (0.1 + 0.05 * Math.sin(t * 0.3 + i)) + ')';
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }
        const niebla = ctx.createRadialGradient(w * 0.7, h * 0.4, 0, w * 0.7, h * 0.4, Math.max(w, h) * 0.6);
        niebla.addColorStop(0, 'rgba(255,255,255,.05)');
        niebla.addColorStop(1, 'transparent');
        ctx.fillStyle = niebla;
        ctx.fillRect(0, 0, w, h);
    }

    const FONDOS = {
        problema: fondoProblema,
        necesidades: fondoNecesidades,
        fuentes: fondoFuentes,
        dataset: fondoDataset,
        diccionario: fondoDiccionario,
        calidad: fondoCalidad,
        limitaciones: fondoLimitaciones,
    };

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.page-hero[data-fondo]').forEach((hero) => {
            const clave = hero.dataset.fondo;

            if (clave === 'preguntas') {
                // Cruce (crossfade) entre las dos fotos reales -- La Nina
                // (fondo-foto-preguntas-base) y El Nino (...-cruce) -- segun
                // el progreso de scroll de toda la pagina. Es un listener
                // aparte del motor de canvas para que la opacidad se
                // actualice de inmediato al hacer scroll, incluso si el
                // usuario tiene "reduced motion" activado (ahi el canvas de
                // particulas no anima, pero el cruce de fotos si sigue
                // funcionando porque es solo una transicion de opacidad).
                const cruce = hero.querySelector('.fondo-foto-preguntas-cruce');
                const actualizarCruce = () => {
                    if (cruce) cruce.style.opacity = String(calcularProgresoScroll());
                };
                actualizarCruce();
                window.addEventListener('scroll', actualizarCruce, { passive: true });
                window.addEventListener('resize', actualizarCruce);

                const canvas = hero.querySelector('.fondo-preguntas-fijo');
                if (!canvas) return;
                motor(canvas, (ctx, w, h, t) => fondoPreguntas(ctx, w, h, t, calcularProgresoScroll()), { fija: true });
                return;
            }

            const fn = FONDOS[clave];
            const canvas = hero.querySelector('.fondo-seccion');
            if (!fn || !canvas) return;
            motor(canvas, fn);
        });
    });
})();
