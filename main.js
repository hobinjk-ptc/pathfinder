import AStar from './AStar.js';
import CanvasRenderer from './CanvasRenderer.js';
import Field from './Field.js';

const width = 800;
const height = 480;

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

const field = new Field(width, height);
field.buildNodeNeighborGraph();

renderer.gfx.fillStyle = 'black';
renderer.fillObstacles(field);

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
