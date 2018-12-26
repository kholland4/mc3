function initMapgen() {
  initTrees();
}

function noise2D(position, scale) {
  var n = noise.perlin2(position.x / scale, position.y / scale);
  //convert to the 0 - 1 range and invert
  n = (n + 1) / 2;
  n = 1 - n;
  return n;
}

function noise3D(position, scale) {
  var n = noise.perlin3(position.x / scale, position.y / scale, position.z / scale);
  //convert to the 0 - 1 range and invert
  n = (n + 1) / 2;
  n = 1 - n;
  return n;
}

function mapHeightNoise(position) {
  var scale = 50;
  var n = noise.perlin2(position.x / scale, position.y / scale);
  //convert to the 0 - 1 range and invert
  n = (n + 1) / 2;
  n = 1 - n;
  return n;
}

function treeNoise(position) {
  var scale = 2;
  var n = noise.perlin2(position.x / scale, position.y / scale);
  //convert to the 0 - 1 range and invert
  n = (n + 1) / 2;
  n = 1 - n;
  return n;
}

function genChunk(chunkPos) {
  var data = [];
  var trees = [];
  var empty = true;
  for(var x = 0; x < CHUNK_SIZE.x; x++) {
    for(var y = 0; y < CHUNK_SIZE.y; y++) {
      for(var z = 0; z < CHUNK_SIZE.z; z++) {
        var pos = localToGlobal(new THREE.Vector3(x, y, z), chunkPos);
        var height = range(mapHeightNoise(new THREE.Vector2(pos.x, pos.z)), 10, 40);
        var thisEmpty = false;
        if(pos.y < height) {
          data.push(getItemID("default:stone"));
        } else if(pos.y == height) {
          data.push(getItemID("default:grass_block"));
        } else {
          data.push(getItemID("default:air"));
          thisEmpty = true;
        }
        if(!thisEmpty) {
          empty = false;
        }
        
        //trees
        /*if(pos.y == height + 1 && treeNoise(new THREE.Vector2(pos.x, pos.z)) > 0.8) {
          trees.push(pos);
        }*/
      }
    }
  }
  
  //get height noise from a larger area for trees
  for(var x = -MAX_TREE_RADIUS.x; x < CHUNK_SIZE.x + MAX_TREE_RADIUS.x; x++) {
    for(var z = -MAX_TREE_RADIUS.z; z < CHUNK_SIZE.z + MAX_TREE_RADIUS.z; z++) {
      var pos = localToGlobal(new THREE.Vector3(x, 0, z), chunkPos);
      var height = range(mapHeightNoise(new THREE.Vector2(pos.x, pos.z)), 10, 40);
      pos.y = height + 1;
      
      if(pos.y > chunkPos.y * CHUNK_SIZE.y - MAX_TREE_RADIUS.y && pos.y < (chunkPos.y + 1) * CHUNK_SIZE.y + MAX_TREE_RADIUS.y && treeNoise(new THREE.Vector2(pos.x, pos.z)) > TREE_FREQ) {
        trees.push(pos);
      }
    }
  }
  
  //trees
  var air = getItemID("default:air");
  
  for(var i = 0; i < trees.length; i++) {
    var pos = trees[i];
    var tree = genTree(trees[i]);
    for(var x = 0; x < tree.size.x; x++) {
      for(var y = 0; y < tree.size.y; y++) {
        for(var z = 0; z < tree.size.z; z++) {
          var relPos = new THREE.Vector3(x - Math.round((tree.size.x - 1) / 2), y, z - Math.round((tree.size.z - 1) / 2));
          var localPos = vectorMod(vectorAdd(relPos, pos), CHUNK_SIZE);
          var chunkIn = vectorDivide(vectorAdd(relPos, pos), CHUNK_SIZE);
          
          if(chunkPos.equals(chunkIn)) {
            var block = tree.data[z * (tree.size.x * tree.size.y) + (tree.size.y - y - 1) * tree.size.x + x];
            if(block != air) {
              data[calcDataOffset(localPos)] = block;
              empty = false;
            }
          }
        }
      }
    }
  }
  
  var index = chunkData.length;
  chunkMap.push({pos: chunkPos, index: index, dirty: false, empty: empty});
  chunkData.push(data);
  return data;
}