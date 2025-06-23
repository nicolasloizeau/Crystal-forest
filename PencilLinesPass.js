import { Pass, FullScreenQuad } from "three/addons/postprocessing/Pass";
import { PencilLinesMaterial } from "./PencilLinesMaterial";
import * as THREE from "three";
import * as tools from "./tools.js";

export class PencilLinesPass extends Pass {
  constructor({ width, height, scene, camera, colors }) {
    super();

    this.scene = scene;
    this.camera = camera;
    this.clearDepth = true;

    this.material = new PencilLinesMaterial(colors);
    this.fsQuad = new FullScreenQuad(this.material);

    const normalBuffer = new THREE.WebGLRenderTarget(width, height);

    normalBuffer.texture.format = THREE.RGBAFormat;
    normalBuffer.texture.type = THREE.HalfFloatType;
    normalBuffer.texture.minFilter = THREE.NearestFilter;
    normalBuffer.texture.magFilter = THREE.NearestFilter;
    normalBuffer.texture.generateMipmaps = false;
    normalBuffer.stencilBuffer = false;
    normalBuffer.texture.encoding = THREE.sRGBEncoding;
    this.normalBuffer = normalBuffer;

    this.normalMaterial = new THREE.MeshNormalMaterial();

    this.material.uniforms.uResolution.value = new THREE.Vector2(width, height);
  }

  dispose() {
    this.material.dispose();
    this.fsQuad.dispose();
  }

  render(renderer, writeBuffer, readBuffer) {
    renderer.setRenderTarget(this.normalBuffer);
    const overrideMaterialValue = this.scene.overrideMaterial;

    this.scene.overrideMaterial = this.normalMaterial;
    renderer.render(this.scene, this.camera);
    this.scene.overrideMaterial = overrideMaterialValue;

    this.material.uniforms.uNormals.value = this.normalBuffer.texture;
    this.material.uniforms.tDiffuse.value = readBuffer.texture;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
      this.fsQuad.render(renderer);
    }
  }
}
