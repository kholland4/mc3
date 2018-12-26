var MAX_TREE_RADIUS = new THREE.Vector3(3, 7, 3);
var TREE_FREQ = 0.85;

var treeData = [];

function initTrees() {
  var wood = getItemID("default:oak_log");
  var leaves = getItemID("default:leaves");
  var air = getItemID("default:air");
  
  treeData.push({
    size: new THREE.Vector3(5, 7, 5),
    data: [
         air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,
      leaves, leaves, leaves, leaves, leaves,
      leaves, leaves, leaves, leaves, leaves,
         air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,
         
         air,   air, leaves,   air,    air,
         air, leaves, leaves, leaves,    air,
      leaves, leaves, leaves, leaves, leaves,
      leaves, leaves, leaves, leaves, leaves,
         air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,
         
         air, leaves, leaves, leaves,    air,
         air, leaves,   wood, leaves,    air,
      leaves, leaves,   wood, leaves, leaves,
      leaves, leaves,   wood, leaves, leaves,
         air,    air,   wood,    air,    air,
         air,    air,   wood,    air,    air,
         air,    air,   wood,    air,    air,
         
         air,   air, leaves,   air,    air,
         air, leaves, leaves, leaves,    air,
      leaves, leaves, leaves, leaves, leaves,
      leaves, leaves, leaves, leaves, leaves,
         air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,
         
         air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,
      leaves, leaves, leaves, leaves, leaves,
      leaves, leaves, leaves, leaves, leaves,
         air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,
         air,    air,    air,    air,    air
    ]
  })
}

function genTree(pos) {
  return treeData[0];
}
