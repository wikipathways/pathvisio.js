SVG.G = function() {
  this.constructor.call(this, SVG.create('g'))
}

// Inherit from SVG.Container
SVG.G.prototype = new SVG.Container

//
SVG.extend(SVG.G, {
  // Move over x-axis
  x: function(x) {
    return x == null ? this.trans.x : this.transform('x', x)
  }
  // Move over y-axis
, y: function(y) {
    return y == null ? this.trans.y : this.transform('y', y)
  }
})

//
SVG.extend(SVG.Container, {
  // Create a group element
  group: function() {
    return this.put(new SVG.G)
  }
  
})