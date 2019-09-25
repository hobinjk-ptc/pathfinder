import AStar from './AStar.js';
import Field from './Field.js';

const field = new Field(8, 8);
const start = field.getNode(0, field.height - 2);
start.tag = 'S';

const goal = field.getNode(field.width - 1, field.height - 2);
goal.tag = 'G';

const aStar = new AStar(field, start, goal);
let path = aStar.search();
for (let node of path) {
  if (node.tag === 'V') {
    node.tag = 'P';
  }
}
console.log(aStar.field.debug());
