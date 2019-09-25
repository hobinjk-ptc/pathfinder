export default class Node {
  constructor(field, x, y) {
    this.field = field;
    this.x = x;
    this.y = y;
    this.id = y * this.field.width + x;
    this.pred = null;
    this.tag = '';
  }

  neighbors() {
    const neighbors = [];
    for (let dy = -1; dy < 2; dy++) {
      for (let dx = -1; dx < 2; dx++) {
        if (dx === 0 && dy === 0) {
          continue;
        }
        const nx = this.x + dx;
        const ny = this.y + dy;
        if (nx < 0 || nx >= this.field.width) {
          continue;
        }
        if (ny < 0 || ny >= this.field.height) {
          continue;
        }
        neighbors.push(this.field.getNode(nx, ny));
      }
    }
    return neighbors;
  }
}

