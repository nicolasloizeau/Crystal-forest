import * as THREE from "three";
import * as composer from "./composer.js";
import { renderdraw } from "./renderer.js";
import { random_choice } from "./tools.js";

const palette = [
  {
    bg: "#A3CEF1",
    line: "#000000",
    frame: "#000000",
    shapes: ["#CEB598", "#E16D56"],
  },
  {
    bg: "#1F1F23",
    line: "#000000",
    frame: "#000000",
    shapes: ["#FA7E61"],
  },
  {
    bg: "#1F1F23",
    line: "#000000",
    frame: "#000000",
    shapes: ["#F7B05B", "#FFD085", "#F7934C"],
  },
  {
    bg: "#BCEBCB",
    line: "#000000",
    frame: "#000000",
    shapes: ["#B392AC", "#E8C2CA", "#F7D1CD"],
  },
  {
    bg: "#91C7B1",
    line: "#000000",
    frame: "#000000",
    shapes: ["#EC9F05", "#C3423F", "#643549"],
  },
  {
    bg: "#FFFFFF",
    line: "#000000",
    frame: "#000000",
    shapes: ["#FFFFFF"],
  },
];

// n, l, hmax, width, sigma, iter
const views = [
  {
    name: "flat city",
    par: [3000, 70, 20, 2, 2, -1],
    pos: [30, 5, 30, 0],
  },
  {
    name: "square mountain",
    par: [3000, 50, 100, 2, 1, 0],
    pos: [-22, 4, 22, 15],
  },
  {
    name: "city plate",
    par: [1000, 60, 60, 2, 2, -1],
    pos: [43, 10, -45, 4],
  },
  {
    name: "city plate 2",
    par: [1000, 60, 60, 2, 2, -1],
    pos: [43, 10, 45, 4],
  },
  {
    name: "crystals",
    par: [4000, 90, 100, 2, 2, 1],
    pos: [45, 2, 45, 12],
  },
  {
    name: "crystals 2",
    par: [4000, 90, 100, 2, 2, 1],
    pos: [-50, 5, 20, 15],
  },
  {
    name: "crystal reflection",
    par: [4000, 90, 100, 2, 2, 1],
    pos: [0, 0, 100, 0],
  },
  {
    name: "explosion",
    par: [3000, 90, 100, 2, 2, 1],
    pos: [0, 50, 0, 0],
  },
  {
    name: "explosion 2",
    par: [3000, 70, 60, 2, 2, -1],
    pos: [0, 55, 0, 0],
  },
];

var colors = random_choice(palette);
var view = random_choice(views);
console.log(view["name"]);

var scene = composer.buildscene(colors["shapes"], ...view["par"]);
renderdraw(scene, colors, view["pos"]);

const canvas = document.getElementById("canvas");

function downloadCanvasImage(canvas, filename = "canvas-image.png") {
  const dataURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

downloadCanvasImage(canvas);
