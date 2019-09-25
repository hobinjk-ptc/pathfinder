import CellType from './CellType.js';
import Node from './Node.js';

export default class Field {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cells = new Array(width * height);
    this.nodes = new Array(width * height);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.cells[y * width + x] = CellType.EMPTY;
        if (x === 4 && y > 3) {
          this.cells[y * width + x] = CellType.WALL;
        }
        this.nodes[y * width + x] = null;
      }
    }
  }

  getNode(x, y) {
    if (this.nodes[y * this.width + x]) {
      return this.nodes[y * this.width + x];
    }
    const node = new Node(this, x, y);
    this.nodes[y * this.width + x] = node;
    return node;
  }

  getCellType(x, y) {
    return this.cells[y * this.width + x];
  }

  cost(to, from) {
    if (this.getCellType(from.x, from.y) === CellType.WALL ||
        this.getCellType(to.x, to.y) === CellType.WALL) {
      return 10000;
    }
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const cost = Math.sqrt(dx * dx + dy * dy);
    return cost;
  }

  debug() {
    let out = '';
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const i = y * this.width + x;
        if (this.cells[i] === CellType.WALL) {
          out += 'W';
        } else if (this.nodes[i]) {
          out += this.nodes[i].tag || 'N';
        } else {
          out += ' ';
        }
      }
      out += '\n';
    }
    return out;
  }
}
