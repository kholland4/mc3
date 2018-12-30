(function() {
  var plantMeshVertices = [
    //front
    -0.5, 0.5, 0.25,
    0.5, 0.5, 0.25,
    -0.5, -0.5, 0.25,

    0.5, 0.5, 0.25,
    0.5, -0.5, 0.25,
    -0.5, -0.5, 0.25,
    
    //back
    -0.5, 0.5, -0.25,
    0.5, 0.5, -0.25,
    -0.5, -0.5, -0.25,

    0.5, 0.5, -0.25,
    0.5, -0.5, -0.25,
    -0.5, -0.5, -0.25,
    
    //left
    -0.25, 0.5, -0.5,
    -0.25, 0.5, 0.5,
    -0.25, -0.5, -0.5,

    -0.25, 0.5, 0.5,
    -0.25, -0.5, 0.5,
    -0.25, -0.5, -0.5,
    
    //right
    0.25, 0.5, -0.5,
    0.25, 0.5, 0.5,
    0.25, -0.5, -0.5,

    0.25, 0.5, 0.5,
    0.25, -0.5, 0.5,
    0.25, -0.5, -0.5
  ];
  function getPlantMeshUVs(tex) {
    var uvs = [];
    for(var i = 0; i < 4; i++) {
      uvs.push.apply(uvs, [
        0.0 + (tex.x * textureMapIndexScale), uvSize + (tex.y * textureMapIndexScale),
        uvSize + (tex.x * textureMapIndexScale), uvSize + (tex.y * textureMapIndexScale),
        0.0 + (tex.x * textureMapIndexScale), 0.0 + (tex.y * textureMapIndexScale),

        uvSize + (tex.x * textureMapIndexScale), uvSize + (tex.y * textureMapIndexScale),
        uvSize + (tex.x * textureMapIndexScale), 0.0 + (tex.y * textureMapIndexScale),
        0.0 + (tex.x * textureMapIndexScale), 0.0 + (tex.y * textureMapIndexScale)
      ]);
    }
    return uvs;
  }
  var plantMeshFaces = [
    {dir: new THREE.Vector3(0, 1, 0), length: 6},
    {dir: new THREE.Vector3(0, 1, 0), length: 6},
    {dir: new THREE.Vector3(0, 1, 0), length: 6},
    {dir: new THREE.Vector3(0, 1, 0), length: 6}
  ];
  
  registerItem({
    name: "farming:farmland",
    drops: new InvItem("default:dirt", 1),
    inInventory: false,
    textureOffsetAlt: {
      top: new THREE.Vector2(160, 128),
      bottom: new THREE.Vector2(64, 112),
      sides: new THREE.Vector2(64, 112)
    },
    groups: ["dirt"],
    hardness: 0.6
  });
  
  registerItem({
    name: "farming:wheat_seeds",
    displayName: "Wheat Seeds",
    onPlace: function(pos) {
      if(getItemName(getBlock(selector.destroy)) == "farming:farmland") {
        intelligentSetBlock(pos, getItemID("farming:wheat_stage_0"));
        useHUDActiveItem();
      }
      return false;
    },
    icon: "textures/items/seeds_wheat.png"
  });
  for(var stage = 0; stage < 7; stage++) {
    registerItem({
      name: "farming:wheat_stage_" + stage,
      icon: "textures/blocks/wheat_stage_" + stage + ".png",
      drops: new InvItem("farming:wheat_seeds", 1),
      inInventory: false,
      customMesh: true,
      meshVertices: plantMeshVertices,
      meshUVs: getPlantMeshUVs(new THREE.Vector2(256 + (stage * 16), 0)),
      meshFaces: plantMeshFaces,
      transparent: true,
      walkable: true,
      groups: ["farming_plant"],
      hardness: 0.1 //FIXME
    });
  }
  registerItem({
    name: "farming:wheat_stage_7",
    icon: "textures/blocks/wheat_stage_7.png",
    onDestroy: function(pos) {
      intelligentSetBlock(pos, getItemID("default:air"));
      givePlayerInventoryItem(new InvItem("default:wheat", 1));
      givePlayerInventoryItem(new InvItem("farming:wheat_seeds", randint(1, 3)));
      return false;
    },
    inInventory: false,
    customMesh: true,
    meshVertices: plantMeshVertices,
    meshUVs: getPlantMeshUVs(new THREE.Vector2(256 + (7 * 16), 0)),
    meshFaces: plantMeshFaces,
    transparent: true,
    walkable: true,
    groups: ["farming_plant"],
    hardness: 0.1 //FIXME
  });
  
  registerOnFrame(function() {
    var chunkIn = vectorDivide(controls.getObject().position, CHUNK_SIZE);
    for(var chunkCount = 0; chunkCount < 10; chunkCount++) {
      var chunkPos = new THREE.Vector3(chunkIn.x + randint(-VIEW_RANGE.x, VIEW_RANGE.x), chunkIn.y + randint(-VIEW_RANGE.y, VIEW_RANGE.y), chunkIn.z + randint(-VIEW_RANGE.z, VIEW_RANGE.z));
      for(var blockCount = 0; blockCount < 15; blockCount++) {
        var localPos = new THREE.Vector3(randint(0, CHUNK_SIZE.x - 1), randint(0, CHUNK_SIZE.y - 1), randint(0, CHUNK_SIZE.z - 1));
        var pos = localToGlobal(localPos, chunkPos);
        var block = getBlock(pos);
        var name = getItemName(block);
        
        var prefix = "farming:wheat_stage_";
        if(name.startsWith(prefix)) {
          var n = parseInt(name.substring(prefix.length));
          if(n < 7) {
            n++;
            intelligentSetBlock(pos, getItemID(prefix + n.toString()));
          }
        }
        
        //TODO: wet/dry farmland
      }
    }
  });
  
  mods.farmingTill = function(pos) {
    var target = selector.destroy;
    var targetName = getItemName(getBlock(target));
    if(targetName == "default:dirt" || targetName == "default:grass_block") {
      intelligentSetBlock(target, getItemID("farming:farmland"));
      return true;
    }
    return false;
  };
  
  ["diamond", "gold", "iron", "stone", "wood"].forEach(function(toolType) {
    setItemProp("default:" + toolType + "_hoe", "placeable", true);
    setItemProp("default:" + toolType + "_hoe", "onPlace", function(pos) {if("farmingTill" in mods) {var ret=mods.farmingTill(pos);if(ret) {useHUDActiveItem();}} return false;});
  });
})();
