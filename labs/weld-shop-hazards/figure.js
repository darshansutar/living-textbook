/* The welding-area corner for the lab "Make the welding area safe" (ITI Fitter Module 4, Episode 1, concept 1).
   Drawn in code as a flat isometric scene in the workbench look: a dark floor slab, two low walls, the arc welding machine,
   a bench with a plate and soapstone, cotton waste, electrode stubs, a steel bin, an extinguisher bracket. No text in the drawing.
   Sets window.FIG_SVG (the picture) and window.FIG_DATA (camera views and the anchor of every part). */
(function () {
  "use strict";
  var S = 44, OX = 500, OY = 150, CX = 0.866 * S, CY = 0.5 * S;
  function P(x, y, z) { return [OX + (x - y) * CX, OY + (x + y) * CY - z * S]; }
  function pts(list) { return list.map(function (p) { var q = P(p[0], p[1], p[2]); return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" "); }
  function poly(list, fill, cls, extra) { return '<polygon class="sh ' + (cls || "") + '" fill="' + fill + '" points="' + pts(list) + '"' + (extra || "") + '/>'; }
  function line(list, stroke, w, cls, extra) {
    return '<polyline class="' + (cls || "ln") + '" fill="none" stroke="' + stroke + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round" points="' + pts(list) + '"' + (extra || "") + '/>';
  }
  // a box: top, +y (left) face, +x (right) face
  function box(x, y, z, w, d, h, c, cls, extra) {
    var x1 = x + w, y1 = y + d, z1 = z + h;
    return poly([[x, y1, z], [x1, y1, z], [x1, y1, z1], [x, y1, z1]], c.left, cls, extra) +
           poly([[x1, y, z], [x1, y1, z], [x1, y1, z1], [x1, y, z1]], c.right, cls, extra) +
           poly([[x, y, z1], [x1, y, z1], [x1, y1, z1], [x, y1, z1]], c.top, cls, extra);
  }
  function ringPts(cx, cy, rx, ry, z, n, wob) {
    var o = [];
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2, k = 1 + (wob ? wob * Math.sin(a * 3 + 1) : 0);
      o.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k, z]);
    }
    return o;
  }
  // a circle drawn on the face x = const or y = const
  function faceCircleX(x, yc, zc, r, n) { var o = []; for (var i = 0; i < (n || 20); i++) { var a = i / (n || 20) * Math.PI * 2; o.push([x, yc + Math.cos(a) * r, zc + Math.sin(a) * r]); } return o; }
  function cylinder(cx, cy, z, r, h, c, cls, extra) {
    // the half of the side that faces the viewer (angles -45 deg .. 135 deg, contiguous), then the top disc
    var top = ringPts(cx, cy, r, r, z + h, 24), up = [], i;
    for (i = 0; i <= 12; i++) { var a = (-45 + i * 15) * Math.PI / 180; up.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z + h]); }
    var low = up.map(function (p) { return [p[0], p[1], z]; }).reverse();
    return poly(up.concat(low), c.side, cls, extra) + poly(top, c.top, cls, extra);
  }

  var INK = "#14100d";
  var C = {
    floor: { top: "#5c564f", left: "#3b3733", right: "#46423d" },
    wall: { left: "#46504c", right: "#566059" },
    machine: { top: "#b3b9b4", left: "#6b726e", right: "#8e958f" },
    steel: { top: "#9aa1a4", left: "#5e6568", right: "#7b8286" },
    bench: { top: "#8c8f8c", left: "#585d5e", right: "#70767a" },
    rust: { top: "#9a5a33", left: "#6d3d22", right: "#84492a" },
    bin: { side: "#7b8184", top: "#2b2c2d" },
    ext: { side: "#c23b2c", top: "#d9564a" },
    stone: { top: "#f2ead2", left: "#cfc6ac", right: "#e0d8be" },
    navy: { top: "#2f3b57", left: "#222b41", right: "#2a3550" },
    mustard: { top: "#e3b73a", left: "#b88f26", right: "#d0a42f" }
  };

  var out = [];
  var anchors = {};
  function anchor(id, x, y, z) { var p = P(x, y, z); anchors[id] = [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10]; }

  /* ---- room: floor slab and two low walls ---- */
  var FW = 11.4, FD = 8;
  out.push('<g class="layer-back">');
  out.push(poly([[0, 0, -0.5], [FW, 0, -0.5], [FW, FD, -0.5], [0, FD, -0.5]], "#1d1a17", "noedge"));
  // slab sides and top
  out.push(poly([[0, FD, -0.5], [FW, FD, -0.5], [FW, FD, 0], [0, FD, 0]], C.floor.left));
  out.push(poly([[FW, 0, -0.5], [FW, FD, -0.5], [FW, FD, 0], [FW, 0, 0]], C.floor.right));
  out.push(poly([[0, 0, 0], [FW, 0, 0], [FW, FD, 0], [0, FD, 0]], C.floor.top));
  // floor joints (concrete bays)
  for (var gx = 2.85; gx < FW; gx += 2.85) out.push(line([[gx, 0, 0], [gx, FD, 0]], "#4a453f", 1.2));
  for (var gy = 2.67; gy < FD; gy += 2.67) out.push(line([[0, gy, 0], [FW, gy, 0]], "#4a453f", 1.2));
  // walls (3.4 high) with a grey-green skirting band
  out.push(poly([[0, 0, 0], [0, FD, 0], [0, FD, 3.4], [0, 0, 3.4]], C.wall.right));
  out.push(poly([[0, 0, 0], [FW, 0, 0], [FW, 0, 3.4], [0, 0, 3.4]], C.wall.left));
  out.push(poly([[0, 0, 0], [0, FD, 0], [0, FD, 1.1], [0, 0, 1.1]], "#3a4340", "noedge"));
  out.push(poly([[0, 0, 0], [FW, 0, 0], [FW, 0, 1.1], [0, 0, 1.1]], "#323a38", "noedge"));
  // daylight opening in the right-hand wall (shutter light)
  out.push(poly([[8.9, 0, 0], [10.7, 0, 0], [10.7, 0, 2.7], [8.9, 0, 2.7]], "#d8b56a", "noedge"));
  for (var sl = 0.45; sl < 2.7; sl += 0.45) out.push(line([[8.9, 0, sl], [10.7, 0, sl]], "#b8924e", 1.4));
  // empty extinguisher bracket on the right wall (the extinguisher is not placed yet)
  out.push(poly([[3.2, 0, 0.75], [3.7, 0, 0.75], [3.7, 0, 0.9], [3.2, 0, 0.9]], "#2b2d2e"));
  out.push(poly([[3.2, 0, 1.45], [3.7, 0, 1.45], [3.7, 0, 1.6], [3.2, 0, 1.6]], "#2b2d2e"));
  out.push('</g>');

  /* ---- wet patch (floor) ---- */
  var wet = ringPts(3.0, 3.7, 1.45, 0.95, 0.01, 26, 0.12);
  out.push('<g data-hit="wet" data-part="wet"><polygon class="wetpool" fill="#5b8fa8" fill-opacity=".72" stroke="#a9d2e4" stroke-width="1.4" points="' + pts(wet) + '"/>' +
    line([[2.4, 3.5, 0.02], [3.0, 3.45, 0.02], [3.5, 3.6, 0.02]], "#d6edf6", 1.6, "ln") +
    line([[2.6, 3.9, 0.02], [3.2, 3.85, 0.02]], "#d6edf6", 1.2, "ln") +
    '<polygon class="ring" fill="none" points="' + pts(ringPts(3.0, 3.7, 1.9, 1.3, 0.02, 30)) + '"/></g>');
  anchor("wet", 3.0, 3.7, 0.1);

  /* ---- wall socket and power cord ---- */
  out.push(poly([[0, 4.6, 0.7], [0.05, 4.6, 0.7], [0.05, 5.3, 0.7], [0, 5.3, 0.7]], "#222", "noedge"));
  out.push(box(0, 4.55, 0.65, 0.08, 0.8, 0.7, { top: "#d8d4c8", left: "#a9a598", right: "#c4c0b3" }, "", ' data-part="socket"'));
  // connected cord and plug
  out.push('<g data-hit="plug" data-part="cord-on">' +
    line([[0.9, 3.0, 0.45], [1.15, 3.55, 0.05], [0.9, 4.2, 0.05], [0.6, 4.6, 0.3], [0.3, 4.95, 0.95]], "#1b1b1c", 4.2, "cord") +
    box(0.08, 4.8, 0.82, 0.4, 0.3, 0.3, { top: "#2d2d30", left: "#1f1f21", right: "#26262a" }, "") +
    '<ellipse class="ring" fill="none" cx="' + P(0.4, 4.95, 0.9)[0] + '" cy="' + P(0.4, 4.95, 0.9)[1] + '" rx="30" ry="24"/></g>');
  // disconnected: the cord lies on the floor, the plug beside the socket
  out.push('<g data-part="cord-off" style="display:none;opacity:0">' +
    line([[0.9, 3.0, 0.45], [1.2, 3.6, 0.03], [1.9, 4.3, 0.03], [2.2, 5.0, 0.03], [1.75, 5.5, 0.04]], "#1b1b1c", 4.2, "cord") +
    box(1.55, 5.45, 0.02, 0.4, 0.3, 0.3, { top: "#2d2d30", left: "#1f1f21", right: "#26262a" }, "") + '</g>');
  anchor("plug", 0.4, 4.95, 0.9);

  /* ---- the arc welding machine ---- */
  var mx = 0.2, my = 1.0, mw = 1.6, md = 2.0, mh = 2.2, fx = mx + mw;
  out.push('<g data-hit="machine" data-part="machine">' + box(mx, my, 0, mw, md, mh, C.machine, "") +
    // vents on the +y face
    [0.5, 0.8, 1.1, 1.4].map(function (z) { return line([[0.35, my + md, z], [1.45, my + md, z]], "#4d5350", 1.6); }).join("") +
    '<polygon class="ring" fill="none" points="' + pts(ringPts(1.0, 2.0, 2.0, 1.7, 0.02, 30)) + '"/></g>');
  // dial on the +x face
  out.push('<g data-hit="dial" data-part="dial">' + poly(faceCircleX(fx + 0.01, 1.6, 1.5, 0.42), "#e9e4d2", "") +
    '<g class="needle">' + line([[fx + 0.02, 1.6, 1.5], [fx + 0.02, 1.38, 1.7]], "#a8321f", 2.2) + '</g></g>');
  // two cable sockets
  out.push(poly(faceCircleX(fx + 0.01, 1.35, 0.7, 0.2), "#1d1f20", "") + poly(faceCircleX(fx + 0.01, 1.95, 0.7, 0.2), "#1d1f20", ""));
  // lamp
  out.push('<g data-part="lamp">' + poly(faceCircleX(fx + 0.01, 2.55, 2.0, 0.11, 12), "#46d17a", "lamp-on") + poly(faceCircleX(fx + 0.01, 2.55, 2.0, 0.11, 12), "#26382b", "lamp-off", ' style="display:none"') + '</g>');
  // the switch: a rocker; on = upper half raised
  out.push('<g data-hit="switch" data-part="switch">' +
    box(fx, 2.3, 1.15, 0.16, 0.55, 0.7, { top: "#2b2b2d", left: "#1d1d1f", right: "#242426" }, "") +
    '<g class="rock-on">' + poly([[fx + 0.17, 2.34, 1.5], [fx + 0.17, 2.82, 1.5], [fx + 0.17, 2.82, 1.82], [fx + 0.17, 2.34, 1.82]], "#e8e2cf", "") + '</g>' +
    '<g class="rock-off" style="display:none">' + poly([[fx + 0.17, 2.34, 1.18], [fx + 0.17, 2.82, 1.18], [fx + 0.17, 2.82, 1.5], [fx + 0.17, 2.34, 1.5]], "#8c3322", "") + '</g>' +
    '<ellipse class="ring" fill="none" cx="' + P(fx + 0.17, 2.58, 1.5)[0] + '" cy="' + P(fx + 0.17, 2.58, 1.5)[1] + '" rx="40" ry="34"/></g>');
  anchor("machine", 1.0, 2.0, 2.3);
  anchor("switch", fx + 0.2, 2.58, 1.5);
  anchor("dial", fx, 1.6, 1.5);

  /* ---- spark (wrong choice) and trainee ---- */
  var sp = P(fx + 0.4, 1.7, 0.9), sparkSvg = "";
  for (var k = 0; k < 10; k++) { var a = k / 10 * Math.PI * 2, r1 = 8, r2 = 24 + (k % 2) * 12; sparkSvg += '<line x1="' + (sp[0] + Math.cos(a) * r1).toFixed(1) + '" y1="' + (sp[1] + Math.sin(a) * r1).toFixed(1) + '" x2="' + (sp[0] + Math.cos(a) * r2).toFixed(1) + '" y2="' + (sp[1] + Math.sin(a) * r2).toFixed(1) + '" stroke="#ffd34d" stroke-width="3" stroke-linecap="round"/>'; }
  out.push('<g data-part="spark" style="display:none;opacity:0">' + sparkSvg + '</g>');

  var tx = 3.7, ty = 3.1;
  var tr = '<g data-part="trainee" style="display:none;opacity:0">' +
    box(tx, ty + 0.05, 0, 0.2, 0.2, 0.95, C.navy, "") + box(tx + 0.34, ty + 0.05, 0, 0.2, 0.2, 0.95, C.navy, "") +
    box(tx - 0.05, ty - 0.02, 0.95, 0.65, 0.45, 0.85, C.mustard, "") +
    box(tx - 0.2, ty + 0.1, 1.15, 0.18, 0.18, 0.6, C.mustard, "") +
    '<ellipse class="sh" fill="#b57b4e" cx="' + P(tx + 0.27, ty + 0.2, 2.3)[0] + '" cy="' + P(tx + 0.27, ty + 0.2, 2.3)[1] + '" rx="15" ry="17"/>' +
    '<path class="sh" fill="#16110e" d="M' + (P(tx + 0.27, ty + 0.2, 2.3)[0] - 15) + " " + (P(tx + 0.27, ty + 0.2, 2.3)[1] - 4) + "q15 -26 30 0q-6 -7 -15 -7t-15 7z" + '"/></g>';
  out.push(tr);
  anchor("trainee", tx + 0.27, ty + 0.2, 3.1);

  /* ---- extinguisher: near the bench (placed) or in the store (wrong) ---- */
  function extGroup(x, y, name) {
    var p = P(x, y, 0), top = P(x, y, 1.45);
    return '<g data-hit="ext" data-part="' + name + '" style="display:none;opacity:0">' +
      cylinder(x, y, 0, 0.3, 1.25, C.ext, "") +
      cylinder(x, y, 1.25, 0.15, 0.3, { side: "#2b2d2e", top: "#4a4d4f" }, "") +
      line([[x + 0.05, y + 0.05, 1.5], [x + 0.35, y + 0.25, 1.35], [x + 0.35, y + 0.4, 0.8]], "#1b1b1c", 3.2) +
      '<ellipse class="ring" fill="none" cx="' + p[0] + '" cy="' + p[1] + '" rx="40" ry="22"/></g>';
  }
  out.push(extGroup(3.45, 0.42, "ext-near"));
  out.push(extGroup(10.3, 6.9, "ext-store"));
  anchor("ext", 3.45, 0.42, 1.9);

  /* ---- bench with plate and soapstone ---- */
  var bx = 4.6, by = 0.35, bw = 4.0, bd = 1.7, bh = 1.5;
  var legc = C.steel;
  out.push('<g data-hit="bench" data-part="bench">' +
    box(bx + 0.1, by + 0.1, 0, 0.22, 0.22, bh, legc, "") + box(bx + bw - 0.32, by + 0.1, 0, 0.22, 0.22, bh, legc, "") +
    box(bx + 0.1, by + bd - 0.32, 0, 0.22, 0.22, bh, legc, "") + box(bx + bw - 0.32, by + bd - 0.32, 0, 0.22, 0.22, bh, legc, "") +
    box(bx + 0.1, by + 0.2, 0.45, bw - 0.2, 0.12, 0.12, legc, "") +
    box(bx, by, bh, bw, bd, 0.16, C.bench, "") +
    '<polygon class="ring" fill="none" points="' + pts(ringPts(bx + bw / 2, by + bd / 2, 3.0, 1.5, 0.02, 30)) + '"/></g>');
  anchor("bench", bx + bw / 2, by + bd + 0.2, bh + 0.2);
  var pz = bh + 0.16;
  out.push('<g data-hit="plate" data-part="plate">' + box(5.3, 0.75, pz, 1.7, 0.85, 0.1, { top: "#a1a8ab", left: "#656c70", right: "#82898d" }, "") +
    line([[5.5, 1.18, pz + 0.1], [6.8, 1.18, pz + 0.1]], "#5a3a22", 4.2, "bead") +
    '<g class="hotglow" style="display:none;opacity:0">' + poly([[5.3, 0.75, pz + 0.11], [7.0, 0.75, pz + 0.11], [7.0, 1.6, pz + 0.11], [5.3, 1.6, pz + 0.11]], "#ff7a1a", "noedge", ' fill-opacity=".62"') + '</g>' +
    '<g class="heat" style="display:none;opacity:0">' + [5.7, 6.15, 6.6].map(function (hx, i) { var a = P(hx, 1.2, pz + 0.3), s = ""; return '<path class="hw hw' + i + '" d="M' + a[0].toFixed(1) + " " + a[1].toFixed(1) + "q8 -14 0 -28q-8 -14 0 -28q8 -12 0 -24" + '" fill="none" stroke="#ffb066" stroke-width="3.2" stroke-linecap="round"/>'; }).join("") + '</g>' +
    '<g class="chalk" style="display:none;opacity:0">' + line([[5.9, 0.9, pz + 0.12], [6.4, 1.45, pz + 0.12]], "#fffbe8", 4.5) + line([[6.4, 0.9, pz + 0.12], [5.9, 1.45, pz + 0.12]], "#fffbe8", 4.5) + '</g>' +
    '<g class="fire" style="display:none;opacity:0">' + (function () { var a = P(6.8, 1.55, pz + 0.1); return '<path d="M' + a[0] + " " + a[1] + "q-18 -14 -4 -40q4 12 10 8q6 -16 -2 -30q26 20 18 54q-10 8 -22 8z" + '" fill="#ff7a1a" stroke="#ffd34d" stroke-width="2"/><path d="M' + (a[0] + 2) + " " + (a[1] - 2) + "q-8 -8 -2 -22q8 8 10 22z" + '" fill="#ffd34d"/>'; })() + '</g>' +
    '<polygon class="ring" fill="none" points="' + pts(ringPts(6.15, 1.18, 1.6, 0.9, pz + 0.12, 26)) + '"/></g>');
  anchor("plate", 6.15, 1.18, pz + 0.3);
  out.push('<g data-hit="soap" data-part="soap">' + box(7.7, 1.2, pz, 0.55, 0.28, 0.14, C.stone, "") +
    '<polygon class="ring" fill="none" points="' + pts(ringPts(7.97, 1.34, 0.8, 0.5, pz + 0.16, 24)) + '"/></g>');
  anchor("soap", 7.97, 1.34, pz + 0.3);

  /* ---- cotton waste on the floor beside the bench ---- */
  var cw = ringPts(5.45, 2.85, 0.55, 0.38, 0.05, 18, 0.2);
  out.push('<g data-hit="waste" data-part="waste">' +
    '<polygon class="sh" fill="#e9e2cf" points="' + pts(cw) + '"/>' +
    poly(ringPts(5.55, 2.8, 0.34, 0.24, 0.3, 16, 0.25), "#f4eedb", "") +
    poly(ringPts(5.3, 2.95, 0.22, 0.16, 0.22, 12, 0.2), "#b5a77f", "") +
    line([[5.15, 2.8, 0.1], [5.45, 2.7, 0.2], [5.75, 2.9, 0.1]], "#7a2f1c", 2.6, "ln") +
    '<polygon class="ring" fill="none" points="' + pts(ringPts(5.45, 2.85, 1.0, 0.75, 0.02, 24)) + '"/></g>');
  anchor("waste", 5.45, 2.85, 0.45);

  /* ---- steel bin and electrode stubs ---- */
  out.push('<g data-hit="bin" data-part="bin">' + cylinder(9.3, 3.5, 0, 0.62, 1.15, C.bin, "") +
    '<polygon class="ring" fill="none" points="' + pts(ringPts(9.3, 3.5, 1.1, 0.8, 0.02, 24)) + '"/></g>');
  anchor("bin", 9.3, 3.5, 1.4);
  function stub(x, y, rot) {
    var a = P(x, y, 0.06), b = P(x + Math.cos(rot) * 0.55, y + Math.sin(rot) * 0.55, 0.06);
    return '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="#b9743a" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="' + b[0].toFixed(1) + '" cy="' + b[1].toFixed(1) + '" r="4.2" fill="#ffb347"/>';
  }
  var sp0 = P(6.4, 4.3, 0.06);
  out.push('<g data-hit="stubs" data-part="stubs">' + stub(6.0, 4.1, 0.3) + stub(6.35, 4.35, 1.2) + stub(6.1, 4.65, 0.7) + stub(6.65, 4.15, 2.0) +
    '<polygon class="ring" fill="none" points="' + pts(ringPts(6.4, 4.35, 1.1, 0.8, 0.02, 24)) + '"/></g>');
  anchor("stubs", 6.35, 4.35, 0.4);

  window.FIG_SVG = '<svg xmlns="http://www.w3.org/2000/svg" class="weld-svg" viewBox="0 0 1000 640" role="img" aria-label="A corner of a welding area: an arc welding machine, a bench with a steel plate, a wet patch, cotton waste, electrode stubs and a steel bin.">' +
    '<defs><filter id="soft"><feGaussianBlur stdDeviation="1.2"/></filter></defs>' + out.join("") + '</svg>';

  /* ---- camera views: bounding boxes of world boxes, projected ---- */
  function view(x0, y0, z0, x1, y1, z1, pad) {
    var xs = [], ys = [];
    [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].forEach(function (c) { [z0, z1].forEach(function (z) { var p = P(c[0], c[1], z); xs.push(p[0]); ys.push(p[1]); }); });
    var l = Math.min.apply(null, xs) - pad, t = Math.min.apply(null, ys) - pad, r = Math.max.apply(null, xs) + pad, b = Math.max.apply(null, ys) + pad;
    return [Math.round(l), Math.round(t), Math.round(r - l), Math.round(b - t)];
  }
  window.FIG_DATA = {
    views: {
      all: [60, 40, 880, 600],
      wet: view(0.2, 1.0, 0, 4.6, 5.2, 2.4, 30),
      bench: view(3.0, 0, 0, 8.8, 3.4, 2.6, 30),
      stubs: view(4.6, 2.6, 0, 10.2, 5.2, 1.4, 40),
      machine: view(0, 0.8, 0, 4.4, 5.2, 3.0, 30),
      plate: view(4.8, 0, 0, 8.7, 2.2, 3.0, 30)
    },
    anchors: anchors
  };
})();
