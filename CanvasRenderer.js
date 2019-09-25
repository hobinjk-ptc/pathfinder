export default class CanvasRenderer {
  constructor(width, height, elt) {
    this.width = width;
    this.height = height;
    this.elt = elt || document.querySelector('canvas');
    this.elt.width = width;
    this.elt.height = height;
    this.gfx = this.elt.getContext('2d');
  }

  drawField(field) {
    this.gfx.clearRect(0, 0, this.width, this.height);
    this.gfx.fillStyle = '#993300';
    for (let rect of field.obstacles) {
      this.gfx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }

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
}
