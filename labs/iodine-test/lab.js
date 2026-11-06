/* Living Textbook - lab prototype: test a leaf for starch (NCERT Class 7 Science, Activity 10.2).
 * three.js r158 (classic build) + GSAP 3.12.5. Every object is built here in code: no model files, works from file://.
 * The steps are data (STEPS below); a real lab screen would read them from chapter.json.
 * v2 (2026-11-06): close camera framing per step that follows the action; a real dropper with forming, falling,
 * splashing drops and a stain that spreads from each drop; clear tap targets (gold outline, floor ring, "Tap:" label,
 * hover cursor, pointing hand after idle / wrong tap / Show me). */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  // inside a lesson (player screen type "lab") the page opens with ?embed=1: no title, panels clear of the lesson's
  // rail and buttons, and the lesson is told when the class finishes
  const EMBED = /[?&]embed=1/.test(location.search);
  if (EMBED) document.body.classList.add('embed');

  // ---------------------------------------------------------------- renderer, scene, camera
  const canvas = $('#scene');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#14100d');
  scene.fog = new THREE.Fog('#14100d', 18, 34);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const camTarget = new THREE.Vector3();

  scene.add(new THREE.HemisphereLight('#fff1dc', '#3a2a1e', 1.1));
  const sun = new THREE.DirectionalLight('#ffe2b8', 1.6);
  sun.position.set(-6, 10, 6);
  scene.add(sun);

  // toon shading: three flat tones, like the painted lessons
  const ramp = new THREE.DataTexture(new Uint8Array([90, 90, 90, 255, 175, 175, 175, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat);
  ramp.minFilter = ramp.magFilter = THREE.NearestFilter; ramp.needsUpdate = true;
  const toon = (color, extra) => new THREE.MeshToonMaterial(Object.assign({ color, gradientMap: ramp }, extra || {}));
  const OUTLINE = new THREE.MeshBasicMaterial({ color: '#2a1c12', side: THREE.BackSide });
  const GLASS_LINE = new THREE.MeshBasicMaterial({ color: '#d8e8f0', side: THREE.BackSide, transparent: true, opacity: .55, depthWrite: false });
  const GOLD_LINE = new THREE.MeshBasicMaterial({ color: '#f5be73', side: THREE.BackSide });
  const MISS_LINE = new THREE.MeshBasicMaterial({ color: '#ee7f62', side: THREE.BackSide });
  function outline(mesh, k, mat) {
    const o = new THREE.Mesh(mesh.geometry, mat || OUTLINE);
    const base = 1 + (k || .04);
    o.scale.setScalar(base);
    o.raycast = () => {};
    o.userData.outline = { mat: mat || OUTLINE, base, k: k || .04 };
    mesh.add(o);
    return mesh;
  }
  function lathe(points, segs) { return new THREE.LatheGeometry(points.map(p => new THREE.Vector2(p[0], p[1])), segs || 40); }
  function glass(geo) {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: '#cfe6f2', transparent: true, opacity: .16, depthWrite: false, side: THREE.DoubleSide }));
    m.renderOrder = 5;
    return outline(m, .025, GLASS_LINE);
  }
  function blob(r, x, z) {  // soft contact shadow
    const m = new THREE.Mesh(new THREE.CircleGeometry(r, 32), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: .28, depthWrite: false }));
    m.rotation.x = -Math.PI / 2; m.position.set(x, .012, z); scene.add(m); return m;
  }

  // ---------------------------------------------------------------- the bench
  const bench = outline(new THREE.Mesh(new THREE.BoxGeometry(15, .6, 7.5), toon('#8a5a35')), .006);
  bench.position.y = -.3; scene.add(bench);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 16), toon('#3b2d22'));
  wall.position.set(0, 7, -5); scene.add(wall);
  const board = outline(new THREE.Mesh(new THREE.BoxGeometry(9, 3.6, .12), toon('#2f5a43')), .01);
  board.position.set(-1, 5.4, -4.9); scene.add(board);

  const objects = {};   // tappable groups by key
  function tappable(key, group, label, anchor, extra) {
    const groups = [group].concat(extra || []);
    groups.forEach(g => g.traverse(o => { o.userData.key = key; }));
    objects[key] = { group, groups, label, anchor: anchor || new THREE.Vector3(0, 1.2, 0) };
    return group;
  }

  // tripod + gauze + beaker of water
  const tripod = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * Math.PI * 2;
    const leg = outline(new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 2.12, 8), toon('#5b5f66')), .25);
    leg.position.set(Math.cos(a) * .95, 1.06, Math.sin(a) * .95); leg.rotation.z = Math.cos(a) * .08; leg.rotation.x = -Math.sin(a) * .08;
    tripod.add(leg);
  }
  const ring = outline(new THREE.Mesh(new THREE.TorusGeometry(1, .06, 8, 40), toon('#5b5f66')), .2);
  ring.rotation.x = Math.PI / 2; ring.position.y = 2.24; tripod.add(ring);
  const gauze = outline(new THREE.Mesh(new THREE.BoxGeometry(2.3, .04, 2.3), toon('#9aa0a6')), .01);
  gauze.position.y = 2.3; tripod.add(gauze);
  tripod.position.set(-3, 0, 0); scene.add(tripod); blob(1.4, -3, 0);

  const beaker = new THREE.Group();
  beaker.add(glass(lathe([[0, 0], [.85, 0], [.88, .05], [.88, 1.75], [.95, 1.82]])));
  const water = new THREE.Mesh(new THREE.CylinderGeometry(.83, .83, 1.1, 32), new THREE.MeshToonMaterial({ color: '#7fb6d6', gradientMap: ramp, transparent: true, opacity: .55, depthWrite: false }));
  water.position.y = .58; water.renderOrder = 4; beaker.add(water);
  beaker.position.set(-3, 2.33, 0); scene.add(beaker);
  tappable('beaker', beaker, 'Beaker of water', new THREE.Vector3(.9, 1.9, 0));

  // spirit lamp
  const lamp = new THREE.Group();
  lamp.add(glass(lathe([[0, 0], [.55, 0], [.6, .3], [.45, .7], [.18, .8]])));
  const fuel = new THREE.Mesh(lathe([[0, .02], [.52, .02], [.56, .3], [.45, .45], [0, .45]]), new THREE.MeshToonMaterial({ color: '#d9c48a', gradientMap: ramp, transparent: true, opacity: .6 }));
  lamp.add(fuel);
  const cap = outline(new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .14, 16), toon('#b08a3a')), .06); cap.position.y = .86; lamp.add(cap);
  const wick = outline(new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .16, 8), toon('#f2ead8')), .1); wick.position.y = 1.0; lamp.add(wick);
  const flame = new THREE.Group();
  const outer = new THREE.Mesh(new THREE.ConeGeometry(.17, .62, 16), new THREE.MeshBasicMaterial({ color: '#ffae42', transparent: true, opacity: .9 }));
  const inner = new THREE.Mesh(new THREE.ConeGeometry(.08, .34, 16), new THREE.MeshBasicMaterial({ color: '#fff3b0' }));
  outer.position.y = .31; inner.position.y = .2; flame.add(outer, inner);
  flame.position.y = 1.08; flame.scale.setScalar(.001); lamp.add(flame);
  const glow = new THREE.PointLight('#ffb35a', 0, 6); glow.position.y = 1.4; lamp.add(glow);
  lamp.position.set(-3, 0, 0); scene.add(lamp);
  tappable('lamp', lamp, 'Spirit lamp', new THREE.Vector3(-.9, 1.0, .6));

  // test tube of alcohol in a wooden rack
  const rack = outline(new THREE.Mesh(new THREE.BoxGeometry(1.6, .5, .7), toon('#9b6b3f')), .02);
  rack.position.set(0, .25, -1.6); scene.add(rack); blob(1, 0, -1.6);
  const tube = new THREE.Group();
  tube.add(glass(lathe([[0, 0], [.1, .01], [.17, .1], [.17, 1.9], [.2, 1.95]], 24)));
  const alcohol = new THREE.Mesh(new THREE.CylinderGeometry(.15, .15, .95, 20), new THREE.MeshToonMaterial({ color: '#e6eef5', gradientMap: ramp, transparent: true, opacity: .45, depthWrite: false }));
  alcohol.position.y = .55; alcohol.renderOrder = 4; tube.add(alcohol);
  tube.position.set(0, .45, -1.6); scene.add(tube);
  tappable('tube', tube, 'Test tube with alcohol', new THREE.Vector3(0, 2.2, 0));

  // bowl of water
  const bowl = new THREE.Group();
  bowl.add(outline(new THREE.Mesh(lathe([[0, 0], [.7, 0], [.95, .45], [.9, .48], [.65, .06], [0, .06]]), toon('#e7e2d6', { side: THREE.DoubleSide })), .02));
  const bowlWater = new THREE.Mesh(new THREE.CircleGeometry(.84, 32), new THREE.MeshToonMaterial({ color: '#86bcd9', gradientMap: ramp, transparent: true, opacity: .8 }));
  bowlWater.rotation.x = -Math.PI / 2; bowlWater.position.y = .36; bowl.add(bowlWater);
  bowl.position.set(.6, 0, 1.8); scene.add(bowl); blob(1, .6, 1.8);
  tappable('bowl', bowl, 'Bowl of water', new THREE.Vector3(0, .9, 0));

  // white plate
  const plate = new THREE.Group();
  plate.add(outline(new THREE.Mesh(lathe([[0, 0], [1.05, 0], [1.25, .12], [1.2, .14], [1.0, .05], [0, .05]], 48), toon('#f3f0ea', { side: THREE.DoubleSide })), .015));
  plate.position.set(3.4, 0, .9); scene.add(plate); blob(1.3, 3.4, .9);
  tappable('plate', plate, 'Plate', new THREE.Vector3(1.15, .3, .3));

  // iodine bottle and its dropper (a glass pipette with a red rubber bulb; no label text)
  const iodine = new THREE.Group();
  iodine.add(outline(new THREE.Mesh(lathe([[0, 0], [.42, 0], [.45, .9], [.22, 1.1], [.2, 1.25]], 24), toon('#7a3e14')), .03));
  iodine.position.set(5.6, 0, -1.1); scene.add(iodine); blob(.6, 5.6, -1.1);
  const dropper = new THREE.Group();           // origin = the pipette tip
  const pipette = glass(lathe([[0, 0], [.025, 0], [.06, .25], [.07, 1.15], [.08, 1.2]], 16));
  dropper.add(pipette);
  const iodineIn = new THREE.Mesh(new THREE.CylinderGeometry(.045, .02, .5, 12), toon('#8a4512', { transparent: true, opacity: .85 }));
  iodineIn.position.y = .3; dropper.add(iodineIn);
  const bulb = outline(new THREE.Mesh(new THREE.SphereGeometry(.17, 16, 12), toon('#c23b2b')), .06);
  bulb.position.y = 1.38; bulb.scale.y = 1.35; dropper.add(bulb);
  const DROPPER_HOME = new THREE.Vector3(5.6, .2, -1.1);
  dropper.position.copy(DROPPER_HOME); scene.add(dropper);
  tappable('iodine', iodine, 'Iodine', new THREE.Vector3(0, 1.9, 0), [dropper]);

  // the leaf (flat shape with a midrib), starts on the plate. A canvas texture carries the iodine stain.
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, -.75);
  leafShape.bezierCurveTo(.55, -.45, .5, .35, 0, .8);
  leafShape.bezierCurveTo(-.5, .35, -.55, -.45, 0, -.75);
  const LEAF_GREEN = new THREE.Color('#3f9a3a'), LEAF_PALE = new THREE.Color('#e9e2b6');
  const stainCanvas = document.createElement('canvas'); stainCanvas.width = stainCanvas.height = 256;
  const sctx = stainCanvas.getContext('2d');
  const stainTex = new THREE.CanvasTexture(stainCanvas);
  stainTex.colorSpace = THREE.SRGBColorSpace;
  stainTex.repeat.set(1 / 1.1, 1 / 1.55); stainTex.offset.set(.55 / 1.1, .75 / 1.55);   // ShapeGeometry UVs are shape coordinates
  const stains = [];   // {lx, ly, r}: growing blue-black patches in leaf coordinates
  function paintStains() {
    sctx.fillStyle = '#ffffff'; sctx.fillRect(0, 0, 256, 256);
    stains.forEach(s => {
      if (s.r <= 0) return;
      const cx = (s.lx + .55) / 1.1 * 256, cy = (1 - (s.ly + .75) / 1.55) * 256, r = s.r * 256;
      const g = sctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, s.brown > 0 ? `rgba(140,70,20,${s.brown})` : '#262e66');
      g.addColorStop(.18, '#262e66'); g.addColorStop(.82, '#2b356f'); g.addColorStop(1, 'rgba(43,53,111,0)');
      sctx.fillStyle = g; sctx.beginPath(); sctx.arc(cx, cy, r, 0, 6.3); sctx.fill();
    });
    stainTex.needsUpdate = true;
  }
  paintStains();
  const leafMat = toon(LEAF_GREEN.clone(), { side: THREE.DoubleSide, map: stainTex });
  const leaf = new THREE.Group();
  const blade = outline(new THREE.Mesh(new THREE.ShapeGeometry(leafShape, 24), leafMat), .03);
  const ribMat = new THREE.MeshBasicMaterial({ color: '#2b6b28' });
  const rib = new THREE.Mesh(new THREE.BoxGeometry(.03, 1.45, .01), ribMat); rib.position.set(0, .02, .005);
  const stalk = new THREE.Mesh(new THREE.BoxGeometry(.04, .35, .02), ribMat); stalk.position.set(0, -.9, 0);
  blade.add(rib); leaf.add(blade, stalk);
  const LEAF_ON_PLATE = { pos: new THREE.Vector3(3.4, .1, .9), rot: new THREE.Euler(-Math.PI / 2, 0, .5) };
  leaf.position.copy(LEAF_ON_PLATE.pos); leaf.rotation.copy(LEAF_ON_PLATE.rot);
  scene.add(leaf);
  tappable('leaf', leaf, 'Leaf from a sunny plant', new THREE.Vector3(0, .6, 0));

  // bubbles and steam for boiling water
  const BUBBLES = 36;
  const bubbles = new THREE.InstancedMesh(new THREE.SphereGeometry(.05, 8, 6), new THREE.MeshBasicMaterial({ color: '#eaf6ff', transparent: true, opacity: .8 }), BUBBLES);
  const bubbleState = Array.from({ length: BUBBLES }, () => ({ x: 0, y: 0, z: 0, v: 0 }));
  const tmp = new THREE.Object3D();
  bubbles.renderOrder = 6; beaker.add(bubbles);
  const steam = [];
  for (let i = 0; i < 7; i++) {
    const s = new THREE.Mesh(new THREE.CircleGeometry(.35, 16), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false }));
    s.userData.t = i / 7; beaker.add(s); steam.push(s);
  }

  // tap-target marker: a gold ring on the bench under the object to tap
  const floorRing = new THREE.Mesh(new THREE.RingGeometry(.86, 1, 64), new THREE.MeshBasicMaterial({ color: '#f5be73', transparent: true, opacity: 0, depthWrite: false }));
  floorRing.rotation.x = -Math.PI / 2; floorRing.position.y = .02; scene.add(floorRing);

  // ---------------------------------------------------------------- lab state
  const S = { lit: false, boil: 0, step: -1, predicted: null, busy: false, target: null, flash: null };
  bubbleState.forEach(b => { const a = Math.random() * 6.28, r = Math.random() * .7; b.x = Math.cos(a) * r; b.z = Math.sin(a) * r; b.y = Math.random() * 1.05; b.v = .6 + Math.random() * .8; });

  // ---------------------------------------------------------------- camera views (close framing per step)
  const VIEWS = {
    all: { pos: [.8, 7.2, 12.5], at: [.8, 1.2, 0] },
    burner: { pos: [-1.2, 4.6, 6.6], at: [-2.9, 2.0, 0] },       // whole lamp, tripod and beaker
    lamp: { pos: [-1.6, 2.9, 4.6], at: [-3, 1.2, 0] },            // the spirit lamp under the tripod
    bath: { pos: [-2.0, 4.6, 3.5], at: [-2.85, 3.1, 0] },         // looking into the beaker at the test tube
    leafPick: { pos: [3.7, 3.5, 4.0], at: [3.35, .3, .8] },       // the leaf on the plate
    rack: { pos: [-.9, 4.4, 5.6], at: [-1.2, 1.6, -.7] },         // the test tube in its rack, beaker beside it
    wash: { pos: [-.9, 5.3, 8.2], at: [-1.1, 1.6, 1.0] },         // the beaker and the bowl of water
    bowl: { pos: [1.0, 3.2, 4.6], at: [.6, .5, 1.6] },
    plate: { pos: [3.6, 4.2, 4.8], at: [3.35, .35, .8] },
    plateClose: { pos: [4.5, 3.0, 4.2], at: [3.4, .75, .85] },    // close on the leaf, with room above it for the dropper and the falling drop
    iodine: { pos: [5.0, 3.6, 5.0], at: [4.6, .9, -.2] },         // the bottle and the plate together
  };
  function view(name, instant, duration) {
    const v = VIEWS[name];
    const d = instant ? 0 : (duration || 1.5);
    gsap.to(camera.position, { x: v.pos[0], y: v.pos[1], z: v.pos[2], duration: d, ease: 'power2.inOut', overwrite: true });
    gsap.to(camTarget, { x: v.at[0], y: v.at[1], z: v.at[2], duration: d, ease: 'power2.inOut', overwrite: true });
  }
  const later = (s, fn) => gsap.delayedCall(s, fn);

  // ---------------------------------------------------------------- effects (the "do" operations)
  function tweenColor(color, to, duration, delay) {
    return gsap.to(color, { r: to.r, g: to.g, b: to.b, duration, delay: delay || 0, ease: 'sine.inOut' });
  }
  const FX = {
    lampOn() {
      S.lit = true;
      gsap.to(flame.scale, { x: 1, y: 1, z: 1, duration: .5, ease: 'back.out(2)' });
      gsap.to(glow, { intensity: 2.2, duration: .6 });
      gsap.to(S, { boil: 1, duration: 3, delay: .8, ease: 'power1.in' });
      later(.9, () => view('burner', false, 1.8));
      return 3.8;
    },
    lampOff() {
      S.lit = false;
      gsap.to(flame.scale, { x: .001, y: .001, z: .001, duration: .4 });
      gsap.to(glow, { intensity: 0, duration: .4 });
      gsap.to(S, { boil: 0, duration: 2.5 });
      later(.6, () => view('burner', false, 1.4));
      return 2.2;
    },
    leafIntoWater() {
      view('burner', false, 2.2);
      const tl = gsap.timeline();
      tl.to(leaf.position, { x: -1, y: 4.6, z: 0, duration: 1.1, ease: 'power2.out' })
        .to(leaf.rotation, { x: -Math.PI / 2 + .3, z: 0, duration: 1.1 }, '<')
        .to(leaf.position, { x: -3, y: 2.95, z: 0, duration: .9, ease: 'power2.in' })
        .to(leaf.scale, { x: .75, y: .75, z: .75, duration: .9 }, '<')
        .to(leaf.rotation, { x: -1.2, y: .8, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: 1 });
      tweenColor(leafMat.color, new THREE.Color('#4f8a3a'), 2, 2);
      return 4.4;
    },
    tubeAndLeafIntoBath() {
      const tl = gsap.timeline();
      // the leaf goes into the tube (rolled thin), then the tube stands in the hot water
      tl.to(leaf.position, { x: 0, y: 3.4, z: -1.6, duration: 1, ease: 'power2.inOut' })
        .to(leaf.rotation, { x: 0, y: 0, z: 0, duration: 1 }, '<')
        .to(leaf.scale, { x: .22, y: .55, z: .55, duration: 1 }, '<')
        .to(leaf.position, { y: 1.05, duration: .8, ease: 'power2.in' })
        .to(tube.position, { x: -2.7, y: 2.45, z: .1, duration: 1.4, ease: 'power2.inOut' }, '+=.2')
        .to(leaf.position, { x: -2.7, y: 3.05, z: .1, duration: 1.4, ease: 'power2.inOut' }, '<');
      later(2.2, () => view('bath', false, 1.8));
      tweenColor(alcohol.material.color, new THREE.Color('#5fbf4a'), 3.5, 4.5);
      gsap.to(alcohol.material, { opacity: .8, duration: 3.5, delay: 4.5 });
      tweenColor(leafMat.color, LEAF_PALE, 3.5, 4.6);
      tweenColor(ribMat.color, new THREE.Color('#cfc690'), 3.5, 4.6);
      return 8.6;
    },
    washAndPlate() {
      const tl = gsap.timeline();
      tl.to(leaf.position, { y: 4.7, duration: .9, ease: 'power2.out' })
        .to(leaf.scale, { x: 1, y: 1, z: 1, duration: .9 }, '<')
        .to(leaf.position, { x: .6, y: .5, z: 1.8, duration: 1.2, ease: 'power2.inOut' })
        .to(leaf.rotation, { x: -Math.PI / 2, z: .2, duration: 1.2 }, '<')
        .to(leaf.position, { y: .35, duration: .4, yoyo: true, repeat: 3, ease: 'sine.inOut' })
        .to(leaf.position, { x: LEAF_ON_PLATE.pos.x, y: LEAF_ON_PLATE.pos.y, z: LEAF_ON_PLATE.pos.z, duration: 1.3, ease: 'power2.inOut' })
        .to(leaf.rotation, { x: LEAF_ON_PLATE.rot.x, y: 0, z: LEAF_ON_PLATE.rot.z, duration: 1.3 }, '<');
      later(1.4, () => view('bowl', false, 1.2));
      later(3.7, () => view('plate', false, 1.5));
      return 5.4;
    },
    iodineDrops() {
      // where the drops land, in leaf coordinates, and in the world
      const spots = [[.02, .32], [-.14, -.08], [.12, -.38]];
      const world = spots.map(([x, y]) => { leaf.updateMatrixWorld(); return leaf.localToWorld(new THREE.Vector3(x, y, 0)); });
      later(.9, () => view('plateClose', false, 1.8));
      const tl = gsap.timeline();
      // lift the dropper out of the bottle and bring it over the leaf
      tl.to(dropper.position, { y: 1.75, duration: .7, ease: 'power2.out' })
        .to(dropper.position, { x: world[0].x, y: world[0].y + .95, z: world[0].z, duration: 1.2, ease: 'power2.inOut' });
      world.forEach((p, i) => {
        const drop = new THREE.Mesh(new THREE.SphereGeometry(.075, 16, 12), toon('#8a4512', { transparent: true }));
        drop.scale.setScalar(.01); drop.visible = false; scene.add(drop);
        const ripple = new THREE.Mesh(new THREE.RingGeometry(.08, .11, 32), new THREE.MeshBasicMaterial({ color: '#8a4512', transparent: true, opacity: 0, depthWrite: false }));
        ripple.rotation.x = -Math.PI / 2; ripple.position.set(p.x, p.y + .015, p.z); scene.add(ripple);
        const stain = { lx: spots[i][0], ly: spots[i][1], r: 0, brown: 1 };
        if (i > 0) tl.to(dropper.position, { x: p.x, z: p.z, y: p.y + .95, duration: .55, ease: 'power1.inOut' });
        // squeeze the bulb, the drop swells at the tip, lets go, falls with gravity and splashes
        tl.to(bulb.scale, { x: .72, z: .72, y: 1.15, duration: .22, ease: 'power2.in' })
          .call(() => { drop.visible = true; drop.position.set(p.x, p.y + .95 - .08, p.z); })
          .to(drop.scale, { x: 1, y: 1.15, z: 1, duration: .4, ease: 'sine.out' })
          .to(bulb.scale, { x: 1, z: 1, y: 1.35, duration: .3, ease: 'power2.out' }, '<.1')
          .to(drop.position, { y: p.y + .06, duration: .38, ease: 'power2.in' })
          .to(drop.scale, { y: 1.45, x: .85, z: .85, duration: .38, ease: 'power2.in' }, '<')
          .call(() => { stains.push(stain); })
          .to(drop.scale, { x: 1.9, y: .22, z: 1.9, duration: .12, ease: 'power2.out' })
          .to(drop.position, { y: p.y + .02, duration: .12 }, '<')
          .fromTo(ripple.scale, { x: .4, y: .4, z: .4 }, { x: 2.6, y: 2.6, z: 2.6, duration: .7, ease: 'power2.out', immediateRender: false }, '<')
          .fromTo(ripple.material, { opacity: .8 }, { opacity: 0, duration: .7, immediateRender: false }, '<')
          .to(drop.material, { opacity: 0, duration: .9 }, '<.2')
          .to(stain, { r: .1, duration: .5, ease: 'power1.out' }, '<');
      });
      // the dropper goes home while the blue-black spreads out from every drop
      tl.to(dropper.position, { x: DROPPER_HOME.x, y: 1.75, z: DROPPER_HOME.z, duration: 1.2, ease: 'power2.inOut' }, '+=.2')
        .to(dropper.position, { y: DROPPER_HOME.y, duration: .6, ease: 'power2.in' });
      tl.call(() => {
        stains.forEach((s, i) => {
          gsap.to(s, { brown: 0, duration: 1.4, delay: i * .15 });
          gsap.to(s, { r: .75, duration: 3.6, delay: i * .15, ease: 'sine.inOut' });
        });
        tweenColor(ribMat.color, new THREE.Color('#141830'), 3.2, .4);
      }, null, '<-1.6');
      return tl.duration() + 1.8;
    },
  };

  // ---------------------------------------------------------------- the activity, as data
  const STEPS = [
    { title: 'Light the lamp', view: 'burner', tap: 'lamp', hint: 'Tap the spirit lamp',
      say: 'We will test a leaf for starch. First we need boiling water. Light the spirit lamp under the beaker.',
      ok: 'The flame heats the water. Watch the bubbles: the water is boiling.', fx: 'lampOn', status: ['#7fb6d6', 'Water: boiling'] },
    { title: 'Boil the leaf', view: 'leafPick', tap: 'leaf', hint: 'Tap the leaf on the plate',
      say: 'This leaf comes from a plant kept in sunlight. Put it in the boiling water for a few minutes. Boiling softens the leaf.',
      ok: 'The leaf is soft now.', fx: 'leafIntoWater', status: ['#4f8a3a', 'Leaf: soft and green'] },
    { title: 'Be safe with alcohol', view: 'rack', choose: true,
      say: 'Next we remove the green colour with alcohol. Alcohol catches fire easily. How should we heat it?',
      options: [
        { text: 'Stand the test tube of alcohol in the hot water', right: true, say: 'Yes. The hot water heats the alcohol safely. Alcohol never goes near a flame.' },
        { text: 'Heat the alcohol directly on the flame', say: 'No! Alcohol catches fire easily. Never bring it near a flame. Heat it in hot water instead.' },
      ] },
    { title: 'Remove the green colour', view: 'rack', tap: 'tube', hint: 'Tap the test tube of alcohol',
      say: 'Put the leaf in the test tube of alcohol, and stand the tube in the hot water.',
      ok: 'Look: the green colour moves out of the leaf into the alcohol. The leaf turns pale.', fx: 'tubeAndLeafIntoBath', status: ['#5fbf4a', 'Leaf: pale  ·  Alcohol: green'] },
    { title: 'Put out the flame', view: 'lamp', tap: 'lamp', hint: 'Tap the spirit lamp',
      say: 'We do not need heat any more. Put out the flame first. Always switch off the flame when you finish heating.',
      ok: 'The flame is out. The water stops boiling.', fx: 'lampOff', status: ['#9e9287', 'Flame: off'] },
    { title: 'Wash the leaf', view: 'wash', tap: 'bowl', hint: 'Tap the bowl of water',
      say: 'Take the pale leaf out and wash it in water. Then lay it flat on the plate.',
      ok: 'The washed leaf is on the plate, ready for the test.', fx: 'washAndPlate', status: ['#e9e2b6', 'Leaf: pale, washed'] },
    { title: 'Predict', view: 'plate', predict: true,
      say: 'Iodine is brown. Where there is starch, it turns blue-black. What will the leaf look like? Ask the class and tap the answer most of them chose.',
      options: [{ text: 'The leaf turns blue-black', right: true }, { text: 'The leaf stays pale' }, { text: 'The leaf turns brown, like iodine' }] },
    { title: 'Add iodine', view: 'iodine', tap: 'iodine', hint: 'Tap the iodine bottle',
      say: 'Now we find out. Put a few drops of iodine on the leaf.',
      fx: 'iodineDrops', status: ['#3b4a8a', 'Leaf: blue-black  ·  Starch present'] },
  ];

  // ---------------------------------------------------------------- UI
  const card = { title: $('#steptitle'), say: $('#say'), hint: $('#hint'), hinttext: $('#hinttext'), choices: $('#choices'), fb: $('#feedback'), next: $('#next') };
  const chipsEl = $('#chips'), pointer = $('#pointer');
  const HAND = '<svg viewBox="0 0 24 24"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V12m0-1a1.5 1.5 0 0 1 3 0v3.5a6 6 0 0 1-6 6h-.6a5 5 0 0 1-4-2l-3-4a1.5 1.5 0 0 1 2.3-1.9L9 14"/></svg>';
  const chips = {};
  for (const k in objects) {
    const c = document.createElement('div'); c.className = 'chip'; c.innerHTML = `<span>${objects[k].label}</span>`; chipsEl.appendChild(c); chips[k] = c;
  }
  pointer.innerHTML = '<i></i><b>' + HAND + '</b>';

  // highlight the object to tap: gold outline, gold floor ring, gold "Tap:" label; the other labels step back
  function setTarget(key) {
    S.target = key;
    for (const k in objects) {
      const on = k === key;
      objects[k].groups.forEach(g => g.traverse(o => { const u = o.userData.outline; if (u) { o.material = on ? GOLD_LINE : u.mat; o.scale.setScalar(u.base); } }));
      chips[k].classList.toggle('target', on);
      chips[k].classList.toggle('faded', !!key && !on);
      chips[k].innerHTML = on ? `${HAND}<span>Tap: ${objects[k].label}</span>` : `<span>${objects[k].label}</span>`;
    }
    if (key) {
      const box = new THREE.Box3().setFromObject(objects[key].group);
      const size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
      floorRing.position.set(c.x, .02, c.z); floorRing.scale.setScalar(Math.max(size.x, size.z) / 2 + .35);
    }
    gsap.to(floorRing.material, { opacity: key ? .9 : 0, duration: .4 });
  }
  function flashWrong(key) {
    if (!key || !objects[key]) return;
    const outlines = [];
    objects[key].groups.forEach(g => g.traverse(o => { if (o.userData.outline) outlines.push(o); }));
    outlines.forEach(o => { o.material = MISS_LINE; });
    later(.7, () => outlines.forEach(o => { o.material = key === S.target ? GOLD_LINE : o.userData.outline.mat; }));
    gsap.fromTo(objects[key].group.position, { x: '-=0.05' }, { x: '+=0.05', duration: .06, repeat: 5, yoyo: true });
  }
  let idle = null;
  function showPointer(on) {
    pointer.hidden = !on;
    if (idle) { idle.kill(); idle = null; }
  }
  function armIdle() { if (idle) idle.kill(); idle = later(6, () => { if (S.target && !S.busy) pointer.hidden = false; }); }

  function setStatus(color, text) {
    const st = $('#status'); st.querySelector('i').style.background = color; st.querySelector('i').style.color = color; st.querySelector('span').textContent = text;
  }
  function progress() {
    const p = $('#progress'); p.innerHTML = '';
    STEPS.forEach((s, i) => { const li = document.createElement('li'); li.className = i < S.step ? 'done' : i === S.step ? 'now' : ''; p.appendChild(li); });
    $('#stepno').textContent = S.step < STEPS.length ? `Step ${S.step + 1} of ${STEPS.length}` : 'Lab complete';
  }
  function feedback(text, kind) {
    card.fb.hidden = !text; card.fb.textContent = text || ''; card.fb.className = kind || '';
  }
  function showStep(i) {
    S.step = i; progress();
    const st = STEPS[i];
    card.title.textContent = st.title; card.say.textContent = st.say;
    feedback(''); card.next.hidden = true; showPointer(false);
    card.hint.hidden = !st.tap; card.hinttext.textContent = st.hint || '';
    card.choices.hidden = !(st.choose || st.predict); card.choices.innerHTML = '';
    if (st.options) st.options.forEach((o, k) => {
      const b = document.createElement('button'); b.className = 'opt'; b.innerHTML = `<b>${'ABC'[k]}</b><span>${o.text}</span>`;
      b.onclick = () => pick(k); card.choices.appendChild(b);
    });
    setTarget(st.tap || null);
    view(st.view);
    if (st.tap) armIdle();
  }
  function pick(k) {
    const st = STEPS[S.step]; const btns = [...card.choices.children];
    if (st.predict) {   // the class's prediction: no right or wrong yet, the iodine will show it
      S.predicted = k;
      btns.forEach((b, j) => { b.classList.toggle('picked', j === k); b.classList.toggle('dim', j !== k); });
      feedback('Class prediction noted. Let us test it.', '');
      card.next.hidden = false; return;
    }
    const o = st.options[k];
    btns.forEach((b, j) => { b.classList.remove('right', 'miss', 'dim'); if (st.options[j].right) b.classList.add('right'); else if (j === k) b.classList.add('miss'); else b.classList.add('dim'); });
    feedback(o.say, o.right ? 'good' : 'bad');
    if (o.right) card.next.hidden = false;
  }
  function done(st) {
    let text = st.ok || '';
    if (st.fx === 'iodineDrops') {
      const p = STEPS[6].options[S.predicted ?? 0];
      text = (p && p.right ? 'The class predicted it! ' : `Many of you said "${(p || {}).text}". `) +
             'The leaf turned blue-black. Blue-black means starch. The leaf made food and stored it as starch.';
    }
    feedback(text, 'good');
    if (st.status) setStatus(st.status[0], st.status[1]);
    card.next.hidden = false;
    card.next.firstChild.textContent = S.step === STEPS.length - 1 ? 'Finish ' : 'Next ';
  }
  function tapped(key) {
    const st = STEPS[S.step];
    if (!st || !st.tap || S.busy) return;
    if (key !== st.tap) {
      feedback(`Not that one. ${st.hint}: it is glowing gold.`, 'bad');
      flashWrong(key); pointer.hidden = false;
      return;
    }
    S.busy = true; showPointer(false); card.hint.hidden = true; setTarget(null);
    feedback('', '');
    const t = FX[st.fx]();
    setTimeout(() => { S.busy = false; done(st); }, t * 1000);
  }
  card.next.onclick = () => {
    if (S.step < STEPS.length - 1) showStep(S.step + 1);
    else finish();
  };
  $('#showme').onclick = () => { if (S.target) { pointer.hidden = false; view(STEPS[S.step].view, false, .8); } };
  function finish() {
    S.step = STEPS.length; progress();
    card.title.textContent = 'What we found';
    card.say.textContent = 'The leaf turned blue-black with iodine. So the leaf has starch. Plants make their food in the leaves and store it as starch.';
    card.hint.hidden = true; card.choices.hidden = true; feedback('', '');
    card.next.hidden = false; card.next.firstChild.textContent = 'Do it again ';
    if (EMBED && window.parent !== window) window.parent.postMessage({ lt: 'lab-done', lab: 'iodine-test' }, '*');
    card.next.onclick = () => location.reload();
    view('plate');
  }

  // taps and hover on the 3D bench
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function pickAt(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const all = []; Object.values(objects).forEach(o => all.push(...o.groups));
    const hit = ray.intersectObjects(all, true)[0];
    return hit ? hit.object.userData.key : null;
  }
  canvas.addEventListener('pointerdown', e => { if (document.body.dataset.screen !== 'title') tapped(pickAt(e)); });
  canvas.addEventListener('pointermove', e => {
    if (document.body.dataset.screen === 'title') return;
    const k = pickAt(e);
    canvas.style.cursor = k ? 'pointer' : 'default';
    for (const key in chips) chips[key].classList.toggle('hover', key === k);
  });

  // ---------------------------------------------------------------- loop
  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.setViewOffset(w, h, w > 900 ? w * .12 : 0, 0, w, h);   // keep the action left of the guide card
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize);
  const v3 = new THREE.Vector3(), box = new THREE.Box3();
  const clock = new THREE.Clock();
  function tick() {
    const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
    camera.lookAt(camTarget);
    if (S.lit) { outer.scale.set(1 + Math.sin(t * 23) * .05, 1 + Math.sin(t * 17) * .12, 1); glow.intensity = 2 + Math.sin(t * 19) * .3; }
    // boiling: bubbles and steam follow S.boil (0..1)
    const n = Math.floor(BUBBLES * S.boil);
    bubbleState.forEach((b, i) => {
      if (i < n) { b.y += b.v * dt * (0.6 + S.boil); if (b.y > 1.08) { b.y = 0; } }
      tmp.position.set(b.x, i < n ? b.y + .05 : -100, b.z); tmp.scale.setScalar(.6 + b.y * .6); tmp.updateMatrix(); bubbles.setMatrixAt(i, tmp.matrix);
    });
    bubbles.instanceMatrix.needsUpdate = true;
    steam.forEach(s => {
      s.userData.t = (s.userData.t + dt * .25) % 1; const k = s.userData.t;
      s.position.set(Math.sin(k * 6 + s.id) * .3, 1.9 + k * 2.2, Math.cos(k * 5 + s.id) * .2);
      s.scale.setScalar(.6 + k * 1.4); s.material.opacity = S.boil * .22 * Math.sin(k * Math.PI); s.lookAt(camera.position);
    });
    if (stains.length) paintStains();
    // the gold target pulses
    if (S.target) {
      const pulse = .5 + .5 * Math.sin(t * 5);
      objects[S.target].groups.forEach(g => g.traverse(o => { const u = o.userData.outline; if (u) o.scale.setScalar(u.base + Math.max(u.k, .03) * (1.2 + pulse)); }));
      floorRing.material.opacity = .45 + .45 * pulse;
      floorRing.scale.setScalar(floorRing.scale.x);   // keep size
    }
    // labels and the pointing hand follow their objects on screen
    const w = innerWidth, h = innerHeight;
    for (const k in objects) {
      const o = objects[k]; o.group.updateMatrixWorld(); v3.copy(o.anchor); o.group.localToWorld(v3); v3.project(camera);
      const x = (v3.x * .5 + .5) * w, y = (-v3.y * .5 + .5) * h;
      chips[k].style.left = x + 'px'; chips[k].style.top = y + 'px';
      chips[k].style.opacity = v3.z < 1 && x > 0 && x < w * .72 && y > 0 && y < h ? '' : 0;
      if (!pointer.hidden && S.target === k) {
        box.setFromObject(o.group); box.getCenter(v3); v3.project(camera);
        pointer.style.left = (v3.x * .5 + .5) * w + 'px'; pointer.style.top = (-v3.y * .5 + .5) * h + 'px';
      }
    }
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  // ---------------------------------------------------------------- start
  resize(); view('all', true); setStatus('#3f9a3a', 'Leaf: green'); tick();
  $('#start').onclick = () => { document.body.dataset.screen = 'lab'; $('#title').classList.remove('on'); showStep(0); };
  if (EMBED) $('#start').onclick();
  window.LAB = { S, STEPS, FX, tapped, showStep, objects, setTarget };   // for testing
})();
