(function() {
  registerModsInit(function() {
    function logicWireUpdate(pos, recursive = false) {
      var block = getBlock(pos);
      var props = getItemProps(block);
      
      var connections = [0, 0, 0, 0];
      for(var face = 2; face < 6; face++) {
        var nearbyPos = vectorAdd(pos, faces[face]);
        var nearbyProps = getItemProps(getBlock(nearbyPos));
        if(nearbyProps.groups.includes("logic_wire")) {
          connections[face - 2] = 1;
          if(recursive) {
            logicWireUpdate(nearbyPos, false);
          }
        } else if("logic_source" in nearbyProps) {
          if(nearbyProps.logic_source) {
            connections[face - 2] = 1;
          }
        }
      }
      
      if(!props.groups.includes("logic_wire")) {
        return;
      }
      
      var newItemName = "logic:wire_" + connections[0].toString() + connections[1].toString() + connections[2].toString() + connections[3].toString();
      if(!("logic_wireState" in props)) {
        return;
      }
      if(props.logic_wireState) {
        newItemName += "_on";
      } else {
        newItemName += "_off";
      }
      
      if(props.name != newItemName) {
        intelligentSetBlock(pos, getItemID(newItemName)); //FIXME more efficient refresh
      }
    }
    
    function logicWireTraverseOff(pos) {
      var block = getBlock(pos);
      var props = getItemProps(block);
      
      if(props.groups.includes("logic_wire")) {
        if("logic_wireState" in props) {
          if(props.logic_wireState) {
            setBlock(pos, getItemID(props.name.substring(0, props.name.length - 3) + "_off"));
            //console.log("off!");
          }
        }
      }
      
      for(var face = 2; face < 6; face++) {
        var nearbyPos = vectorAdd(pos, faces[face]);
        var nearbyProps = getItemProps(getBlock(nearbyPos));
        if(nearbyProps.groups.includes("logic_wire")) {
          if(!("logic_wireState" in nearbyProps)) {
            continue;
          }
          if(nearbyProps.logic_wireState) {
            logicWireTraverseOff(nearbyPos);
          }
        }
      }
    }
    
    var traverseLog = [];
    function logicWireTraverseOn(pos, targetState = false) {
      var block = getBlock(pos);
      var props = getItemProps(block);
      
      if(props.groups.includes("logic_wire") && ("logic_wireState" in props)) {
        if(!props.logic_wireState && targetState) {
          setBlock(pos, getItemID(props.name.substring(0, props.name.length - 4) + "_on"));
          //console.log("on!");
        }
      }
      
      for(var face = 2; face < 6; face++) {
        var nearbyPos = vectorAdd(pos, faces[face]);
        var nearbyProps = getItemProps(getBlock(nearbyPos));
        if(nearbyProps.groups.includes("logic_wire")) {
          if("logic_wireState" in nearbyProps) {
            //console.log("cascade adjacent current=" + nearbyProps.logic_wireState + " target=" + targetState);
            if(!nearbyProps.logic_wireState) {
              if(!targetState) {
                var skip = false;
                for(var i = 0; i < traverseLog.length; i++) {
                  if(nearbyPos.equals(traverseLog[i])) {
                    skip = true;
                    break;
                  }
                }
                if(skip) { continue; }
                traverseLog.push(nearbyPos);
              }
              logicWireTraverseOn(nearbyPos, targetState);
            }
          }
        } else if("logic_source" in nearbyProps) {
          if(nearbyProps.logic_source && !targetState) {
            targetState = true;
            //traverseLog = [];
            traverseLog.push(pos);
            logicWireTraverseOn(pos, true);
            return;
          }
        }
      }
    }
    
    function logicWirePostPlace(pos, itemToPlace) {
      logicWireUpdate(pos, true);
      //console.log(getItemName(getBlock(pos)));
      logicWireTraverseOff(pos);
      traverseLog = [];
      logicWireTraverseOn(pos);
      
      var chunksTouched = [];
      for(var i = 0; i < traverseLog.length; i++) {
        var chunkIn = vectorDivide(traverseLog[i], CHUNK_SIZE);
        var skip = false;
        for(var n = 0; n < chunksTouched.length; n++) {
          if(chunkIn.equals(chunksTouched[n])) {
            skip = true;
            break;
          }
        }
        if(skip) { continue; }
        chunksTouched.push(chunkIn);
        intelligentReloadChunkMeshNear(traverseLog[i]);
      }
    }
    function logicWireDestroy(pos) {
      //logicWireUpdate(pos, true);
      logicWirePostPlace(pos, null);
    }
    
    if(getItemProps("ores:redstone_dust") != null) {
      setItemProp("ores:redstone_dust", "placeable", true);
      setItemProp("ores:redstone_dust", "onPlace", function(pos, itemToPlace) {
        intelligentSetBlock(pos, getItemID("logic:wire_0000_off"));
        useHUDActiveItem();
        getItemProps("logic:wire_0000_off").postPlace(pos, getItemID("logic:wire_0000_off"));
        return false;
      });
    } else {
      registerItem({
        name: "ores:redstone_dust",
        displayName: "Redstone Dust",
        //textureOffsetAlt: {all: new THREE.Vector2(256, 240)},
        transparent: true,
        icon: "textures/items/redstone_dust.png",
        //groups: ["logic_wire"],
        hardness: 0,
        onPlace: function(pos, itemToPlace) {
          intelligentSetBlock(pos, getItemID("logic:wire_0000_off"));
          useHUDActiveItem();
          getItemProps("logic:wire_0000_off").postPlace(pos, getItemID("logic:wire_0000_off"));
          return false;
        }
      });
    }
    
    var dropItem = "ores:redstone_dust"; //"logic:wire"
    
    for(var i = 0; i < 16; i++) {
      var tex = new THREE.Vector2(256 + (i * 16), 112);
      var ts = textureMapIndexScale;
      registerItem({
        name: "logic:wire_" + ((i >> 3) & 1).toString() + ((i >> 2) & 1).toString() + ((i >> 1) & 1).toString() + (i & 1).toString() + "_off",
        inInventory: false,
        drops: new InvItem(dropItem, 1),
        textureOffsetAlt: {all: tex},
        customMesh: true,
        meshVertices: [
          -0.5, -0.489, -0.5,
           0.5, -0.489, -0.5,
           -0.5, -0.489, 0.5,
           
           0.5, -0.489, -0.5,
           0.5, -0.489, 0.5,
           -0.5, -0.489, 0.5
        ],
        meshUVs: [
          0.0 + (tex.x*ts), uvSize + (tex.y*ts),
          uvSize + (tex.x*ts), uvSize + (tex.y*ts),
          0.0 + (tex.x*ts), 0.0 + (tex.y*ts),

          uvSize + (tex.x*ts), uvSize + (tex.y*ts),
          uvSize + (tex.x*ts), 0.0 + (tex.y*ts),
          0.0 + (tex.x*ts), 0.0 + (tex.y*ts)
        ],
        meshFaces: [
          {dir: new THREE.Vector3(0, 1, 0), length: 6}
        ],
        transparent: true,
        walkable: true,
        groups: ["logic_wire"],
        hardness: 0,
        logic_wireConnects: i,
        logic_wireState: false,
        postPlace: logicWirePostPlace,
        onDestroy: logicWireDestroy
      });
    }
    
    for(var i = 0; i < 16; i++) {
      var tex = new THREE.Vector2(256 + (i * 16), 96);
      var ts = textureMapIndexScale;
      registerItem({
        name: "logic:wire_" + ((i >> 3) & 1).toString() + ((i >> 2) & 1).toString() + ((i >> 1) & 1).toString() + (i & 1).toString() + "_on",
        inInventory: false,
        drops: new InvItem(dropItem, 1),
        textureOffsetAlt: {all: tex},
        customMesh: true,
        meshVertices: [
          -0.5, -0.489, -0.5,
           0.5, -0.489, -0.5,
           -0.5, -0.489, 0.5,
           
           0.5, -0.489, -0.5,
           0.5, -0.489, 0.5,
           -0.5, -0.489, 0.5
        ],
        meshUVs: [
          0.0 + (tex.x*ts), uvSize + (tex.y*ts),
          uvSize + (tex.x*ts), uvSize + (tex.y*ts),
          0.0 + (tex.x*ts), 0.0 + (tex.y*ts),

          uvSize + (tex.x*ts), uvSize + (tex.y*ts),
          uvSize + (tex.x*ts), 0.0 + (tex.y*ts),
          0.0 + (tex.x*ts), 0.0 + (tex.y*ts)
        ],
        meshFaces: [
          {dir: new THREE.Vector3(0, 1, 0), length: 6}
        ],
        transparent: true,
        walkable: true,
        groups: ["logic_wire"],
        hardness: 0,
        lightLevel: 5,
        logic_wireConnects: i,
        logic_wireState: true,
        postPlace: logicWirePostPlace,
        onDestroy: logicWireDestroy
      });
    }
    
    if(getItemProps("ores:redstone_block") != null) {
      setItemProp("ores:redstone_block", "logic_source", true);
      setItemProp("ores:redstone_block", "postPlace", logicWirePostPlace);
      setItemProp("ores:redstone_block", "onDestroy", logicWireDestroy);
    }
  });
})();
