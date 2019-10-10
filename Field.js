import Node from './Node.js';
import {lineSegmentsIntersect} from './Utilities.js';

export default class Field {
  constructor(width, height, obstacleGfx) {
    this.width = width;
    this.height = height;
    this.obstacles = [];
    this.nodes = new Map();
    const obs = obstacleGfx.getImageData(0, 0, width, height).data;
    this.obs = obs;

    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        let w = 8;
        let h = 8;
        if (obs[(y * width + x) * 4] > 127) {
          this.obstacles.push({
            x: x - w / 2,
            y: y - h / 2,
            width: w,
            height: h,
          });
        }
      }
    }

    for (let x = 0; x < this.width; x += 10) {
      for (let y = 0; y < this.height; y += 10) {
        let dx = Math.round((Math.random() - 0.5) * 10);
        let dy = Math.round((Math.random() - 0.5) * 10);
        if (obs[(y * width + x) * 4] < 127) {
          this.getNode(x + dx, y + dy);
        }
      }
    }
  }

  lineIntersectsObstacle(startX, startY, endX, endY) {
    for (const obstacle of this.obstacles) {
      const lX = obstacle.x;
      const tY = obstacle.y;
      const rX = obstacle.x + obstacle.width;
      const bY = obstacle.y + obstacle.height;
      const anyIntersect =
        lineSegmentsIntersect(startX, startY, endX, endY, lX, tY, rX, tY) ||
        lineSegmentsIntersect(startX, startY, endX, endY, rX, tY, rX, bY) ||
        lineSegmentsIntersect(startX, startY, endX, endY, rX, bY, lX, bY) ||
        lineSegmentsIntersect(startX, startY, endX, endY, lX, bY, lX, tY);
      if (anyIntersect) {
        return true;
      }
    }
    return false;
  }

  pointInsideObstacle(x, y) {
    for (const obstacle of this.obstacles) {
      const lX = obstacle.x;
      const tY = obstacle.y;
      const rX = obstacle.x + obstacle.width;
      const bY = obstacle.y + obstacle.height;
      if (x > lX && x < rX && y > tY && y < bY) {
        return true;
      }
    }
    return false;
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
