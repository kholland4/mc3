(function() {
  var sunDelta = -1;
  setInterval(function() {
    var radius = VIEW_RANGE;
    var todo = [];
    for(var x = -radius.x; x <= radius.x; x++) {
      for(var y = -radius.y; y <= radius.y; y++) {
        for(var z = -radius.z; z <= radius.z; z++) {
          todo.push(new THREE.Vector3(x, y, z));
        }
      }
    }
    var currentIndex = 0;
    var prescaler = 0;
    
    function reloadChunks() {
      if(prescaler % 2 != 0) {
        prescaler++;
        //requestAnimationFrame(reloadChunks);
        return;
      }
      var chunkIn = vectorDivide(controls.getObject().position, CHUNK_SIZE);
      var loadCount = 0;
      for(null; currentIndex < todo.length; currentIndex++) {
        var chunkPos = vectorAdd(todo[currentIndex], chunkIn);
        
        var meta = getChunkMeta(chunkPos);
        if(meta.empty) {
          continue;
        }
        
        if(chunkMeshLoaded(chunkPos)) {
          reloadLightMapNear(localToGlobal(new THREE.Vector3(0, 0, 0), chunkPos));
          //reloadLightMapRaw(chunkPos);
          reloadChunkMesh(chunkPos);
          loadCount++;
          if(loadCount >= 1) {
            currentIndex++;
            prescaler++;
            //requestAnimationFrame(reloadChunks);
            return;
          }
        }
      }
      
      removeOnFrame(reloadChunks);
    }
    
    SUNLIGHT_LEVEL += sunDelta;
    if(SUNLIGHT_LEVEL < 0 || SUNLIGHT_LEVEL > MAX_LIGHT) {
      sunDelta = -sunDelta;
      SUNLIGHT_LEVEL += sunDelta;
    }
    //reloadChunks();
    addOnFrame(reloadChunks);
  }, 30000);
})();
