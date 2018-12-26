var MAX_LIGHT = 15;
var SUNLIGHT_LEVEL = 15;

var lightMapMap = []; //{pos: THREE.Vector3, index: int}
var lightMapData = [];

//FIXME efficiency of this function
function calcSunlight(pos, propCache) {
  var chunkIn = vectorMod(pos, CHUNK_SIZE);
  if(getChunkMeta(chunkIn).empty) {
    return true;
  }
  
  var block = getBlock(pos);
  var props;
  if(block in propCache) {
    props = propCache[block];
  } else {
    props = getItemProps(block);
    propCache[block] = props;
  }
  if(props.transparent) {
    return calcSunlight(vectorAdd(pos, new THREE.Vector3(0, 1, 0)));
  } else {
    return false;
  }
}

function genLightMapRaw(chunkPos) {
  /*var chunks = [];
  for(var x = -1; x <= 1; x++) {
    for(var y = -1; y <= 1; y++) {
      for(var z = -1; z <= 1; z++) {
        chunks.push(getChunk(new THREE.Vector3(chunkPos.x + x, chunkPos.y + y, chunkPos.z + z)));
      }
    }
  }*/
  var chunk = getChunk(chunkPos);
  
  var propCache = {};
  
  var lightMap = [];
  var lightSources = [];
  
  var sunlit = false;
  if(getChunkMeta(new THREE.Vector3(chunkPos.x, chunkPos.y + 1, chunkPos.z)).empty) {
    sunlit = true;
  }
  
  for(var x = 0; x < CHUNK_SIZE.x; x++) {
    for(var y = 0; y < CHUNK_SIZE.y; y++) {
      for(var z = 0; z < CHUNK_SIZE.z; z++) {
        lightMap.push(0);
      }
    }
  }
  
  for(var x = 0; x < CHUNK_SIZE.x; x++) {
    for(var z = 0; z < CHUNK_SIZE.z; z++) {
      var hasSun = sunlit;
      if(!sunlit) {
        hasSun = calcSunlight(localToGlobal(new THREE.Vector3(x, CHUNK_SIZE.y - 1, z), chunkPos), propCache);
      }
      for(var y = CHUNK_SIZE.y - 1; y >= 0; y--) {
        var blockPos = new THREE.Vector3(x, y, z);
        var block = getBlockCached(blockPos, chunk);
        var props;
        if(block in propCache) {
          props = propCache[block];
        } else {
          props = getItemProps(block);
          propCache[block] = props;
        }
        
        var isLight = false;
        if("lightLevel" in props) {
          if(props.lightLevel > 0) {
            lightSources.push({pos: blockPos, level: props.lightLevel});
            isLight = true;
          }
        }
        
        if(props.transparent && hasSun) {
          //lightMap[calcDataOffset(blockPos)] = 15;
          lightSources.push({pos: blockPos, level: SUNLIGHT_LEVEL});
          lightMap[calcDataOffset(blockPos)] = -2;
        }
        
        if(props.transparent || isLight) {
          //lightMap.push(0);
        } else {
          //lightMap.push(-1);
          lightMap[calcDataOffset(blockPos)] = -1;
          hasSun = false;
        }
      }
    }
  }
    
  for(var i = 0; i < lightSources.length; i++) {
    recursiveSetLight(lightMap, lightSources[i]);
  }
  
  var meta = getLightMapMeta(chunkPos);
  
  if(meta == null) {
    var index = lightMapData.length;
    lightMapMap.push({pos: chunkPos, index: index, empty: false});
    lightMapData.push(lightMap);
  } else {
    var index = meta.index;
    lightMapData[index] = lightMap;
  }
  
  return lightMap;
}

function recursiveSetLight(lightMap, lightSource) {
  var oldLevel = lightMap[calcDataOffset(lightSource.pos)];
  if(lightSource.level > oldLevel && oldLevel != -1) {
    lightMap[calcDataOffset(lightSource.pos)] = lightSource.level;
    
    if(lightSource.level > 1) {
      for(var face = 0; face < faces.length; face++) {
        var newPos = vectorAdd(lightSource.pos, faces[face]);
        if(newPos.x >= 0 && newPos.y >= 0 && newPos.z >= 0 && newPos.x < CHUNK_SIZE.x && newPos.y < CHUNK_SIZE.y && newPos.z < CHUNK_SIZE.z) {
          if(lightMap[calcDataOffset(newPos)] == -2 && oldLevel == -2) {
            lightMap[calcDataOffset(newPos)] = lightSource.level;
          } else {
            recursiveSetLight(lightMap, {pos: newPos, level: lightSource.level - 1});
          }
        }
      }
    }
  }
}

function genLightMap(chunkPos) {
  var lightMap = genLightMapRaw(chunkPos);
  for(var face = 0; face < 6; face++) {
    var nearbyLightMap = getLightMapRaw(vectorAdd(chunkPos, faces[face]));
  
    var destBlock = new THREE.Vector3(0, 0, 0);
    var indices = [0, 1, 2];
    var staticIndex;
    for(var i = 0; i < 3; i++) {
      if(faces[face].getComponent(i) == -1) {
        staticIndex = i;
        destBlock.setComponent(i, 0);
        break;
      } else if(faces[face].getComponent(i) == 1) {
        staticIndex = i;
        destBlock.setComponent(i, CHUNK_SIZE.getComponent(i) - 1);
        break;
      }
    }
    indices.splice(staticIndex, 1);
    
    for(var axis1 = 0; axis1 < CHUNK_SIZE.getComponent(indices[0]); axis1++) {
      for(var axis2 = 0; axis2 < CHUNK_SIZE.getComponent(indices[1]); axis2++) {
        destBlock.setComponent(indices[0], axis1);
        destBlock.setComponent(indices[1], axis2);
        
        if(getLightBlockCached(destBlock, lightMap) == -1) {
          continue;
        }
        
        var srcBlock = vectorMod(vectorAdd(destBlock, faces[face]), CHUNK_SIZE);
        var lightLevel = getLightBlockCached(srcBlock, nearbyLightMap);
        
        if(lightLevel <= 1) {
          continue;
        }
        
        //lightMap[calcDataOffset(destBlock)] = lightLevel - 1;
        recursiveSetLight(lightMap, {pos: destBlock, level: lightLevel - 1});
      }
    }
  }
  
  return lightMap;
}

function getLightMapIndex(chunkPos) {
  for(var i = 0; i < lightMapMap.length; i++) {
    if(lightMapMap[i].pos.equals(chunkPos)) {
      return i;
    }
  }
  return null;
}

function getLightMap(chunkPos) {
  var index = getLightMapIndex(chunkPos);
  if(index != null) {
    return lightMapData[lightMapMap[index].index];
  }
  return genLightMap(chunkPos);
}

function getLightMapRaw(chunkPos) {
  var index = getLightMapIndex(chunkPos);
  if(index != null) {
    return lightMapData[lightMapMap[index].index];
  }
  return genLightMapRaw(chunkPos);
}

function getLightMapMeta(chunkPos) {
  var index = getLightMapIndex(chunkPos);
  if(index == null) {
    return null;
  }
  return lightMapMap[index];
}

function reloadLightMap(chunkPos) {
  return genLightMap(chunkPos);
}

function reloadLightMapRaw(chunkPos) {
  return genLightMapRaw(chunkPos);
}

//TODO: remove light map

function getLightBlockCached(localPos, lightMap) {
  return lightMap[calcDataOffset(localPos)];
}

function getLightBlock(pos) {
  var lightMap = getLightMap(vectorDivide(pos, CHUNK_SIZE));
  var localPos = vectorMod(pos, CHUNK_SIZE);
  return getLightBlockCached(localPos, lightMap);
}

function setLightBlock(pos, val) {
  var chunkPos = vectorDivide(pos, CHUNK_SIZE);
  var lightMap = getLightMap(chunkPos);
  var localPos = vectorMod(pos, CHUNK_SIZE);
  lightMap[calcDataOffset(localPos)] = val;
  
  //TODO: clear empty flag?
}

function reloadLightMapNear(pos) {
  var chunkPos = vectorDivide(pos, CHUNK_SIZE);
  for(var x = -1; x <= 1; x++) {
    for(var y = -1; y <= 1; y++) {
      for(var z = -1; z <= 1; z++) {
        genLightMapRaw(new THREE.Vector3(chunkPos.x + x, chunkPos.y + y, chunkPos.z + z));
      }
    }
  }
  
  for(var x = -1; x <= 1; x++) {
    for(var y = -1; y <= 1; y++) {
      for(var z = -1; z <= 1; z++) {
        genLightMap(new THREE.Vector3(chunkPos.x + x, chunkPos.y + y, chunkPos.z + z));
      }
    }
  }
  
  //genLightMap(chunkPos);
  //reloadLightMap(chunkPos);
}
