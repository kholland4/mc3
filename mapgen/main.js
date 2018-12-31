function initMapgen() {
  //var seed = Math.floor(Math.random() * 65535);
  var seed = 552063;
  noise.seed(seed);
  initTrees();
}

function noise2D(position, scale, type = "perlin") {
  var n = 0;
  if(type == "perlin") {
    n = noise.perlin2(position.x / scale, position.y / scale);
  } else if(type == "simplex") {
    n = noise.simplex2(position.x / scale, position.y / scale);
  }
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

function mapHeight(position) {
  //very low frequency noise; on a continent scale
  var xlf = range(noise2D(position, 5000), -3000, 2000);
  
  //low frequency noise - large mountains, hills, etc.
  var lf = range(noise2D(position, 500), 0, 1000);
  
  //medium frequency noise
  var mf = range(noise2D(position, 50), 100, 400);
  
  return Math.round((xlf + lf + mf) / 10);
}

function treeNoise(position) {
  var scale = 2;
  var n = noise.perlin2(position.x / scale, position.y / scale);
  //convert to the 0 - 1 range and invert
  n = (n + 1) / 2;
  n = 1 - n;
  return n;
}

function caveNoise(position) {
  if(position.y > -64) {
    return false;
  }
  return noise3D(position, 29) < 0.3;
}

function genChunk(chunkPos) {
  var data = [];
  var trees = [];
  var empty = true;
  for(var x = 0; x < CHUNK_SIZE.x; x++) {
    for(var y = 0; y < CHUNK_SIZE.y; y++) {
      for(var z = 0; z < CHUNK_SIZE.z; z++) {
        var pos = localToGlobal(new THREE.Vector3(x, y, z), chunkPos);
        var height = mapHeight(new THREE.Vector2(pos.x, pos.z));
        var thisEmpty = false;
        if(caveNoise(pos)) {
          data.push(getItemID("default:air"));
          thisEmpty = true;
        } else if(pos.y < height) {
          if(coalOreNoise(pos)) {
            data.push(getItemID("ores:coal_ore"));
          } else if(ironOreNoise(pos)) {
            data.push(getItemID("ores:iron_ore"));
          } else if(goldOreNoise(pos)) {
            data.push(getItemID("ores:gold_ore"));
          } else if(diamondOreNoise(pos)) {
            data.push(getItemID("ores:diamond_ore"));
          } else {
            data.push(getItemID("default:stone"));
          }
        } else if(height >= 0) {
          if(pos.y == height) {
            data.push(getItemID("default:grass_block"));
          } else {
            data.push(getItemID("default:air"));
            thisEmpty = true;
          }
        } else {
          if(pos.y == height) {
            data.push(getItemID("default:sand"));
          } else if(pos.y < -1) {
            data.push(getItemID("default:water_source"));
          } else {
            data.push(getItemID("default:air"));
            thisEmpty = true;
          }
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
      var height = mapHeight(new THREE.Vector2(pos.x, pos.z));
      pos.y = height + 1;
      
      if(height < 0) {
        continue;
      }
      
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
    if(tree == null) {
      continue;
    }
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
  for(var i = 0; i < chunkData.length; i++) {
    if(chunkData[i] == null) {
      index = i;
      break;
    }
  }
  chunkMap.push({pos: chunkPos, index: index, dirty: false, empty: empty});
  if(index == chunkData.length) {
    chunkData.push(data);
  } else {
    chunkData[index] = data;
  }
  
  return data;
}
