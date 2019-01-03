(function() {
  var container = document.createElement("div");
  container.style.position = "fixed";
  container.style.zIndex = 3;
  container.style.right = "0";
  container.style.top = "0";
  container.style.padding = "5px";
  container.style.paddingRight = "85px";
  container.style.fontFamily = "sans-serif";
  container.style.fontSize = "16px";
  container.style.color = "white";
  document.body.appendChild(container);
  
  var prescaler = 0;
  
  function updateDebug() {
    if(prescaler % 4 == 0) {
      var pos = controls.getObject().position;
      container.innerText = "(" + pos.x.toFixed(1) + ", " + pos.y.toFixed(1) + ", " + pos.z.toFixed(1) + ")";
    }
    prescaler++;
  }
  
  addOnFrame(updateDebug);
  
  var script = document.createElement("script");
  script.onload = function() {
    var stats = new Stats();
    stats.dom.style.left = "initial";
    stats.dom.style.right = "0";
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  };
  script.src = "lib/stats.min.js";
  document.head.appendChild(script);
  
  mods.registerChatCommand("/noclip", function(arg) {
    if(arg == "on") {
      NOCLIP = true;
      return "noclip is now on\n";
    } else if(arg == "off") {
      NOCLIP = false;
      return "noclip is now off\n";
    } else {
      if(NOCLIP) {
        return "noclip is on\n";
      } else {
        return "noclip is off\n";
      }
    }
  });
  
  mods.registerChatCommand("/js", function(arg) {
    if(arg != undefined) {
      eval(arg);
    }
  });
  
  mods.registerChatCommand("/reseed", function(arg) {
    if(arg != undefined) {
      var seed = parseInt(arg);
      if(!isNaN(seed)) {
        noise.seed(seed);
        chunkMap = [];
        chunkData = [];
        lightMapMap = [];
        lightMapData = [];
        
        for(var i = 0; i < chunkMeshMap.length; i++) {
          unloadChunkMesh(chunkMeshMap[i].pos);
          i--;
        }
        
        var startPos = controls.getObject().position;
        startPos.y = mapHeight(new THREE.Vector2(startPos.x, startPos.z)) + 5;
        controls.getObject().position.copy(startPos);
        
        chunkMeshAutoload(vectorDivide(startPos, CHUNK_SIZE), new THREE.Vector3(1, 1, 1), Infinity);
      }
    }
  });
  
  mods.registerChatCommand("/texturepack", function(name) {
    if(name != undefined) {
      TEXTUREPACK = name;
      updateHUD();
      if("health" in mods) { mods.health.set(mods.health.get()); }
      if("hunger" in mods) { mods.hunger.set(mods.hunger.get()); }
      
      textureMap = THREE.ImageUtils.loadTexture(TEXTUREPACK + "textures/textureMap.png");
      textureMap.minFilter = THREE.NearestFilter;
      textureMap.magFilter = THREE.NearestFilter;
      
      for(var i = 0; i < chunkMeshMap.length; i++) {
        unloadChunkMesh(chunkMeshMap[i].pos);
        i--;
      }
      
      chunkMeshAutoload(vectorDivide(controls.getObject().position, CHUNK_SIZE), new THREE.Vector3(1, 1, 1), Infinity);
    } else {
      return "Texture pack is " + TEXTUREPACK;
    }
  });
  
  registerItem({
    name: "debug:window",
    displayName: "Debugging Window",
    customMesh: true,
    meshVertices: [],
    meshUVs: [],
    meshFaces: [],
    transparent: false,
    walkable: true,
    hardness: 1,
    icon: "textures/blocks/debug.png"
  });
})();
