export default class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  isHeapy(i) {
    const li = i * 2 + 1;
    const ri = i * 2 + 2;
    if (li >= this.heap.length) {
      return true;
    }
    const left = this.heap[li];
    const right = this.heap[ri];
    if (this.heap[i].key > left.key) {
      return false;
    }
    if (right && this.heap[i].key > right.key) {
      return false;
    }
    return this.isHeapy(li) && this.isHeapy(ri);
  }

  pop() {
    if (this.heap.length === 1) {
      return this.heap.pop().node;
    }
    const min = this.heap[0];
    if (!min) {
      return null;
    }
    let i = 0;
    this.heap[0] = this.heap.pop();

    while (i < this.heap.length) {
      const li = i * 2 + 1;
      const ri = i * 2 + 2;
      if (li >= this.heap.length) {
        break;
      }
      const left = this.heap[li];
      const right = this.heap[ri];
      if (!left && !right) {
        break;
      }
      if (!right || left.key <= right.key) {
        if (this.heap[i].key <= left.key) {
          break;
        }
        this.heap[li] = this.heap[i];
        this.heap[i] = left;
        i = li;
      } else {
        if (this.heap[i].key <= right.key) {
          break;
        }
        this.heap[ri] = this.heap[i];
        this.heap[i] = right;
        i = ri;
      }
    }
    return min.node;
  }

  insert(node, key) {
    this.update(node, key);
  }

  insertNew(node, key) {
    let i = this.heap.length;
    let value = {key, node};
    this.heap.push(value);
    while (i > 0) {
      const pi = (i - 1) >> 1;
      const parent = this.heap[pi];
      if (value.key >= parent.key) {
        break;
      }

      this.heap[pi] = value;
      this.heap[i] = parent;
      i = pi;
    }
  }

  update(node, key) {
    let i;
    for (i = 0; i < this.heap.length; i++) {
      let value = this.heap[i];
      if (value.node.id === node.id) {
        if (value.key <= key) {
          return;
        }
        break;
      }
    }
    if (i >= this.heap.length) {
      this.insertNew(node, key);
      return;
    }
    this.heap[i].key = key;
    while (i > 0) {
      const pi = (i - 1) >> 1;
      const parent = this.heap[pi];
      if (key >= parent.key) {
        break;
      }

      this.heap[pi] = this.heap[i];
      this.heap[i] = parent;
      i = pi;
    }
  }
}

