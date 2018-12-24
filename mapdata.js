var CHUNK_SIZE = new THREE.Vector3(16, 16, 16);

var chunkMap = []; //{pos: THREE.Vector3, index: int}
var chunkData = [];

function noise2D(position, scale) {
  var n = noise.simplex2(position.x / scale, position.y / scale);
  //convert to the 0 - 1 range and invert
  n = (n + 1) / 2;
  n = 1 - n;
  return n;
}

function noise3D(position, scale) {
  var n = noise.simplex3(position.x / scale, position.y / scale, position.z / scale);
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

function range(val, min, max) {
  return Math.round((val * (max - min)) + min);
}

function initMap() {
  
}

function calcDataOffset(localPos) {
  return localPos.x * (CHUNK_SIZE.y * CHUNK_SIZE.z) + localPos.y * CHUNK_SIZE.z + localPos.z;
}

function localToGlobal(localPos, chunkPos) {
  return new THREE.Vector3(localPos.x + chunkPos.x * CHUNK_SIZE.x, localPos.y + chunkPos.y * CHUNK_SIZE.y, localPos.z + chunkPos.z * CHUNK_SIZE.z);
}

function genChunk(chunkPos) {
  var data = [];
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
          data.push(getItemID("default:air"));y 
          thisEmpty = true;
        }
        if(!thisEmpty) {
          empty = false;
        }
      }
    }
  }
  
  var index = chunkData.length;
  chunkMap.push({pos: chunkPos, index: index, dirty: false, empty: empty});
  chunkData.push(data);
  return data;
}

function getChunkMapIndex(chunkPos) {
  for(var i = 0; i < chunkMap.length; i++) {
    if(chunkMap[i].pos.equals(chunkPos)) {
      return i;
    }
  }
  return null;
}

function getChunk(chunkPos) {
  var index = getChunkMapIndex(chunkPos);
  if(index != null) {
    return chunkData[chunkMap[index].index];
  }
  return genChunk(chunkPos);
}

function getChunkMeta(chunkPos) {
  var index = getChunkMapIndex(chunkPos);
  if(index == undefined) {
    //FIXME
    genChunk(chunkPos);
    index = getChunkMapIndex(chunkPos);
  }
  return chunkMap[index];
}

function unloadChunkIfClean(chunkPos) {
  //TODO
}

function getBlockCached(localPos, chunk) {
  return chunk[calcDataOffset(localPos)];
}

function getBlock(pos) {
  var chunk = getChunk(vectorDivide(pos, CHUNK_SIZE));
  var localPos = vectorMod(pos, CHUNK_SIZE);
  return getBlockCached(localPos, chunk);
}

function setBlock(pos, val) {
  var chunkPos = vectorDivide(pos, CHUNK_SIZE);
  var chunk = getChunk(chunkPos);
  var localPos = vectorMod(pos, CHUNK_SIZE);
  chunk[calcDataOffset(localPos)] = val;
  
  //mark as dirty
  var index = getChunkMapIndex(chunkPos);
  chunkMap[index].dirty = true;
  chunkMap[index].empty = false;
}

function intelligentSetBlock(pos, val) {
  setBlock(pos, val);
  intelligentReloadChunkMeshNear(pos);
}
