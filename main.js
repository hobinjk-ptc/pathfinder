import AStar from './AStar.js';
import CanvasRenderer from './CanvasRenderer.js';
import Field from './Field.js';

const width = 800;
const height = 480;

const renderer = new CanvasRenderer(width, height);

const field = new Field(width, height);
const start = field.getNode(10, field.height / 2);
start.tag = 'S';
const goal = field.getNode(field.width - 10, field.height / 2);
goal.tag = 'G';
field.buildNodeNeighborGraph();

const aStar = new AStar(field, start, goal);
let path = aStar.search();
for (let node of path) {
  if (node.tag === 'V') {
    node.tag = 'P';
  }
}

renderer.drawField(field);
