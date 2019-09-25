import PriorityQueue from './PriorityQueue.js';

export default class AStar {
  constructor(field, start, goal) {
    this.field = field;
    this.start = start;
    this.goal = goal;
  }

  h(node) {
    return Math.abs(node.x - this.start.x) + Math.abs(node.y - this.start.y);
  }

  reconstructPath(end) {
    const path = [end];
    while (path[path.length - 1].pred) {
      path.push(path[path.length - 1].pred);
    }
    return path;
  }

  search() {
    const openSet = new PriorityQueue();
    const closedSet = new Set();
    const g = new Map();

    openSet.insert(this.start, this.h(this.start));
    g.set(this.start.id, 0);

    // eslint-disable-next-line
    while (true) {
      console.log('========================== NEW STEP =========================');
      console.log(this.field.debug());
      const current = openSet.pop();
      if (!current) {
        return;
      }
      if (current.id === this.goal.id) {
        return this.reconstructPath(current);
      }
      current.tag = 'V';

      closedSet.add(current.id);

      current.neighbors().forEach(neighbor => {
        if (closedSet.has(neighbor.id)) {
          return;
        }
        if (!g.has(current.id)) {
          return;
        }
        let newG = g.get(current.id) + this.field.cost(current, neighbor);
        if (!g.has(neighbor.id) || newG < g.get(neighbor)) {
          neighbor.pred = current;
          g.set(neighbor.id, newG);
          openSet.insert(neighbor, newG + this.h(neighbor));
        }
      });
    }
  }
}
