// ClimaTec — "Ruleta" de navegacion (reemplaza el <ul> desplegable de
// "Etapa 1" por una rueda de nodos numerados). Lee los datos de dos
// bloques JSON que imprime base.html con Jinja (asi los textos y las URLs
// siguen viniendo de url_for(), nunca se hardcodean aqui):
//
//   #ruleta-dimensiones-data  -> [{num, titulo, href, disponible}]
//   #ruleta-secciones-data    -> [{num, titulo, href, activo}]
//
// Un mismo componente ("rueda de nodos + etiqueta flotante al pasar el
// mouse") se usa en dos sitios:
//   - .ruleta--inicio   dentro de Inicio: empieza en nivel "dimensiones"
//     y al hacer clic en la unica dimension disponible (Etapa 1) pasa a
//     nivel "secciones" en el mismo sitio.
//   - .ruleta-overlay-panel dentro de un overlay fijo, disparado por el
//     boton "Etapa 1" de la topbar en cualquier pagina interior; ese
//     siempre arranca directo en nivel "secciones".

(function () {
    'use strict';

    function leerJSON(id) {
        const el = document.getElementById(id);
        if (!el) return null;
        try { return JSON.parse(el.textContent); } catch (e) { return null; }
    }

    function crearFlotante(contenedor) {
        const flot = document.createElement('div');
        flot.className = 'ruleta-flotante';
        flot.setAttribute('aria-hidden', 'true');
        contenedor.appendChild(flot);
        return flot;
    }

    function posicionarFlotante(flot, nodo, contenedor) {
        const r = nodo.getBoundingClientRect();
        const cr = contenedor.getBoundingClientRect();
        flot.style.top = (r.top - cr.top + r.height / 2) + 'px';
        flot.style.left = (r.right - cr.left + 8) + 'px';
    }

    // Construye la rueda (lista de nodos circulares) dentro de `rueda`,
    // usando `items` = [{num,titulo,href,activo|disponible}], y devuelve
    // una funcion de limpieza.
    function pintarRueda(rueda, flot, items, opts) {
        opts = opts || {};
        rueda.innerHTML = '';
        items.forEach((item) => {
            const nodo = document.createElement(item.href && (opts.siempreNavegable !== false) ? 'a' : 'button');
            nodo.className = 'ruleta-nodo' + (item.activo ? ' es-actual' : '');
            if (item.disponible === false) {
                nodo.className += ' ruleta-nodo--proximo';
                nodo.setAttribute('aria-disabled', 'true');
                nodo.style.opacity = '.35';
                nodo.style.cursor = 'default';
            }
            if (nodo.tagName === 'A' && item.href) nodo.href = item.href;
            nodo.type = nodo.tagName === 'BUTTON' ? 'button' : undefined;
            nodo.innerHTML = '<span class="ruleta-num">' + item.num + '</span>';
            nodo.setAttribute('aria-label', item.titulo);

            const mostrar = () => {
                if (item.disponible === false) {
                    flot.textContent = item.titulo + ' (proximamente)';
                } else {
                    flot.textContent = item.titulo;
                }
                posicionarFlotante(flot, nodo, flot.parentElement);
                flot.classList.add('visible');
            };
            const ocultar = () => flot.classList.remove('visible');

            nodo.addEventListener('mouseenter', mostrar);
            nodo.addEventListener('focus', mostrar);
            nodo.addEventListener('mouseleave', ocultar);
            nodo.addEventListener('blur', ocultar);

            if (item.disponible === false) {
                nodo.addEventListener('click', (e) => e.preventDefault());
            } else if (item.onClick) {
                nodo.addEventListener('click', (e) => { e.preventDefault(); item.onClick(); });
            }
            rueda.appendChild(nodo);
        });
    }

    // ---------------------------------------------------------------
    // 1) Rueda de Inicio: dimensiones -> secciones
    // ---------------------------------------------------------------
    function iniciarRuletaInicio() {
        const caja = document.querySelector('.ruleta--inicio');
        if (!caja) return;
        const rueda = caja.querySelector('.ruleta-rueda');
        const subtitulo = caja.querySelector('.ruleta-subtitulo');
        const volverBtn = caja.querySelector('.ruleta-volver');
        const flot = crearFlotante(caja);

        const dimensiones = leerJSON('ruleta-dimensiones-data') || [];
        const secciones = leerJSON('ruleta-secciones-data') || [];

        function pintarDimensiones() {
            caja.dataset.nivel = 'dimensiones';
            if (subtitulo) subtitulo.textContent = 'Elige una etapa';
            pintarRueda(rueda, flot, dimensiones.map((d) => ({
                num: d.num, titulo: d.titulo, disponible: d.disponible,
                onClick: d.disponible === false ? null : pintarSecciones,
            })));
        }
        function pintarSecciones() {
            caja.dataset.nivel = 'secciones';
            if (subtitulo) subtitulo.textContent = 'Etapa 1 · elige una seccion';
            pintarRueda(rueda, flot, secciones.map((s) => ({
                num: s.num, titulo: s.titulo, href: s.href, activo: s.activo,
            })));
        }
        if (volverBtn) volverBtn.addEventListener('click', pintarDimensiones);

        pintarDimensiones();

        // Se oculta despues de hacer scroll (igual que en el pantallazo de
        // referencia: la rueda solo aparece al principio, para elegir).
        let oculto = false;
        const onScroll = () => {
            const debeOcultarse = window.scrollY > 90;
            if (debeOcultarse !== oculto) {
                oculto = debeOcultarse;
                caja.classList.toggle('ruleta--oculta', oculto);
                if (oculto) flot.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ---------------------------------------------------------------
    // 2) Rueda en overlay (disponible en cualquier pagina de Etapa 1)
    // ---------------------------------------------------------------
    function iniciarRuletaOverlay() {
        const disparadores = document.querySelectorAll('.ruleta-disparador');
        const overlayFondo = document.querySelector('.ruleta-overlay-fondo');
        if (!disparadores.length || !overlayFondo) return;

        const panel = overlayFondo.querySelector('.ruleta-overlay-panel');
        const rueda = panel.querySelector('.ruleta-rueda');
        const subtitulo = panel.querySelector('.ruleta-subtitulo');
        const cerrarBtn = panel.querySelector('.ruleta-overlay-cerrar');
        const flot = crearFlotante(panel);
        const secciones = leerJSON('ruleta-secciones-data') || [];

        function abrir() {
            if (subtitulo) subtitulo.textContent = 'Etapa 1 · elige una seccion';
            pintarRueda(rueda, flot, secciones.map((s) => ({
                num: s.num, titulo: s.titulo, href: s.href, activo: s.activo,
            })));
            overlayFondo.classList.add('abierto');
            disparadores.forEach((b) => b.setAttribute('aria-expanded', 'true'));
            document.body.style.overflow = 'hidden';
        }
        function cerrar() {
            overlayFondo.classList.remove('abierto');
            disparadores.forEach((b) => b.setAttribute('aria-expanded', 'false'));
            document.body.style.overflow = '';
        }
        disparadores.forEach((b) => b.addEventListener('click', abrir));
        if (cerrarBtn) cerrarBtn.addEventListener('click', cerrar);
        overlayFondo.addEventListener('click', (e) => { if (e.target === overlayFondo) cerrar(); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlayFondo.classList.contains('abierto')) cerrar();
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        iniciarRuletaInicio();
        iniciarRuletaOverlay();
    });
})();
