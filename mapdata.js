var CHUNK_SIZE = new THREE.Vector3(16, 16, 16);

var chunkMap = []; //{pos: THREE.Vector3, index: int}
var chunkData = [];

function range(val, min, max) {
  return Math.round((val * (max - min)) + min);
}

function initMap() {
  initMapgen();
}

function calcDataOffset(localPos) {
  return localPos.x * (CHUNK_SIZE.y * CHUNK_SIZE.z) + localPos.y * CHUNK_SIZE.z + localPos.z;
}

function localToGlobal(localPos, chunkPos) {
  return new THREE.Vector3(localPos.x + chunkPos.x * CHUNK_SIZE.x, localPos.y + chunkPos.y * CHUNK_SIZE.y, localPos.z + chunkPos.z * CHUNK_SIZE.z);
}

//genChunk() is in mapgen/main.js

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
