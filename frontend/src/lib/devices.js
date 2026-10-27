// Shared, original device artwork. The same drawings power the interactive
// diagrams and the generated GIFs, keeping every animation visually consistent.
const rect = (x, y, w, h, fill, r = 8, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`
const line = (x1, y1, x2, y2, color = '#6a8b7a', width = 2) =>
  `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`
const circle = (x, y, r, fill, extra = '') =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`
const part = (name, dx, dy, angle, anchor, label, svg) => ({
  name,
  dx,
  dy,
  angle,
  anchor,
  label,
  svg,
})
const fins = (x, y, count, height, gap = 8) =>
  Array.from({ length: count }, (_, i) => rect(x + i * gap, y, 3, height, '#a8bdb3', 1)).join('')
const coil = (x, y, w, rows, color = '#e5a276') =>
  `<path d="M${x} ${y} ${Array.from({ length: rows }, (_, i) => `h${i % 2 ? -w : w} q${i % 2 ? -8 : 8} 0 ${i % 2 ? -8 : 8} 8 v3 q0 8 ${i % 2 ? 8 : -8} 8`).join(' ')}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`
const screw = (x, y) => circle(x, y, 3, '#b7cbc1') + line(x - 1, y, x + 1, y, '#405c50', 1)
const blade =
  '<path d="M0-7 C-46-15-48-68-16-69 C10-70 20-34 0-7Z" fill="url(#body)" stroke="#cfe5b7" stroke-width="1.5"/>'
const rotor = (x, y, phase = 0, scale = 1) =>
  `<g transform="translate(${x} ${y}) scale(${scale})"><g transform="rotate(${phase})">${[0, 120, 240].map((a) => `<g transform="rotate(${a})">${blade}</g>`).join('')}</g>${circle(0, 0, 13, '#f1efdc')}${circle(0, 0, 5, '#436353')}</g>`

export const devices = [
  {
    id: 'fridge',
    name: 'Refrigerator',
    short: 'Fridge',
    question: 'Does a fridge make cold?',
    answer: 'It moves heat out.',
    detail:
      'A refrigerant carries heat from inside the fridge to the coils outside. The compressor keeps that journey going.',
    concept: 'Heat transfer',
    color: '#b9dccb',
    fact: 'The coils at the back release heat into the room.',
    parts: ['Insulated door', 'Cooling coils', 'Compressor'],
    safety: 'Professionally prepared cutaway; children never handle refrigerant lines.',
  },
  {
    id: 'engine',
    name: 'Engine',
    short: 'Engine',
    question: 'How does a car turn fuel into movement?',
    answer: 'A little push. A lot of motion.',
    detail:
      'Expanding gases push a piston. A connecting rod and crankshaft turn that back-and-forth motion into rotation.',
    concept: 'Energy & motion',
    color: '#efbc96',
    fact: 'The crankshaft turns an up-and-down push into a spin.',
    parts: ['Cylinder head', 'Piston', 'Crankshaft'],
    safety: 'Cleaned, drained cutaway parts only, with no fuel or live battery.',
  },
  {
    id: 'microwave',
    name: 'Microwave',
    short: 'Microwave',
    question: 'How does lunch get warm so quickly?',
    answer: 'Tiny waves. Warmer food.',
    detail:
      'A magnetron produces microwaves. The food absorbs their energy, especially through its water molecules, and heats up.',
    concept: 'Waves & energy',
    color: '#c5b8e5',
    fact: 'The turntable helps food pass through different parts of the wave field.',
    parts: ['Outer cover', 'Magnetron', 'Turntable'],
    safety: 'Illustrated exploration only; internal high-voltage components are adult-only.',
  },
  {
    id: 'ac',
    name: 'Air conditioner',
    short: 'AC',
    question: 'Where does the heat in a warm room go?',
    answer: 'Outside, with a little help.',
    detail:
      'The indoor coil absorbs heat. A refrigerant carries it to an outdoor unit, while a fan circulates the cooled room air.',
    concept: 'Heat & airflow',
    color: '#b4d5e3',
    fact: 'A fridge and an AC use the same big idea: move heat.',
    parts: ['Front cover', 'Air filter', 'Cooling coil'],
    safety: 'Explore a prepared model; sealed refrigerant systems stay with professionals.',
  },
  {
    id: 'tv',
    name: 'Television',
    short: 'TV',
    question: 'How does a screen make a million colours?',
    answer: 'Small lights. Big pictures.',
    detail:
      'In an LCD television, a backlight shines through layers. Tiny red, green, and blue subpixels control the colours you see.',
    concept: 'Light & colour',
    color: '#d9c8ed',
    fact: 'Look closely: a colour picture is made from red, green, and blue.',
    parts: ['LCD panel', 'Backlight', 'Signal board'],
    safety: 'Battery-free, disconnected display layers; electronics are prepared by adults.',
  },
  {
    id: 'phone',
    name: 'Smartphone',
    short: 'Phone',
    question: 'What is hiding behind your screen?',
    answer: 'A tiny team of clever parts.',
    detail:
      'The circuit board connects processors, cameras, sensors, and speakers. Each part has a job; together they make a phone work.',
    concept: 'Circuits & sensors',
    color: '#d1e49b',
    fact: 'A speaker turns electrical signals into vibrations you can hear.',
    parts: ['Display', 'Circuit board', 'Rear cover'],
    safety: 'Batteries are removed before a phone reaches the classroom.',
  },
  {
    id: 'fan',
    name: 'Electric fan',
    short: 'Fan',
    question: 'How does electricity become a breeze?',
    answer: 'Magnets make it move.',
    detail:
      'Electric current creates a magnetic field inside the motor. That turns the shaft and blades, which push the air around you.',
    concept: 'Electricity & magnets',
    color: '#e6d7ab',
    fact: 'A fan moves air; it does not cool the air like an AC.',
    parts: ['Front guard', 'Fan blades', 'Motor'],
    safety: 'Disconnected equipment; adults open the motor and supervise safe parts.',
  },
]

function partsFor(type, phase) {
  if (type === 'fridge')
    return [
      part(
        'CABINET',
        25,
        -8,
        0,
        [310, 200],
        [430, 93],
        rect(226, 77, 151, 282, 'url(#edge)', 15) +
          rect(235, 83, 132, 265, '#b8ccc1', 10) +
          rect(246, 96, 110, 73, '#334e45', 6) +
          rect(246, 179, 110, 155, '#3b5b50', 5) +
          [218, 266, 309].map((y) => rect(249, y, 103, 5, '#c5ded1', 2)).join('') +
          rect(247, 317, 101, 13, '#8fae9d', 3) +
          rect(242, 359, 17, 6, '#263d34', 2) +
          rect(346, 359, 17, 6, '#263d34', 2),
      ),
      part(
        'COOLING COILS',
        131,
        -3,
        5,
        [320, 207],
        [451, 226],
        coil(272, 124, 55, 8) + line(275, 120, 275, 109, '#e5a276', 5),
      ),
      part(
        'COMPRESSOR',
        79,
        51,
        0,
        [323, 324],
        [412, 395],
        rect(291, 293, 57, 45, '#263d36', 18) +
          rect(289, 330, 64, 7, '#718f7d', 3) +
          line(296, 306, 283, 302, '#e5a276', 5) +
          line(345, 308, 360, 295, '#e5a276', 5) +
          rect(308, 290, 18, 4, '#a8bbac', 2),
      ),
      part(
        'INSULATED DOOR',
        -133,
        -6,
        -9,
        [289, 215],
        [65, 97],
        rect(223, 78, 147, 276, '#638c6e', 14) +
          rect(218, 75, 144, 275, 'url(#body)', 13) +
          line(221, 167, 359, 167, '#819e70', 2) +
          rect(335, 113, 7, 35, '#f4f2d7', 3) +
          rect(335, 183, 7, 51, '#f4f2d7', 3) +
          rect(239, 94, 38, 4, '#e6efce', 2) +
          rect(239, 103, 20, 2, '#a6c78e', 1),
      ),
    ]
  if (type === 'engine')
    return [
      part(
        'ENGINE BLOCK',
        0,
        13,
        0,
        [293, 245],
        [72, 276],
        rect(225, 159, 154, 150, 'url(#metal)', 13) +
          rect(247, 178, 104, 110, '#263e36', 6) +
          rect(258, 180, 81, 104, '#4a6258', 3) +
          fins(226, 171, 3, 119) +
          fins(359, 171, 3, 119) +
          [235, 369].flatMap((x) => [171, 294].map((y) => screw(x, y))).join(''),
      ),
      part(
        'CRANKSHAFT',
        77,
        94,
        8,
        [310, 300],
        [422, 393],
        line(250, 294, 349, 294, '#a4bcae', 17) +
          circle(297, 294, 29, '#627c70', 'stroke="#c0d0bf" stroke-width="3"') +
          circle(297, 294, 11, '#263c34') +
          line(297, 294, 313, 280, '#e2aa7d', 11) +
          circle(313, 280, 5, '#f2dbb2'),
      ),
      part(
        'PISTON',
        -77,
        -14,
        -8,
        [300, 218],
        [73, 177],
        line(302, 229, 313, 280, '#baccc0', 14) +
          circle(313, 280, 10, '#738d7f', 'stroke="#d1dcce" stroke-width="4"') +
          rect(264, 187 + Math.sin((phase * Math.PI) / 180) * 8, 75, 51, 'url(#metal)', 5) +
          [196, 202, 208]
            .map((y) =>
              line(
                267,
                y + Math.sin((phase * Math.PI) / 180) * 8,
                335,
                y + Math.sin((phase * Math.PI) / 180) * 8,
                '#596e61',
                3,
              ),
            )
            .join(''),
      ),
      part(
        'CYLINDER HEAD',
        2,
        -99,
        -3,
        [300, 147],
        [397, 63],
        rect(222, 124, 161, 47, 'url(#metal)', 8) +
          fins(229, 132, 19, 30) +
          rect(279, 108, 35, 17, '#dba77c', 3) +
          rect(292, 96, 9, 19, '#e9efde', 3) +
          line(296, 97, 296, 89, '#8aa99a', 3),
      ),
    ]
  if (type === 'microwave')
    return [
      part(
        'COOKING CHAMBER',
        0,
        11,
        0,
        [289, 230],
        [73, 318],
        rect(173, 138, 254, 160, 'url(#metal)', 12) +
          rect(183, 149, 187, 136, '#344e46', 7) +
          rect(197, 160, 160, 110, '#627d70', 3) +
          rect(206, 165, 146, 97, '#49675c', 3) +
          rect(382, 153, 34, 32, '#20372f', 4) +
          '<text x="389" y="174" fill="#d3f36b" font-size="12" font-family="monospace">0:30</text>' +
          [202, 229, 256].map((y) => circle(398, y, 7, '#c8d3bf')).join(''),
      ),
      part(
        'MAGNETRON',
        109,
        -77,
        7,
        [372, 180],
        [438, 89],
        rect(337, 165, 64, 55, '#8caaa0', 5) +
          fins(342, 169, 7, 47) +
          rect(358, 153, 24, 13, '#d7ad81', 3) +
          circle(370, 150, 8, '#d7e0ce') +
          line(345, 216, 328, 231, '#d4a47d', 4),
      ),
      part(
        'TURNTABLE',
        -20,
        88,
        -5,
        [279, 257],
        [333, 385],
        '<ellipse cx="279" cy="257" rx="70" ry="15" fill="#c6e0d8" fill-opacity=".85" stroke="#e0f1df" stroke-width="3"/>' +
          '<ellipse cx="279" cy="257" rx="48" ry="9" fill="none" stroke="#88b5a2"/>' +
          circle(279, 257, 4, '#edf0d7'),
      ),
      part(
        'OUTER COVER',
        -23,
        -90,
        -5,
        [294, 142],
        [82, 60],
        '<path d="M167 145 L189 123 H428 L440 145 V283 H427 V145Z" fill="url(#body)" stroke="#d9e5c5" stroke-width="2"/>' +
          line(186, 133, 412, 133, '#e3edcf', 3),
      ),
      part(
        'MESH DOOR',
        -111,
        29,
        -13,
        [272, 218],
        [67, 199],
        rect(174, 143, 202, 146, '#182f29', 9) +
          rect(186, 154, 163, 123, 'url(#glass)', 4) +
          '<rect x="192" y="159" width="151" height="111" fill="url(#mesh)" rx="2"/>' +
          rect(357, 171, 7, 88, '#c3d6b1', 3),
      ),
    ]
  if (type === 'ac')
    return [
      part(
        'HOUSING',
        16,
        28,
        0,
        [299, 225],
        [426, 337],
        rect(153, 158, 300, 132, 'url(#metal)', 15) +
          rect(164, 172, 276, 85, '#36574a', 8) +
          rect(174, 267, 251, 13, '#294638', 3),
      ),
      part(
        'COOLING COIL',
        31,
        -80,
        4,
        [300, 211],
        [438, 96],
        rect(168, 181, 267, 66, '#547e70', 4) +
          fins(176, 186, 31, 55) +
          [188, 208, 229].map((y) => line(174, y, 427, y, '#d6a278', 4)).join(''),
      ),
      part(
        'AIR FILTER',
        -67,
        -27,
        -7,
        [292, 203],
        [68, 122],
        rect(
          164,
          175,
          267,
          77,
          '#9fbea0',
          5,
          'fill-opacity=".5" stroke="#cedfc1" stroke-width="4"',
        ) +
          Array.from({ length: 22 }, (_, i) =>
            line(172 + i * 12, 179, 172 + i * 12, 248, '#b2c9ab', 1),
          ).join('') +
          [190, 207, 224, 241].map((y) => line(167, y, 427, y, '#b2c9ab', 1)).join(''),
      ),
      part(
        'FRONT COVER',
        -49,
        88,
        -5,
        [296, 220],
        [69, 365],
        rect(151, 158, 300, 132, '#749879', 15) +
          rect(151, 155, 300, 122, 'url(#body)', 14) +
          rect(166, 253, 265, 16, '#385f49', 4) +
          [256, 261, 266].map((y) => line(173, y, 423, y, '#91ac87', 1)).join('') +
          circle(423, 175, 3, '#d3f36b') +
          rect(174, 176, 48, 3, '#e7eed4', 1),
      ),
    ]
  if (type === 'tv')
    return [
      part(
        'REAR HOUSING',
        88,
        -43,
        6,
        [303, 220],
        [436, 100],
        rect(152, 118, 303, 202, '#466353', 12) +
          rect(166, 132, 275, 169, '#273f34', 5) +
          rect(277, 316, 49, 36, '#5b7762', 3) +
          '<path d="M297 340L244 367H358L307 340Z" fill="#76977c"/>',
      ),
      part(
        'SIGNAL BOARD',
        36,
        97,
        7,
        [302, 211],
        [440, 386],
        rect(231, 167, 140, 91, '#488271', 6) +
          rect(273, 186, 41, 37, '#183e34', 3) +
          Array.from({ length: 6 }, (_, i) =>
            line(243, 177 + i * 12, 355, 177 + i * 12, '#86b69c', 1),
          ).join('') +
          rect(278, 189, 31, 28, '#263d33', 3) +
          [245, 265, 330, 349].map((x) => rect(x, 239, 11, 8, '#dab688', 1)).join(''),
      ),
      part(
        'BACKLIGHT',
        -20,
        0,
        0,
        [301, 213],
        [435, 265],
        rect(159, 124, 286, 185, '#d7e6cb', 7) +
          [153, 183, 213, 243, 273].map((y) => line(175, y, 430, y, '#f5f3ce', 7)).join('') +
          Array.from({ length: 7 }, (_, i) =>
            [153, 183, 213, 243, 273].map((y) => circle(185 + i * 38, y, 3, '#fffce1')).join(''),
          ).join(''),
      ),
      part(
        'LCD PANEL',
        -118,
        -32,
        -7,
        [296, 213],
        [57, 82],
        rect(152, 118, 303, 202, '#a0b393', 9) +
          rect(155, 116, 296, 198, '#152f28', 8) +
          rect(163, 124, 280, 180, 'url(#display)', 3) +
          '<path d="M163 266 L250 177 318 240 373 158 443 218V304H163Z" fill="#bed78a" opacity=".6"/>' +
          '<path d="M163 289 L270 233 337 278 400 227 443 248V304H163Z" fill="#e4eac1" opacity=".5"/>' +
          circle(215, 164, 17, '#f7ddb4') +
          circle(303, 310, 2, '#d3f36b'),
      ),
    ]
  if (type === 'phone')
    return [
      part(
        'REAR COVER',
        105,
        -36,
        12,
        [298, 217],
        [435, 76],
        rect(229, 85, 143, 271, 'url(#body)', 23) +
          rect(239, 97, 53, 62, '#719578', 13) +
          [112, 140]
            .map((y) => circle(254, y, 10, '#203c32', 'stroke="#b9cdaa" stroke-width="3"'))
            .join('') +
          circle(278, 113, 4, '#ecebc5') +
          circle(300, 218, 19, '#9ebe83') +
          circle(300, 218, 11, '#c6dda6'),
      ),
      part(
        'CIRCUIT BOARD',
        4,
        5,
        0,
        [299, 218],
        [422, 246],
        rect(236, 94, 127, 255, '#407b63', 17) +
          Array.from(
            { length: 8 },
            (_, i) =>
              `<path d="M247 ${119 + i * 25}h25v12h69" fill="none" stroke="#93bd8b" stroke-width="1.5"/>`,
          ).join('') +
          rect(268, 136, 57, 56, '#243f34', 4) +
          rect(275, 143, 43, 42, '#556f54', 2) +
          '<text x="285" y="168" fill="#d8e3b9" font-size="10" font-family="monospace">CPU</text>' +
          rect(250, 224, 96, 100, '#9cae87', 7) +
          line(264, 243, 331, 243, '#dce5bb', 2) +
          line(264, 253, 305, 253, '#dce5bb', 2) +
          [250, 346].flatMap((x) => [108, 335].map((y) => screw(x, y))).join(''),
      ),
      part(
        'CAMERA',
        80,
        66,
        8,
        [264, 117],
        [437, 344],
        rect(246, 99, 37, 37, '#a0b7a3', 7) +
          circle(264, 117, 14, '#203f36') +
          circle(264, 117, 8, '#4e7b6c') +
          circle(261, 114, 3, '#c0d7cd'),
      ),
      part(
        'DISPLAY',
        -112,
        -23,
        -12,
        [294, 216],
        [70, 91],
        rect(228, 84, 143, 271, '#97b7a2', 23) +
          rect(225, 81, 143, 271, '#142e27', 23) +
          rect(232, 88, 129, 255, 'url(#display)', 17) +
          '<path d="M232 266Q305 150 361 201V326Q361 343 344 343H249Q232 343 232 326Z" fill="#b2d888" opacity=".85"/>' +
          '<path d="M232 298Q305 226 361 260V326Q361 343 344 343H249Q232 343 232 326Z" fill="#e1e8b8" opacity=".7"/>' +
          rect(278, 95, 36, 7, '#182e28', 4) +
          rect(279, 331, 34, 3, '#e6edcc', 2),
      ),
    ]
  return [
    part(
      'STAND',
      9,
      40,
      0,
      [300, 312],
      [421, 369],
      rect(289, 237, 22, 103, 'url(#metal)', 8) +
        '<ellipse cx="300" cy="342" rx="76" ry="17" fill="#4b6c54"/>' +
        '<ellipse cx="300" cy="337" rx="75" ry="17" fill="#b3c597"/>' +
        rect(287, 329, 27, 9, '#536f54', 4),
    ),
    part(
      'MOTOR',
      105,
      -27,
      6,
      [300, 209],
      [445, 128],
      rect(268, 171, 65, 74, '#4d7865', 20) +
        coil(279, 185, 31, 3) +
        circle(300, 207, 14, '#b1bd95') +
        circle(300, 207, 5, '#4b6857'),
    ),
    part('FAN BLADES', -1, -26, 0, [300, 208], [430, 259], rotor(300, 208, phase, 1.27)),
    part(
      'FRONT GUARD',
      -117,
      -25,
      -7,
      [300, 208],
      [57, 83],
      circle(300, 208, 104, '#c3d9b6', 'fill-opacity=".08" stroke="#c9dcc0" stroke-width="5"') +
        [32, 56, 79, 96]
          .map((r) => circle(300, 208, r, 'none', 'stroke="#c0d5b1" stroke-width="1.5"'))
          .join('') +
        Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6
          return line(
            300 + Math.cos(a) * 15,
            208 + Math.sin(a) * 15,
            300 + Math.cos(a) * 102,
            208 + Math.sin(a) * 102,
            '#b8d0ac',
            1.5,
          )
        }).join('') +
        circle(300, 208, 17, '#dbe5c4') +
        circle(300, 208, 7, '#88a27c'),
    ),
  ]
}

export function deviceSvg(type, progress = 1, { phase = 0, labels = true, id = 'device' } = {}) {
  const p = Math.min(1, Math.max(0, progress))
  const parts = partsFor(type, phase)
  const definitions = `<defs>
    <linearGradient id="body" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e0edbb"/><stop offset=".46" stop-color="#bad695"/><stop offset="1" stop-color="#7eaa76"/></linearGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="#dde3ce"/><stop offset=".35" stop-color="#93afa0"/><stop offset="1" stop-color="#688e7c"/></linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e0ead6"/><stop offset="1" stop-color="#587f6c"/></linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#74967c"/><stop offset="1" stop-color="#183b31"/></linearGradient>
    <linearGradient id="display" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#245e51"/><stop offset=".5" stop-color="#699d79"/><stop offset="1" stop-color="#d1e6a0"/></linearGradient>
    <pattern id="mesh" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#b0c6a1" opacity=".5"/></pattern>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="220%"><feDropShadow dx="3" dy="9" stdDeviation="7" flood-color="#041e13" flood-opacity=".24"/></filter>
  </defs>`
  const guides =
    p > 0.02
      ? parts
          .map(
            (a) =>
              `<path d="M${a.anchor[0]} ${a.anchor[1]}l${a.dx * p} ${a.dy * p}" stroke="#aecda3" stroke-width="1" stroke-dasharray="3 5" opacity="${p * 0.5}"/>`,
          )
          .join('')
      : ''
  const bodies = parts
    .map(
      (a) =>
        `<g transform="translate(${(a.dx * p).toFixed(2)} ${(a.dy * p).toFixed(2)}) rotate(${(a.angle * p).toFixed(2)} ${a.anchor[0]} ${a.anchor[1]})" filter="url(#shadow)">${a.svg}</g>`,
    )
    .join('')
  const annotations = labels
    ? parts
        .map((a) => {
          const x = a.anchor[0] + a.dx * p,
            y = a.anchor[1] + a.dy * p
          const left = a.label[0] < 300
          return `<g opacity="${Math.max(0, (p - 0.4) / 0.6).toFixed(3)}"><path d="M${x} ${y}L${a.label[0] + (left ? 75 : -10)} ${a.label[1] + 6}H${a.label[0]}" stroke="#b4ce9a" stroke-width=".8" fill="none"/>${circle(x, y, 2.5, '#d3f36b')}${rect(a.label[0] - 5, a.label[1] - 11, a.name.length * 6.5 + 10, 16, '#193b2a', 3)}<text x="${a.label[0]}" y="${a.label[1]}" fill="#dce8cf" font-size="9" font-family="monospace" letter-spacing="1">${a.name}</text></g>`
        })
        .join('')
    : ''
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 440" fill="none">${definitions}<ellipse cx="300" cy="390" rx="165" ry="12" fill="#051c13" opacity=".18"/>${guides}${bodies}${annotations}</svg>`
  return markup
    .replaceAll(/id="([^"]+)"/g, `id="${id}-$1"`)
    .replaceAll(/url\(#([^)]+)\)/g, `url(#${id}-$1)`)
}
