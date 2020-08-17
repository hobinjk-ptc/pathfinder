import AStar from './AStar.js';
import CanvasRenderer from './CanvasRenderer.js';
import Field from './Field.js';
import stlToDepthImage from './stlToDepthImage.js'

const width = 1180;
const height = 650;
const darkMode = false;

const renderer = new CanvasRenderer(width, height);

function addCoolNodes(field, coolX, coolY, scaleX, scaleY) {
  for (let dx = -scaleX; dx <= scaleX; dx += 2) {
    for (let dy = -scaleY; dy <= scaleY; dy += 2) {
      field.getNode(coolX + dx, coolY + dy);
    }
  }
  // renderer.gfx.fillStyle = '#995000';
  // renderer.gfx.fillRect(coolX - scaleX, coolY - scaleY, scaleX * 2, scaleY * 2);
}

let field, nodes;

function start(obstacleGfx, baseId) {
  renderer.gfx.fillStyle = 'black';
  // renderer.fillObstacles(field);
  let id = baseId;
  for (let i = 0; i < id.data.length / 4; i++) {
    if (id.data[4 * i] > 127) {
      id.data[4 * i + 0] = 0;
      id.data[4 * i + 1] = 0;
      id.data[4 * i + 2] = 0;
      id.data[4 * i + 3] = 127;
    } else {
      id.data[4 * i + 0] = 0;
      id.data[4 * i + 1] = 0;
      id.data[4 * i + 2] = 0;
      id.data[4 * i + 3] = 0;
    }
  }
  renderer.gfx.putImageData(id, 0, 0);

  if (darkMode === true) {
    setTimeout(() => {
      renderer.gfx.fillStyle = 'black';
      renderer.gfx.fillRect(0, 0, width, height);
    }, 1000);
  }

  field = new Field(width, height, obstacleGfx);
  addCoolNodes(field, 733, 215, 10, 10);
  addCoolNodes(field, 914, 264, 8, 10);
  addCoolNodes(field, 920, 288, 12, 12);
  addCoolNodes(field, 929, 310, 16, 8);
  field.buildNodeNeighborGraph();
  nodes = Array.from(field.nodes.values());

  // renderer.drawField(field);
  frame();
}

function frame() {
  for (let node of nodes) {
    node.pred = null;
  }

  const start = nodes[Math.floor(Math.random() * nodes.length)];
  const goal = nodes[Math.floor(Math.random() * nodes.length)];

  if (goal === start) {
    requestAnimationFrame(frame);
    return;
  }
  const aStar = new AStar(field, start, goal);
  const path = aStar.search();
  if (path) {
    renderer.drawPath(path);
  }
  requestAnimationFrame(frame);
}
window.frame = frame;


stlToDepthImage(function(gfx) {
  gfx.clearRect(0, 0, width, height);
  gfx.drawImage(document.querySelector('img.middleground'), 0, 0);
  const baseId = gfx.getImageData(0, 0, width, height)
  gfx.clearRect(0, 0, width, height);
  gfx.drawImage(document.querySelector('img.coolest'), 0, 0);
  start(gfx, baseId);
});
