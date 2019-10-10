/* global THREE */

const postVertShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const postFragShader = `
#include <packing>
varying vec2 vUv;
uniform sampler2D tDepth;
uniform sampler2D tDiffuse;
uniform float cameraNear;
uniform float cameraFar;
float readDepth(sampler2D depthSampler, vec2 coord) {
  float fragCoordZ = texture2D(depthSampler, coord).x;
  float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
  return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
}
void main() {
  float alphy = texture2D(tDiffuse, vUv).a;
  float depth = readDepth(tDepth, vUv);
  gl_FragColor.rgb = 1.0 - vec3(depth);
  gl_FragColor.a = alphy;
}`;

const width = 950 * 2;
const height = 560 * 2;

const aspect = width / height;
const camera = new THREE.PerspectiveCamera(15, aspect, 82, 87);
// let scale = 17;
// const camera = new THREE.OrthographicCamera(-scale, scale, -scale / aspect, scale / aspect, 1, 20);
camera.position.x = 1.5;
camera.position.y = 1;
camera.position.z = 85;
// camera.position.z = 10;
// camera.rotateZ(90 / 360 * 2 * Math.PI)
camera.rotateZ(-90 / 360 * 2 * Math.PI)

var scene = new THREE.Scene();
scene.add(camera);

function onProgress(xhr) {
  if (xhr.lengthComputable) {
    var percentComplete = xhr.loaded / xhr.total * 100;
    console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');
  }
}
function onError() {}
var object;
var loader = new THREE.STLLoader();
var material = new THREE.MeshBasicMaterial({color: 0xaaaaaa});

function run(callback) {
  loader.load('./please.stl', function(obj) {
    console.log('in business');
    object = new THREE.Mesh(obj, material); // .scene;
    // object.rotateX(Math.PI / 2);
    object.rotateX(-Math.PI / 2);
    // object.traverse(function(child) {
    //   if (child.isMesh) {
    //     child.material = material;
    //   }
    // });
    scene.add(object);
    render(callback);
  }, onProgress, onError);
}

var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);

function render(callback) {
  renderer.setRenderTarget(target);
  renderer.render(scene, camera);
  renderer.setRenderTarget(coolerTarget);
  renderer.render(postScene, postCamera);
  readDepthData(callback);
}

const coolerTarget = new THREE.WebGLRenderTarget(width, height);
  // Rendering depth from THREE's depth texture example
const target = new THREE.WebGLRenderTarget(width, height);
target.texture.format = THREE.RGBAFormat;
target.texture.minFilter = THREE.NearestFilter;
target.texture.magFilter = THREE.NearestFilter;
target.texture.generateMipmaps = false;
target.stencilBuffer = false;
target.depthBuffer = true;
target.depthTexture = new THREE.DepthTexture();
target.depthTexture.type = THREE.UnsignedShortType;

// Setup post processing stage
const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
var postMaterial = new THREE.ShaderMaterial({
  vertexShader: postVertShader,
  fragmentShader: postFragShader,
  uniforms: {
    cameraNear: {value: camera.near},
    cameraFar: {value: camera.far},
    tDepth: {value: target.depthTexture},
    tDiffuse: {value: target.texture},
  },
});
var postPlane = new THREE.PlaneBufferGeometry(2, 2);
var postQuad = new THREE.Mesh(postPlane, postMaterial);
const postScene = new THREE.Scene();
postScene.add(postQuad);

const cvs = document.createElement('canvas');
cvs.width = width;
cvs.height = height;
cvs.style.width = `${width}px`;
cvs.style.height = `${height}px`;
const coolGfx = cvs.getContext('2d');

const buf = new ArrayBuffer(width * height * 4);
let tester = 110;
let tx = 100, ty = 330, tw = 1180, th = 650;

function readDepthData(callback) {
  const array = new Uint8Array(buf);
  renderer.readRenderTargetPixels(renderer.getRenderTarget(), 0, 0, width, height, array);
  const pix = new Uint32Array(buf);
  for (let y = 0; y < height / 2; y++) {
    for (let x = 0; x < width; x++) {
      let t = pix[y * width + x]
      pix[y * width + x] = pix[(height - 1 - y) * width + x];
      pix[(height - 1 - y) * width + x] = t;
    }
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let v = array[(y * width + x) * 4 + 0];
      for (let i = 0; i < 3; i++) {
        if ((v < tester && v > 1) || v > 220) {
          array[(y * width + x) * 4 + i] = 0;
        } else {
          array[(y * width + x) * 4 + i] = 255;
        }
      }
      array[(y * width + x) * 4 + 3] = 255;
    }
  }
  coolGfx.fillStyle = 'black';
  coolGfx.fillRect(0, 0, width, height);
  coolGfx.putImageData(new ImageData(new Uint8ClampedArray(buf), width, height), 0, 0);

  const canvas = document.createElement('canvas');
  canvas.width = tw;
  canvas.height = th;
  canvas.style.width = `${tw}px`;
  canvas.style.height = `${th}px`;
  const coolestGfx = canvas.getContext('2d');
  coolestGfx.putImageData(coolGfx.getImageData(tx, ty, tw, th), 0, 0);
  // document.body.appendChild(canvas);
  callback(coolestGfx);
}

export default run;
