import * as THREE from "three";

import fs from "./fragment.glsl";
import * as tools from "./tools.js";

import vertexShader from "./vertex.glsl";

export class PencilLinesMaterial extends THREE.ShaderMaterial {
  constructor(colors) {
    var fs2 = fs.replace("BGCOLOR", tools.format_color(colors["bg"]));
    fs2 = fs2.replace("LINECOLOR", tools.format_color(colors["line"]));
    fs2 = fs2.replace("LINECOLOR", tools.format_color(colors["line"]));
    fs2 = fs2.replace("LINECOLOR", tools.format_color(colors["line"]));
    fs2 = fs2.replace("FRAMECOLOR", tools.format_color(colors["frame"]));
    super({
      uniforms: {
        tDiffuse: { value: null },
        uNormals: { value: null },
        uTexture: { value: null },
        uResolution: {
          value: new THREE.Vector2(1, 1),
        },
      },
      fragmentShader: fs2,
      vertexShader: vertexShader,
    });
  }
}
