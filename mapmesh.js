var chunkMeshMap = [];
var chunkMeshData = [];

//position deltas for each face
var faces = [
  new THREE.Vector3(0, 1, 0), //top
  new THREE.Vector3(0, -1, 0), //bottom
  new THREE.Vector3(-1, 0, 0), //left
  new THREE.Vector3(1, 0, 0), //right
  new THREE.Vector3(0, 0, 1), //front
  new THREE.Vector3(0, 0, -1) //back
];

var blockMeshFaceSquares = [ //FIXME to match UVs
  [-0.5, 0.5, -0.5, //top
   0.5, 0.5, -0.5,
   -0.5, 0.5, 0.5,
   
   0.5, 0.5, -0.5,
   0.5, 0.5, 0.5,
   -0.5, 0.5, 0.5],
   
  [-0.5, -0.5, -0.5, //bottom
   0.5, -0.5, -0.5,
   -0.5, -0.5, 0.5,
   
   0.5, -0.5, -0.5,
   0.5, -0.5, 0.5,
   -0.5, -0.5, 0.5],
   
  [-0.5, 0.5, -0.5, //left
   -0.5, 0.5, 0.5,
   -0.5, -0.5, -0.5,
   
   -0.5, 0.5, 0.5,
   -0.5, -0.5, 0.5,
   -0.5, -0.5, -0.5],
  
  [0.5, 0.5, -0.5, //right
   0.5, 0.5, 0.5,
   0.5, -0.5, -0.5,
   
   0.5, 0.5, 0.5,
   0.5, -0.5, 0.5,
   0.5, -0.5, -0.5],
  
  [-0.5, 0.5, 0.5, //front
   0.5, 0.5, 0.5,
   -0.5, -0.5, 0.5,
   
   0.5, 0.5, 0.5,
   0.5, -0.5, 0.5,
   -0.5, -0.5, 0.5],
  
  [-0.5, 0.5, -0.5, //back
   0.5, 0.5, -0.5,
   -0.5, -0.5, -0.5,
   
   0.5, 0.5, -0.5,
   0.5, -0.5, -0.5,
   -0.5, -0.5, -0.5]
];

//lower left is (0, 0)
//1      24
//
//
//36     5
var blockMeshFaceUVs = [
  0.0, 0.125,
  0.125, 0.125,
  0.0, 0.0,
  
  0.125, 0.125,
  0.125, 0.0,
  0.0, 0.0
];
var textureMapIndexScale = 1 / 128;

function genChunkMesh(chunkPos) {
  var chunk = getChunk(chunkPos);
  
  var meshes = [];
  var vertices = [];
  var uvs = [];
  var normals = [];
  
  var meta = getChunkMeta(chunkPos);
  if(meta.empty) {
    return [];
  }
  
  var propCache = {};
  
  var lightMap = getLightMap(chunkPos);
  
  for(var x = 0; x < CHUNK_SIZE.x; x++) {
    for(var y = 0; y < CHUNK_SIZE.y; y++) {
      for(var z = 0; z < CHUNK_SIZE.z; z++) {
        var blockPos = new THREE.Vector3(x, y, z);
        var block = getBlockCached(blockPos, chunk);
        var props;
        if(block in propCache) {
          props = propCache[block];
        } else {
          props = getItemProps(block);
          propCache[block] = props;
        }
        
        if(!props.visible) {
          //nothing to draw
          continue;
        }
        
        if(props.customMesh) {
          var meshVertices = deepcopy(props.meshVertices);
          for(var i = 0; i < meshVertices.length; i += 3) {
            meshVertices[i] += blockPos.x;
            meshVertices[i + 1] += blockPos.y;
            meshVertices[i + 2] += blockPos.z;
          }
          vertices.push.apply(vertices, meshVertices);
          uvs.push.apply(uvs, props.meshUVs);
          
          for(var face = 0; face < props.meshFaces.length; face++) {
            /*var nearbyPos = vectorAdd(blockPos, props.meshFaces[face].dir);
            var nearbyBlock = null;
            if(nearbyPos.x >= 0 && nearbyPos.y >= 0 && nearbyPos.z >= 0 && nearbyPos.x < CHUNK_SIZE.x && nearbyPos.y < CHUNK_SIZE.y && nearbyPos.z < CHUNK_SIZE.z) {
              nearbyBlock = getBlockCached(nearbyPos, chunk);
            } else {
              nearbyBlock = getBlock(localToGlobal(nearbyPos, chunkPos));
            }
            var nearbyProps;
            if(nearbyBlock in propCache) {
              nearbyProps = propCache[nearbyBlock];
            } else {
              nearbyProps = getItemProps(nearbyBlock);
              propCache[nearbyBlock] = nearbyProps;
            }
            
            var lightLevel = null;
            if(nearbyPos.x >= 0 && nearbyPos.y >= 0 && nearbyPos.z >= 0 && nearbyPos.x < CHUNK_SIZE.x && nearbyPos.y < CHUNK_SIZE.y && nearbyPos.z < CHUNK_SIZE.z) {
              lightLevel = getLightBlockCached(nearbyPos, lightMap);
            } else {
              lightLevel = getLightBlock(localToGlobal(nearbyPos, chunkPos));
            }
            
            if(lightLevel == -1) {
              lightLevel = 0;
            }
            if(lightLevel == 0) {
              lightLevel = 1;
            }
            
            if(props.meshFaces[face].dir.y == 1) {
              lightLevel *= 1.5;
            } else if(props.meshFaces[face].dir.y == -1) {
              lightLevel *= 0.8;
            }
            
            lightLevel = lightLevel / (MAX_LIGHT * 2);*/
            
            var normal = [];
            var direction = (-props.meshFaces[face].dir.x) + props.meshFaces[face].dir.y + props.meshFaces[face].dir.z;
            for(var i = 0; i < props.meshFaces[face].length; i++) {
              /*normal.push(0);
              normal.push(-(direction * lightLevel));
              normal.push((1 - lightLevel));*/
              normal.push(0);
              normal.push(1);
              normal.push(0);
            }
            normals.push.apply(normals, normal);
          }
          continue;
        }
        
        for(var face = 0; face < 6; face++) {
          var nearbyPos = vectorAdd(blockPos, faces[face]);
          var nearbyBlock = null;
          if(nearbyPos.x >= 0 && nearbyPos.y >= 0 && nearbyPos.z >= 0 && nearbyPos.x < CHUNK_SIZE.x && nearbyPos.y < CHUNK_SIZE.y && nearbyPos.z < CHUNK_SIZE.z) {
            nearbyBlock = getBlockCached(nearbyPos, chunk);
          } else {
            nearbyBlock = getBlock(localToGlobal(nearbyPos, chunkPos));
          }
          var nearbyProps;
          if(nearbyBlock in propCache) {
            nearbyProps = propCache[nearbyBlock];
          } else {
            nearbyProps = getItemProps(nearbyBlock);
            propCache[nearbyBlock] = nearbyProps;
          }
          if(nearbyProps.visible && !nearbyProps.transparent) {
            //opaque block adjacent
            continue;
          }
          
          var faceSquare = deepcopy(blockMeshFaceSquares[face]);
          for(var i = 0; i < faceSquare.length; i += 3) {
            faceSquare[i] += blockPos.x;
            faceSquare[i + 1] += blockPos.y;
            faceSquare[i + 2] += blockPos.z;
          }
          
          vertices.push.apply(vertices, faceSquare);
          
          var uv = deepcopy(blockMeshFaceUVs);
          for(var i = 0; i < uv.length; i += 2) {
            uv[i] += props.textureOffset[face].x * textureMapIndexScale;
            uv[i + 1] += props.textureOffset[face].y * textureMapIndexScale;
          }
          
          uvs.push.apply(uvs, uv);
          
          var lightLevel = null;
          if(nearbyPos.x >= 0 && nearbyPos.y >= 0 && nearbyPos.z >= 0 && nearbyPos.x < CHUNK_SIZE.x && nearbyPos.y < CHUNK_SIZE.y && nearbyPos.z < CHUNK_SIZE.z) {
            lightLevel = getLightBlockCached(nearbyPos, lightMap);
          } else {
            lightLevel = getLightBlock(localToGlobal(nearbyPos, chunkPos));
          }
          
          if(lightLevel == -1) {
            lightLevel = 0;
          }
          if(lightLevel == 0) {
            lightLevel = 1;
          }
          
          if(faces[face].y == 1) {
            lightLevel *= 1.5;
          } else if(faces[face].y == -1) {
            lightLevel *= 0.8;
          }
          
          lightLevel = lightLevel / (MAX_LIGHT * 2);
          
          var normal = [];
          var direction = (-faces[face].x) + faces[face].y + faces[face].z;
          for(var i = 0; i < 18; i += 3) {
            normal.push(0);
            normal.push(-(direction * lightLevel));
            normal.push((1 - lightLevel));
          }
          normals.push.apply(normals, normal);
        }
      }
    }
  }
  
  var material = new THREE.MeshLambertMaterial({map: textureMap, transparent: false});
  //var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
  var geometry = new THREE.BufferGeometry();
  
  geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
  
  geometry.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
  
  geometry.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), 3));
  
  //geometry.computeFaceNormals();
  //geometry.computeVertexNormals();
  
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (chunkPos.x * CHUNK_SIZE.x);
  mesh.position.y = (chunkPos.y * CHUNK_SIZE.y);
  mesh.position.z = (chunkPos.z * CHUNK_SIZE.z);
  
  mesh.material.side = THREE.DoubleSide; //FIXME
  
  meshes.push(mesh);
  
  return meshes;
}

function loadChunkMesh(chunkPos) {
  var meshes = genChunkMesh(chunkPos);
  meshes.forEach(function(mesh) {
    scene.add(mesh);
  });
  
  var targetIndex = null;
  for(var i = 0; i < chunkMeshData.length; i++) {
    if(chunkMeshData[i] == null) {
      targetIndex = i;
      break;
    }
  }
  
  if(targetIndex == null) {
    chunkMeshMap.push({pos: chunkPos, index: chunkMeshData.length});
    chunkMeshData.push(meshes);
  } else {
    chunkMeshMap.push({pos: chunkPos, index: targetIndex});
    chunkMeshData[targetIndex] = meshes;
  }
}

function unloadChunkMesh(chunkPos) {
  var index = null;
  var i;
  for(i = 0; i < chunkMeshMap.length; i++) {
    if(chunkMeshMap[i].pos.equals(chunkPos)) {
      index = chunkMeshMap[i].index;
      break;
    }
  }
  if(index == null) {
    return;
  }
  
  var meshes = chunkMeshData[index];
  meshes.forEach(function(mesh) {
    scene.remove(mesh);
    //TODO: any neccessary freeing of resources?
  });
  chunkMeshData[index] = null;
  chunkMeshMap.splice(i, 1);
  
  unloadChunkIfClean(chunkPos);
}

function reloadChunkMesh(chunkPos) {
  var meshesNew = genChunkMesh(chunkPos);
  
  var index = null;
  for(var i = 0; i < chunkMeshMap.length; i++) {
    if(chunkMeshMap[i].pos.equals(chunkPos)) {
      index = chunkMeshMap[i].index;
      break;
    }
  }
  if(index == null) {
    return;
  }
  
  var meshes = chunkMeshData[index];
  meshes.forEach(function(mesh) {
    scene.remove(mesh);
    //TODO: any neccessary freeing of resources?
  });
  
  meshesNew.forEach(function(mesh) {
    scene.add(mesh);
  });
  
  chunkMeshData[index] = meshesNew;
}

function chunkMeshLoaded(chunkPos) {
  for(var i = 0; i < chunkMeshMap.length; i++) {
    if(chunkMeshMap[i].pos.equals(chunkPos)) {
      return true;
    }
  }
  return false;
}

function chunkMeshAutoload(chunkIn, radius, throttle) {
  var unloadCount = 0;
  for(var i = 0; i < chunkMeshMap.length; i++) {
    var thisPos = chunkMeshMap[i].pos;
    if(thisPos.x < chunkIn.x - radius.x || thisPos.x > chunkIn.x + radius.x || thisPos.y < chunkIn.y - radius.y || thisPos.y > chunkIn.y + radius.y || thisPos.z < chunkIn.z - radius.z || thisPos.z > chunkIn.z + radius.z) {
      unloadChunkMesh(chunkMeshMap[i].pos);
      i--;
      unloadCount++;
      if(unloadCount >= throttle) {
        break;
      }
    }
  }
  
  var loadCount = 0;
  for(var x = -radius.x; x <= radius.x; x++) {
    for(var y = -radius.y; y <= radius.y; y++) {
      for(var z = -radius.z; z <= radius.z; z++) {
        var chunkPos = vectorAdd(new THREE.Vector3(x, y, z), chunkIn);
        if(!chunkMeshLoaded(chunkPos)) {
          loadChunkMesh(chunkPos);
          loadCount++;
          if(loadCount >= throttle) {
            return;
          }
        }
      }
    }
  }
}

function reloadChunkMeshNear(pos) {
  var chunkIn = vectorDivide(pos, CHUNK_SIZE);
  /*var chunks = [chunkIn];
  for(var face = 0; face < 6; face++) {
    var newChunkPos = vectorDivide(vectorAdd(pos, faces[face]), CHUNK_SIZE);
    if(!chunkIn.equals(newChunkPos)) {
      chunks.push(newChunkPos);
    }
  }
  for(var i = 0; i < chunks.length; i++) {
    if(chunkMeshLoaded(chunks[i])) {
      reloadChunkMesh(chunks[i]);
    }
  }*/
  //need to use new light maps
  /*for(var x = -1; x <= 1; x++) {
    for(var y = -1; y <= 1; y++) {
      for(var z = -1; z <= 1; z++) {
        var newPos = new THREE.Vector3(chunkIn.x + x, chunkIn.y + y, chunkIn.z + z);
        if(chunkMeshLoaded(newPos)) {
          reloadChunkMesh(newPos);
        }
      }
    }
  }*/
  if(chunkMeshLoaded(chunkIn)) {
    reloadChunkMesh(chunkIn);
  }
  for(var face = 0; face < 6; face++) {
    var newPos = vectorAdd(chunkIn, faces[face]);
    if(chunkMeshLoaded(newPos)) {
      reloadChunkMesh(newPos);
    }
  }
}