export default class PriorityQueue {
  constructor() {
    this.queue = new Map();
  }

  pop() {
    let min = null;
    for (const value of this.queue.values()) {
      if (!min || value.key < min.key) {
        min = value;
      }
    }
    if (!min) {
      return null;
    }
    this.queue.delete(min.node.id);
    return min.node;
  }

  contains(node) {
    this.queue.remove(node.id);
  }

  insert(node, key) {
    if (this.queue.has(node.id)) {
      this.queue.get(node.id).key = key;
    } else {
      this.queue.set(node.id, {
        node,
        key,
      });
    }
  }

  keys() {
    return Array.from(this.queue.keys());
  }
}

