import AStar from './AStar.js';
import CanvasRenderer from './CanvasRenderer.js';
import Field from './Field.js';
import stlToDepthImage from './stlToDepthImage.js'

const width = 1180;
const height = 650;

const renderer = new CanvasRenderer(width, height);

//const field = new Field(width, height);
//const start = field.getNode(10, field.height / 2);
//start.tag = 'S';
//const goal = field.getNode(field.width - 10, field.height / 2);
//goal.tag = 'G';
//field.buildNodeNeighborGraph();

// const aStar = new AStar(field, start, goal);
// let path = aStar.search();
// for (let node of path) {
//   if (node.tag === 'V') {
//     node.tag = 'P';
//   }
// }

// renderer.drawField(field);

function start(obstacleGfx) {
  const field = new Field(width, height, obstacleGfx);
  const coolX = 733;
  const coolY = 215;
  for (let dx = -10; dx <= 10; dx += 2) {
    for (let dy = -10; dy <= 10; dy += 2) {
      field.getNode(coolX + dx, coolY + dy);
    }
  }
  field.buildNodeNeighborGraph();

  renderer.gfx.fillStyle = 'black';
  // renderer.fillObstacles(field);
  // renderer.drawField(field);
  let id = obstacleGfx.getImageData(0, 0, width, height);
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

  function frame() {
    const nodes = Array.from(field.nodes.values());
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

  frame();
}

stlToDepthImage(function(gfx) {
  gfx.clearRect(0, 0, width, height);
  gfx.drawImage(document.querySelector('img'), 0, 0);
  console.log('this will work', gfx);
  start(gfx);
});
