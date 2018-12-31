var MAX_TREE_RADIUS = new THREE.Vector3(3, 8, 3);
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
  });
  
  wood = getItemID("default:birch_log");
  leaves = getItemID("default:birch_leaves");
  
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
  });
  
  wood = getItemID("default:spruce_log");
  leaves = getItemID("default:spruce_leaves");
  
  treeData.push({
    size: new THREE.Vector3(7, 8, 7),
    data: [
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air, leaves, leaves, leaves, leaves, leaves,    air,
         air,    air,    air,    air,    air,    air,    air,
         
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air, leaves, leaves, leaves,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air, leaves, leaves, leaves,    air,    air,
      leaves, leaves, leaves, leaves, leaves, leaves, leaves,
         air,    air,    air,    air,    air,    air,    air,
         
         air,    air,    air, leaves,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air, leaves,    air,    air,    air,
         air, leaves, leaves, leaves, leaves, leaves,    air,
         air,    air,    air, leaves,    air,    air,    air,
         air, leaves, leaves, leaves, leaves, leaves,    air,
      leaves, leaves, leaves, leaves, leaves, leaves, leaves,
         air,    air,    air,    air,    air,    air,    air,
         
         air,    air, leaves, leaves, leaves,    air,    air,
         air,    air,    air,   wood,    air,    air,    air,
         air,    air, leaves,   wood, leaves,    air,    air,
         air, leaves, leaves,   wood, leaves, leaves,    air,
         air,    air, leaves,   wood, leaves,    air,    air,
         air, leaves, leaves,   wood, leaves, leaves,    air,
      leaves, leaves, leaves,   wood, leaves, leaves, leaves,
         air,    air,    air,   wood,    air,    air,    air,
         
         air,    air,    air, leaves,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air, leaves,    air,    air,    air,
         air, leaves, leaves, leaves, leaves, leaves,    air,
         air,    air,    air, leaves,    air,    air,    air,
         air, leaves, leaves, leaves, leaves, leaves,    air,
      leaves, leaves, leaves, leaves, leaves, leaves, leaves,
         air,    air,    air,    air,    air,    air,    air,
         
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air, leaves, leaves, leaves,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air, leaves, leaves, leaves,    air,    air,
      leaves, leaves, leaves, leaves, leaves, leaves, leaves,
      
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air,    air,    air,    air,    air,    air,    air,
         air, leaves, leaves, leaves, leaves, leaves,    air,
         air,    air,    air,    air,    air,    air,    air
    ]
  });
}

function treeTypeNoise(position) {
  var scale = 20;
  var n = noise.perlin2(position.x / scale, position.y / scale);
  //convert to the 0 - 1 range and invert
  n = (n + 1) / 2;
  n = 1 - n;
  return n;
}

function genTree(pos) {
  var noise = treeTypeNoise(new THREE.Vector2(pos.x, pos.z));
  if(noise < 0.6) {
    return treeData[0];
  } else if(noise < 0.77) {
    return treeData[1];
  } else if(noise < 1.0) {
    return treeData[2];
  }
  return treeData[0];
}
