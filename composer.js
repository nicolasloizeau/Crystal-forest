import * as THREE from "three";
import { LoopSubdivision } from "./LoopSubdivision.js";
import { randint, random_choice, fxrand } from "./tools.js";

export function buildscene(palette, n, l, hmax, width, sigma, iter) {
  const scene = new THREE.Scene();

  // add the ground
  var geometry = new THREE.BoxGeometry(l, 1, l);
  geometry = LoopSubdivision.modify(geometry, 0, { split: false });
  var material = new THREE.MeshStandardMaterial({
    color: palette[0],
    shadowSide: 2,
    side: 2,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.position.set(0, 0, 0);
  scene.add(mesh);

  // add the shapes
  for (var i = 0; i < n; i++) {
    var pos = [fxrand() - 0.5, 0, fxrand() - 0.5];
    for (var k = 0; k < 10; k++) {
      pos[k] *= l;
    }
    var w = fxrand() * 2 * width;
    var h =
      fxrand() *
        Math.exp(-(pos[0] * pos[0] + pos[2] * pos[2]) / l / sigma / sigma) *
        hmax +
      2;
    if (fxrand() > 0.95) {
      h *= 1.5;
    }
    var geometry = new THREE.BoxGeometry(w, h, w);
    if (iter == -1) {
      var iterations = randint(2);
    } else {
      var iterations = iter;
    }
    geometry = LoopSubdivision.modify(geometry, iterations, { split: false });
    var material = new THREE.MeshStandardMaterial({
      color: random_choice(palette),
      shadowSide: 2,
      side: 2,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.position.set(...pos);
    scene.add(mesh);
  }
  return scene;
}
