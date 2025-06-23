import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer";
import { RenderPass } from "three/addons/postprocessing/RenderPass";
import { FilmPass } from "three/addons/postprocessing/FilmPass";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { PencilLinesPass } from "./PencilLinesPass";
import { randint } from "./tools.js";
import * as settings from "./settings.js";

export function renderdraw(scene, colors, pos) {
  var w = Math.min(window.innerWidth, window.innerHeight) / settings.ratio;
  var h = Math.min(window.innerWidth, window.innerHeight);
  console.log("renderdraw", w, h, settings.ratio);
  var canvas = document.getElementById("canvas");

  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);

  camera.position.x = pos[0];
  camera.position.y = pos[1];
  camera.position.z = pos[2];

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.castShadow = true;
  directionalLight.position.set(2, 2, 2);
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  const hemisphereLight = new THREE.HemisphereLight(0x7a3114, 0x48c3ff, 0.5);
  scene.add(hemisphereLight);

  const renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true,
    antialias: true,
    canvas: document.getElementById("canvas"),
  });

  renderer.setClearColor("#eee");

  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.CineonToneMapping;
  renderer.toneMappingExposure = 2.5;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(w, h);

  document.body.appendChild(renderer.domElement);

  const composer = new EffectComposer(renderer);
  composer.renderTarget1.texture.encoding = THREE.sRGBEncoding;
  composer.renderTarget2.texture.encoding = THREE.sRGBEncoding;
  const renderPass = new RenderPass(scene, camera);
  const pencilLinePass = new PencilLinesPass({
    width: renderer.domElement.clientWidth,
    height: renderer.domElement.clientHeight,
    scene,
    camera,
    colors,
  });

  composer.addPass(renderPass);
  composer.addPass(pencilLinePass);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.target.set(0, pos[3], 0); // set the z coordinate of the center

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    composer.render();
  }

  animate();
}
