import Node from './Node.js';

export default class Field {
  constructor(width, height, obstacleGfx) {
    this.width = width;
    this.height = height;
    this.obstacles = [];
    this.nodes = new Map();
    const obs = obstacleGfx.getImageData(0, 0, width, height).data;
    this.obs = obs;

    for (let x = 0; x < this.width; x += 6) {
      for (let y = 0; y < this.height; y += 6) {
        let dx = Math.round((Math.random() - 0.5) * 4);
        let dy = Math.round((Math.random() - 0.5) * 4);
        let bad = false;
        for (let ix = x + dx - 8; ix < x + dx + 9; ix++) {
          for (let iy = y + dy - 8; iy < y + dy + 9; iy++) {
            if (this.pointInsideObstacle(ix, iy)) {
              bad = true;
              break;
            }
          }
          if (bad) {
            break;
          }
        }
        if (bad) {
          continue;
        }
        this.getNode(x + dx, y + dy);
      }
    }
  }

  lineIntersectsObstacle(startX, startY, endX, endY) {
    let minX = Math.min(startX, endX);
    let maxX = Math.max(startX, endX);
    let minY = Math.min(startY, endY);
    let maxY = Math.max(startY, endY);
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        // This is wrong
        if (this.pointInsideObstacle(x, y)) {
          return true;
        }
      }
    }
    return false;
  }

  pointInsideObstacle(x, y) {
    return this.obs[(y * this.width + x) * 4] > 127;
  }

  buildNodeNeighborGraph() {
    const nodes = Array.from(this.nodes.values());
    for (let i = 0; i < nodes.length; i++) {
      const iNode = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const jNode = nodes[j];
        if (this.cost(iNode, jNode) > 40) {
          continue;
        }
        if (this.lineIntersectsObstacle(iNode.x, iNode.y, jNode.x, jNode.y)) {
          continue;
        }
        iNode.neighbors.push(jNode);
        jNode.neighbors.push(iNode);
      }
    }
  }

  key(x, y) {
    return Math.floor(y * this.width + x);
  }

  getNode(x, y) {
    const key = this.key(x, y);
    if (this.nodes.has(key)) {
      return this.nodes.get(key);
    }
    const node = new Node(this, x, y);
    if (this.pointInsideObstacle(x, y)) {
      return node;
    }
    this.nodes.set(key, node);
    return node;
  }

  cost(to, from) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const cost = Math.sqrt(dx * dx + dy * dy);
    return cost;
  }
}
