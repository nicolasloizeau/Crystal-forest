export function fxrand() {
  // return $fx.rand();
  return Math.random();
}

export function randint(max) {
  return Math.floor(fxrand() * max);
}

export function weighted_random(items, weights) {
  let w = [...weights];
  var i;
  for (i = 0; i < w.length; i++) w[i] += w[i - 1] || 0;
  var random = fxrand() * w[w.length - 1];
  for (i = 0; i < w.length; i++) if (w[i] > random) break;
  return items[i];
}

export function random_choice(items) {
  var weights = new Array(items.length).fill(1);
  return weighted_random(items, weights);
}

export function inner(u, v) {
  var k = 0;
  for (var i = 0; i < 3; i++) {
    k += u[i] * v[i];
  }
  return k;
}

export function dist(u, v) {
  var w = diff(u, v);
  return Math.sqrt(inner(w, w));
}
export function diff(u, v) {
  var w = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    w[i] = u[i] - v[i];
  }
  return w;
}

export function randp(w) {
  var u = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    u[i] = (fxrand() - 0.5) * w;
  }
  return u;
}

export function basicgraph() {
  var nodes = [
    [0, 0, 0],
    [0, -1, 0],
    [1, 1, 0],
    [-1, 1, 0],
    [2, 1, 0],
    [-1, 2, -1.5],
    [-1, 2, 1.5],
  ];
  var edges = [
    [0, 1],
    [0, 2],
    [0, 3],
    [2, 4],
    [3, 5],
    [3, 6],
  ];
  return [nodes, edges];
}

export function normal(mean, std) {
  let u = 1 - fxrand();
  let v = fxrand();
  return (
    Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * std + mean
  );
}

export function normalize(u) {
  return mul(1 / Math.sqrt(inner(u, u)), u);
}

export function mul(k, u) {
  var v = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    v[i] = k * u[i];
  }
  return v;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [
    parseInt(result[1], 16) / 255.0,
    parseInt(result[2], 16) / 255.0,
    parseInt(result[3], 16) / 255.0,
  ];
}

export function format_color(color) {
  var c = hexToRgb(color);
  var c2 = c[0].toString() + "," + c[1].toString() + "," + c[2].toString();
  return c2;
}
