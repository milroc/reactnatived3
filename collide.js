'use strict';

var d3 = require('d3');
// quad is d3.geom.quadtree, while not explicitly necessary, it's a good
// practice.

function collide(width, height, node) {
  var r = node.radius + 16,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = node.radius + quad.point.radius;
      if (l < r) {
        l = (l - r) / l * .5;
        if (x * l < width || x * l > 0) node.x -= x *= l;
        if (y * l < height || x * l > 0) node.y -= y *= l;
        if (x * l < width || x * l > 0) quad.point.x += x;
        if (y * l < height || x * l > 0) quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}

module.exports = collide;
