pathvisio.pathway.edge.point = function(){ 

  // pathvisio.js vs PathVisio (Java) specification of anchor position
  // -----------------------------------------
  // pathvisio.js |  PathVisio  | Meaning
  //  relX | relY | relx | rely |
  // -----------------------------------------
  // 0.333   0      -0.5   -1.0   top side at left third-point 
  // 0.5     0       0.0   -1.0   top side at center 
  // 0.667   0       0.5   -1.0   top side at right third-point 
  // 1       0.333   1.0   -0.5   right side at top third-point 
  // 1       0.5     1.0    0.0   right side at middle 
  // 1       0.667   1.0    0.5   right side at bottom third-point 
  // 0.667   1       0.5    1.0   bottom side at right third-point 
  // 0.5     1       0.0    1.0   bottom side at center 
  // 0.333   1      -0.5    1.0   bottom side at left third-point 
  // 0       0.667  -1.0    0.5   left side at bottom third-point 
  // 0       0.5    -1.0    0.0   left side at middle 
  // 0       0.333  -1.0   -0.5   left side at top third-point 
  //
  // PathVisio (Java) also sometimes comes up with other values for relx and rely.
  // I don't know what those mean.

  var anchorPositionMappings = { "-1":0, "-0.5":0.333, "0":0.5, "0.5":0.667, "1":1 };

  // GPML to jGPML shape name mappings: { "OldName":"new-name" }
  // replace spaces with dashes
  // Add dashes before every capital letter except any capital letters at the beginning of the string
  // Replace spaces with dashes
  // Replace double dashes with single dashes
  // replace capitals letters with lowercase. 

  var markerMappings = {
    "Arrow":"arrow",
    "mim-branching-left":"mim-branching-left",
    "mim-branching-right":"mim-branching-right",
    "mim-necessary-stimulation":"mim-necessary-stimulation",
    "mim-binding":"mim-binding",
    "mim-conversion":"mim-conversion",
    "mim-stimulation":"mim-stimulation",
    "mim-modification":"mim-modification",
    "mim-catalysis":"mim-catalysis",
    "mim-inhibition":"mim-inhibition",
    "mim-cleavage":"mim-cleavage",
    "mim-covalent-bond":"mim-covalent-bond",
    "mim-transcription-translation":"mim-transcription-translation",
    "mim-gap":"mim-gap",
    "none":"none",
    "TBar":"t-bar"
  };

  function gpml2json(rawJsonPoints) {
    try {
      var markerStart = 'none';
      var markerEnd = 'none';

      rawJsonPoints.forEach(function(element, index, array) {

        // for anchor points, the data model for a point is
        // relX, relY, [dx], [dy]
        // with dx and dy only being used for the first and last point
        //
        // "relX, relY" indicates where on the shape the anchor is located.
        //
        // Table of meanings for "relX, relY"
        // ----------------------------------
        //  relX   |   relY   | meaning
        // ----------------------------------
        // 0.333   0       top side at left third-point 
        // 0.5     0       top side at center 
        // 0.667   0       top side at right third-point 
        // 1       0.333   right side at top third-point 
        // 1       0.5     right side at middle 
        // 1       0.667   right side at bottom third-point 
        // 0.667   1       bottom side at right third-point 
        // 0.5     1       bottom side at center 
        // 0.333   1       bottom side at left third-point 
        // 0       0.667   left side at bottom third-point 
        // 0       0.5     left side at middle 
        // 0       0.333   left side at top third-point 
        //
        // "dx, dy" indicates the direction of the line relative to the shape
        //
        // Table of meanings for "dx, dy"
        // ------------------------------
        //  dx | dy | meaning
        // ------------------------------
        //   0   -1   line emanates upward from anchor 
        //   1    0   line emanates rightward from anchor 
        //   0    1   line emanates downward from anchor 
        //  -1    0   line emanates leftward from anchor 
        //
        //  adapted from jsPlumb implementation:
        //  https://github.com/sporritt/jsPlumb/wiki/anchors

        if (element.graphref !== undefined) {
          element.graphRef = element.graphref;
          delete element.graphref;

          var relx = (Math.round(element.relx * 2)/2).toString()
          element.relX = parseFloat(anchorPositionMappings[relx]);
          delete element.relx;
          delete element.x;

          var rely = (Math.round(element.rely * 2)/2).toString()
          element.relY = parseFloat(anchorPositionMappings[rely]);
          delete element.rely;
          delete element.y;

          if (element.relX === 0) {
            element.dx = -1;
          }
          else {
            if (element.relX === 1) {
              element.dx = 1;
            }
            else {
              if (element.relY === 0) {
                element.dy = -1;
              }
              else {
                if (element.relY === 1) {
                  element.dy = 1;
                };
              };
            };
          };
        };

        // This is probably unreliable. We need to establish a way to ensure we identify start and end markers correctly, and we should not rely on the order of elements in XML.

        if ((index === 0) && (markerMappings.hasOwnProperty(element.arrowhead))) {
          markerStart = markerMappings[element.arrowhead];
          delete element.arrowhead;
        }
        else {
          if ((index === array.length - 1) && (markerMappings.hasOwnProperty(element.arrowhead))) {
            markerEnd = markerMappings[element.arrowhead];
            delete element.arrowhead;
          }
        };
      });

      // This seems clumsy. I added it so it's clear that we are returning the points array after it has been processed.

      var validJsonPoints = rawJsonPoints;
      return { "points": validJsonPoints, "markerStart":markerStart, "markerEnd":markerEnd };
    }
    catch (e) {
      console.log("Error converting point to json: " + e.message);
      return e;
    };
  };
  function getGraphRef(point) {
    self.point=point;
    if (point.hasOwnProperty('graphRef')) {
      if (pathvisio.data.pathways[pathvisio.data.current.svgSelector].hasOwnProperty('labelableElements')) {
        var labelableElement = pathvisio.data.pathways[pathvisio.data.current.svgSelector].labelableElements.filter(function(element) {return element.graphId === point.graphRef})[0]
        if (labelableElement !== undefined) {
          return {'type':'labelableElement', 'element':labelableElement};
        };
      };

      if (pathvisio.data.pathways[pathvisio.data.current.svgSelector].hasOwnProperty('groups')) {
        var group = pathvisio.data.pathways[pathvisio.data.current.svgSelector].groups.filter(function(element) {return element.graphId === point.graphRef})[0]
        if (group !== undefined) {
          return {'type':'group', 'groupId':group.groupId};
        };
      };

      var edgesWithAnchors = pathvisio.data.pathways[pathvisio.data.current.svgSelector].edges.filter(function(element) {return element.hasOwnProperty('anchors')})
      self.edgesWithAnchors = edgesWithAnchors;
      var i = -1;
      do {
        i += 1;
        var anchor = edgesWithAnchors[i].anchors.filter(function(element) {return element.graphId === point.graphRef})[0]
      } while (anchor === undefined && i < edgesWithAnchors.length);

      return {'type':'anchor', 'element':anchor, 'edge':edgesWithAnchors[i]};

    }
    else {
      return {'type':'unconnected'};
    };
  };

  function getCoordinates(point) {
    var coordinates = {};
    var edgeTerminusRef = self.edgeTerminusRef = getGraphRef(point);
    if (edgeTerminusRef.type !== 'anchor') {
      if (edgeTerminusRef.type === 'unconnected') {
        coordinates.x = point.x;
        coordinates.y = point.y;

      }
      else {
        if (edgeTerminusRef.type === 'labelableElement') {
          var coordinates = pathvisio.pathway.labelableElement.getPortCoordinates(edgeTerminusRef.element, point.relX, point.relY);
        }
        else {
          if (edgeTerminusRef.type === 'group') {
            var groupDimensions = pathvisio.pathway.group.getDimensions(edgeTerminusRef.groupId);
            var coordinates = pathvisio.pathway.labelableElement.getPortCoordinates(groupDimensions, point.relX, point.relY);
          }
          else {
            return 'error';
          };
        };
      };
    }
    else {
      var path = d3.select("#interaction-" + edgeTerminusRef.edge.graphId)[0][0];
      var coordinates = path.getPointAtLength(edgeTerminusRef.element.position * path.getTotalLength());
    };

    return coordinates;
  };

  function isTwoPointElbow(source, target) {
    var isRightAngle = ( Math.abs(source.dx) === Math.abs(target.dy) && Math.abs(source.dy) === Math.abs(target.dx) ); 
    var sourcePasses = ( (((target.x - source.x)/Math.abs(target.x - source.x) === source.dx) || ((target.y - source.y)/Math.abs(target.y - source.y) === source.dy)) );
    var targetPasses = ( ((source.x - target.x)/Math.abs(source.x - target.x) === target.dx) || ((source.y - target.y)/Math.abs(source.y - target.y) === target.dy) );
    return ( isRightAngle && sourcePasses && targetPasses );
  }; 

  return { 
    getGraphRef:getGraphRef, 
    getCoordinates:getCoordinates, 
    isTwoPointElbow:isTwoPointElbow,
    gpml2json:gpml2json
  } 
}();
