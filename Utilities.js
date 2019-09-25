function lineSegmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
  let u = - ((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
  return 0 <= t && t <= 1 && 0 <= u && u <= 1;
}

export {
  lineSegmentsIntersect
}

