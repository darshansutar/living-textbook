/* SCIENCE SAMPLE, Starling 'focus' look (2026-11-25): dark monochrome stage, colour only for meaning, lit-target dimming, light pools.
 * 3D DEMO (2026-11-25): soft shadows + warm lit bench, orbit / zoom, drag-and-place objects, live reactions (soft steam, glow, green wisps).
 * Copy of labs/iodine-test with the same steps and embed contract.
 * Living Textbook - lab prototype: test a leaf for starch (NCERT Class 7 Science, Activity 10.2).
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
  // narration: inside a lesson the player passes the line prefix and the audio folder (?lines=e1_c2_lab_&audio=../../media/audio/)
  const Q = new URLSearchParams(location.search);
  const LINES = Q.get('lines'), AUDIO = Q.get('audio') || 'audio/';
  let voice = null, lastKey = null;
  // language: inside a translated lesson the player passes ?lang=; on-screen text comes from this table (English is the key)
  const LANG = Q.get('lang') || 'en';
  const TEXT = {
    "hi": {
      "Beaker of water": "पानी का बीकर",
      "Spirit lamp": "स्पिरिट लैंप",
      "Test tube with alcohol": "ऐल्कोहॉल वाली परखनली",
      "Bowl of water": "पानी का कटोरा",
      "Plate": "प्लेट",
      "Iodine": "आयोडीन",
      "Leaf from a sunny plant": "धूप वाले पौधे की पत्ती",
      "Light the lamp": "लैंप जलाइए",
      "Tap the spirit lamp": "स्पिरिट लैंप पर टैप कीजिए",
      "Boil the leaf": "पत्ती उबालिए",
      "Tap the leaf on the plate": "प्लेट पर रखी पत्ती पर टैप कीजिए",
      "Be safe with alcohol": "ऐल्कोहॉल से सावधान",
      "Remove the green colour": "हरा रंग निकालिए",
      "Tap the test tube of alcohol": "ऐल्कोहॉल वाली परखनली पर टैप कीजिए",
      "Put out the flame": "लौ बुझाइए",
      "Wash the leaf": "पत्ती धोइए",
      "Tap the bowl of water": "पानी के कटोरे पर टैप कीजिए",
      "Predict": "अनुमान लगाइए",
      "Add iodine": "आयोडीन डालिए",
      "Tap the iodine bottle": "आयोडीन की शीशी पर टैप कीजिए",
      "Stand the test tube of alcohol in the hot water": "ऐल्कोहॉल वाली परखनली को गरम पानी में खड़ा करें",
      "Heat the alcohol directly on the flame": "ऐल्कोहॉल को सीधे लौ पर गरम करें",
      "The leaf stays pale": "पत्ती फीकी ही रहेगी",
      "The leaf turns blue-black": "पत्ती नीली-काली हो जाएगी",
      "The leaf turns brown, like iodine": "पत्ती आयोडीन की तरह भूरी हो जाएगी",
      "Leaf: green": "पत्ती: हरी",
      "Water: boiling": "पानी: उबल रहा है",
      "Leaf: soft and green": "पत्ती: नरम और हरी",
      "Leaf: pale  ·  Alcohol: green": "पत्ती: फीकी  ·  ऐल्कोहॉल: हरा",
      "Flame: off": "लौ: बुझी हुई",
      "Leaf: pale, washed": "पत्ती: फीकी, धुली हुई",
      "Leaf: blue-black  ·  Starch present": "पत्ती: नीली-काली  ·  स्टार्च मौजूद",
      "What we found": "हमने क्या पाया",
      "Lab complete": "लैब पूरी हुई",
      "Tap: ": "टैप करें: ",
      "Next ": "आगे ",
      "Finish ": "पूरा करें ",
      "Show me": "दिखाइए",
      "Hear again": "फिर से सुनिए",
      "Shanta Teacher": "शांता टीचर",
      "Science teacher": "विज्ञान शिक्षिका",
      "Class 7 · Science · Activity 10.2 · Lab": "कक्षा 7 · विज्ञान · क्रियाकलाप 10.2 · लैब",
      "Does a leaf store food?": "क्या पत्ती भोजन जमा करती है?",
      "Test a leaf for starch on the lab bench. Tap what the class tells you to use, step by step.": "लैब की मेज़ पर एक पत्ती में स्टार्च की जाँच कीजिए। कक्षा जो इस्तेमाल करने को कहे, उस पर एक-एक कदम टैप कीजिए।",
      "Start the lab ": "लैब शुरू कीजिए ",
      "We will test a leaf for starch. First we need boiling water. Light the spirit lamp under the beaker.": "हम एक पत्ती में स्टार्च की जाँच करेंगे। पहले हमें उबलता पानी चाहिए। बीकर के नीचे स्पिरिट लैंप जलाइए।",
      "The flame heats the water. Watch the bubbles: the water is boiling.": "लौ पानी को गरम करती है। बुलबुले देखिए: पानी उबल रहा है।",
      "This leaf comes from a plant kept in sunlight. Put it in the boiling water for a few minutes. Boiling softens the leaf.": "यह पत्ती धूप में रखे पौधे से ली गई है। इसे कुछ मिनट उबलते पानी में डालिए। उबालने से पत्ती नरम हो जाती है।",
      "The leaf is soft now.": "पत्ती अब नरम हो गई है।",
      "Next we remove the green colour with alcohol. Alcohol catches fire easily. How should we heat it?": "अब हम ऐल्कोहॉल से हरा रंग निकालेंगे। ऐल्कोहॉल जल्दी आग पकड़ता है। हम इसे कैसे गरम करें?",
      "Yes. The hot water heats the alcohol safely. Alcohol never goes near a flame.": "हाँ। गरम पानी ऐल्कोहॉल को सुरक्षित तरीके से गरम करता है। ऐल्कोहॉल को कभी लौ के पास नहीं ले जाते।",
      "No! Alcohol catches fire easily. Never bring it near a flame. Heat it in hot water instead.": "नहीं! ऐल्कोहॉल जल्दी आग पकड़ता है। इसे कभी लौ के पास मत ले जाइए। इसे गरम पानी में रखकर गरम कीजिए।",
      "Put the leaf in the test tube of alcohol, and stand the tube in the hot water.": "पत्ती को ऐल्कोहॉल वाली परखनली में डालिए, और परखनली को गरम पानी में खड़ा कीजिए।",
      "Look: the green colour moves out of the leaf into the alcohol. The leaf turns pale.": "देखिए: हरा रंग पत्ती से निकलकर ऐल्कोहॉल में आ रहा है। पत्ती फीकी पड़ रही है।",
      "We do not need heat any more. Put out the flame first. Always switch off the flame when you finish heating.": "अब हमें गरमी की ज़रूरत नहीं है। पहले लौ बुझाइए। गरम करने का काम ख़त्म होते ही, हमेशा लौ बुझा दीजिए।",
      "The flame is out. The water stops boiling.": "लौ बुझ गई। पानी का उबलना रुक गया।",
      "Take the pale leaf out and wash it in water. Then lay it flat on the plate.": "फीकी पत्ती को बाहर निकालिए और पानी से धोइए। फिर उसे प्लेट पर सीधा फैला दीजिए।",
      "The washed leaf is on the plate, ready for the test.": "धुली हुई पत्ती प्लेट पर है, जाँच के लिए तैयार।",
      "Iodine is brown. What will the leaf look like? Ask the class and tap the answer most of them chose.": "आयोडीन भूरा होता है। पत्ती कैसी दिखेगी? कक्षा से पूछिए, और ज़्यादातर बच्चों ने जो जवाब चुना, उस पर टैप कीजिए।",
      "Class prediction noted. Let us test it.": "कक्षा का अनुमान दर्ज हो गया। चलिए जाँचते हैं।",
      "Now we find out. Put a few drops of iodine on the leaf.": "अब पता करते हैं। पत्ती पर आयोडीन की कुछ बूँदें डालिए।",
      "The class predicted it! The leaf turned blue-black. Blue-black means starch. The leaf made food and stored it as starch.": "कक्षा का अनुमान सही निकला! पत्ती नीली-काली हो गई। नीला-काला मतलब स्टार्च। पत्ती ने भोजन बनाया और उसे स्टार्च के रूप में जमा किया।",
      "Many of you thought something else. But the leaf turned blue-black. Blue-black means starch. The leaf made food and stored it as starch.": "आप में से बहुतों ने कुछ और सोचा था। पर पत्ती नीली-काली हो गई। नीला-काला मतलब स्टार्च। पत्ती ने भोजन बनाया और उसे स्टार्च के रूप में जमा किया।",
      "The leaf turned blue-black with iodine. So the leaf has starch. Plants make their food in the leaves and store it as starch.": "आयोडीन डालने पर पत्ती नीली-काली हो गई। यानी पत्ती में स्टार्च है। पौधे अपना भोजन पत्तियों में बनाते हैं और उसे स्टार्च के रूप में जमा करते हैं।",
      "Not that one. Look for the object glowing gold.": "वह नहीं। सुनहरी चमकती चीज़ ढूँढिए।"
    }
  };
  const tr = t => (TEXT[LANG] && TEXT[LANG][t]) || t;
  if (LANG !== 'en') {
    document.documentElement.lang = LANG;
    // fixed page text in index.html
    document.querySelectorAll('.kicker, h1, .sub, .who b, .who span, #showme').forEach(el => { el.textContent = tr(el.textContent); });
    const hear = document.querySelector('#hear'); if (hear) hear.title = tr(hear.title);
    [document.querySelector('#start'), document.querySelector('#next')].forEach(b => { if (b && b.firstChild) b.firstChild.textContent = tr(b.firstChild.textContent); });
  }
  if (LINES) document.body.classList.add('voiced');
  function say(key) {
    lastKey = key;
    if (!LINES || !key) return;
    if (voice) { voice.pause(); }
    voice = new Audio(AUDIO + LINES + key + '.mp3');
    voice.play().catch(() => { /* blocked until the teacher taps; Hear again replays */ });
  }

  // ---------------------------------------------------------------- renderer, scene, camera
  const canvas = $('#scene');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0a0a0b');
  scene.fog = new THREE.Fog('#0a0a0b', 20, 36);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const camTarget = new THREE.Vector3();

  scene.add(new THREE.HemisphereLight('#dfe6ee', '#101012', .6));
  const sun = new THREE.DirectionalLight('#eef2f7', 1.9);
  sun.position.set(-5, 11, 7);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0005; sun.shadow.normalBias = .02; sun.shadow.radius = 4;
  Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 8, bottom: -6, near: 1, far: 40 });
  scene.add(sun);
  const rim = new THREE.DirectionalLight('#9bb8ff', .4); rim.position.set(7, 5, -6); scene.add(rim);   // cool rim light from behind
  // a soft radial texture (steam, glow, wisps): no hard geometric edges
  function softTex(inner, outer) {
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, inner); g.addColorStop(1, outer);
    x.fillStyle = g; x.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  const SOFT_WHITE = softTex('rgba(255,255,255,.95)', 'rgba(255,255,255,0)');
  const SOFT_GLOW = softTex('rgba(255,200,110,1)', 'rgba(255,140,40,0)');
  const SOFT_GREEN = softTex('rgba(120,220,90,.95)', 'rgba(60,170,50,0)');

  // toon shading: three flat tones, like the painted lessons
  const ramp = new THREE.DataTexture(new Uint8Array([90, 90, 90, 255, 175, 175, 175, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat);
  ramp.minFilter = ramp.magFilter = THREE.NearestFilter; ramp.needsUpdate = true;
  const toon = (color, extra) => new THREE.MeshToonMaterial(Object.assign({ color, gradientMap: ramp }, extra || {}));
  const OUTLINE = new THREE.MeshBasicMaterial({ color: '#030304', side: THREE.BackSide });
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
    const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: '#dfe8ee', transparent: true, opacity: .2, roughness: .05, metalness: 0, clearcoat: 1, clearcoatRoughness: .05, depthWrite: false, side: THREE.DoubleSide }));
    m.renderOrder = 5;
    const lm = new THREE.MeshBasicMaterial({ color: '#cfd8e0', side: THREE.BackSide, transparent: true, opacity: .5, depthWrite: false }); lm.userData.ownLine = true;
    return outline(m, .025, lm);
  }
  function blob(r, x, z) {  // soft contact shadow
    const m = new THREE.Mesh(new THREE.CircleGeometry(r, 32), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: .14, depthWrite: false }));
    m.rotation.x = -Math.PI / 2; m.position.set(x, .012, z); scene.add(m); return m;
  }

  // ---------------------------------------------------------------- the bench
  const grain = document.createElement('canvas'); grain.width = 512; grain.height = 256; {
    const x = grain.getContext('2d'); x.fillStyle = '#8a5a35'; x.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 90; i++) { const y = Math.random() * 256; x.strokeStyle = `rgba(${Math.random() < .5 ? '60,35,18' : '170,120,72'},${.08 + Math.random() * .12})`; x.lineWidth = .6 + Math.random() * 2.2;
      x.beginPath(); x.moveTo(0, y); x.bezierCurveTo(170, y + (Math.random() - .5) * 14, 340, y + (Math.random() - .5) * 14, 512, y + (Math.random() - .5) * 8); x.stroke(); }
  }
  const grainTex = new THREE.CanvasTexture(grain); grainTex.colorSpace = THREE.SRGBColorSpace; grainTex.wrapS = grainTex.wrapT = THREE.RepeatWrapping;
  const bench = outline(new THREE.Mesh(new THREE.BoxGeometry(15, .6, 7.5), toon('#2b2b2e')), .006);
  bench.position.y = -.3; scene.add(bench);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 16), toon('#3b2d22'));
  wall.position.set(0, 7, -5); wall.visible = false; scene.add(wall);
  const board = outline(new THREE.Mesh(new THREE.BoxGeometry(9, 3.6, .12), toon('#2f5a43')), .01);
  board.position.set(-1, 5.4, -4.9); board.visible = false; scene.add(board);

  const objects = {};   // tappable groups by key
  function tappable(key, group, label, anchor, extra) {
    const groups = [group].concat(extra || []);
    groups.forEach(g => g.traverse(o => { o.userData.key = key; }));
    objects[key] = { group, groups, label: tr(label), anchor: anchor || new THREE.Vector3(0, 1.2, 0) };
    return group;
  }

  // tripod + gauze + beaker of water
  const tripod = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * Math.PI * 2;
    const leg = outline(new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 2.12, 8), toon('#3f4246')), .25);
    leg.position.set(Math.cos(a) * .95, 1.06, Math.sin(a) * .95); leg.rotation.z = Math.cos(a) * .08; leg.rotation.x = -Math.sin(a) * .08;
    tripod.add(leg);
  }
  const ring = outline(new THREE.Mesh(new THREE.TorusGeometry(1, .06, 8, 40), toon('#3f4246')), .2);
  ring.rotation.x = Math.PI / 2; ring.position.y = 2.24; tripod.add(ring);
  const gauze = outline(new THREE.Mesh(new THREE.BoxGeometry(2.3, .04, 2.3), toon('#45484d')), .01);
  gauze.position.y = 2.3; tripod.add(gauze);
  tripod.position.set(-3, 0, 0); scene.add(tripod); blob(1.4, -3, 0);

  const beaker = new THREE.Group();
  beaker.add(glass(lathe([[0, 0], [.85, 0], [.88, .05], [.88, 1.75], [.95, 1.82]])));
  const water = new THREE.Mesh(new THREE.CylinderGeometry(.83, .83, 1.1, 32), new THREE.MeshToonMaterial({ color: '#7a98aa', gradientMap: ramp, transparent: true, opacity: .38, depthWrite: false }));
  water.position.y = .58; water.renderOrder = 4; beaker.add(water);
  beaker.position.set(-3, 2.33, 0); scene.add(beaker);
  tappable('beaker', beaker, 'Beaker of water', new THREE.Vector3(.9, 1.9, 0));

  // spirit lamp
  const lamp = new THREE.Group();
  lamp.add(glass(lathe([[0, 0], [.55, 0], [.6, .3], [.45, .7], [.18, .8]])));
  const fuel = new THREE.Mesh(lathe([[0, .02], [.52, .02], [.56, .3], [.45, .45], [0, .45]]), new THREE.MeshToonMaterial({ color: '#8d8f93', gradientMap: ramp, transparent: true, opacity: .55 }));
  lamp.add(fuel);
  const cap = outline(new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .14, 16), toon('#74777c')), .06); cap.position.y = .86; lamp.add(cap);
  const wick = outline(new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .16, 8), toon('#c9ccd0')), .1); wick.position.y = 1.0; lamp.add(wick);
  const flame = new THREE.Group();
  const outer = new THREE.Mesh(new THREE.ConeGeometry(.17, .62, 16), new THREE.MeshBasicMaterial({ color: '#ffae42', transparent: true, opacity: .62 }));
  const inner = new THREE.Mesh(new THREE.ConeGeometry(.08, .34, 16), new THREE.MeshBasicMaterial({ color: '#fff3b0' }));
  outer.position.y = .31; inner.position.y = .2; flame.add(outer, inner);
  const flameGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: SOFT_GLOW, transparent: true, opacity: .9, depthWrite: false, blending: THREE.AdditiveBlending }));
  flameGlow.scale.setScalar(1.7); flameGlow.position.y = .32; flame.add(flameGlow);
  flame.position.y = 1.08; flame.scale.setScalar(.001); lamp.add(flame);
  const glow = new THREE.PointLight('#ffb35a', 0, 6); glow.position.y = 1.4; lamp.add(glow);
  lamp.position.set(-3, 0, 0); scene.add(lamp);
  tappable('lamp', lamp, 'Spirit lamp', new THREE.Vector3(-.9, 1.0, .6));

  // test tube of alcohol in a wooden rack
  const rack = outline(new THREE.Mesh(new THREE.BoxGeometry(1.6, .5, .7), toon('#3a3b3f')), .02);
  rack.position.set(0, .25, -1.6); scene.add(rack); blob(1, 0, -1.6);
  const tube = new THREE.Group();
  tube.add(glass(lathe([[0, 0], [.1, .01], [.17, .1], [.17, 1.9], [.2, 1.95]], 24)));
  const alcohol = new THREE.Mesh(new THREE.CylinderGeometry(.15, .15, .95, 20), new THREE.MeshToonMaterial({ color: '#cdd8e0', gradientMap: ramp, transparent: true, opacity: .45, depthWrite: false }));
  alcohol.position.y = .55; alcohol.renderOrder = 4; tube.add(alcohol);
  tube.position.set(0, .45, -1.6); scene.add(tube);
  tappable('tube', tube, 'Test tube with alcohol', new THREE.Vector3(0, 2.2, 0));

  // bowl of water
  const bowl = new THREE.Group();
  bowl.add(outline(new THREE.Mesh(lathe([[0, 0], [.7, 0], [.95, .45], [.9, .48], [.65, .06], [0, .06]]), toon('#56585c', { side: THREE.DoubleSide })), .02));
  const bowlWater = new THREE.Mesh(new THREE.CircleGeometry(.84, 32), new THREE.MeshToonMaterial({ color: '#6f95ad', gradientMap: ramp, transparent: true, opacity: .7 }));
  bowlWater.rotation.x = -Math.PI / 2; bowlWater.position.y = .36; bowl.add(bowlWater);
  bowl.position.set(.6, 0, 1.8); scene.add(bowl); blob(1, .6, 1.8);
  tappable('bowl', bowl, 'Bowl of water', new THREE.Vector3(0, .9, 0));

  // white plate
  const plate = new THREE.Group();
  plate.add(outline(new THREE.Mesh(lathe([[0, 0], [1.05, 0], [1.25, .12], [1.2, .14], [1.0, .05], [0, .05]], 48), toon('#5c5e63', { side: THREE.DoubleSide })), .015));
  plate.position.set(3.4, 0, .9); scene.add(plate); blob(1.3, 3.4, .9);
  tappable('plate', plate, 'Plate', new THREE.Vector3(1.15, .3, .3));

  // iodine bottle and its dropper (a glass pipette with a red rubber bulb; no label text)
  const iodine = new THREE.Group();
  iodine.add(outline(new THREE.Mesh(lathe([[0, 0], [.42, 0], [.45, .9], [.22, 1.1], [.2, 1.25]], 24), toon('#47474b')), .03));
  iodine.position.set(5.6, 0, -1.1); scene.add(iodine); blob(.6, 5.6, -1.1);
  const dropper = new THREE.Group();           // origin = the pipette tip
  const pipette = glass(lathe([[0, 0], [.025, 0], [.06, .25], [.07, 1.15], [.08, 1.2]], 16));
  dropper.add(pipette);
  const iodineIn = new THREE.Mesh(new THREE.CylinderGeometry(.045, .02, .5, 12), toon('#8a4512', { transparent: true, opacity: .85 }));
  iodineIn.position.y = .3; dropper.add(iodineIn);
  const bulb = outline(new THREE.Mesh(new THREE.SphereGeometry(.17, 16, 12), toon('#66676b')), .06);
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
  const BUBBLES = 64;
  const bubbles = new THREE.InstancedMesh(new THREE.SphereGeometry(.036, 10, 8), new THREE.MeshBasicMaterial({ color: '#dfe9f0', transparent: true, opacity: .4 }), BUBBLES);
  const bubbleState = Array.from({ length: BUBBLES }, () => ({ x: 0, y: 0, z: 0, v: 0 }));
  const tmp = new THREE.Object3D();
  bubbles.renderOrder = 6; bubbles.frustumCulled = false; beaker.add(bubbles);
  const steam = [];
  for (let i = 0; i < 14; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: SOFT_WHITE, color: '#ffffff', transparent: true, opacity: 0, depthWrite: false }));
    s.userData.t = i / 14; beaker.add(s); steam.push(s);
  }
  // green wisps that leave the leaf and drift into the alcohol
  const wisps = [];
  for (let i = 0; i < 16; i++) {
    const w = new THREE.Sprite(new THREE.SpriteMaterial({ map: SOFT_GREEN, transparent: true, opacity: 0, depthWrite: false }));
    w.scale.setScalar(.34); scene.add(w); wisps.push(w);
  }
  // floating dust motes in the key light: the room feels alive
  const MOTES = 40, moteGeo = new THREE.BufferGeometry(), motePos = new Float32Array(MOTES * 3);
  for (let i = 0; i < MOTES; i++) { motePos[i * 3] = (Math.random() - .5) * 14; motePos[i * 3 + 1] = Math.random() * 7; motePos[i * 3 + 2] = (Math.random() - .5) * 8; }
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
  const motes = new THREE.Points(moteGeo, new THREE.PointsMaterial({ map: SOFT_WHITE, color: '#ffe6bd', size: .12, transparent: true, opacity: .45, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(motes);

  // tap-target marker: a gold ring on the bench under the object to tap
  const floorRing = new THREE.Mesh(new THREE.RingGeometry(.86, 1, 64), new THREE.MeshBasicMaterial({ color: '#f5be73', transparent: true, opacity: 0, depthWrite: false }));
  floorRing.rotation.x = -Math.PI / 2; floorRing.position.y = .02; scene.add(floorRing);

  // real shadows: every solid mesh casts and receives; glass, water, outlines and markers do not
  scene.traverse(o => {
    if (!o.isMesh || o.isInstancedMesh) return;
    const solid = !o.material.transparent && o.material !== OUTLINE && !(o.material.side === THREE.BackSide);
    if (solid) { o.castShadow = true; o.receiveShadow = true; }
  });
  bench.castShadow = false; inner.castShadow = false;
  const WATER_BASE = water.material.color.clone(), WATER_WARM = new THREE.Color('#8fb6cc');

  // ---- lit target: objects a step does not use go dark and grey; the step's objects stay bright (shader uniform per group, fades in ~.4 s)
  const DIM = {}, DIM_AMOUNT = .8;
  const DIMGROUPS = { beaker: [beaker, tripod], lamp: [lamp], tube: [tube, rack], bowl: [bowl], plate: [plate], iodine: [iodine, dropper], leaf: [leaf], bench: [bench] };
  function dimPatch(m, u) {
    if (m.userData.dimmed) return; m.userData.dimmed = true;
    m.onBeforeCompile = sh => {
      sh.uniforms.uDim = u;
      sh.fragmentShader = 'uniform float uDim;\n' + sh.fragmentShader.replace('#include <dithering_fragment>',
        'float dl = dot(gl_FragColor.rgb, vec3(.299, .587, .114)); gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(dl), uDim * .9) * (1.0 - .72 * uDim); gl_FragColor.a *= (1.0 - .5 * uDim);\n#include <dithering_fragment>');
    };
  }
  for (const k in DIMGROUPS) {
    const u = DIM[k] = { value: 0 };
    DIMGROUPS[k].forEach(g => g.traverse(o => {
      if (!o.isMesh || o.isInstancedMesh) return;
      if (o.userData.outline && !o.material.userData.ownLine) return;
      dimPatch(o.material, u);
    }));
  }
  const LIT = [['lamp', 'beaker'], ['leaf', 'plate', 'beaker'], ['tube', 'beaker', 'lamp'], ['tube', 'leaf', 'beaker'], ['lamp', 'beaker'], ['bowl', 'leaf', 'plate'], ['leaf', 'plate'], ['iodine', 'leaf', 'plate']];
  const BENCH_DIM = .4;
  function setLit(keys, instant) {
    for (const k in DIM) {
      const to = k === 'bench' ? BENCH_DIM : (!keys || keys.includes(k)) ? 0 : DIM_AMOUNT;
      if (instant) DIM[k].value = to; else gsap.to(DIM[k], { value: to, duration: .4, ease: 'sine.inOut', overwrite: true });
    }
  }
  for (const k in DIM) DIM[k].value = k === 'bench' ? .55 : .35;   // the title screen is calm and a little dim
  // light pools: one soft pool under the object of the step, one orange pool around the lit lamp
  const mkPool = (map, color) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map, color, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); m.rotation.x = -Math.PI / 2; m.position.y = .018; m.renderOrder = 1; scene.add(m); return m; };
  const pool = mkPool(SOFT_WHITE, '#e8eef6'), flamePool = mkPool(SOFT_GLOW, '#ff9a3c');
  flamePool.position.set(-3, .02, 0); flamePool.scale.set(7, 7, 1);

  // ---------------------------------------------------------------- lab state
  const S = { leafOnPlate: true, tubeUsed: false, dragging: false, lit: false, boil: 0, step: -1, predicted: null, busy: false, target: null, flash: null };
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
  const viewPos = new THREE.Vector3(.8, 7.2, 12.5);
  const orbit = { yaw: 0, pitch: 0, zoom: 1 };   // the student's own rotation and zoom, on top of the guided view
  function view(name, instant, duration) {
    const v = VIEWS[name];
    const d = instant ? 0 : (duration || 1.5);
    gsap.to(viewPos, { x: v.pos[0], y: v.pos[1], z: v.pos[2], duration: d, ease: 'power2.inOut', overwrite: true });
    gsap.to(camTarget, { x: v.at[0], y: v.at[1], z: v.at[2], duration: d, ease: 'power2.inOut', overwrite: true });
  }
  function resetOrbit(d) { gsap.to(orbit, { yaw: 0, pitch: 0, zoom: 1, duration: d == null ? .8 : d, ease: 'power2.inOut', overwrite: true }); }
  const _off = new THREE.Vector3(), _sph = new THREE.Spherical();
  function applyCamera() {
    _off.copy(viewPos).sub(camTarget); _sph.setFromVector3(_off);
    _sph.theta += orbit.yaw; _sph.phi = Math.min(1.5, Math.max(.2, _sph.phi + orbit.pitch)); _sph.radius *= orbit.zoom;
    _off.setFromSpherical(_sph); camera.position.copy(camTarget).add(_off); camera.lookAt(camTarget);
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
      S.leafOnPlate = false;
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
      S.leafOnPlate = false; S.tubeUsed = true;
      later(4.6, () => wisps.forEach((w, i) => {
        const from = leaf.position.clone().add(new THREE.Vector3((Math.random() - .5) * .2, (Math.random() - .5) * .5, (Math.random() - .5) * .2));
        const to = tube.position.clone().add(new THREE.Vector3((Math.random() - .5) * .1, .75 + Math.random() * .7, (Math.random() - .5) * .1));
        w.position.copy(from);
        gsap.timeline({ delay: i * .17 })
          .to(w.material, { opacity: .9, duration: .4 })
          .to(w.position, { x: to.x, y: to.y, z: to.z, duration: 2.2, ease: 'sine.inOut' }, 0)
          .to(w.scale, { x: .6, y: .6, duration: 2.2 }, 0)
          .to(w.material, { opacity: 0, duration: .7 }, 1.9);
      }));
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
      later(5.3, () => { S.leafOnPlate = true; });
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
      // Every tween below is placed at an ABSOLUTE time (t0 + offset). Relative '<' placements used to push the
      // timeline end out by the fade/stain tweens, so the dropper hovered motionless ~1 s after each drop.
      let lastSplash = 0, cursor = tl.duration();   // cursor = when the dropper is free to move on
      world.forEach((p, i) => {
        const drop = new THREE.Mesh(new THREE.SphereGeometry(.075, 16, 12), toon('#8a4512', { transparent: true }));
        drop.scale.setScalar(.01); drop.visible = false; scene.add(drop);
        const ripple = new THREE.Mesh(new THREE.RingGeometry(.08, .11, 32), new THREE.MeshBasicMaterial({ color: '#8a4512', transparent: true, opacity: 0, depthWrite: false }));
        ripple.rotation.x = -Math.PI / 2; ripple.position.set(p.x, p.y + .015, p.z); scene.add(ripple);
        const stain = { lx: spots[i][0], ly: spots[i][1], r: 0, brown: 1 };
        if (i > 0) tl.to(dropper.position, { x: p.x, z: p.z, y: p.y + .95, duration: .5, ease: 'power1.inOut' }, cursor);
        const t0 = i > 0 ? cursor + .5 : cursor;   // the dropper is now above this spot
        const tipY = p.y + .95 - .08;
        // squeeze the bulb; the drop forms at the tip, then lets go and falls with gravity
        tl.to(bulb.scale, { x: .72, z: .72, y: 1.15, duration: .18, ease: 'power2.in' }, t0)
          .call(() => { drop.visible = true; drop.position.set(p.x, tipY, p.z); drop.material.opacity = 1; }, null, t0 + .04)
          .to(drop.scale, { x: 1, y: 1.15, z: 1, duration: .26, ease: 'sine.out' }, t0 + .04)
          .to(bulb.scale, { x: 1, z: 1, y: 1.35, duration: .24, ease: 'power2.out' }, t0 + .2)
          .to(drop.position, { y: p.y + .06, duration: .3, ease: 'power3.in' }, t0 + .3)
          .to(drop.scale, { y: 1.45, x: .85, z: .85, duration: .3, ease: 'power2.in' }, t0 + .3)
          .call(() => { stains.push(stain); }, null, t0 + .6)
          .to(drop.scale, { x: 1.9, y: .22, z: 1.9, duration: .1, ease: 'power2.out' }, t0 + .6)
          .to(drop.position, { y: p.y + .02, duration: .1 }, t0 + .6)
          .fromTo(ripple.scale, { x: .4, y: .4, z: .4 }, { x: 2.6, y: 2.6, z: 2.6, duration: .6, ease: 'power2.out', immediateRender: false }, t0 + .6)
          .fromTo(ripple.material, { opacity: .8 }, { opacity: 0, duration: .6, immediateRender: false }, t0 + .6)
          .to(drop.material, { opacity: 0, duration: .5 }, t0 + .7)
          .to(stain, { r: .1, duration: .4, ease: 'power1.out' }, t0 + .6);
        lastSplash = t0 + .6;
        cursor = t0 + .78;                       // move on right after the splash; the fades finish on their own
      });
      // the dropper goes home while the blue-black spreads out from every drop
      const tHome = lastSplash + .2;
      tl.to(dropper.position, { x: DROPPER_HOME.x, y: 1.75, z: DROPPER_HOME.z, duration: 1.0, ease: 'power2.inOut' }, tHome)
        .to(dropper.position, { y: DROPPER_HOME.y, duration: .5, ease: 'power2.in' }, tHome + 1.0);
      tl.call(() => {
        stains.forEach((s, i) => {
          gsap.to(s, { brown: 0, duration: 1.4, delay: i * .15 });
          gsap.to(s, { r: .75, duration: 3.6, delay: i * .15, ease: 'sine.inOut' });
        });
        tweenColor(ribMat.color, new THREE.Color('#141830'), 3.2, .4);
      }, null, lastSplash + .4);
      return Math.max(tl.duration(), lastSplash + .4 + 3.9) + 1.0;
    },
  };

  // ---------------------------------------------------------------- the activity, as data
  const STEPS = [
    { title: 'Light the lamp', view: 'burner', tap: 'lamp', hint: 'Tap the spirit lamp',
      say: 'We will test a leaf for starch. First we need boiling water. Light the spirit lamp under the beaker.',
      ok: 'The flame heats the water. Watch the bubbles: the water is boiling.', fx: 'lampOn', key: 's1', status: ['#7fb6d6', 'Water: boiling'] },
    { title: 'Boil the leaf', view: 'leafPick', tap: 'leaf', hint: 'Tap the leaf on the plate',
      say: 'This leaf comes from a plant kept in sunlight. Put it in the boiling water for a few minutes. Boiling softens the leaf.',
      ok: 'The leaf is soft now.', fx: 'leafIntoWater', key: 's2', status: ['#4f8a3a', 'Leaf: soft and green'] },
    { title: 'Be safe with alcohol', view: 'rack', choose: true, key: 's3',
      say: 'Next we remove the green colour with alcohol. Alcohol catches fire easily. How should we heat it?',
      options: [
        { text: 'Stand the test tube of alcohol in the hot water', right: true, key: 'optA', say: 'Yes. The hot water heats the alcohol safely. Alcohol never goes near a flame.' },
        { text: 'Heat the alcohol directly on the flame', key: 'optB', say: 'No! Alcohol catches fire easily. Never bring it near a flame. Heat it in hot water instead.' },
      ] },
    { title: 'Remove the green colour', view: 'rack', tap: 'tube', hint: 'Tap the test tube of alcohol',
      say: 'Put the leaf in the test tube of alcohol, and stand the tube in the hot water.',
      ok: 'Look: the green colour moves out of the leaf into the alcohol. The leaf turns pale.', fx: 'tubeAndLeafIntoBath', key: 's4', status: ['#5fbf4a', 'Leaf: pale  ·  Alcohol: green'] },
    { title: 'Put out the flame', view: 'lamp', tap: 'lamp', hint: 'Tap the spirit lamp',
      say: 'We do not need heat any more. Put out the flame first. Always switch off the flame when you finish heating.',
      ok: 'The flame is out. The water stops boiling.', fx: 'lampOff', key: 's5', status: ['#9e9287', 'Flame: off'] },
    { title: 'Wash the leaf', view: 'wash', tap: 'bowl', hint: 'Tap the bowl of water',
      say: 'Take the pale leaf out and wash it in water. Then lay it flat on the plate.',
      ok: 'The washed leaf is on the plate, ready for the test.', fx: 'washAndPlate', key: 's6', status: ['#e9e2b6', 'Leaf: pale, washed'] },
    { title: 'Predict', view: 'plate', predict: true, key: 's7',
      // a prediction never states the rule it tests: the reveal (s8.right / s8.wrong) teaches "blue-black means starch"
      say: 'Iodine is brown. What will the leaf look like? Ask the class and tap the answer most of them chose.',
      options: [{ text: 'The leaf stays pale' }, { text: 'The leaf turns blue-black', right: true }, { text: 'The leaf turns brown, like iodine' }] },
    { title: 'Add iodine', view: 'iodine', tap: 'iodine', hint: 'Tap the iodine bottle',
      say: 'Now we find out. Put a few drops of iodine on the leaf.',
      fx: 'iodineDrops', key: 's8', status: ['#3b4a8a', 'Leaf: blue-black  ·  Starch present'] },
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
      chips[k].innerHTML = on ? `${HAND}<span>${tr('Tap: ')}${objects[k].label}</span>` : `<span>${objects[k].label}</span>`;
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
    const st = $('#status'); st.querySelector('i').style.background = color; st.querySelector('i').style.color = color; st.querySelector('span').textContent = tr(text);
  }
  function progress() {
    const p = $('#progress'); p.innerHTML = '';
    STEPS.forEach((s, i) => { const li = document.createElement('li'); li.className = i < S.step ? 'done' : i === S.step ? 'now' : ''; p.appendChild(li); });
    $('#stepno').textContent = S.step < STEPS.length ? (LANG === 'hi' ? `चरण ${S.step + 1} / ${STEPS.length}` : `Step ${S.step + 1} of ${STEPS.length}`) : tr('Lab complete');
  }
  function feedback(text, kind) {
    card.fb.hidden = !text; card.fb.textContent = tr(text || ''); card.fb.className = kind || '';
  }
  function showStep(i) {
    S.step = i; progress();
    const st = STEPS[i];
    card.title.textContent = tr(st.title); card.say.textContent = tr(st.say);
    feedback(''); card.next.hidden = true; showPointer(false);
    card.hint.hidden = !st.tap; card.hinttext.textContent = tr(st.hint || '');
    card.choices.hidden = !(st.choose || st.predict); card.choices.innerHTML = '';
    if (st.options) st.options.forEach((o, k) => {
      const b = document.createElement('button'); b.className = 'opt'; b.innerHTML = `<b>${'ABC'[k]}</b><span>${tr(o.text)}</span>`;
      b.onclick = () => pick(k); card.choices.appendChild(b);
    });
    setTarget(st.tap || null);
    setLit(LIT[i]); S.poolKey = st.tap || LIT[i][0];
    resetOrbit(.9); view(st.view);
    say(st.key + '_say');
    if (st.tap) armIdle();
  }
  function pick(k) {
    const st = STEPS[S.step]; const btns = [...card.choices.children];
    if (st.predict) {   // the class's prediction: no right or wrong yet, the iodine will show it
      S.predicted = k;
      btns.forEach((b, j) => { b.classList.toggle('picked', j === k); b.classList.toggle('dim', j !== k); });
      feedback('Class prediction noted. Let us test it.', ''); say(st.key + '_pick');
      card.next.hidden = false; return;
    }
    const o = st.options[k];
    btns.forEach((b, j) => { b.classList.remove('right', 'miss', 'dim'); if (st.options[j].right) b.classList.add('right'); else if (j === k) b.classList.add('miss'); else b.classList.add('dim'); });
    feedback(o.say, o.right ? 'good' : 'bad'); say(st.key + '_' + o.key);
    if (o.right) card.next.hidden = false;
  }
  function done(st) {
    let text = st.ok || '';
    if (st.fx === 'iodineDrops') {
      const p = STEPS[6].options[S.predicted ?? 0];
      text = (p && p.right ? 'The class predicted it! ' : 'Many of you thought something else. But ') +
             (p && p.right ? 'The leaf turned blue-black.' : 'the leaf turned blue-black.') + ' Blue-black means starch. The leaf made food and stored it as starch.';
      say(st.key + (p && p.right ? '_right' : '_wrong'));
    } else {
      say(st.key + '_ok');
    }
    feedback(text, 'good');
    if (st.status) setStatus(st.status[0], st.status[1]);
    card.next.hidden = false;
    card.next.firstChild.textContent = tr(S.step === STEPS.length - 1 ? 'Finish ' : 'Next ');
  }
  function tapped(key) {
    const st = STEPS[S.step];
    if (!st || !st.tap || S.busy) return;
    if (key !== st.tap) {
      feedback('Not that one. Look for the object glowing gold.', 'bad'); say('miss');
      flashWrong(key); pointer.hidden = false;
      return;
    }
    S.busy = true; showPointer(false); card.hint.hidden = true; setTarget(null);
    feedback('', '');
    resetOrbit(.8);
    const wait = tidy() ? 700 : 150;   // tidy the bench so the action meets the objects where it expects them
    setTimeout(() => { const t = FX[st.fx](); setTimeout(() => { S.busy = false; done(st); }, t * 1000); }, wait);
  }
  card.next.onclick = () => {
    if (S.step < STEPS.length - 1) showStep(S.step + 1);
    else finish();
  };
  $('#hear').onclick = () => { if (lastKey) say(lastKey); };
  $('#showme').onclick = () => { if (S.target) { pointer.hidden = false; view(STEPS[S.step].view, false, .8); } };
  function finish() {
    S.step = STEPS.length; progress();
    card.title.textContent = tr('What we found');
    card.say.textContent = tr('The leaf turned blue-black with iodine. So the leaf has starch. Plants make their food in the leaves and store it as starch.');
    say('end');
    card.hint.hidden = true; card.choices.hidden = true; feedback('', '');
    const inLesson = EMBED && window.parent !== window;
    card.next.hidden = false; card.next.firstChild.textContent = inLesson ? 'Continue ' : 'Do it again ';
    if (inLesson) window.parent.postMessage({ lt: 'lab-done', lab: 'iodine-test' }, '*');
    // inside a lesson the button moves the lesson on; on its own the lab starts over
    card.next.onclick = inLesson ? () => window.parent.postMessage({ lt: 'lab-next', lab: 'iodine-test' }, '*') : () => location.reload();
    setLit(['leaf', 'plate']); S.poolKey = 'plate';
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
  // draggable bench items and where they live; the guided action tidies them back first, so every step still plays correctly
  const DRAG = {
    bowl: { homes: [[bowl, new THREE.Vector3(.6, 0, 1.8)]] },
    plate: { homes: [[plate, new THREE.Vector3(3.4, 0, .9)]], rider: () => S.leafOnPlate && leaf },
    iodine: { homes: [[iodine, new THREE.Vector3(5.6, 0, -1.1)], [dropper, DROPPER_HOME.clone()]] },
    tube: { homes: [[tube, new THREE.Vector3(0, .45, -1.6)]], locked: () => S.tubeUsed },
  };
  function tidy() {
    let moved = false;
    for (const k in DRAG) DRAG[k].homes.forEach(([g, p]) => { if (g.position.distanceTo(p) > .02) { moved = true; gsap.to(g.position, { x: p.x, y: p.y, z: p.z, duration: .6, ease: 'power2.inOut', overwrite: true }); } });
    if (S.leafOnPlate && leaf.position.distanceTo(LEAF_ON_PLATE.pos) > .02) { moved = true; gsap.to(leaf.position, { x: LEAF_ON_PLATE.pos.x, y: LEAF_ON_PLATE.pos.y, z: LEAF_ON_PLATE.pos.z, duration: .6, ease: 'power2.inOut', overwrite: true }); }
    return moved;
  }
  const benchPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hitP = new THREE.Vector3();
  function planePoint(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera);
    return ray.ray.intersectPlane(benchPlane, hitP) ? hitP.clone() : null;
  }
  const ptrs = new Map(); let gesture = null, pinch0 = 0, zoom0 = 1;
  canvas.addEventListener('pointerdown', e => {
    if (document.body.dataset.screen === 'title') return;
    canvas.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); zoom0 = orbit.zoom; gesture = { mode: 'pinch' }; return; }
    const key = pickAt(e), d = key && (DRAG[key] || (key === 'leaf' && S.leafOnPlate && DRAG.plate));   // the leaf on the plate carries the plate
    gesture = { x0: e.clientX, y0: e.clientY, key, mode: 'press', drag: d && !(d.locked && d.locked()) && !S.busy ? d : null };
  });
  canvas.addEventListener('pointermove', e => {
    if (document.body.dataset.screen === 'title') return;
    if (ptrs.has(e.pointerId)) {
      const prev = ptrs.get(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (gesture && gesture.mode === 'pinch' && ptrs.size === 2) { const [a, b] = [...ptrs.values()]; orbit.zoom = Math.min(1.7, Math.max(.45, zoom0 * pinch0 / Math.max(10, Math.hypot(a.x - b.x, a.y - b.y)))); return; }
      if (gesture && gesture.mode === 'press' && Math.hypot(e.clientX - gesture.x0, e.clientY - gesture.y0) > 6) {
        if (gesture.drag) {   // lift the object off the bench and carry it
          gesture.mode = 'drag'; S.dragging = true; if (idle) idle.kill();
          const p = planePoint(e); gesture.last = p;
          gesture.drag.homes.forEach(([g]) => gsap.to(g.position, { y: '+=.35', duration: .18, ease: 'power2.out', overwrite: 'auto' }));
          canvas.style.cursor = 'grabbing';
        } else { gesture.mode = 'orbit'; canvas.style.cursor = 'move'; }
      }
      if (gesture && gesture.mode === 'orbit') { orbit.yaw -= (e.clientX - prev.x) * .006; orbit.pitch -= (e.clientY - prev.y) * .005; return; }
      if (gesture && gesture.mode === 'drag') {
        const p = planePoint(e); if (!p || !gesture.last) return;
        const dx = p.x - gesture.last.x, dz = p.z - gesture.last.z; gesture.last = p;
        const g0 = gesture.drag.homes[0][0], nx = Math.max(-6.8, Math.min(6.8, g0.position.x + dx)), nz = Math.max(-3, Math.min(3.3, g0.position.z + dz));
        const ddx = nx - g0.position.x, ddz = nz - g0.position.z;
        gesture.drag.homes.forEach(([g]) => { g.position.x += ddx; g.position.z += ddz; });
        const rider = gesture.drag.rider && gesture.drag.rider(); if (rider) { rider.position.x += ddx; rider.position.z += ddz; }
        return;
      }
      return;
    }
    const k = pickAt(e);
    canvas.style.cursor = k ? (DRAG[k] || (k === 'leaf' && S.leafOnPlate) ? 'grab' : 'pointer') : 'default';
    for (const key in chips) chips[key].classList.toggle('hover', key === k);
  });
  function endPtr(e) {
    if (!ptrs.has(e.pointerId)) return; ptrs.delete(e.pointerId);
    const g = gesture; if (ptrs.size) return; gesture = null;
    if (!g) return;
    if (g.mode === 'press') tapped(g.key);   // a press without movement is a tap
    else if (g.mode === 'drag') {            // set it down again, with a little settle
      S.dragging = false; canvas.style.cursor = 'grab';
      g.drag.homes.forEach(([o]) => gsap.to(o.position, { y: '-=.35', duration: .35, ease: 'bounce.out', overwrite: 'auto' }));
      if (S.target) armIdle();
    } else canvas.style.cursor = 'default';
  }
  canvas.addEventListener('pointerup', endPtr); canvas.addEventListener('pointercancel', endPtr);
  canvas.addEventListener('wheel', e => { if (document.body.dataset.screen === 'title') return; e.preventDefault(); orbit.zoom = Math.min(1.7, Math.max(.45, orbit.zoom * Math.exp(e.deltaY * .0012))); }, { passive: false });
  $('#reset').onclick = () => resetOrbit(.7);

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
    applyCamera();
    if (S.lit) {
      outer.scale.set(1 + Math.sin(t * 23) * .05, 1 + Math.sin(t * 17) * .12 + Math.sin(t * 41) * .04, 1); outer.rotation.y = t * 3;
      glow.intensity = 2.4 + Math.sin(t * 19) * .35 + Math.sin(t * 7.3) * .2; flameGlow.material.opacity = .75 + Math.sin(t * 13) * .15; flameGlow.scale.setScalar(1.7 + Math.sin(t * 11) * .12);
    }
    // light pools follow the step's object; the lamp pool breathes with the flame
    if (S.poolKey && objects[S.poolKey]) {
      box.setFromObject(objects[S.poolKey].group); box.getCenter(v3); const sz = box.getSize(new THREE.Vector3());
      pool.position.x += (v3.x - pool.position.x) * Math.min(1, dt * 6); pool.position.z += (v3.z - pool.position.z) * Math.min(1, dt * 6);
      const s = Math.max(sz.x, sz.z) * 2.2 + 2.2; pool.scale.set(s, s, 1);
    }
    pool.material.opacity += ((S.poolKey ? .22 : 0) - pool.material.opacity) * Math.min(1, dt * 4);
    flamePool.material.opacity += ((S.lit ? .55 + Math.sin(t * 13) * .08 : 0) - flamePool.material.opacity) * Math.min(1, dt * 3);
    motes.rotation.y = t * .02; motes.position.y = Math.sin(t * .4) * .15;
    // the water shivers and warms as it boils
    water.scale.y = 1 + S.boil * .025 * Math.sin(t * 14); water.material.color.copy(WATER_BASE).lerp(WATER_WARM, S.boil * .25);
    // boiling: bubbles and steam follow S.boil (0..1)
    const n = Math.floor(BUBBLES * S.boil);
    bubbleState.forEach((b, i) => {
      if (i < n) { b.y += b.v * dt * (0.6 + S.boil); if (b.y > 1.08) { b.y = 0; } }
      tmp.position.set(b.x, i < n ? b.y + .05 : -100, b.z); tmp.scale.setScalar(.6 + b.y * .6); tmp.updateMatrix(); bubbles.setMatrixAt(i, tmp.matrix);
    });
    bubbles.instanceMatrix.needsUpdate = true;
    steam.forEach(s => {
      s.userData.t = (s.userData.t + dt * .25) % 1; const k = s.userData.t;
      s.position.set(Math.sin(k * 6 + s.id) * .3 + k * .25, 1.9 + k * 2.4, Math.cos(k * 5 + s.id) * .2);
      s.scale.setScalar(.7 + k * 1.9); s.material.opacity = S.boil * .3 * Math.sin(k * Math.PI);
    });
    if (stains.length) paintStains();
    // the gold target pulses
    if (S.target) {
      const pulse = .5 + .5 * Math.sin(t * 5);
      objects[S.target].groups.forEach(g => g.traverse(o => { const u = o.userData.outline; if (u) o.scale.setScalar(u.base + Math.max(u.k, .03) * (1.2 + pulse)); }));
      floorRing.material.opacity = .45 + .45 * pulse;
      box.setFromObject(objects[S.target].group); box.getCenter(v3); floorRing.position.set(v3.x, .02, v3.z);   // follows the object if it was moved
    }
    // labels and the pointing hand follow their objects on screen
    const w = innerWidth, h = innerHeight;
    for (const k in objects) {
      const o = objects[k]; o.group.updateMatrixWorld(); v3.copy(o.anchor); o.group.localToWorld(v3); v3.project(camera);
      const x = (v3.x * .5 + .5) * w, y = (-v3.y * .5 + .5) * h;
      chips[k].style.left = x + 'px'; chips[k].style.top = y + 'px';
      chips[k].style.opacity = v3.z < 1 && x > 0 && x < w * .72 && y > 0 && y < h && (S.target === k || chips[k].classList.contains('hover')) ? '' : 0;
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
  let started = false;
  $('#start').onclick = () => {
    if (started) return; started = true;
    document.body.dataset.screen = 'lab'; $('#title').classList.remove('on'); showStep(0);
    if (EMBED && window.parent !== window) window.parent.postMessage({ lt: 'lab-started', lab: 'iodine-test' }, '*');
  };
  // inside a lesson the lab also opens on its intro; the lesson's Next (lab-start) or Start begins it
  if (EMBED && window.parent !== window) {
    window.addEventListener('message', e => { if (e.source === window.parent && e.data && e.data.lt === 'lab-start') $('#start').onclick(); });
    window.parent.postMessage({ lt: 'lab-intro', lab: 'iodine-test' }, '*');
  }
  window.LAB = { S, STEPS, FX, tapped, showStep, objects, setTarget, bubbles, bubbleState, orbit, camera, viewPos, camTarget, steam, DRAG, tidy, resetOrbit, DIM, setLit, pool };   // for testing
})();
