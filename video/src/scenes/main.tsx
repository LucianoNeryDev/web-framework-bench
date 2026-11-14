import {Audio, Circle, Line, Node, Rect, Txt, makeScene2D} from '@revideo/2d';
import {
  all, createRef, createSignal, easeInOutCubic, easeOutCubic, loop, sequence, tween, useTime, waitFor,
} from '@revideo/core';
import {beats, marks, total} from '../beats';
import {data} from '../data';

// Palette from lucianonery.dev; the bar green is the accent stepped down to pass contrast checks on dark.
const BG = '#080a09', SURFACE = '#0d100e', INK = '#edf1e9', MUTED = '#9ca39a', LINE = '#232823';
const ACCENT = '#a8ff3e', BAR = '#65a30d', REF = '#6b7280';
const SANS = 'Manrope', MONO = 'Plex Mono';
// Revideo 0.11 does not render Txt whose text is a function, so value labels are static text or set in tweens.
const fmt = (v: number) => Math.round(v).toLocaleString('en-US');

/** Wait until an absolute time on the narration track. */
function* at(t: number) {
  const now = useTime();
  if (t > now) yield* waitFor(t - now);
}

function Section(props: {label: string; title: string; refNode: ReturnType<typeof createRef<Node>>}) {
  return (
    <Node ref={props.refNode} opacity={0}>
      <Txt text={props.label} fontFamily={MONO} fontSize={24} fill={ACCENT} letterSpacing={3} x={-860} y={-440} offsetX={-1} />
      <Txt text={props.title} fontFamily={SANS} fontWeight={700} fontSize={64} fill={INK} x={-860} y={-380} offsetX={-1} letterSpacing={-1.5} />
    </Node>
  );
}

export default makeScene2D('main', function* (view) {
  yield document.fonts.load(`700 64px ${SANS}`);
  yield document.fonts.load(`400 24px ${MONO}`);
  yield document.fonts.load(`500 24px ${MONO}`);

  view.fill(BG);
  view.add(<Audio src={'/audio/narration.mp3'} play={true} />);
  // Frame: site-style header line.
  view.add(
    <Node>
      <Txt text="WEB FRAMEWORK BENCH" fontFamily={MONO} fontWeight={500} fontSize={22} fill={MUTED} letterSpacing={4} x={-860} y={-505} offsetX={-1} />
      <Txt text="lucianonery.dev" fontFamily={MONO} fontSize={22} fill={MUTED} x={860} y={-505} offsetX={1} />
      <Line points={[[-960, -475], [960, -475]]} stroke={LINE} lineWidth={1} />
    </Node>,
  );

  // --- 1. Intro ------------------------------------------------------------------------------
  const intro = createRef<Node>();
  const chips = createRef<Node>();
  const stacks = ['HTML', 'Hugo', 'Nuxt', 'Next.js', 'Astro', 'SvelteKit', 'React Router', 'Angular', 'Qwik City',
    'Go (+ htmx)', 'Laravel', 'WordPress', 'Ghost'];
  view.add(
    <Node ref={intro} opacity={0}>
      <Txt text="Same blog." fontFamily={SANS} fontWeight={700} fontSize={150} fill={INK} y={-250} letterSpacing={-5} />
      <Txt text="13 stacks." fontFamily={SANS} fontWeight={700} fontSize={150} fill={ACCENT} y={-90} letterSpacing={-5} />
      <Txt text="24 builds · one contract · measured the same way" fontFamily={MONO} fontSize={32} fill={MUTED} y={40} />
      <Node ref={chips} y={210} />
    </Node>,
  );
  stacks.forEach((name, i) => {
    const row = Math.floor(i / 7), col = i % 7, shift = row === 1 ? 118 : 0; // 7 + 6 chips, both rows centred
    chips().add(
      <Rect x={(col - 3) * 236 + shift} y={row * 86} width={216} height={62} stroke={LINE} lineWidth={2} radius={4} opacity={0} scale={0.9}>
        <Txt text={name} fontFamily={MONO} fontSize={24} fill={INK} />
      </Rect>,
    );
  });

  yield* at(beats.intro.start - 0.5);
  yield* intro().opacity(1, 0.6);
  yield* at(beats.intro.start + 3.2);
  yield* sequence(0.12, ...chips().children().map((c) => all(c.opacity(1, 0.3), c.scale(1, 0.3, easeOutCubic))));
  yield* at(beats.setup.start - 0.4);
  yield* intro().opacity(0, 0.4);

  // --- 2. Setup ------------------------------------------------------------------------------
  const setup = createRef<Node>();
  const packets = createRef<Node>();
  const box = (x: number, title: string, line1: string, line2: string) => (
    <Rect x={x} y={-20} width={560} height={300} fill={SURFACE} stroke={LINE} lineWidth={2} radius={6}>
      <Txt text={title} fontFamily={MONO} fontWeight={500} fontSize={26} fill={ACCENT} letterSpacing={3} y={-80} />
      <Txt text={line1} fontFamily={SANS} fontWeight={700} fontSize={44} fill={INK} y={-10} />
      <Txt text={line2} fontFamily={MONO} fontSize={26} fill={MUTED} y={60} />
    </Rect>
  );
  view.add(
    <Node ref={setup} opacity={0}>
      <Section label="02 · SETUP" title="Two machines on Google Cloud" refNode={createRef<Node>()} />
      {box(-470, 'LOAD + BROWSER', 'n2-standard-4', '4 vCPU · oha · Chromium')}
      {box(470, 'TARGET', 'n2-standard-2', '2 vCPU · one stack at a time')}
      <Line points={[[-180, -20], [180, -20]]} stroke={MUTED} lineWidth={3} endArrow arrowSize={16} />
      <Node ref={packets} />
      <Txt text="same pages · same content · 1,214 checks before any measurement" fontFamily={MONO} fontSize={28} fill={MUTED} y={260} />
    </Node>,
  );
  setup().children()[0].opacity(1);
  for (let i = 0; i < 3; i++) packets().add(<Circle size={14} fill={ACCENT} x={-170} y={-20} opacity={0} />);

  yield* setup().opacity(1, 0.5);
  yield* loop(Math.floor((beats.static.start - 0.6 - useTime()) / 1.1), () => // one cycle: 2 x 0.25 s stagger + 0.6 s
    sequence(0.25, ...packets().children().map((p) => all(p.opacity(1, 0).to(1, 0.5).to(0, 0.1), p.position.x(-170, 0).to(170, 0.6, easeInOutCubic)))),
  );
  yield* at(beats.static.start - 0.4);
  yield* setup().opacity(0, 0.4);

  // --- 3. Static builds ----------------------------------------------------------------------
  const stat = createRef<Node>();
  const statRows = createRef<Node>();
  const W = 780, rowH = 66, maxStatic = 20000;
  view.add(
    <Node ref={stat} opacity={0}>
      <Section label="03 · PRERENDERED" title="Every static build serves the same" refNode={createRef<Node>()} />
      <Node ref={statRows} y={-200} />
      <Txt text="≈17,000" fontFamily={SANS} fontWeight={700} fontSize={120} fill={ACCENT} x={860} y={-60} offsetX={1} opacity={0} />
      <Txt text="pages per second · 2 vCPU" fontFamily={MONO} fontSize={28} fill={MUTED} x={860} y={30} offsetX={1} opacity={0} />
    </Node>,
  );
  stat().children()[0].opacity(1);
  const statWidths = data.static.map(() => createSignal(0));
  data.static.forEach(([name, v], i) => {
    statRows().add(
      <Node y={i * rowH}>
        <Txt text={name} fontFamily={MONO} fontSize={28} fill={INK} x={-560} offsetX={1} />
        <Rect x={-530} offsetX={-1} height={36} fill={BAR} radius={[0, 4, 4, 0]} width={() => statWidths[i]()} />
        <Txt text={fmt(v)} fontFamily={MONO} fontSize={24} fill={MUTED} x={() => -515 + statWidths[i]()} offsetX={-1} opacity={0} />
      </Node>,
    );
  });
  yield* stat().opacity(1, 0.5);
  yield* sequence(0.08, ...data.static.map(([, v], i) => statWidths[i]((v / maxStatic) * W, 1.4, easeOutCubic)));
  yield* all(...statRows().children().map((r) => r.children()[2].opacity(1, 0.4)));
  yield* at(beats.static.start + 5.5);
  yield* all(stat().children()[2].opacity(1, 0.5), stat().children()[3].opacity(1, 0.5));
  yield* at(beats.server.start - 0.4);
  yield* stat().opacity(0, 0.4);

  // --- 4. Server rendering (log scale), 5. page cache ----------------------------------------
  const srv = createRef<Node>();
  const srvRows = createRef<Node>();
  const LW = 1080, lo = Math.log10(30), hi = Math.log10(20000);
  const logW = (v: number) => ((Math.log10(Math.max(v, 30)) - lo) / (hi - lo)) * LW;
  const srvVals = data.server.map(() => createSignal(30));
  const srvTitle = createRef<Txt>();
  view.add(
    <Node ref={srv} opacity={0}>
      <Txt text="04 · RENDERED ON EVERY REQUEST" fontFamily={MONO} fontSize={24} fill={ACCENT} letterSpacing={3} x={-860} y={-440} offsetX={-1} />
      <Txt ref={srvTitle} text="Pages per second, no cache, 2 vCPU" fontFamily={SANS} fontWeight={700} fontSize={64} fill={INK} x={-860} y={-380} offsetX={-1} letterSpacing={-1.5} />
      <Node ref={srvRows} y={-270} />
      <Line points={[[-460 + logW(17000), -300], [-460 + logW(17000), 440]]} stroke={REF} lineWidth={2} />
      <Txt text={'static ≈17,000'} fontFamily={MONO} fontSize={22} fill={MUTED} x={-460 + logW(17000) - 12} y={430} offsetX={1} />
    </Node>,
  );
  data.server.forEach(([name], i) => {
    srvRows().add(
      <Node y={i * 60}>
        <Txt text={name} fontFamily={MONO} fontSize={26} fill={INK} x={-490} offsetX={1} />
        <Rect x={-460} offsetX={-1} height={34} fill={BAR} radius={[0, 4, 4, 0]} width={() => logW(srvVals[i]())} />
        <Txt text={fmt(data.server[i][1])} fontFamily={MONO} fontSize={24} fill={INK} x={() => -445 + logW(srvVals[i]())} offsetX={-1} opacity={0} />
      </Node>,
    );
  });
  const rowOf = (name: string) => data.server.findIndex(([n]) => n === name);
  function* spotlight(name: string) {
    const idx = rowOf(name);
    yield* all(...srvRows().children().map((r, i) => r.opacity(i === idx ? 1 : 0.35, 0.3)));
  }
  yield* srv().opacity(1, 0.5);
  yield* sequence(0.1, ...data.server.map(([, v], i) => all(srvVals[i](v, 1.2, easeOutCubic), srvRows().children()[i].children()[2].opacity(1, 0.5))));
  for (const [word, name] of [['Go:', 'Go'], ['Astro:', 'Astro'], ['Next.js:', 'Next.js'], ['WordPress:', 'WordPress']] as const) {
    yield* at(beats.server.start + marks.server[word] - 0.15);
    yield* spotlight(name);
  }
  // Page cache: the WordPress bar jumps.
  yield* at(beats.cache.start + 1.4);
  const wp = rowOf('WordPress');
  const wpBar = srvRows().children()[wp].children()[1] as Rect;
  const wpTxt = srvRows().children()[wp].children()[2] as Txt;
  const from = data.server[wp][1];
  yield* all(
    srvVals[wp](data.wpCached, 1.6, easeInOutCubic), wpBar.fill(ACCENT, 0.6), srvTitle().text('WordPress behind a page cache', 0.6),
    tween(1.6, (v) => wpTxt.text(fmt(from * Math.pow(data.wpCached / from, easeInOutCubic(v))))),
  );
  yield* at(beats.browser.start - 0.4);
  yield* srv().opacity(0, 0.4);

  // --- 6. Browser ----------------------------------------------------------------------------
  const br = createRef<Node>();
  const plot = createRef<Node>();
  const PW = 1000, PH = 640, X0 = -620, Y0 = 380;
  const px = (kb: number) => X0 + (kb / 160) * PW, py = (ms: number) => Y0 - (ms / 2000) * PH;
  view.add(
    <Node ref={br} opacity={0}>
      <Txt text="06 · IN THE BROWSER" fontFamily={MONO} fontSize={24} fill={ACCENT} letterSpacing={3} x={-860} y={-440} offsetX={-1} />
      <Txt text="More JavaScript, later interactivity" fontFamily={SANS} fontWeight={700} fontSize={64} fill={INK} x={-860} y={-380} offsetX={-1} letterSpacing={-1.5} />
      <Line points={[[X0, Y0], [X0 + PW, Y0]]} stroke={LINE} lineWidth={2} />
      <Line points={[[X0, Y0], [X0, Y0 - PH]]} stroke={LINE} lineWidth={2} />
      <Txt text="JavaScript downloaded (KB)" fontFamily={MONO} fontSize={24} fill={MUTED} x={X0 + PW} y={Y0 + 72} offsetX={1} />
      <Txt text="filter ready on a slow phone (s)" fontFamily={MONO} fontSize={24} fill={MUTED} x={X0 + 10} y={Y0 - PH - 30} offsetX={-1} />
      {[0, 0.5, 1, 1.5, 2].map((s) => <Txt text={`${s}`} fontFamily={MONO} fontSize={22} fill={MUTED} x={X0 - 20} y={py(s * 1000)} offsetX={1} />)}
      {[0, 40, 80, 120, 160].map((k) => <Txt text={`${k}`} fontFamily={MONO} fontSize={22} fill={MUTED} x={px(k)} y={Y0 + 30} />)}
      <Node ref={plot} />
    </Node>,
  );
  const labelSide: Record<string, [number, number]> = {
    'No framework': [24, -34], Astro: [24, 30], htmx: [20, 30], SvelteKit: [-20, -34], Qwik: [20, 30],
    Nuxt: [-20, -34], Angular: [20, 30], 'React Router': [-20, -34], 'Next.js': [-20, -34],
  };
  data.scatter.forEach(([name, kb, ms]) => {
    const [dx, dy] = labelSide[name];
    plot().add(
      <Node x={px(kb)} y={py(ms)} opacity={0}>
        <Circle size={22} fill={BAR} stroke={BG} lineWidth={3} />
        <Txt text={name} fontFamily={MONO} fontSize={24} fill={INK} x={dx} y={dy} offsetX={dx < 0 ? 1 : -1} />
      </Node>,
    );
  });
  const card = (title: string, value: string, y: number) => (
    <Rect layout direction="column" gap={8} x={700} y={y} width={420} fill={SURFACE} stroke={ACCENT} lineWidth={2} radius={6} padding={[22, 28]} opacity={0}>
      <Txt text={title} fontFamily={MONO} fontSize={24} fill={MUTED} />
      <Txt text={value} fontFamily={SANS} fontWeight={700} fontSize={46} fill={ACCENT} />
    </Rect>
  );
  const c1 = card('No framework', '0.55 s · 1.2 KB', 120);
  const c2 = card('Next.js', '1.8 s · 140 KB', -100);
  br().add(c1); br().add(c2);
  yield* br().opacity(1, 0.5);
  yield* sequence(0.15, ...plot().children().map((p) => p.opacity(1, 0.35)));
  const pts = plot().children();
  const mark = (i: number) => (pts[i].children()[0] as Circle);
  yield* at(beats.browser.start + marks.browser['Without'] - 0.1);
  yield* all(c1.opacity(1, 0.4), mark(0).fill(ACCENT, 0.4), mark(0).scale(1.5, 0.4), ...pts.map((p, i) => p.opacity(i <= 1 ? 1 : 0.4, 0.4)));
  yield* at(beats.browser.start + marks.browser['Next.js'] - 0.1);
  const last = pts.length - 1;
  yield* all(c2.opacity(1, 0.4), mark(last).fill(ACCENT, 0.4), mark(last).scale(1.5, 0.4), pts[last].opacity(1, 0.4));
  yield* at(beats.outro.start - 0.4);
  yield* br().opacity(0, 0.4);

  // --- 7. Outro --------------------------------------------------------------------------------
  const out = createRef<Node>();
  const end = createRef<Node>();
  view.add(
    <Node ref={out} opacity={0}>
      <Txt text="For a content site" fontFamily={MONO} fontSize={30} fill={ACCENT} letterSpacing={3} y={-220} />
      <Txt text="Prerender." fontFamily={SANS} fontWeight={700} fontSize={120} fill={INK} y={-90} letterSpacing={-4} />
      <Txt text="Ship as little JavaScript as you can." fontFamily={SANS} fontWeight={700} fontSize={72} fill={INK} y={50} letterSpacing={-2} opacity={0} />
    </Node>,
  );
  view.add(
    <Node ref={end} opacity={0}>
      <Txt text="Code, data and method, open source" fontFamily={MONO} fontSize={30} fill={MUTED} y={-110} />
      <Txt text="github.com/LucianoNeryDev/web-framework-bench" fontFamily={MONO} fontWeight={500} fontSize={48} fill={ACCENT} y={-30} />
      <Txt text="Write-up: lucianonery.dev/blog/web-framework-bench" fontFamily={MONO} fontSize={30} fill={INK} y={60} />
      <Txt text="Luciano Nery" fontFamily={SANS} fontWeight={700} fontSize={40} fill={INK} y={260} />
    </Node>,
  );
  yield* out().opacity(1, 0.5);
  yield* at(beats.outro.start + 3.0);
  yield* out().children()[2].opacity(1, 0.5);
  yield* at(beats.outro.start + 6.6);
  yield* out().opacity(0, 0.4);
  yield* end().opacity(1, 0.6);
  yield* at(total);
});
