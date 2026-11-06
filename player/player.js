/* Living Textbook - generic player (schema living-textbook/chapter@1).
 * One player for every chapter: never edit this file for a chapter. Content comes from chapter.js
 * (window.CHAPTER, works from file://) or chapter.json (when served over http).
 * Keyboard: Right/Space/Enter next, Left back, 1-9 pick an option, R replay, C captions, M map,
 * T teacher view, F full screen, H home, Esc close the map.
 * URL: ?ep=e1&screen=e1.c1.s4&teacher=1 opens a screen directly. */
(function () {
  'use strict';

  // ---------------- helpers ----------------
  const SVGNS = 'http://www.w3.org/2000/svg';
  const $ = (s, el) => (el || document).querySelector(s);
  function h(tag, attrs) {
    const el = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (let i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) c.forEach(x => add(el, x));
    else el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // only <sub>, <sup>, <b>, <i>, <br> survive (equations: CO<sub>2</sub>)
  const rich = s => esc(s).replace(/&lt;(\/?)(sub|sup|b|i)&gt;/g, '<$1$2>').replace(/&lt;br\s*\/?&gt;/g, '<br>');
  const store = {
    get(k, d) { try { const v = localStorage.getItem('lt:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('lt:' + k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
  };
  // theme colours for drawn SVG (read from player.css so the simulators follow the Starling palette)
  const THEME = (() => { const cs = getComputedStyle(document.documentElement), g = (n, d) => (cs.getPropertyValue(n) || '').trim() || d;
    return { ink: g('--ink', '#f5f0eb'), dim: g('--dim', '#9e9287'), accent: g('--primary', '#f5be73'), track: g('--track', '#2b2622'), bad: g('--bad', '#f08a7a') }; })();
  const fmt = s => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

  const UI_DEFAULT = {
    next: 'Next', back: 'Back', episode: 'Episode', chapter: 'Chapter', classWord: 'Class', start: 'Start',
    vote_hint: 'Count the hands. Tap the answer most of the class chose.', times_up: "Time's up! Tap the class's choice.",
    class_chose: 'Class chose', right_answer: 'Right answer', your_question: 'Our question',
    cards_hint: 'Which question does the class want to answer? Tap one.', mcq_hint: 'Tap the answer the class agrees on.',
    did_you_know: 'Did you know?', recap: 'Last time', score: 'Score', of: 'of', show_result: 'Show result',
    materials: 'You need', safety: 'Take care', step: 'Step', start_timer: 'Start timer', pause: 'Pause', reset: 'Reset',
    what_did_you_see: 'What did you see?', expected: 'What should happen', run: 'Run', run_again: 'Reset',
    zoom_in: 'Zoom in', zoom_out: 'Zoom out', show_all: 'Show all', mission: 'Village mission', days: 'days',
    report_back: 'Next class we will ask', map: 'Chapter map', next_up: 'Next up', home: 'Chapter home',
    next_episode: 'Next episode', topic: 'Topic', recap_step: 'Recap',
    // the four steps of a topic loop, named after the topic's flow (chapter.json screen `flow`)
    loops: {
      story: [['Story', 'Watch what happens'], ['Vote', 'The class predicts'], ['Answer', 'Find out why'], ['Check', 'Try a new case']],
      challenge: [['Challenge', 'A job to do now'], ['Try', 'Try with what you know'], ['Learn', 'Learn the tool, solve it'], ['New challenge', 'Use it again']],
      wonder: [['Wonder', 'Something surprising'], ['Guess', 'The class guesses why'], ['Find out', 'See the investigation'], ['Check', 'Try a new case']]
    }, episode_done: 'Episode complete', loading_error: 'Could not load chapter.js. Keep index.html, player.js, chapter.js and media/ together in one folder.'
  };

  // ---------------- state ----------------
  const S = {
    ch: null, ui: UI_DEFAULT, ep: null, idx: -1, view: null,
    // the class's picks live only for this run: a refresh or a fresh start of an episode begins clean
    votes: {}, cards: {}, mcq: {},
    reached: store.get('reached', {}), mapShown: {},
    captions: true, teacher: false, cleanup: [], tick: null
  };
  const stage = $('#stage'), screenEl = $('#screen'), capEl = $('#captions'), bar = $('#bar');

  function fit() {
    const w = Math.min(window.innerWidth, window.innerHeight * 16 / 9);
    document.documentElement.style.setProperty('--u', (w / 100) + 'px');
    document.documentElement.style.fontSize = (w / 100 * 1.17) + 'px';
  }
  window.addEventListener('resize', fit);
  fit();

  // ---------------- media lifecycle ----------------
  function onCleanup(fn) { S.cleanup.push(fn); }
  function clearScreen() {
    S.cleanup.splice(0).forEach(fn => { try { fn(); } catch (e) { /* ignore */ } });
    if (S.tick) cancelAnimationFrame(S.tick);
    S.tick = null;
    screenEl.innerHTML = '';
    setCaption('');
    S.view = null;
  }
  function trackMedia(el) {
    onCleanup(() => { try { el.pause(); el.removeAttribute('src'); el.load(); } catch (e) { /* ignore */ } });
    return el;
  }
  let currentAudio = null;
  function playAudio(src, opts) {
    opts = opts || {};
    stopAudio();
    if (!src) { if (opts.onend) setTimeout(opts.onend, 0); return null; }
    const a = trackMedia(new Audio(src));
    currentAudio = a;
    if (opts.captions) timed(a, opts.captions, null, null);
    a.addEventListener('ended', () => { if (currentAudio === a) currentAudio = null; if (opts.onend) opts.onend(); });
    a.play().catch(() => { /* autoplay blocked until the teacher taps; R replays */ });
    return a;
  }
  function stopAudio() { if (currentAudio) { try { currentAudio.pause(); } catch (e) { /* ignore */ } currentAudio = null; } }
  let replayFn = null;
  function setReplay(fn) { replayFn = fn; $('#btn-replay').disabled = !fn; }

  // captions + overlays driven by a media element's clock
  function timed(media, captions, overlays, layer) {
    const ovEls = [];
    if (overlays && overlays.length && layer) {
      overlays.forEach(o => {
        const el = h('div', { class: 'ov ' + (o.style || 'label'), html: rich(o.text) });
        place(el, o.anchor);
        layer.appendChild(el);
        ovEls.push([o, el]);
      });
    }
    let last = null;
    const step = () => {
      const t = media.currentTime || 0;
      if (captions && captions.length) {
        const c = captions.find(c => t >= c.start && t < c.end);
        const txt = c ? c.text : '';
        if (txt !== last) { setCaption(txt); last = txt; }
      }
      ovEls.forEach(([o, el]) => el.classList.toggle('show', t >= o.at && t < (o.until == null ? 1e9 : o.until)));
      S.tick = requestAnimationFrame(step);
    };
    if (S.tick) cancelAnimationFrame(S.tick);
    S.tick = requestAnimationFrame(step);
    media.addEventListener('ended', () => { setCaption(''); });
  }
  function place(el, anchor) {
    const st = el.style;
    if (anchor && typeof anchor === 'object') {
      st.left = anchor.x + '%'; st.top = anchor.y + '%'; st.transform = 'translate(-50%, -50%)';
      return;
    }
    switch (anchor) {
      case 'top': st.left = '50%'; st.top = '7%'; st.transform = 'translateX(-50%)'; break;
      case 'bottom': st.left = '50%'; st.bottom = '20%'; st.transform = 'translateX(-50%)'; break;
      case 'left': st.left = '5%'; st.top = '45%'; st.transform = 'translateY(-50%)'; break;
      case 'right': st.right = '5%'; st.top = '45%'; st.transform = 'translateY(-50%)'; break;
      default: st.left = '50%'; st.top = '45%'; st.transform = 'translate(-50%, -50%)';
    }
  }
  function setCaption(text) {
    capEl.innerHTML = text ? '<span>' + esc(text) + '</span>' : '';
    capEl.hidden = !S.captions || !text;
  }

  // ---------------- lookups ----------------
  const episode = id => S.ch.episodes.find(e => e.id === id);
  function findScreen(id) {
    for (const e of S.ch.episodes) { const s = e.screens.find(x => x.id === id); if (s) return s; }
    return null;
  }
  const concept = id => (S.ch.concepts || []).find(c => c.id === id);
  const voteSeconds = sc => sc.seconds || (S.ch.settings && S.ch.settings.vote_seconds) || 10;
  function saveVotes() { /* picks are kept in memory only (S.votes, S.mcq) */ }
  try { localStorage.removeItem('lt:votes'); localStorage.removeItem('lt:mcq'); } catch (e) { /* storage blocked */ }

  // ---------------- navigation ----------------
  function setNext(enabled, pulse) {
    const b = $('#btn-next');
    b.disabled = !enabled;
    b.classList.toggle('pulse', !!pulse);
  }
  function startEpisode(id, screenId) {
    S.ep = episode(id);
    if (!S.ep) return home();
    if (!screenId) {  // starting an episode from its beginning clears that episode's picks
      S.ep.screens.forEach(s => { delete S.votes[s.id]; delete S.votes[s.id + '.observe']; delete S.mcq[s.id]; if (s.concept) delete S.cards[s.concept]; });
    }
    const i = screenId ? Math.max(0, S.ep.screens.findIndex(s => s.id === screenId)) : 0;
    show(i, 1);
  }
  function next() {
    if (S.view && S.view.next && S.view.next()) return;
    if (!S.ep) { if (S.ch.episodes[0]) startEpisode(S.ch.episodes[0].id); return; }
    if (S.idx < S.ep.screens.length - 1) show(S.idx + 1, 1);
    else endOfEpisode();
  }
  function back() {
    if (S.view && S.view.back && S.view.back()) return;
    if (S.ep && S.idx > 0) show(S.idx - 1, -1);
    else home();
  }
  function show(i, dir) {
    const sc = S.ep.screens[i];
    S.idx = i;
    // the chapter map opens only on request (Map button / M); it no longer interrupts the lesson
    render(sc);
  }
  function isFirstOfConcept(i) {
    const c = S.ep.screens[i].concept;
    return !S.ep.screens.slice(0, i).some(s => s.concept === c);
  }
  function render(sc) {
    if (typeof closeMenu === 'function') closeMenu();
    closeMap();
    clearScreen();
    stopAudio();
    setNext(true, false);
    setReplay(null);
    if (sc.concept && concept(sc.concept)) { S.reached[sc.concept] = true; store.set('reached', S.reached); }
    setBackdrop(null);
    setProgress(null);
    document.body.dataset.screen = sc.type === 'title' ? 'title' : (sc.type === 'video' || sc.type === 'still') ? 'film' : 'sheet';
    const r = RENDER[sc.type] || renderUnknown;
    S.view = r(sc, screenEl) || {};
    drawRail(sc);
    drawTeacher(sc);
  }
  // ---------------- step rail: the four steps of the topic loop (story, vote, answer, check) ----------------
  function loopStep(sc) {
    if (!sc) return -1;
    if (sc.type === 'video') return sc.role === 'explain' ? 2 : 0;
    if (sc.type === 'vote' || sc.type === 'question_cards') return 1;
    if (sc.type === 'reveal') return 2;
    if (sc.type === 'mcq') return 3;
    if (sc.type === 'lab') return 2;
    return -1;
  }
  // topics are numbered within the episode (the chapter's concept list also holds fact boxes and later topics)
  function topicOf(sc) {
    if (!S.ep || !sc || !sc.concept) return null;
    const ids = [];
    S.ep.screens.forEach(s => { if (s.concept && ids.indexOf(s.concept) < 0) ids.push(s.concept); });
    const c = (S.ch.concepts || []).find(x => x.id === sc.concept);
    return c ? { n: ids.indexOf(sc.concept) + 1, title: c.title } : null;
  }
  // a screen's flow: its own, else that of its topic's other screens, else the episode's first topic
  function flowOf(sc) {
    if (sc && sc.flow) return sc.flow;
    const scr = (S.ep && S.ep.screens) || [];
    const same = sc && sc.concept && scr.find(s => s.concept === sc.concept && s.flow);
    const first = scr.find(s => s.flow);
    return (same || first || {}).flow || 'story';
  }
  function loopNames(sc) {
    const ui = S.ui, fl = flowOf(sc);
    return (ui.loops && (ui.loops[fl] || ui.loops.story)) || ui.loop;
  }
  function drawRail(sc) {
    const ol = $('#steps'), topic = $('#topic'), ui = S.ui;
    ol.innerHTML = ''; topic.textContent = '';
    if (!S.ep || !sc) return;
    const cur = loopStep(sc), end = sc.role === 'cliffhanger' || sc.type === 'recap' || sc.type === 'score';
    loopNames(sc).forEach(([name], i) => {
      const state = end || i < cur ? 'done' : i === cur ? 'now' : '';
      ol.appendChild(h('li', { class: state },
        h('span', { class: 'num', text: String(i + 1) }), h('span', { class: 'name', text: name }),
        h('span', { class: 'bar' }, h('i', { style: { transform: 'scaleX(' + (state === 'done' ? 1 : 0) + ')' } }))));
    });
    const tp = topicOf(sc);
    if (tp) topic.textContent = ui.topic + ' ' + tp.n + ' · ' + tp.title;
    else if (end) topic.textContent = ui.recap_step;
  }
  // fill of the current step's bar and of the thin line under a video (0..1; null hides the line)
  function setProgress(f) {
    const p = $('#progress');
    p.classList.toggle('on', f != null);
    p.firstElementChild.style.transform = 'scaleX(' + (f || 0) + ')';
    const now = $('#steps li.now .bar i');
    if (now && f != null) now.style.transform = 'scaleX(' + f + ')';
  }
  function setBackdrop(src) {
    const b = $('#backdrop');
    b.style.backgroundImage = src ? 'url("' + src + '")' : '';
    b.classList.toggle('on', !!src);
  }

  // ---------------- home, end, map ----------------
  function home() {
    closeMap(); clearScreen(); stopAudio();
    S.ep = null; S.idx = -1;
    const c = S.ch.chapter, ui = S.ui;
    const meta = [c.class ? ui.classWord + ' ' + c.class : '', c.subject, c.number ? ui.chapter + ' ' + c.number : ''].filter(Boolean).join(' · ');
    document.body.dataset.screen = 'title';
    setBackdrop(null); setProgress(null); drawRail(null);
    screenEl.appendChild(h('div', { class: 'titlecard' },
      c.cover ? h('img', { class: 'full', src: c.cover, alt: '' }) : null,
      h('div', { class: 'scrim' }),
      // Starling title block: gold kicker, big Rajdhani title (story_world is a production note, not shown to the class)
      h('div', { class: 'title-block' }, h('p', { class: 'kicker', text: meta }), h('h1', { text: c.title }),
        h('div', { class: 'home-eps' }, S.ch.episodes.map((e, i) =>
          h('button', { class: 'btn' + (i ? ' ghost' : ' big'), onclick: () => startEpisode(e.id) },
            h('small', { text: ui.episode + ' ' + (i + 1) }), h('span', { text: e.title })))))));
    S.view = {};
    setNext(S.ch.episodes.length > 0, false);
    setReplay(null);
    drawTeacher(null);
  }
  function endOfEpisode() {
    const i = S.ch.episodes.indexOf(S.ep), nx = S.ch.episodes[i + 1], ui = S.ui;
    clearScreen(); stopAudio();
    screenEl.appendChild(h('div', { class: 'sheet', style: { justifyContent: 'center', alignItems: 'center', textAlign: 'center' } },
      h('div', { class: 'eyebrow', text: ui.episode + ' ' + (i + 1) }), h('h1', { text: ui.episode_done }),
      h('div', { class: 'btns', style: { justifyContent: 'center' } },
        nx ? h('button', { class: 'btn accent', onclick: () => startEpisode(nx.id) }, ui.next_episode + ': ' + nx.title) : null,
        h('button', { class: 'btn alt', onclick: home }, ui.home))));
    S.view = { next: () => { if (nx) startEpisode(nx.id); else home(); return true; } };
  }
  let mapEl = null;
  function showMap(currentId, then) {
    closeMap();
    const ui = S.ui, cs = S.ch.concepts || [];
    const curIdx = cs.findIndex(c => c.id === currentId);
    // Starling-style stepper: one card per concept - done (gold tick), now (gold glow), later (dim)
    const steps = h('div', { class: 'steps' }, cs.map((c, i) => {
      const state = c.id === currentId ? 'now' : (S.reached[c.id] || (curIdx >= 0 && i < curIdx)) ? 'done' : 'later';
      return h('div', { class: 'step ' + state },
        h('div', { class: 'step-pic', style: c.icon ? { backgroundImage: 'url("' + c.icon + '")' } : null },
          h('span', { class: 'step-badge', text: state === 'done' ? '✓' : String(i + 1) })),
        h('div', { class: 'step-title', text: c.title }));
    }));
    const close = h('button', { class: 'btn', text: S.ui.back_to_lesson || 'Back to lesson' });
    mapEl = h('div', { class: 'map' },
      h('div', { class: 'map-head' },
        h('div', { class: 'kicker', text: ui.map }),
        h('h2', { text: S.ch.chapter.title }),
        cs.length ? h('p', { class: 'sub', text: (curIdx >= 0 ? (curIdx + 1) : cs.filter(c => S.reached[c.id]).length) + ' ' + ui.of + ' ' + cs.length }) : null),
      steps,
      h('div', { class: 'stack' }, close));
    stage.appendChild(mapEl);
    let timer = null;
    const done = () => { clearTimeout(timer); closeMap(); if (then) then(); };
    close.addEventListener('click', e => { e.stopPropagation(); done(); });
    mapPending = done;
    if (then) timer = setTimeout(done, 3500);
  }
  let mapPending = null;
  function closeMap() { if (mapEl) { mapEl.remove(); mapEl = null; } mapPending = null; }

  // ---------------- screen renderers ----------------
  const RENDER = {};

  // the loop line along the bottom of a title: 1 Story, 2 Vote, 3 Answer, 4 Check
  function stepsLine() {
    return h('ol', { class: 'steps-line' }, loopNames(null).map(([name, sub], i) =>
      h('li', null, h('span', { class: 'num', text: String(i + 1) }), h('b', { text: name }), h('span', { text: sub }))));
  }
  RENDER.title = sc => {
    const c = S.ch.chapter, ui = S.ui;
    // the chapter home already shows the chapter; the episode title leads with the episode itself
    const n = S.ep ? S.ch.episodes.indexOf(S.ep) + 1 : 0;
    const where = [c.class ? ui.classWord + ' ' + c.class + ' ' + (c.subject || '') : c.subject, c.number ? ui.chapter + ' ' + c.number : '', c.title].filter(Boolean).join(' · ');
    screenEl.appendChild(h('div', { class: 'titlecard' },
      sc.image ? h('img', { class: 'full', src: sc.image, alt: '' }) : null,
      h('div', { class: 'scrim' }),
      h('div', { class: 'title-block' }, h('p', { class: 'kicker', text: n ? ui.episode + ' ' + n : where }),
        h('h1', { text: (S.ep && S.ep.title) || sc.title }), h('p', { class: 'sub', text: n ? where : (sc.subtitle || '') })),
      stepsLine()));
    const go = () => playAudio(sc.audio, { captions: sc.captions, onend: () => setNext(true, true) });
    go();
    setReplay(sc.audio ? go : null);
    if (!sc.audio) setNext(true, true);
  };

  RENDER.video = sc => {
    const v = trackMedia(h('video', { class: 'full contain', src: sc.src, playsinline: true, preload: 'auto' }));
    const layer = h('div', { class: 'overlays' });
    screenEl.append(v, layer);
    // the question card the class picked is shown at the start of the explanation
    if (sc.role === 'explain' && sc.concept && S.cards[sc.concept]) {
      const chip = h('div', { class: 'chip floating-chip', text: S.ui.your_question + ': ' + S.cards[sc.concept] });
      screenEl.appendChild(chip);
      const t = setTimeout(() => { chip.style.opacity = 0; }, 7000);
      onCleanup(() => clearTimeout(t));
    }
    timed(v, sc.captions, sc.overlays, layer);
    v.addEventListener('timeupdate', () => { if (v.duration) setProgress(v.currentTime / v.duration); });
    setProgress(0);
    // a story opens on a big topic card (gold number, topic title), as the monsoon film chapters do
    const tp = topicOf(sc);
    if (sc.role !== 'explain' && tp) {
      const card = h('div', { class: 'topic-card' }, h('span', { class: 'num', text: String(tp.n) }),
        h('div', null, h('span', { class: 'sub', text: S.ui.topic + ' ' + tp.n }), h('b', { text: tp.title })));
      screenEl.append(h('div', { class: 'film-shade' }), card);
      requestAnimationFrame(() => requestAnimationFrame(() => screenEl.classList.add('chaptering')));
      const t = setTimeout(() => screenEl.classList.remove('chaptering'), 4200);
      onCleanup(() => { clearTimeout(t); screenEl.classList.remove('chaptering'); });
    }
    // a finished video flows straight into the next step (story -> vote, explanation -> check);
    // settings.auto_advance = false turns this off for a chapter
    let adv = null;
    v.addEventListener('ended', () => {
      setNext(true, true);
      if (S.ch.settings && S.ch.settings.auto_advance === false) return;
      adv = setTimeout(() => { adv = null; next(); }, 900);
    });
    onCleanup(() => { if (adv) clearTimeout(adv); });
    v.addEventListener('click', () => (v.paused ? v.play() : v.pause()));
    v.play().catch(() => setNext(true, true));
    setNext(true, false);
    setReplay(() => { v.currentTime = 0; v.play(); });
    const view = {};
    return view;
  };

  RENDER.still = sc => {
    screenEl.append(h('img', { class: 'full', src: sc.image, alt: '' }));
    // optional silent animation of the picture: plays once under the narration and holds its last frame
    const anim = sc.video ? trackMedia(h('video', { class: 'full', src: sc.video, poster: sc.image, playsinline: true, preload: 'auto' })) : null;
    if (anim) { anim.muted = true; screenEl.appendChild(anim); }
    const layer = h('div', { class: 'overlays' });
    screenEl.appendChild(layer);
    const go = () => {
      if (anim) { anim.currentTime = 0; anim.play().catch(() => { /* the poster still shows */ }); }
      const a = playAudio(sc.audio, { captions: sc.captions, onend: () => setNext(true, true) });
      if (a && sc.overlays && sc.overlays.length) timed(a, sc.captions, sc.overlays, layer);
    };
    go();
    setReplay(go);
  };

  // an interactive lab (skills/lt-lab): the lab page runs full screen in a frame and has its own step card;
  // the lesson's Next unlocks (and pulses) when the lab reports that the class finished it
  RENDER.lab = sc => {
    // the lab plays its narration from the lesson's media/audio (lines named <prefix><key>.mp3)
    const src = sc.src + (sc.src.indexOf('?') < 0 ? '?' : '&') + 'embed=1' +
      (sc.lines ? '&lines=' + encodeURIComponent(sc.lines) + '&audio=' + encodeURIComponent('../../media/audio/') : '');
    const f = h('iframe', { class: 'full lab-frame', src, title: sc.title || 'Lab', allow: 'autoplay' });
    screenEl.appendChild(f);
    setNext(false, false);
    setReplay(null);
    const onMsg = e => { if (e.source === f.contentWindow && e.data && e.data.lt === 'lab-done') setNext(true, true); };
    window.addEventListener('message', onMsg);
    onCleanup(() => window.removeEventListener('message', onMsg));
    return {};
  };

  function choiceGrid(options, cls) {
    const n = options.length;
    return h('div', { class: 'choices ' + (cls || ('n' + Math.min(4, Math.max(2, n)))) });
  }
  const LETTERS = 'ABCDEFGHI';
  const TICK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  function choiceEl(o, i, onPick) {
    return h('button', { class: 'choice' + (o.image ? ' pic-card' : '') + (o.correct ? ' is-correct' : ''), onclick: () => onPick(i) },
      o.image ? h('div', { class: 'img', style: { backgroundImage: 'url("' + o.image + '")' } },
        h('span', { class: 'letter', text: LETTERS[i] }), h('span', { class: 'tick', html: TICK })) : null,
      h('div', { class: 'txt' }, o.image ? null : h('span', { class: 'key', text: LETTERS[i] }), h('span', { class: 'rich', html: rich(o.text) })));
  }

  // vote body shared by vote screens and do-along "observe" votes:
  // question read aloud -> teacher taps the class's choice -> right answer and explanation on the same screen
  function voteBody(vote, id, root) {
    const ui = S.ui;
    const hint = h('div', { class: 'hint', text: ui.vote_hint });
    const fb = h('div', { class: 'feedback', style: { visibility: 'hidden' } });
    const grid = choiceGrid(vote.options, vote.options.some(o => o.image) ? null : 'list');
    const els = vote.options.map((o, i) => choiceEl(o, i, pick));
    els.forEach(e => grid.appendChild(e));
    const right = vote.options.findIndex(o => o.correct);
    function paint(c) {
      if (vote.predict) {   // a prediction before a lab: mark the class's pick, show no right or wrong yet
        els.forEach((e, i) => {
          const old = e.querySelector('.tag'); if (old) old.remove();
          e.classList.toggle('chosen', i === c);
          e.classList.toggle('faded', i !== c);
          if (i === c) e.appendChild(h('span', { class: 'tag pick', text: ui.class_chose }));
        });
        fb.style.visibility = 'visible';
        fb.className = 'feedback';
        fb.innerHTML = rich(vote.options[c].reveal_text || '');
        hint.hidden = true;
        return;
      }
      els.forEach((e, i) => {
        const old = e.querySelector('.tag'); if (old) old.remove();
        e.classList.toggle('right', i === right);
        e.classList.toggle('wrong', i === c && i !== right);
        e.classList.toggle('faded', i !== right && i !== c);
        if (i === c) e.appendChild(h('span', { class: 'tag' + (i === right ? ' ok' : ''), text: ui.class_chose }));
      });
      const o = vote.options[c];
      fb.style.visibility = 'visible';
      fb.className = 'feedback ' + (c === right ? 'good' : 'bad');
      fb.innerHTML = rich(o.reveal_text || '');
      hint.hidden = true;
    }
    function pick(i) {
      S.votes[id] = i; saveVotes(); paint(i);
      const o = vote.options[i];
      playAudio(o.reveal_audio, { onend: () => setNext(true, true) });
      setReplay(() => playAudio(o.reveal_audio));
      if (!o.reveal_audio) setNext(true, true);
    }
    const pic = vote.options.find(o => o.image);
    if (pic) setBackdrop(pic.image);
    root.append(h('h1', { class: 'rich', html: rich(vote.question) }), hint, grid, fb);
    if (S.votes[id] != null) paint(S.votes[id]);
    else {
      playAudio(vote.audio);
      setReplay(() => playAudio(vote.audio));
    }
    return { key: k => { if (k >= 1 && k <= vote.options.length) { pick(k - 1); return true; } return false; } };
  }

  RENDER.vote = sc => {
    const root = h('div', { class: 'sheet' });
    screenEl.appendChild(root);
    if (sc.observation) root.appendChild(h('div', { class: 'eyebrow', text: S.ui.what_did_you_see }));
    const v = voteBody(sc, sc.id, root);
    setNext(true, false);
    return { key: v.key };
  };

  RENDER.reveal = sc => {
    const vote = findScreen(sc.vote);
    if (!vote) return renderUnknown(sc);
    const ui = S.ui;
    const correctIdx = vote.options.findIndex(o => o.correct);
    const chosen = S.votes[vote.id];
    const showIdx = chosen != null ? chosen : correctIdx;
    const panel = () => {
      clearScreenKeep();
      const root = h('div', { class: 'sheet' });
      screenEl.appendChild(root);
      const grid = choiceGrid(vote.options);
      const fb = h('div', { class: 'feedback' });
      const els = vote.options.map((o, i) => {
        const e = choiceEl(o, i, () => say(i));
        e.classList.add(o.correct ? 'right' : 'faded');
        if (i === chosen) e.appendChild(h('span', { class: 'tag' + (o.correct ? ' ok' : ''), text: ui.class_chose }));
        grid.appendChild(e);
        return e;
      });
      function say(i) {
        const o = vote.options[i];
        els.forEach((e, k) => e.classList.toggle('chosen', k === i && !o.correct));
        fb.className = 'feedback ' + (o.correct ? 'good' : 'bad');
        fb.innerHTML = rich(o.reveal_text || '');
        playAudio(o.reveal_audio, { onend: () => setNext(true, true) });
        setReplay(() => say(i));
      }
      root.append(h('div', { class: 'eyebrow', text: ui.right_answer }), h('h1', { class: 'rich', html: rich(vote.question) }), grid, fb);
      say(showIdx);
    };
    const opt = vote.options[showIdx];
    if (chosen != null && opt && opt.consequence_src && !opt.correct) {
      const v = trackMedia(h('video', { class: 'full contain', src: opt.consequence_src, playsinline: true }));
      screenEl.appendChild(v);
      v.addEventListener('ended', panel);
      v.play().catch(panel);
      return { next: () => { if (screenEl.contains(v)) { panel(); return true; } return false; } };
    }
    panel();
  };
  function clearScreenKeep() {
    // clears the content of the current screen without leaving it
    stopAudio();
    screenEl.innerHTML = '';
    setCaption('');
  }

  RENDER.question_cards = sc => {
    const ui = S.ui, root = h('div', { class: 'sheet' });
    screenEl.appendChild(root);
    const grid = choiceGrid(sc.cards);
    const els = sc.cards.map((c, i) => choiceEl(c, i, pick));
    els.forEach(e => grid.appendChild(e));
    function pick(i) {
      if (sc.concept) S.cards[sc.concept] = sc.cards[i].text;
      els.forEach((e, k) => e.classList.toggle('chosen', k === i));
      setNext(true, true);
    }
    root.append(h('h1', { class: 'rich', html: rich(sc.prompt) }), grid, h('div', { class: 'hint', text: ui.cards_hint }));
    playAudio(sc.audio);
    setReplay(() => playAudio(sc.audio));
    return { key: k => { if (k >= 1 && k <= sc.cards.length) { pick(k - 1); return true; } return false; } };
  };

  function mcqBody(m, root) {
    const ui = S.ui, ans = m.answer;
    const opts = m.options.map((o, i) => Object.assign({}, o, { correct: i === ans }));
    const list = choiceGrid(opts, m.image || !opts.some(o => o.image) ? 'list' : null);
    const fb = h('div', { class: 'feedback', style: { visibility: 'hidden' } });
    const els = opts.map((o, i) => choiceEl(o, i, pick));
    els.forEach(e => list.appendChild(e));
    function paint(i) {
      els.forEach((e, k) => {
        e.classList.toggle('right', k === ans);
        e.classList.toggle('wrong', k === i && i !== ans);
        e.classList.toggle('faded', k !== ans && k !== i);
      });
      const o = opts[i];
      fb.style.visibility = 'visible';
      fb.className = 'feedback ' + (i === ans ? 'good' : 'bad');
      fb.innerHTML = rich(o.feedback_text || '');
    }
    function pick(i) {
      const first = S.mcq[m.id] == null;
      if (first) { S.mcq[m.id] = { chosen: i, correct: i === ans }; saveVotes(); }
      paint(i);
      playAudio(opts[i].feedback_audio, { onend: () => setNext(true, true) });
      setReplay(() => playAudio(opts[i].feedback_audio));
      if (!opts[i].feedback_audio) setNext(true, true);
    }
    const q = h('h1', { class: 'rich', html: rich(m.question) });
    const hint = h('div', { class: 'hint', text: ui.mcq_hint });
    if (m.image) {
      setBackdrop(m.image);
      root.classList.add('split');
      root.append(h('figure', { class: 'plate' }, h('img', { src: m.image, alt: '' })),
        h('div', { class: 'check-body' }, q, hint, list, fb));
    } else root.append(q, hint, list, fb);
    if (S.mcq[m.id] != null) { hint.hidden = true; paint(S.mcq[m.id].chosen); }
    else {
      playAudio(m.audio);
      setReplay(() => playAudio(m.audio));
    }
    return { key: k => { if (k >= 1 && k <= opts.length) { pick(k - 1); return true; } return false; } };
  }

  RENDER.mcq = sc => {
    const root = h('div', { class: 'sheet' });
    screenEl.appendChild(root);
    return mcqBody(sc, root);
  };

  RENDER.fact = sc => {
    const root = h('div', { class: 'sheet fact' },
      h('div', { class: 'row' },
        h('div', { class: 'picbox' }, h('img', { class: 'pic', src: sc.image, alt: '' })),
        h('div', { class: 'col', style: { justifyContent: 'center' } },
          h('div', { class: 'eyebrow', text: sc.title || S.ui.did_you_know }),
          h('p', { class: 'rich', html: rich(sc.text), style: { fontSize: 'calc(var(--u) * 2.3)' } }),
          sc.source ? h('div', { class: 'source muted', text: sc.source }) : null)));
    screenEl.appendChild(root);
    const go = () => playAudio(sc.audio, { onend: () => setNext(true, true) });
    go(); setReplay(go);
  };

  RENDER.recap = sc => {
    let phase = 0;
    const draw = () => {
      clearScreenKeep();
      const root = h('div', { class: 'sheet' });
      screenEl.appendChild(root);
      if (phase === 0) {
        root.appendChild(h('div', { class: 'row' },
          h('div', { class: 'picbox' }, sc.image ? h('img', { class: 'pic', src: sc.image, alt: '' }) : null),
          h('div', { class: 'col', style: { justifyContent: 'center' } },
            h('div', { class: 'eyebrow', text: S.ui.recap }), h('p', { class: 'rich', html: rich(sc.text), style: { fontSize: 'calc(var(--u) * 2.2)' } }))));
        const go = () => playAudio(sc.audio, { onend: () => setNext(true, true) });
        go(); setReplay(go);
        view.key = null;
      } else {
        root.appendChild(h('div', { class: 'eyebrow', text: S.ui.recap }));
        view.key = mcqBody(sc.mcq, root).key;
        setReplay(null);
      }
    };
    const view = {
      next: () => { if (phase === 0 && sc.mcq) { phase = 1; draw(); return true; } return false; },
      back: () => { if (phase === 1) { phase = 0; draw(); return true; } return false; }
    };
    draw();
    return view;
  };

  function mcqsOf(screens) {
    const ids = [];
    screens.forEach(s => {
      if (s.type === 'mcq') ids.push(s.id);
      if (s.type === 'recap' && s.mcq) ids.push(s.mcq.id);
    });
    return ids;
  }
  RENDER.score = sc => {
    const ui = S.ui;
    const screens = sc.scope === 'chapter' ? [].concat.apply([], S.ch.episodes.map(e => e.screens)) : S.ep.screens;
    const ids = mcqsOf(screens);
    const right = ids.filter(id => S.mcq[id] && S.mcq[id].correct).length;
    const stars = ids.length ? Math.round(3 * right / ids.length) : 3;
    screenEl.appendChild(h('div', { class: 'sheet', style: { justifyContent: 'center', alignItems: 'center', textAlign: 'center' } },
      h('div', { class: 'eyebrow', text: ui.score }),
      h('h1', { class: 'rich', html: rich(sc.text || '') }),
      ids.length ? h('div', { class: 'score-big', text: right + ' ' + ui.of + ' ' + ids.length }) : null,
      h('div', { class: 'stars', text: '★'.repeat(stars) + '☆'.repeat(3 - stars) })));
    const go = () => playAudio(sc.audio, { onend: () => setNext(true, true) });
    go(); setReplay(go);
  };

  // ---------------- activities ----------------
  RENDER.activity = sc => {
    const f = ACTIVITY[sc.mode === 'simulator' ? 'sim_' + sc.template : sc.mode];
    if (!f) return renderUnknown(sc);
    return f(sc);
  };
  const ACTIVITY = {};

  function beep() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext, ctx = new Ctx();
      [0, .35, .7].forEach(t => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(.25, ctx.currentTime + t); g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + t + .3);
        o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + .3);
      });
      setTimeout(() => ctx.close(), 1500);
    } catch (e) { /* no audio */ }
  }

  ACTIVITY.do_along = sc => {
    const ui = S.ui, steps = sc.steps || [];
    const phases = ['intro'].concat(steps.map((_, i) => i), sc.observe ? ['observe'] : [], ['result']);
    let p = 0;
    const draw = () => {
      clearScreenKeep();
      const ph = phases[p];
      const root = h('div', { class: 'sheet' });
      screenEl.appendChild(root);
      const resultBtn = h('button', { class: 'btn alt', onclick: () => { p = phases.length - 1; draw(); } }, ui.show_result);
      view.key = null;
      setReplay(null);
      if (ph === 'intro') {
        root.append(h('div', { class: 'eyebrow', text: ui.step + 's: ' + steps.length }), h('h1', { class: 'rich', html: rich(sc.title || '') }),
          sc.materials && sc.materials.length ? h('div', { class: 'col', style: { flex: 'none' } }, h('h2', { text: ui.materials }),
            h('ul', { class: 'materials' }, sc.materials.map(m => h('li', { class: 'rich', html: rich(m) })))) : null,
          sc.safety ? h('div', { class: 'safety' }, h('b', { text: ui.safety + ': ' }), sc.safety) : null,
          h('div', { style: { flex: 1 } }), h('div', { class: 'btns' }, h('button', { class: 'btn accent', onclick: next }, ui.start), resultBtn));
        const go = () => playAudio(sc.audio, { captions: sc.captions });
        if (sc.audio) { go(); setReplay(go); }
      } else if (typeof ph === 'number') {
        const st = steps[ph];
        const timerBox = st.timer_s ? stepTimer(st.timer_s) : null;
        root.appendChild(h('div', { class: 'row' },
          h('div', { class: 'picbox' }, st.still ? h('img', { class: 'pic', src: st.still, alt: '' }) : null),
          h('div', { class: 'col', style: { justifyContent: 'center' } },
            h('div', { class: 'stepno', text: ui.step + ' ' + (ph + 1) + ' / ' + steps.length }),
            h('p', { class: 'rich', html: rich(st.text), style: { fontSize: 'calc(var(--u) * 2.6)', fontWeight: 700 } }),
            timerBox, h('div', { class: 'btns' }, resultBtn))));
        if (st.audio) { const go = () => playAudio(st.audio); go(); setReplay(go); }
      } else if (ph === 'observe') {
        root.appendChild(h('div', { class: 'eyebrow', text: ui.what_did_you_see }));
        view.key = voteBody(sc.observe, sc.id + '.observe', root).key;
        root.appendChild(h('div', { class: 'btns' }, resultBtn));
      } else {
        const ex = sc.expected || {};
        const media = ex.result_video
          ? trackMedia(h('video', { class: 'pic', src: ex.result_video, controls: true, playsinline: true }))
          : ex.result_still ? h('img', { class: 'pic', src: ex.result_still, alt: '' }) : null;
        const obs = sc.observe && S.votes[sc.id + '.observe'] != null ? sc.observe.options[S.votes[sc.id + '.observe']] : null;
        root.appendChild(h('div', { class: 'row' },
          h('div', { class: 'picbox' }, media),
          h('div', { class: 'col', style: { justifyContent: 'center' } },
            h('div', { class: 'eyebrow', text: ui.expected }),
            h('p', { class: 'rich', html: rich(ex.text || ''), style: { fontSize: 'calc(var(--u) * 2.3)' } }),
            obs ? h('div', { class: 'feedback ' + (obs.correct ? 'good' : 'bad') }, h('b', { text: ui.class_chose + ': ' }), h('span', { class: 'rich', html: rich(obs.text) }),
              obs.reveal_text ? h('div', { class: 'rich', html: rich(obs.reveal_text) }) : null) : null)));
        if (media && media.tagName === 'VIDEO') media.play().catch(() => {});
        const a = ex.result_audio || ex.audio || (obs && obs.reveal_audio);
        if (a) { const go = () => playAudio(a, { onend: () => setNext(true, true) }); go(); setReplay(go); } else setNext(true, true);
      }
    };
    const view = {
      next: () => { if (p < phases.length - 1) { p++; draw(); return true; } return false; },
      back: () => { if (p > 0) { p--; draw(); return true; } return false; }
    };
    draw();
    return view;
  };

  function stepTimer(total) {
    const ui = S.ui;
    let left = total, iv = null;
    const big = h('div', { class: 'bigtimer', text: fmt(left) });
    const toggle = h('button', { class: 'btn accent' }, ui.start_timer);
    const stop = () => { if (iv) clearInterval(iv); iv = null; toggle.textContent = ui.start_timer; };
    toggle.addEventListener('click', () => {
      if (iv) return stop();
      if (left <= 0) left = total;
      big.classList.remove('done');
      let t0 = performance.now(), start = left;
      toggle.textContent = ui.pause;
      iv = setInterval(() => {
        left = Math.max(0, start - (performance.now() - t0) / 1000);
        big.textContent = fmt(left);
        if (left <= 0) { stop(); big.classList.add('done'); beep(); }
      }, 200);
    });
    const reset = h('button', { class: 'btn alt', onclick: () => { stop(); left = total; big.textContent = fmt(left); big.classList.remove('done'); } }, ui.reset);
    onCleanup(stop);
    return h('div', { class: 'col', style: { flex: 'none' } }, big, h('div', { class: 'btns' }, toggle, reset));
  }

  ACTIVITY.mission = sc => {
    const ui = S.ui, cols = sc.record || [];
    const rows = Math.min(7, Math.max(3, sc.days || 3));
    const table = cols.length ? h('table', { class: 'record' },
      h('tr', null, cols.map(c => h('th', { text: c }))),
      Array.from({ length: rows }, () => h('tr', null, cols.map(() => h('td'))))) : null;
    screenEl.appendChild(h('div', { class: 'sheet' },
      h('div', { class: 'row' },
        h('div', { class: 'picbox', style: { flex: .9 } }, sc.still ? h('img', { class: 'pic', src: sc.still, alt: '' }) : null),
        h('div', { class: 'col' },
          h('div', { class: 'eyebrow', text: ui.mission + (sc.days ? ' · ' + sc.days + ' ' + ui.days : '') }),
          h('p', { class: 'rich', html: rich(sc.task), style: { fontSize: 'calc(var(--u) * 2.4)', fontWeight: 700 } }),
          table,
          sc.report_back ? h('div', { class: 'feedback' }, h('b', { text: ui.report_back + ': ' }), h('span', { class: 'rich', html: rich(sc.report_back) })) : null))));
    if (sc.audio) { const go = () => playAudio(sc.audio); go(); setReplay(go); }
  };

  function simSheet(sc, titleText) {
    const root = h('div', { class: 'sheet' });
    screenEl.appendChild(root);
    if (sc.title || titleText) root.appendChild(h('h1', { class: 'rich', html: rich(sc.title || titleText) }));
    if (sc.audio) { const go = () => playAudio(sc.audio, { captions: sc.captions }); go(); setReplay(go); }
    return root;
  }
  const condLabel = k => String(k).replace(/_/g, ' ').replace(/^co2$/i, 'CO<sub>2</sub>');

  ACTIVITY.sim_compare_setups = sc => {
    const ui = S.ui, cfg = sc.config || {}, setups = cfg.setups || [];
    const root = simSheet(sc);
    const grid = h('div', { class: 'setups', style: { gridTemplateColumns: 'repeat(' + Math.max(1, setups.length) + ', 1fr)' } });
    let ran = false;
    const cards = setups.map(s => {
      const cond = Object.assign({}, s.conditions || {});
      const start = h('img', { src: s.start, alt: '' });
      const res = h('img', { class: 'res', src: s.result, alt: '' });
      const card = h('div', { class: 'setup' }, h('div', { class: 'lab', text: s.label }), h('div', { class: 'imgwrap' }, start, res));
      const chips = h('div', { class: 'conds' });
      // optional: states[] = [{conditions, result}] lets the teacher toggle conditions and see that outcome
      const toggleable = Array.isArray(s.states) && s.states.length > 0;
      const paint = () => {
        chips.innerHTML = '';
        Object.keys(cond).forEach(k => chips.appendChild(h('button', {
          class: 'cond' + (cond[k] ? '' : ' off'), html: condLabel(k), disabled: !toggleable || ran,
          onclick: () => { cond[k] = !cond[k]; paint(); }
        })));
        if (toggleable) {
          const st = s.states.find(x => Object.keys(cond).every(k => !!x.conditions[k] === !!cond[k]));
          res.src = st ? st.result : s.result;
        }
      };
      paint();
      card.appendChild(chips);
      grid.appendChild(card);
      return { card, paint };
    });
    const runBtn = h('button', { class: 'btn accent' }, (cfg.run_label ? ui.run + ': ' + cfg.run_label : ui.run));
    runBtn.addEventListener('click', () => {
      ran = !ran;
      cards.forEach(c => { c.card.classList.toggle('ran', ran); c.paint(); });
      runBtn.textContent = ran ? ui.run_again : (cfg.run_label ? ui.run + ': ' + cfg.run_label : ui.run);
      setNext(true, ran);
    });
    root.append(grid, h('div', { class: 'btns' }, runBtn));
  };

  function s(tag, attrs, text) {
    const el = document.createElementNS(SVGNS, tag);
    for (const k in attrs || {}) el.setAttribute(k, attrs[k]);
    if (text != null) el.textContent = text;
    return el;
  }
  const decimals = step => Math.max(0, Math.min(6, -Math.floor(Math.log10(step) + 1e-9)));

  ACTIVITY.sim_zoom_scale = sc => {
    const ui = S.ui, cfg = sc.config || {};
    const min = +cfg.min || 0, max = cfg.max != null ? +cfg.max : 10, unit = cfg.unit || '';
    const levels = (cfg.levels && cfg.levels.length ? cfg.levels : [1, 0.1, 0.01]).map(Number);
    const marks = cfg.marks || [];
    let level = 0, centre = marks.length ? +marks[0].value : (min + max) / 2;
    const root = simSheet(sc);
    const svg = s('svg', { class: 'sim-svg', viewBox: '0 0 1000 300', preserveAspectRatio: 'xMidYMid meet' });
    const readout = h('div', { class: 'readout' });
    const zin = h('button', { class: 'btn accent' }, ui.zoom_in), zout = h('button', { class: 'btn alt' }, ui.zoom_out);
    const markBtns = marks.map((m, i) => h('button', { class: 'btn alt', onclick: () => { centre = +m.value; draw(); } }, m.label || String(m.value)));
    function windowFor() {
      if (level === 0) return [min, max];
      const span = levels[level] * 10;
      let lo = Math.floor((centre - span / 2) / levels[level - 1]) * levels[level - 1];
      lo = Math.max(min, Math.min(lo, max - span));
      return [lo, lo + span];
    }
    function draw() {
      const [lo, hi] = windowFor(), step = levels[level], d = decimals(step);
      svg.innerHTML = '';
      const X = v => 60 + (v - lo) / (hi - lo) * 880;
      svg.appendChild(s('line', { x1: 40, y1: 150, x2: 960, y2: 150, stroke: THEME.ink, 'stroke-width': 4 }));
      const n = Math.round((hi - lo) / step);
      for (let i = 0; i <= n; i++) {
        const v = lo + i * step, x = X(v);
        const major = n <= 10 || i % 5 === 0;
        svg.appendChild(s('line', { x1: x, y1: 150 - (major ? 30 : 16), x2: x, y2: 150 + (major ? 30 : 16), stroke: THEME.ink, 'stroke-width': major ? 3 : 2 }));
        if (major) svg.appendChild(s('text', { x, y: 215, 'text-anchor': 'middle', 'font-size': 30, fill: THEME.ink }, v.toFixed(d)));
      }
      if (level > 0 && levels[level - 1] / step > 1) {
        // the part of the coarser scale we are inside
        svg.appendChild(s('text', { x: 500, y: 290, 'text-anchor': 'middle', 'font-size': 24, fill: THEME.dim },
          '×' + Math.round(levels[0] / step) + ' · ' + lo.toFixed(decimals(levels[level - 1])) + ' – ' + hi.toFixed(decimals(levels[level - 1])) + ' ' + unit));
      }
      marks.forEach(m => {
        const v = +m.value;
        if (v < lo || v > hi) return;
        const x = X(v);
        svg.appendChild(s('path', { d: `M${x} 112 l-14 -26 h28 z`, fill: THEME.accent }));
        svg.appendChild(s('text', { x, y: 70, 'text-anchor': 'middle', 'font-size': 32, 'font-weight': 700, fill: THEME.accent }, m.label || String(v)));
        if (m.still) svg.appendChild(s('image', { href: m.still, x: x - 40, y: -10, width: 80, height: 60, preserveAspectRatio: 'xMidYMid slice' }));
      });
      readout.textContent = (level === 0 ? '' : '1 ' + ui.step.toLowerCase() + ' = ') + step + ' ' + unit;
      zin.disabled = level >= levels.length - 1;
      zout.disabled = level === 0;
    }
    svg.addEventListener('click', e => {
      const r = svg.getBoundingClientRect(), [lo, hi] = windowFor();
      const x = (e.clientX - r.left) / r.width * 1000;
      centre = Math.max(min, Math.min(max, lo + (x - 60) / 880 * (hi - lo)));
      if (level < levels.length - 1) { level++; draw(); }
    });
    zin.addEventListener('click', () => { level = Math.min(levels.length - 1, level + 1); draw(); });
    zout.addEventListener('click', () => { level = Math.max(0, level - 1); draw(); });
    root.append(svg, h('div', { class: 'btns' }, zout, zin, readout, h('span', { style: { flex: 1 } }), markBtns));
    draw();
    return { key: k => { if (k === 1) { zout.click(); return true; } if (k === 2) { zin.click(); return true; } return false; } };
  };

  ACTIVITY.sim_dial = sc => {
    const cfg = sc.config || {};
    const min = +cfg.min || 0, max = cfg.max != null ? +cfg.max : 100, unit = cfg.unit || '';
    const zones = cfg.zones || [];
    const stepv = cfg.step || (max - min) / 200;
    let val = cfg.start != null ? +cfg.start : min;
    const root = simSheet(sc);
    const svg = s('svg', { class: 'sim-svg', viewBox: '0 0 400 240' });
    const range = h('input', { class: 'range', type: 'range', min, max, step: stepv, value: val });
    const readout = h('div', { class: 'readout' }), zl = h('div', { class: 'zone-label' });
    const pic = h('img', { class: 'pic', alt: '' });
    const A = v => Math.PI * (1 - (v - min) / (max - min)); // left = min, right = max
    const P = (v, r) => [200 + r * Math.cos(A(v)), 210 - r * Math.sin(A(v))];
    const colours = ['#7fb3d5', '#82c785', '#f4d03f', '#f0a35e', '#e57368', '#b388d9'];
    function arc(v0, v1, r) {
      const [x0, y0] = P(v0, r), [x1, y1] = P(v1, r);
      return `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`;
    }
    function draw() {
      svg.innerHTML = '';
      svg.appendChild(s('path', { d: arc(min, max, 160), stroke: THEME.track, 'stroke-width': 36, fill: 'none' }));
      zones.forEach((z, i) => svg.appendChild(s('path', { d: arc(Math.max(min, +z.from), Math.min(max, +z.to), 160), stroke: z.colour || colours[i % colours.length], 'stroke-width': 36, fill: 'none' })));
      for (let i = 0; i <= 10; i++) {
        const v = min + (max - min) * i / 10, [x0, y0] = P(v, 138), [x1, y1] = P(v, 120), [tx, ty] = P(v, 100);
        svg.appendChild(s('line', { x1: x0, y1: y0, x2: x1, y2: y1, stroke: THEME.ink, 'stroke-width': 2 }));
        if (i % 2 === 0) svg.appendChild(s('text', { x: tx, y: ty + 5, 'text-anchor': 'middle', 'font-size': 13, fill: THEME.ink }, String(+v.toFixed(2))));
      }
      const [nx, ny] = P(val, 150);
      svg.appendChild(s('line', { x1: 200, y1: 210, x2: nx, y2: ny, stroke: THEME.bad, 'stroke-width': 6, 'stroke-linecap': 'round' }));
      svg.appendChild(s('circle', { cx: 200, cy: 210, r: 12, fill: THEME.ink }));
      const z = zones.find(z => val >= +z.from && val <= +z.to);
      readout.textContent = (+(+val).toFixed(decimals(stepv))) + ' ' + unit;
      zl.innerHTML = z ? rich(z.label || '') : '';
      const img = z && (z.still || z.outcome);
      if (img) { pic.src = img; pic.style.visibility = 'visible'; } else pic.style.visibility = 'hidden';
      if (z && z.audio && z !== lastZone) playAudio(z.audio);
      lastZone = z;
    }
    let lastZone = null;
    range.addEventListener('input', () => { val = +range.value; draw(); });
    function drag(e) {
      const r = svg.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width * 400 - 200, y = 210 - (e.clientY - r.top) / r.height * 240;
      let a = Math.atan2(Math.max(0, y), x);
      val = min + (1 - a / Math.PI) * (max - min);
      val = Math.round(val / stepv) * stepv;
      range.value = val; draw();
    }
    let down = false;
    svg.addEventListener('pointerdown', e => { down = true; drag(e); });
    const move = e => { if (down) drag(e); };
    const up = () => { down = false; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    onCleanup(() => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); });
    root.appendChild(h('div', { class: 'dialwrap' },
      h('div', { class: 'col' }, svg, range),
      h('div', { class: 'col', style: { justifyContent: 'center' } }, readout, zl, h('div', { class: 'picbox' }, pic))));
    draw();
  };

  ACTIVITY.sim_tap_diagram = sc => {
    const ui = S.ui, cfg = sc.config || {};
    const root = simSheet(sc);
    // hotspots are % of the picture, so they sit on a layer fitted to the picture (not the letterboxed box)
    const img = h('img', { src: cfg.image, alt: '' });
    const layer = h('div', { class: 'dlayer' }, img);
    const box = h('div', { class: 'diagram' }, layer);
    const fitLayer = () => {
      const W = img.naturalWidth || 16, H = img.naturalHeight || 9, bw = box.clientWidth, bh = box.clientHeight;
      const k = Math.min(bw / W, bh / H), w = W * k, hgt = H * k;
      Object.assign(layer.style, { width: w + 'px', height: hgt + 'px', left: (bw - w) / 2 + 'px', top: (bh - hgt) / 2 + 'px' });
    };
    img.addEventListener('load', fitLayer);
    window.addEventListener('resize', fitLayer);
    onCleanup(() => window.removeEventListener('resize', fitLayer));
    requestAnimationFrame(fitLayer);
    const spots = (cfg.hotspots || []).map(hs => {
      const b = h('button', { class: 'hotspot', style: { left: hs.x + '%', top: hs.y + '%', width: (hs.w || 8) + '%', height: (hs.h || 8) + '%' } });
      b.addEventListener('click', () => open(hs, b, true));
      layer.appendChild(b);
      return [hs, b];
    });
    function open(hs, b, speak) {
      if (!b.querySelector('.hl')) b.appendChild(h('span', { class: 'hl rich', html: rich(hs.label) }));
      b.classList.add('seen');
      if (speak && hs.audio) playAudio(hs.audio);
      if (spots.every(([, x]) => x.classList.contains('seen'))) setNext(true, true);
    }
    root.append(box, h('div', { class: 'btns' }, h('button', { class: 'btn alt', onclick: () => spots.forEach(([hs, b]) => open(hs, b, false)) }, ui.show_all)));
    return { key: k => { const sp = spots[k - 1]; if (sp) { open(sp[0], sp[1], true); return true; } return false; } };
  };

  function renderUnknown(sc) {
    screenEl.appendChild(h('div', { class: 'error', text: 'Screen ' + sc.id + ': type "' + sc.type + (sc.mode ? '/' + sc.mode : '') + (sc.template ? '/' + sc.template : '') + '" is not part of schema chapter@1.' }));
    return {};
  }

  // ---------------- teacher view ----------------
  function drawTeacher(sc) {
    document.body.classList.toggle('teacher', S.teacher);
    $('#btn-teacher').classList.toggle('on', S.teacher);
    const p = $('#teacher-panel');
    p.hidden = !S.teacher;
    if (!S.teacher) return;
    p.innerHTML = '';
    if (S.ep) {
      const sel = h('select', { onchange: () => show(+sel.value, 0) },
        S.ep.screens.map((x, i) => h('option', { value: i, selected: i === S.idx }, (i + 1) + '. ' + x.id + ' · ' + x.type + (x.role ? ' (' + x.role + ')' : ''))));
      p.append(h('b', { text: S.ep.title }), sel);
    } else p.appendChild(h('b', { text: S.ch.chapter.title }));
    if (sc && sc.teacher_note) p.appendChild(h('div', { class: 'note rich', html: rich(sc.teacher_note) }));
    if (sc && (sc.type === 'vote' || sc.type === 'mcq')) {
      const right = sc.type === 'vote' ? sc.options.filter(o => o.correct).map(o => o.text).join(', ') : (sc.options[sc.answer] || {}).text;
      p.appendChild(h('div', { class: 'note' }, h('b', { text: S.ui.right_answer + ': ' }), h('span', { class: 'rich', html: rich(right || '') })));
    }
    p.appendChild(h('div', { class: 'keys', text: '→ / Space next · ← back · 1-9 choose · R replay · C captions · M map · T teacher · F full screen · H home' }));
  }

  // ---------------- controls ----------------
  function toggleCaptions() {
    S.captions = !S.captions;
    store.set('captions', S.captions);
    $('#btn-cc').classList.toggle('on', S.captions);
    capEl.hidden = !S.captions || !capEl.textContent;
  }
  function toggleTeacher() {
    S.teacher = !S.teacher;
    drawTeacher(S.ep ? S.ep.screens[S.idx] : null);
  }
  function toggleMap() {
    if (mapEl) { const p = mapPending; closeMap(); if (p) p(); return; }
    const sc = S.ep && S.ep.screens[S.idx];
    showMap(sc && sc.concept, null);
  }
  function fullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }
  const menu = $('#menu'), menuBtn = $('#btn-menu');
  function closeMenu() { menu.hidden = true; menuBtn.classList.remove('on'); }
  menuBtn.addEventListener('click', e => { e.stopPropagation(); menu.hidden = !menu.hidden; menuBtn.classList.toggle('on', !menu.hidden); });
  menu.addEventListener('click', e => { if (e.target.tagName === 'BUTTON') setTimeout(closeMenu, 0); });
  stage.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target) && e.target !== menuBtn) closeMenu(); });
  $('#btn-next').addEventListener('click', () => { if (mapPending) { mapPending(); return; } next(); });
  $('#btn-back').addEventListener('click', back);
  $('#btn-home').addEventListener('click', home);
  $('#btn-replay').addEventListener('click', () => { if (replayFn) replayFn(); });
  $('#btn-cc').addEventListener('click', toggleCaptions);
  $('#btn-teacher').addEventListener('click', toggleTeacher);
  $('#btn-map').addEventListener('click', toggleMap);
  $('#btn-full').addEventListener('click', fullscreen);
  document.addEventListener('keydown', e => {
    if (e.target && (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT')) return;
    const k = e.key;
    if (k === 'ArrowRight' || k === ' ' || k === 'Enter' || k === 'PageDown') { e.preventDefault(); if (mapPending) mapPending(); else if (!$('#btn-next').disabled) next(); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); back(); }
    else if (k === 'Escape') { if (mapEl) toggleMap(); }
    else if (/^[1-9]$/.test(k)) { if (S.view && S.view.key) S.view.key(+k); }
    else if (k === 'r' || k === 'R') { if (replayFn) replayFn(); }
    else if (k === 'c' || k === 'C') toggleCaptions();
    else if (k === 'm' || k === 'M') toggleMap();
    else if (k === 't' || k === 'T') toggleTeacher();
    else if (k === 'f' || k === 'F') fullscreen();
    else if (k === 'h' || k === 'H') home();
    wake();
  });
  // the bar hides after a few seconds without the mouse, so the projected picture is clean
  let idleT = null;
  function wake() {
    bar.classList.remove('idle'); menuBtn.classList.remove('idle');
    clearTimeout(idleT);
    idleT = setTimeout(() => { if (!bar.matches(':hover') && menu.hidden) { bar.classList.add('idle'); menuBtn.classList.add('idle'); } }, 3500);
  }
  stage.addEventListener('pointermove', wake);
  stage.addEventListener('pointerdown', wake);

  // ---------------- boot ----------------
  function boot(ch) {
    if (!ch || !ch.episodes) { screenEl.appendChild(h('div', { class: 'error', text: UI_DEFAULT.loading_error })); return; }
    S.ch = ch;
    S.ui = Object.assign({}, UI_DEFAULT, (ch.settings && ch.settings.ui) || {});
    S.captions = store.get('captions', !(ch.settings && ch.settings.captions === false));
    $('#btn-cc').classList.toggle('on', S.captions);
    document.title = ch.chapter.title + ' · Living Textbook';
    if (ch.language) document.documentElement.lang = ch.language;
    const q = new URLSearchParams(location.search);
    if (q.get('teacher') === '1') S.teacher = true;
    if (q.get('captions') === '0') S.captions = false;
    const ep = q.get('ep'), scr = q.get('screen');
    if (scr) { (ch.episodes || []).forEach(e => (ch.concepts || []).forEach(c => { S.mapShown[e.id + c.id] = true; })); }
    if (ep || scr) {
      const e = ep ? episode(ep) : ch.episodes.find(x => x.screens.some(s => s.id === scr));
      if (e) { startEpisode(e.id, scr); wake(); return; }
    }
    // a chapter with one episode opens straight on it (home stays in the Menu)
    if (ch.episodes.length === 1) startEpisode(ch.episodes[0].id);
    else home();
    wake();
  }
  if (window.CHAPTER) boot(window.CHAPTER);
  else fetch('chapter.json').then(r => r.json()).then(boot).catch(() => boot(null));
  window.LivingTextbook = { state: S, next, back, home, startEpisode };
})();
