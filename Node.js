export default class Node {
  constructor(field, x, y) {
    this.field = field;
    this.x = x;
    this.y = y;
    this.id = field.key(x, y);
    this.pred = null;
    this.tag = '';
    this.neighbors = [];
  }
}

