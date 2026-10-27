// Genera las imágenes SVG del perfil: estética verde con rosas rojas.
// Versión clara (verde menta) y oscura (verde bosque). Uso: node scripts/generar.js
const fs = require('fs');
const path = require('path');

const SALIDA = path.join(__dirname, '..', 'assets');
const ANCHO = 1000;

const TEMAS = {
  light: {
    fondo: ['#bbf7d0', '#dcfce7', '#f0fdf4'],
    tarjeta: '#ffffff',
    borde: '#86efac',
    texto: '#052e16',
    suave: '#166534',
    tenue: '#6b9e7c',
    acento: '#dc2626',
    petalo: ['#f87171', '#b91c1c'],
    centro: '#7f1d1d',
    hoja: ['#22c55e', '#15803d'],
    portada: ['#052e16', '#166534'],
    destello: '#16a34a',
  },
  dark: {
    fondo: ['#020d06', '#052e16', '#0b3d20'],
    tarjeta: '#06200f',
    borde: '#14532d',
    texto: '#dcfce7',
    suave: '#86efac',
    tenue: '#4d7c5f',
    acento: '#f87171',
    petalo: ['#ef4444', '#991b1b'],
    centro: '#450a0a',
    hoja: ['#16a34a', '#14532d'],
    portada: ['#020d06', '#14532d'],
    destello: '#bef264',
  },
};

const TITULO = "'Arial Black','Segoe UI Black',Impact,sans-serif";
const TEXTO = "'Segoe UI',Helvetica,Arial,sans-serif";
const MONO = "Consolas,'SFMono-Regular','Courier New',monospace";

// ---------- piezas reutilizables ----------

function svg(alto, contenido, t, titulo, ancho = ANCHO) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${alto}" width="${ancho}" height="${alto}" role="img" aria-label="${titulo}">
<title>${titulo}</title>
<defs>
  <linearGradient id="fondo" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${t.fondo[0]}"/><stop offset=".55" stop-color="${t.fondo[1]}"/><stop offset="1" stop-color="${t.fondo[2]}"/>
  </linearGradient>
  <radialGradient id="petalo" cx=".5" cy=".9" r=".9">
    <stop offset="0" stop-color="${t.petalo[1]}"/><stop offset="1" stop-color="${t.petalo[0]}"/>
  </radialGradient>
  <linearGradient id="hoja" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${t.hoja[0]}"/><stop offset="1" stop-color="${t.hoja[1]}"/>
  </linearGradient>
  <linearGradient id="portada" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${t.portada[0]}"/><stop offset="1" stop-color="${t.portada[1]}"/>
  </linearGradient>
  <symbol id="rosa" viewBox="-50 -50 100 100" overflow="visible">
    <path d="M-6 16 C-26 22 -42 12 -46 -2 C-30 -2 -16 4 -6 16 Z" fill="url(#hoja)"/>
    <path d="M6 18 C26 28 42 20 46 6 C30 4 16 8 6 18 Z" fill="url(#hoja)"/>
    <path d="M-30 3 L-8 14 M30 13 L8 17" stroke="${t.hoja[1]}" stroke-width="1.2" opacity=".7"/>
    ${[0, 72, 144, 216, 288].map((a) => `<path d="M0 2 C-18 -8 -20 -32 0 -36 C20 -32 18 -8 0 2 Z" transform="rotate(${a})" fill="url(#petalo)" stroke="${t.centro}" stroke-width="1.5"/>`).join('')}
    ${[36, 108, 180, 252, 324].map((a) => `<path d="M0 1 C-12 -6 -13 -22 0 -25 C13 -22 12 -6 0 1 Z" transform="rotate(${a})" fill="url(#petalo)" stroke="${t.centro}" stroke-width="1.3"/>`).join('')}
    <circle r="11" fill="${t.petalo[1]}" stroke="${t.centro}" stroke-width="1.5"/>
    <path d="M-5 -1 C-6 -8 5 -9 6 -2 C7 5 -3 7 -4 1 C-4 -3 1 -4 2 -1" fill="none" stroke="${t.centro}" stroke-width="1.6" stroke-linecap="round"/>
  </symbol>
  <symbol id="caido" viewBox="-10 -10 20 20" overflow="visible">
    <path d="M0 -8 C7 -6 7 5 0 8 C-7 5 -7 -6 0 -8 Z" fill="url(#petalo)"/>
  </symbol>
</defs>
<style>
  .mece { transform-box: fill-box; transform-origin: 50% 100%; animation: mecer 5s ease-in-out infinite; }
  @keyframes mecer { 0%,100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
  .cae { animation: caer 12s linear infinite; }
  @keyframes caer { from { transform: translate(0,-40px) rotate(0deg); opacity: 0; } 10% { opacity: .9; } 90% { opacity: .9; } to { transform: translate(60px, 460px) rotate(300deg); opacity: 0; } }
  .brillo { animation: titilar 3s ease-in-out infinite; }
  @keyframes titilar { 0%,100% { opacity: .15; } 50% { opacity: .9; } }
</style>
${contenido}
</svg>
`;
}

// Rosa en (x, y) con tamaño en px
function rosa(x, y, tam, giro = 0, demora = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${giro})"><g class="mece" style="animation-delay:-${demora}s">
  <use href="#rosa" x="${-tam / 2}" y="${-tam / 2}" width="${tam}" height="${tam}"/>
  </g></g>`;
}

// Pétalos que caen
function petalos(alto, cantidad = 6) {
  let r = '';
  for (let i = 0; i < cantidad; i++) {
    const x = 60 + ((i * 173) % (ANCHO - 120));
    const dur = 10 + (i % 4) * 2.5;
    r += `<g transform="translate(${x} 0)"><g class="cae" style="animation-delay:-${(i * 2.3) % dur}s; animation-duration:${dur}s">
    <use href="#caido" x="-8" y="-8" width="${12 + (i % 3) * 4}" height="${12 + (i % 3) * 4}"/></g></g>`;
  }
  return alto > 0 ? r : '';
}

// Destellos (luciérnagas en modo oscuro, brillos en modo claro)
function destellos(t, alto, cantidad = 24) {
  let r = '';
  for (let i = 0; i < cantidad; i++) {
    const x = (i * 211) % ANCHO;
    const y = (i * 67) % alto;
    r += `<circle class="brillo" cx="${x}" cy="${y}" r="${(i % 3) * 0.6 + 1}" fill="${t.destello}" style="animation-delay:-${(i % 7) * 0.4}s"/>`;
  }
  return r;
}

function tarjeta(t, x, y, w, h) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${t.tarjeta}" fill-opacity="${t === TEMAS.dark ? 0.85 : 0.92}" stroke="${t.borde}" stroke-width="2"/>`;
}

function etiqueta(t, x, y, texto, color = t.acento) {
  return `<text x="${x}" y="${y}" font-family="${MONO}" font-size="15" letter-spacing="4" fill="${color}">${texto}</text>`;
}

function fondo(alto) {
  return `<rect width="${ANCHO}" height="${alto}" rx="26" fill="url(#fondo)"/>`;
}

// ---------- secciones ----------

const SECCIONES = {
  portada(t) {
    const h = 400;
    return svg(h, `
${fondo(h)}${destellos(t, h)}${petalos(h, 7)}
<g transform="translate(60 60)">
  <rect width="280" height="280" rx="14" fill="url(#portada)"/>
  <rect x="14" y="14" width="252" height="252" rx="8" fill="none" stroke="#dcfce7" stroke-opacity=".35" stroke-width="2"/>
  ${rosa(140, 118, 150, -6, 0)}
  ${rosa(54, 190, 70, -24, 1.4)}
  ${rosa(228, 196, 62, 20, 2.6)}
  ${rosa(218, 52, 40, 12, 3.1)}
  <text x="140" y="250" text-anchor="middle" font-family="${TITULO}" font-size="30" letter-spacing="6" fill="#fef2f2">METANOIA</text>
</g>
<text x="390" y="118" font-family="${MONO}" font-size="16" letter-spacing="5" fill="${t.acento}">ÁLBUM · 2026</text>
<text x="388" y="190" font-family="${TITULO}" font-size="56" fill="${t.texto}">SEBASTIÁN</text>
<text x="388" y="250" font-family="${TITULO}" font-size="56" fill="${t.texto}">CALDERON</text>
<text x="390" y="294" font-family="${TEXTO}" font-size="26" font-weight="600" fill="${t.suave}">Desarrollador Full Stack</text>
<text x="390" y="330" font-family="${MONO}" font-size="16" fill="${t.suave}" opacity=".9">Bogotá, Colombia · Ci2 · 1 track · ∞ commits</text>
${rosa(910, 90, 80, 14, 0.7)}
`, t, 'METANOIA — Sebastián Calderon, Desarrollador Full Stack');
  },

  intro(t) {
    const h = 300;
    const lineas = [
      ['Graduado del Tecnólogo en Análisis y Desarrollo de Software', '(ADSO) del SENA.'],
      ['Desarrollador Full Stack en Ci2, Bogotá.'],
      ['Fuera del código: fútbol y música urbana —', 'Eladio Carrión en repeat.'],
    ];
    let y = 110;
    let texto = '';
    for (const bloque of lineas) {
      texto += `<use href="#caido" x="74" y="${y - 15}" width="16" height="16"/>`;
      for (const l of bloque) {
        texto += `<text x="102" y="${y}" font-family="${TEXTO}" font-size="21" fill="${t.texto}">${l}</text>`;
        y += 28;
      }
      y += 12;
    }
    return svg(h, `
${fondo(h)}${destellos(t, h, 14)}
${tarjeta(t, 40, 30, 920, 240)}
${etiqueta(t, 80, 72, '01 · INTRO')}
${texto}
<g transform="translate(700 90)">
  <g>
    <circle cx="110" cy="70" r="66" fill="#0a0a0a"/>
    <circle cx="110" cy="70" r="56" fill="none" stroke="#3f3f46" stroke-width="1"/>
    <circle cx="110" cy="70" r="46" fill="none" stroke="#3f3f46" stroke-width="1"/>
    <circle cx="110" cy="70" r="36" fill="none" stroke="#3f3f46" stroke-width="1"/>
    <circle cx="110" cy="70" r="24" fill="${t.petalo[1]}"/>
    <use href="#rosa" x="96" y="56" width="28" height="28"/>
    <circle cx="110" cy="70" r="3" fill="#0a0a0a"/>
    <animateTransform attributeName="transform" type="rotate" from="0 110 70" to="360 110 70" dur="6s" repeatCount="indefinite"/>
  </g>
</g>
<g transform="translate(700 236)" font-family="${MONO}" font-size="13" fill="${t.suave}">
  <text x="0" y="0">0:42</text>
  <rect x="44" y="-6" width="150" height="4" rx="2" fill="${t.borde}"/>
  <rect x="44" y="-6" width="56" height="4" rx="2" fill="${t.acento}"/>
  <circle cx="100" cy="-4" r="6" fill="${t.acento}"/>
  <text x="202" y="0">3:15</text>
</g>
`, t, 'Intro: graduado del Tecnólogo ADSO del SENA, desarrollador Full Stack en Ci2 (Bogotá). Fútbol y música urbana.');
  },

  discografia(t) {
    const h = 360;
    const hitos = [
      ['2024', 'SINGLE', 'Inicio', ['Empecé el tecnólogo', 'ADSO en el SENA.']],
      ['2025', 'EP', 'React &amp; Laravel', ['Mi primer proyecto', 'con React y Laravel.']],
      ['2026', 'ÁLBUM', 'SCORD', ['Sistema SCORD:', 'web, API y móvil.']],
    ];
    let cartas = '';
    hitos.forEach(([anio, tipo, nombre, desc], i) => {
      const x = 60 + i * 300;
      cartas += `
<g transform="translate(${x} 90)">
  ${tarjeta(t, 0, 0, 270, 240)}
  <rect x="20" y="20" width="96" height="96" rx="10" fill="url(#portada)"/>
  ${rosa(68, 68, 56 + i * 10, -10 + i * 12, i * 0.8)}
  <text x="134" y="52" font-family="${TITULO}" font-size="38" fill="${t.texto}">${anio}</text>
  <text x="136" y="80" font-family="${MONO}" font-size="13" letter-spacing="3" fill="${t.acento}">${tipo}</text>
  <text x="136" y="106" font-family="${TEXTO}" font-size="${nombre.length > 10 ? 16 : 20}" font-weight="700" fill="${t.suave}">${nombre}</text>
  <text x="22" y="164" font-family="${TEXTO}" font-size="18" fill="${t.texto}">${desc[0]}</text>
  <text x="22" y="190" font-family="${TEXTO}" font-size="18" fill="${t.texto}">${desc[1]}</text>
  <rect x="22" y="212" width="${60 + i * 70}" height="4" rx="2" fill="${t.acento}" opacity=".8"/>
</g>`;
    });
    return svg(h, `
${fondo(h)}${destellos(t, h, 18)}${petalos(h, 4)}
${etiqueta(t, 64, 62, '02 · DISCOGRAFÍA', t.texto)}
${cartas}
`, t, 'Discografía: 2024 empecé el tecnólogo ADSO en el SENA; 2025 mi primer proyecto con React y Laravel; 2026 el sistema SCORD.');
  },

  tracklist(t) {
    const h = 330;
    const barras = [14, 22, 10, 18];
    return svg(h, `
${fondo(h)}${destellos(t, h, 14)}
${tarjeta(t, 40, 30, 920, 270)}
${etiqueta(t, 80, 72, '03 · TRACKLIST')}
<g font-family="${MONO}" font-size="13" letter-spacing="2" fill="${t.tenue}">
  <text x="80" y="108">#</text><text x="130" y="108">TÍTULO</text><text x="880" y="108" text-anchor="end">AÑO</text>
</g>
<line x1="80" y1="120" x2="920" y2="120" stroke="${t.borde}" stroke-width="2"/>
<g>
  <text x="80" y="164" font-family="${MONO}" font-size="20" fill="${t.acento}">01</text>
  <text x="130" y="164" font-family="${TEXTO}" font-size="24" font-weight="800" fill="${t.texto}">SCORD</text>
  <text x="230" y="164" font-family="${TEXTO}" font-size="16" fill="${t.suave}">feat. Laravel, React, Flutter &amp; PostgreSQL</text>
  <text x="880" y="164" text-anchor="end" font-family="${MONO}" font-size="18" fill="${t.suave}">2026</text>
  <text x="130" y="196" font-family="${TEXTO}" font-size="17" fill="${t.texto}">Sistema de control y organización deportiva para una escuela de fútbol: jugadores,</text>
  <text x="130" y="220" font-family="${TEXTO}" font-size="17" fill="${t.texto}">entrenadores, cronogramas, partidos, estadísticas y reportes en PDF. Web, API y app móvil.</text>
  ${barras.map((b, i) => `<rect x="${800 - i * 9}" y="${168 - b}" width="5" height="${b}" rx="2" fill="${t.acento}"><animate attributeName="height" values="${b};6;${b}" dur="${0.8 + i * 0.15}s" repeatCount="indefinite"/></rect>`).join('')}
</g>
<line x1="80" y1="242" x2="920" y2="242" stroke="${t.borde}" stroke-width="1" stroke-dasharray="4 6"/>
<g opacity=".5">
  <text x="80" y="276" font-family="${MONO}" font-size="20" fill="${t.tenue}">02</text>
  <text x="130" y="276" font-family="${TEXTO}" font-size="20" font-style="italic" fill="${t.tenue}">Próximamente…</text>
  <text x="880" y="276" text-anchor="end" font-family="${MONO}" font-size="18" fill="${t.tenue}">--:--</text>
</g>
`, t, 'Tracklist: 01 SCORD (2026), sistema de control y organización deportiva para una escuela de fútbol, hecho con Laravel, React, Flutter y PostgreSQL. 02 próximamente.');
  },

  sello(t) {
    const h = 170;
    return svg(h, `
${fondo(h)}${destellos(t, h, 10)}
${tarjeta(t, 40, 25, 920, 120)}
${etiqueta(t, 80, 64, 'SELLO ACTUAL')}
<text x="80" y="112" font-family="${TITULO}" font-size="38" fill="${t.texto}">Ci2</text>
<text x="170" y="110" font-family="${TEXTO}" font-size="22" fill="${t.suave}">Desarrollador Full Stack · Bogotá</text>
<circle cx="890" cy="85" r="8" fill="${t.acento}"><animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;.5;1" dur="2s" repeatCount="indefinite"/></circle>
<text x="870" y="90" text-anchor="end" font-family="${MONO}" font-size="14" fill="${t.suave}">EN VIVO</text>
`, t, 'Sello actual: desarrollador Full Stack en Ci2, Bogotá');
  },

  creditos(t) {
    const grupos = [
      ['Producción', 'Backend', ['PHP', 'Laravel', '.NET']],
      ['Composición', 'Frontend', ['React', 'Angular', 'JavaScript']],
      ['Arreglos', 'Móvil', ['Flutter', 'Dart']],
      ['Mezcla', 'Bases de datos', ['PostgreSQL', 'MySQL']],
      ['Masterización', 'Herramientas', ['Git']],
    ];
    const h = 120 + grupos.length * 58;
    let filas = '';
    grupos.forEach(([rol, area, techs], i) => {
      const y = 120 + i * 58;
      let x = 380;
      const pills = techs.map((tec) => {
        const w = 26 + tec.length * 11;
        const p = `<rect x="${x}" y="${y - 24}" width="${w}" height="36" rx="18" fill="${t.suave}" fill-opacity=".12" stroke="${t.suave}" stroke-opacity=".55"/>
        <text x="${x + w / 2}" y="${y}" text-anchor="middle" font-family="${MONO}" font-size="16" fill="${t.texto}">${tec}</text>`;
        x += w + 12;
        return p;
      }).join('');
      filas += `<text x="80" y="${y}" font-family="${TEXTO}" font-size="20" font-weight="800" fill="${t.texto}">${rol}</text>
      <text x="230" y="${y}" font-family="${MONO}" font-size="14" fill="${t.acento}">${area}</text>${pills}`;
    });
    return svg(h, `
${fondo(h)}${destellos(t, h, 18)}
${tarjeta(t, 40, 30, 920, h - 60)}
${etiqueta(t, 80, 72, '04 · CRÉDITOS')}
${filas}
${rosa(888, 100, 70, 12, 1.1)}
`, t, 'Créditos: backend con PHP, Laravel y .NET; frontend con React, Angular y JavaScript; móvil con Flutter y Dart; bases de datos PostgreSQL y MySQL; herramientas: Git.');
  },

  'red-instagram'(t) {
    return red(t, 'INSTAGRAM', '@sebass_sb', 'Instagram: @sebass_sb');
  },

  'red-github'(t) {
    return red(t, 'GITHUB', '@sebassbb', 'GitHub: @sebassbb');
  },

  firma(t) {
    const h = 210;
    return svg(h, `
${rosa(500, 58, 90, 0, 0)}
<text x="500" y="160" text-anchor="middle" font-family="${TITULO}" font-size="54" letter-spacing="14" fill="${t.texto}">METANOIA</text>
<text x="500" y="192" text-anchor="middle" font-family="${MONO}" font-size="14" letter-spacing="4" fill="${t.acento}">TRANSFORMACIÓN · 2026</text>
`, t, 'METANOIA');
  },
};

function red(t, plataforma, usuario, titulo) {
  const h = 120;
  const w = 500;
  return svg(h, `
<rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="58" fill="url(#fondo)" stroke="${t.borde}" stroke-width="3"/>
<circle cx="60" cy="60" r="38" fill="${t.tarjeta}" fill-opacity=".9"/>
<path d="M52 42 L78 60 L52 78 Z" fill="${t.acento}"/>
<text x="116" y="50" font-family="${MONO}" font-size="16" letter-spacing="4" fill="${t.suave}">${plataforma}</text>
<text x="114" y="86" font-family="${TITULO}" font-size="30" fill="${t.texto}">${usuario}</text>
${rosa(440, 60, 64, 10, 0.5)}
`, t, titulo, w);
}

// ---------- escribir archivos ----------

fs.mkdirSync(SALIDA, { recursive: true });
for (const [nombre, generar] of Object.entries(SECCIONES)) {
  for (const [modo, tema] of Object.entries(TEMAS)) {
    fs.writeFileSync(path.join(SALIDA, `${nombre}-${modo}.svg`), generar(tema));
  }
}
console.log(`Generadas ${Object.keys(SECCIONES).length * 2} imágenes en assets/`);
