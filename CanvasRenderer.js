export default class CanvasRenderer {
  constructor(width, height, elt) {
    this.width = width;
    this.height = height;
    this.elt = elt || document.querySelector('canvas');
    this.elt.width = width;
    this.elt.height = height;
    this.gfx = this.elt.getContext('2d');
  }

  fillObstacles(field) {
    for (let rect of field.obstacles) {
      this.gfx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
  }
  drawField(field) {
    this.gfx.clearRect(0, 0, this.width, this.height);
    this.gfx.fillStyle = '#993300';
    this.fillObstacles(field);

    function isCool(node) {
      return node.tag === 'P' || node.tag === 'S' || node.tag === 'G';
    }

    for (let node of field.nodes.values()) {
      this.gfx.strokeStyle = 'rgba(255, 0, 255, 0.3)';
      this.gfx.beginPath();
      for (let neigh of node.neighbors) {
        if (isCool(node) && isCool(neigh)) {
          continue;
        }
        this.gfx.moveTo(node.x, node.y);
        this.gfx.lineTo(neigh.x, neigh.y);
      }
      this.gfx.stroke();
    }

    for (let node of field.nodes.values()) {
      if (!isCool(node)) {
        continue;
      }

      this.gfx.strokeStyle = '#ffffff';
      for (let neigh of node.neighbors) {
        if (!isCool(neigh)) {
          continue;
        }
        this.gfx.beginPath();
        this.gfx.moveTo(node.x, node.y);
        this.gfx.lineTo(neigh.x, neigh.y);
        this.gfx.stroke();
      }
    }
    for (let node of field.nodes.values()) {
      if (!isCool(node)) {
        continue;
      }
      if (node.tag === 'P') {
        continue;
      }
      switch (node.tag) {
        case 'S':
          this.gfx.fillStyle = '#0077ff';
          break;
        case 'G':
          this.gfx.fillStyle = '#00ff00';
          break;
        case 'P':
          this.gfx.fillStyle = '#fff';
          break;
        default:
          this.gfx.fillStyle = '#ff7700';
          break;
      }
      this.gfx.beginPath();
      this.gfx.ellipse(node.x, node.y, 8, 8, 0, 0, 2 * Math.PI);
      this.gfx.fill();
    }
  }

  drawPath(path) {
    this.gfx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.gfx.beginPath();
    this.gfx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      this.gfx.lineTo(path[i].x, path[i].y);
    }
    this.gfx.stroke();
  }
}
