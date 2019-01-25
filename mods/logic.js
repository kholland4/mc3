(function() {
  registerModsInit(function() {
    function logicWireUpdate(pos, recursive = false) {
      var block = getBlock(pos);
      var props = getItemProps(block);
      
      var affectFaces = [2, 3, 4, 5];
      if("logic_wireFaces" in props) {
        affectFaces = props.logic_wireFaces;
      }
      
      var connections = [0, 0, 0, 0];
      for(var faceN = 0; faceN < affectFaces.length; faceN++) {
        var face = affectFaces[faceN];
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
        } else if("logic_sink" in nearbyProps) {
          if(nearbyProps.logic_sink) {
            connections[face - 2] = 1;
          }
        }
      }
      
      if(!props.groups.includes("logic_wire_mut")) {
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
        //intelligentSetBlock(pos, getItemID(newItemName)); //FIXME more efficient refresh
        setBlock(pos, getItemID(newItemName));
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
      
      var affectFaces = [2, 3, 4, 5];
      if("logic_wireFaces" in props) {
        affectFaces = props.logic_wireFaces;
      }
      
      for(var faceN = 0; faceN < affectFaces.length; faceN++) {
        var face = affectFaces[faceN];
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
    var sinks = [];
    function logicWireTraverseOn(pos, targetState = false) {
      var block = getBlock(pos);
      var props = getItemProps(block);
      
      if(props.groups.includes("logic_wire") && ("logic_wireState" in props)) {
        if(!props.logic_wireState && targetState) {
          setBlock(pos, getItemID(props.name.substring(0, props.name.length - 4) + "_on"));
          //console.log("on!");
        }
      }
      
      var affectFaces = [2, 3, 4, 5];
      if("logic_wireFaces" in props) {
        affectFaces = props.logic_wireFaces;
      }
      
      for(var faceN = 0; faceN < affectFaces.length; faceN++) {
        var face = affectFaces[faceN];
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
        } else if("logic_sink" in nearbyProps) {
          if(nearbyProps.logic_sink) {
            var found = false;
            for(var i = 0; i < sinks.length; i++) {
              if(nearbyPos.equals(sinks[i].pos)) {
                sinks[i].state = targetState;
                found = true;
                break;
              }
            }
            if(!found) {
              sinks.push({pos: nearbyPos, state: targetState});
            }
          }
        }
      }
    }
    
    function logicWirePostPlace(pos, itemToPlace) {
      logicWireUpdate(pos, true);
      //console.log(getItemName(getBlock(pos)));
      logicWireTraverseOff(pos);
      traverseLog = [];
      sinks = [];
      traverseLog.push(pos);
      logicWireTraverseOn(pos);
      
      for(var i = 0; i < sinks.length; i++) {
        var state = false;
        for(var face = 2; face < 6; face++) {
          var nearbyPos = vectorAdd(sinks[i].pos, faces[face]);
          var nearbyProps = getItemProps(getBlock(nearbyPos));
          if(nearbyProps.groups.includes("logic_wire")) {
            if("logic_wireState" in nearbyProps) {
              if(nearbyProps.logic_wireState) {
                state = true;
                break;
              }
            }
          }
        }
        
        var block = getBlock(sinks[i].pos);
        var props = getItemProps(block);
        if("logic_sink_update" in props) {
          props.logic_sink_update(sinks[i].pos, state);
        }
      }
      
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
    function logicWireChange(pos) {
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
        groups: ["logic_wire", "logic_wire_mut"],
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
        groups: ["logic_wire", "logic_wire_mut"],
        hardness: 0,
        lightLevel: 5,
        logic_wireConnects: i,
        logic_wireState: true,
        postPlace: logicWirePostPlace,
        onDestroy: logicWireDestroy
      });
    }
      
    registerItem({
      name: "logic:wire_vertical_off",
      displayName: "Vertical Redstone",
      textureOffsetAlt: {all: new THREE.Vector2(0, 0)},
      groups: ["logic_wire"],
      hardness: 0,
      logic_wireConnects: 15,
      logic_wireState: false,
      logic_wireFaces: [0, 1, 2, 3, 4, 5],
      postPlace: logicWirePostPlace,
      onDestroy: logicWireDestroy
    });
    
    registerItem({
      name: "logic:wire_vertical_on",
      inInventory: false,
      drops: new InvItem("logic:wire_vertical_off", 1),
      textureOffsetAlt: {all: new THREE.Vector2(0, 0)},
      groups: ["logic_wire"],
      hardness: 0,
      lightLevel: 5,
      logic_wireConnects: 15,
      logic_wireState: true,
      logic_wireFaces: [0, 1, 2, 3, 4, 5],
      postPlace: logicWirePostPlace,
      onDestroy: logicWireDestroy
    });
    
    if(getItemProps("ores:redstone_block") != null) {
      setItemProp("ores:redstone_block", "logic_source", true);
      setItemProp("ores:redstone_block", "postPlace", logicWirePostPlace);
      setItemProp("ores:redstone_block", "onDestroy", logicWireDestroy);
    }
    
    //Sinks
    function lampUpdate(pos, state) {
      var block = getBlock(pos);
      if(block == getItemID("logic:lamp_off") && state == true) {
        setBlock(pos, getItemID("logic:lamp_on"));
      }
      if(block == getItemID("logic:lamp_on") && state == false) {
        setBlock(pos, getItemID("logic:lamp_off"));
      }
    }
    registerItem({
      name: "logic:lamp_off",
      displayName: "Redstone Lamp",
      icon: "textures/icons/redstone_lamp.png",
      textureOffsetAlt: {all: new THREE.Vector2(256, 80)},
      hardness: 0.3,
      logic_sink: true,
      logic_sink_update: lampUpdate,
      postPlace: logicWirePostPlace,
      onDestroy: logicWireDestroy
    });
    registerItem({
      name: "logic:lamp_on",
      displayName: "Redstone Lamp",
      drops: new InvItem("logic:lamp_off", 1),
      inInventory: false,
      textureOffsetAlt: {all: new THREE.Vector2(272, 80)},
      hardness: 0.3,
      lightLevel: 10,
      logic_sink: true,
      logic_sink_update: lampUpdate,
      postPlace: logicWirePostPlace,
      onDestroy: logicWireDestroy
    });
    
    function pistonUpdate(pos, state) {
      setTimeout(function() { pistonUpdate2(pos, state); }, 1 / 20);
    }
    function pistonUpdate2(pos, state) {
      var block = getBlock(pos);
      
      var meta = getBlockMeta(pos);
      var facing = 0;
      if("facing" in meta) {
        facing = mod(meta.facing, 4);
      }
      var face = 2;
      
      if(face >= 2) {
        face -= 2;
        if(face == 0) { face = 3; } else if(face == 3) { face = 0; }
        face = (face + (facing)) % 4;
        if(facing == 0) { face = 3; } else if(face == 3) { face = 0; }
        face += 2;
      }
      
      var f = [4, 3, 5, 2];
      
      var targetPos = vectorAdd(pos, faces[mod(f[facing], 6)]);
      var targetBlock = getBlock(targetPos);
      var targetPos2 = vectorAdd(targetPos, faces[mod(f[facing], 6)]);
      var targetBlock2 = getBlock(targetPos2);
      
      var suffix = "";
      if(block == getItemID("logic:piston_off_sticky") || block == getItemID("logic:piston_on_sticky")) {
        suffix = "_sticky";
      }
      
      if((block == getItemID("logic:piston_off") || block == getItemID("logic:piston_off_sticky")) && state == true) {
        if(targetBlock2 == getItemID("default:air")) { //targetBlock != getItemID("default:air") && 
          setBlock(pos, getItemID("logic:piston_on" + suffix));
          
          setBlock(targetPos, getItemID("logic:piston_on_2" + suffix));
          setBlock(targetPos2, targetBlock);
          var targetMeta = getBlockMeta(targetPos);
          if(Object.keys(targetMeta).length > 0) {
            setBlockMeta(targetPos2, targetMeta);
            clearBlockMeta(targetPos);
          }
          setBlockMeta(targetPos, {facing: facing});
          
          intelligentReloadChunkMeshNear(pos);
          logicWireChange(targetPos2);
        }
      }
      if((block == getItemID("logic:piston_on") || block == getItemID("logic:piston_on_sticky")) && state == false) {
        setBlock(pos, getItemID("logic:piston_off" + suffix));
        if(targetBlock == getItemID("logic:piston_on_2" + suffix)) {
          clearBlockMeta(targetPos);
          setBlock(targetPos, getItemID("default:air"));
        }
        
        if(suffix == "_sticky") {
          setBlock(targetPos2, getItemID("default:air"));
          setBlock(targetPos, targetBlock2);
          var targetMeta = getBlockMeta(targetPos2);
          if(Object.keys(targetMeta).length > 0) {
            setBlockMeta(targetPos, targetMeta);
            clearBlockMeta(targetPos2);
          }
          
          intelligentReloadChunkMeshNear(pos);
          logicWireChange(targetPos);
        } else {
          intelligentReloadChunkMeshNear(pos);
        }
      }
    }
    
    var suffix = ["", "_sticky"];
    var displayNames = ["Piston", "Sticky Piston"];
    var icons = ["textures/icons/piston.png", "textures/icons/sticky_piston.png"];
    
    for(var type = 0; type < 2; type++) {
      var frontTex = [new THREE.Vector3(288, 80), new THREE.Vector3(368, 80)];
      var texLR = new THREE.Vector2(304, 80);
      var texTB = new THREE.Vector2(320, 80);
      var texB = new THREE.Vector2(336, 80);
      var texF = frontTex[type];
      var ts = textureMapIndexScale;
      registerItem({
        name: "logic:piston_off" + suffix[type],
        displayName: displayNames[type],
        icon: icons[type],
        textureOffsetAlt: {front: frontTex[type], left: new THREE.Vector2(304, 80), right: new THREE.Vector2(304, 80), top: new THREE.Vector2(320, 80), bottom: new THREE.Vector2(320, 80), back: new THREE.Vector2(336, 80)},
        customMesh: true,
        meshVertices: [
          -0.5, 0.5, -0.5, //top
          0.5, 0.5, -0.5,
          -0.5, 0.5, 0.5,

          0.5, 0.5, -0.5,
          0.5, 0.5, 0.5,
          -0.5, 0.5, 0.5,

          -0.5, -0.5, -0.5, //bottom
          0.5, -0.5, -0.5,
          -0.5, -0.5, 0.5,

          0.5, -0.5, -0.5,
          0.5, -0.5, 0.5,
          -0.5, -0.5, 0.5,

          -0.5, 0.5, -0.5, //left
          -0.5, 0.5, 0.5,
          -0.5, -0.5, -0.5,

          -0.5, 0.5, 0.5,
          -0.5, -0.5, 0.5,
          -0.5, -0.5, -0.5,

          0.5, 0.5, -0.5, //right
          0.5, 0.5, 0.5,
          0.5, -0.5, -0.5,

          0.5, 0.5, 0.5,
          0.5, -0.5, 0.5,
          0.5, -0.5, -0.5,

          -0.5, 0.5, 0.5, //front
          0.5, 0.5, 0.5,
          -0.5, -0.5, 0.5,

          0.5, 0.5, 0.5,
          0.5, -0.5, 0.5,
          -0.5, -0.5, 0.5,

          -0.5, 0.5, -0.5, //back
          0.5, 0.5, -0.5,
          -0.5, -0.5, -0.5,

          0.5, 0.5, -0.5,
          0.5, -0.5, -0.5,
          -0.5, -0.5, -0.5
        ],
        meshUVs: [
          0.0 + (texTB.x*ts), uvSize + (texTB.y*ts), //top
          uvSize + (texTB.x*ts), uvSize + (texTB.y*ts),
          0.0 + (texTB.x*ts), 0.0 + (texTB.y*ts),

          uvSize + (texTB.x*ts), uvSize + (texTB.y*ts),
          uvSize + (texTB.x*ts), 0.0 + (texTB.y*ts),
          0.0 + (texTB.x*ts), 0.0 + (texTB.y*ts),
          
          0.0 + (texTB.x*ts), uvSize + (texTB.y*ts), //bottom
          uvSize + (texTB.x*ts), uvSize + (texTB.y*ts),
          0.0 + (texTB.x*ts), 0.0 + (texTB.y*ts),

          uvSize + (texTB.x*ts), uvSize + (texTB.y*ts),
          uvSize + (texTB.x*ts), 0.0 + (texTB.y*ts),
          0.0 + (texTB.x*ts), 0.0 + (texTB.y*ts),
          
          0.0 + (texLR.x*ts), uvSize + (texLR.y*ts), //left
          uvSize + (texLR.x*ts), uvSize + (texLR.y*ts),
          0.0 + (texLR.x*ts), 0.0 + (texLR.y*ts),

          uvSize + (texLR.x*ts), uvSize + (texLR.y*ts),
          uvSize + (texLR.x*ts), 0.0 + (texLR.y*ts),
          0.0 + (texLR.x*ts), 0.0 + (texLR.y*ts),
          
          0.0 + (texLR.x*ts), uvSize + (texLR.y*ts), //right
          uvSize + (texLR.x*ts), uvSize + (texLR.y*ts),
          0.0 + (texLR.x*ts), 0.0 + (texLR.y*ts),

          uvSize + (texLR.x*ts), uvSize + (texLR.y*ts),
          uvSize + (texLR.x*ts), 0.0 + (texLR.y*ts),
          0.0 + (texLR.x*ts), 0.0 + (texLR.y*ts),
          
          0.0 + (texF.x*ts), uvSize + (texF.y*ts), //front
          uvSize + (texF.x*ts), uvSize + (texF.y*ts),
          0.0 + (texF.x*ts), 0.0 + (texF.y*ts),

          uvSize + (texF.x*ts), uvSize + (texF.y*ts),
          uvSize + (texF.x*ts), 0.0 + (texF.y*ts),
          0.0 + (texF.x*ts), 0.0 + (texF.y*ts),
          
          0.0 + (texB.x*ts), uvSize + (texB.y*ts), //back
          uvSize + (texB.x*ts), uvSize + (texB.y*ts),
          0.0 + (texB.x*ts), 0.0 + (texB.y*ts),

          uvSize + (texB.x*ts), uvSize + (texB.y*ts),
          uvSize + (texB.x*ts), 0.0 + (texB.y*ts),
          0.0 + (texB.x*ts), 0.0 + (texB.y*ts)
        ],
        meshFaces: [
          {dir: new THREE.Vector3(0, 1, 0), length: 6},
          {dir: new THREE.Vector3(0, -1, 0), length: 6},
          {dir: new THREE.Vector3(-1, 0, 0), length: 6},
          {dir: new THREE.Vector3(1, 0, 0), length: 6},
          {dir: new THREE.Vector3(0, 0, 1), length: 6},
          {dir: new THREE.Vector3(0, 0, -1), length: 6}
        ],
        hardness: 0.5,
        logic_sink: true,
        logic_sink_update: pistonUpdate,
        postPlace: logicWirePostPlace,
        onDestroy: logicWireDestroy,
        directional: true
      });
      var texLR = new THREE.Vector2(304, 80);
      var texTB = new THREE.Vector2(320, 80);
      var texB = new THREE.Vector2(336, 80);
      var texF = new THREE.Vector2(352, 80);
      var ts = textureMapIndexScale;
      registerItem({
        name: "logic:piston_on" + suffix[type],
        drops: new InvItem("logic:piston_off" + suffix[type], 1),
        inInventory: false,
        textureOffsetAlt: {all: new THREE.Vector2(272, 80)},
        customMesh: true,
        meshVertices: [
          -0.5, 0.5, -0.5, //top
          0.5, 0.5, -0.5,
          -0.5, 0.5, 0.25,

          0.5, 0.5, -0.5,
          0.5, 0.5, 0.25,
          -0.5, 0.5, 0.25,

          -0.5, -0.5, -0.5, //bottom
          0.5, -0.5, -0.5,
          -0.5, -0.5, 0.25,

          0.5, -0.5, -0.5,
          0.5, -0.5, 0.25,
          -0.5, -0.5, 0.25,

          -0.5, 0.5, -0.5, //left
          -0.5, 0.5, 0.25,
          -0.5, -0.5, -0.5,

          -0.5, 0.5, 0.25,
          -0.5, -0.5, 0.25,
          -0.5, -0.5, -0.5,

          0.5, 0.5, -0.5, //right
          0.5, 0.5, 0.25,
          0.5, -0.5, -0.5,

          0.5, 0.5, 0.25,
          0.5, -0.5, 0.25,
          0.5, -0.5, -0.5,

          -0.5, 0.5, 0.25, //front
          0.5, 0.5, 0.25,
          -0.5, -0.5, 0.25,

          0.5, 0.5, 0.25,
          0.5, -0.5, 0.25,
          -0.5, -0.5, 0.25,

          -0.5, 0.5, -0.5, //back
          0.5, 0.5, -0.5,
          -0.5, -0.5, -0.5,

          0.5, 0.5, -0.5,
          0.5, -0.5, -0.5,
          -0.5, -0.5, -0.5
        ],
        meshUVs: [
          0.0 + (texTB.x*ts), uvSize + (texTB.y*ts), //top
          uvSize + (texTB.x*ts), uvSize + (texTB.y*ts),
          0.0 + (texTB.x*ts), (uvSize/4) + (texTB.y*ts),

          uvSize + (texTB.x*ts), uvSize + (texTB.y*ts),
          uvSize + (texTB.x*ts), (uvSize/4) + (texTB.y*ts),
          0.0 + (texTB.x*ts), (uvSize/4) + (texTB.y*ts),
          
          0.0 + (texTB.x*ts), uvSize + (texTB.y*ts), //bottom
          uvSize + (texTB.x*ts), uvSize + (texTB.y*ts),
          0.0 + (texTB.x*ts), (uvSize/4) + (texTB.y*ts),

          uvSize + (texTB.x*ts), uvSize + (texTB.y*ts),
          uvSize + (texTB.x*ts), (uvSize/4) + (texTB.y*ts),
          0.0 + (texTB.x*ts), (uvSize/4) + (texTB.y*ts),
          
          0.0 + (texLR.x*ts), uvSize + (texLR.y*ts), //left
          (uvSize*0.75) + (texLR.x*ts), uvSize + (texLR.y*ts),
          0.0 + (texLR.x*ts), 0.0 + (texLR.y*ts),

          (uvSize*0.75) + (texLR.x*ts), uvSize + (texLR.y*ts),
          (uvSize*0.75) + (texLR.x*ts), 0.0 + (texLR.y*ts),
          0.0 + (texLR.x*ts), 0.0 + (texLR.y*ts),
          
          0.0 + (texLR.x*ts), uvSize + (texLR.y*ts), //right
          (uvSize*0.75) + (texLR.x*ts), uvSize + (texLR.y*ts),
          0.0 + (texLR.x*ts), 0.0 + (texLR.y*ts),

          (uvSize*0.75) + (texLR.x*ts), uvSize + (texLR.y*ts),
          (uvSize*0.75) + (texLR.x*ts), 0.0 + (texLR.y*ts),
          0.0 + (texLR.x*ts), 0.0 + (texLR.y*ts),
          
          0.0 + (texF.x*ts), uvSize + (texF.y*ts), //front
          uvSize + (texF.x*ts), uvSize + (texF.y*ts),
          0.0 + (texF.x*ts), 0.0 + (texF.y*ts),

          uvSize + (texF.x*ts), uvSize + (texF.y*ts),
          uvSize + (texF.x*ts), 0.0 + (texF.y*ts),
          0.0 + (texF.x*ts), 0.0 + (texF.y*ts),
          
          0.0 + (texB.x*ts), uvSize + (texB.y*ts), //back
          uvSize + (texB.x*ts), uvSize + (texB.y*ts),
          0.0 + (texB.x*ts), 0.0 + (texB.y*ts),

          uvSize + (texB.x*ts), uvSize + (texB.y*ts),
          uvSize + (texB.x*ts), 0.0 + (texB.y*ts),
          0.0 + (texB.x*ts), 0.0 + (texB.y*ts)
        ],
        meshFaces: [
          {dir: new THREE.Vector3(0, 1, 0), length: 6},
          {dir: new THREE.Vector3(0, -1, 0), length: 6},
          {dir: new THREE.Vector3(-1, 0, 0), length: 6},
          {dir: new THREE.Vector3(1, 0, 0), length: 6},
          {dir: new THREE.Vector3(0, 0, 1), length: 6},
          {dir: new THREE.Vector3(0, 0, -1), length: 6}
        ],
        transparent: true,
        hardness: 0.5,
        logic_sink: true,
        logic_sink_update: pistonUpdate,
        postPlace: logicWirePostPlace,
        onDestroy: logicWireDestroy,
        directional: true,
        customHitbox: [
          new THREE.Box3(new THREE.Vector3(-0.5, -0.5, -0.5), new THREE.Vector3(0.5, 0.5, 0.25)),
          new THREE.Box3(new THREE.Vector3(-0.125, -0.125, 0.25), new THREE.Vector3(0.125, 0.125, 0.5))
        ]
      });
      var texLR = new THREE.Vector2(304, 80);
      var texTB = new THREE.Vector2(320, 80);
      var texB = new THREE.Vector2(288, 80);
      var texF = frontTex[type];
      var ts = textureMapIndexScale;
      registerItem({
        name: "logic:piston_on_2" + suffix[type],
        drops: new InvItem("logic:piston_off" + suffix[type], 1),
        inInventory: false,
        textureOffsetAlt: {all: new THREE.Vector2(272, 80)},
        customMesh: true,
        meshVertices: [
          -0.5, 0.5, 0.25, //top
          0.5, 0.5, 0.25,
          -0.5, 0.5, 0.5,

          0.5, 0.5, 0.25,
          0.5, 0.5, 0.5,
          -0.5, 0.5, 0.5,

          -0.5, -0.5, 0.25, //bottom
          0.5, -0.5, 0.25,
          -0.5, -0.5, 0.5,

          0.5, -0.5, 0.25,
          0.5, -0.5, 0.5,
          -0.5, -0.5, 0.5,

          -0.5, 0.5, 0.25, //left
          -0.5, 0.5, 0.5,
          -0.5, -0.5, 0.25,

          -0.5, 0.5, 0.5,
          -0.5, -0.5, 0.5,
          -0.5, -0.5, 0.25,

          0.5, 0.5, 0.25, //right
          0.5, 0.5, 0.5,
          0.5, -0.5, 0.25,

          0.5, 0.5, 0.5,
          0.5, -0.5, 0.5,
          0.5, -0.5, 0.25,

          -0.5, 0.5, 0.5, //front
          0.5, 0.5, 0.5,
          -0.5, -0.5, 0.5,

          0.5, 0.5, 0.5,
          0.5, -0.5, 0.5,
          -0.5, -0.5, 0.5,

          -0.5, 0.5, 0.25, //back
          0.5, 0.5, 0.25,
          -0.5, -0.5, 0.25,

          0.5, 0.5, 0.25,
          0.5, -0.5, 0.25,
          -0.5, -0.5, 0.25,
          
          //---Shaft---
          
          -0.125, 0.125, -0.75, //top
          0.125, 0.125, -0.75,
          -0.125, 0.125, 0.25,

          0.125, 0.125, -0.75,
          0.125, 0.125, 0.25,
          -0.125, 0.125, 0.25,

          -0.125, -0.125, -0.75, //bottom
          0.125, -0.125, -0.75,
          -0.125, -0.125, 0.25,

          0.125, -0.125, -0.75,
          0.125, -0.125, 0.25,
          -0.125, -0.125, 0.25,
          
          -0.125, 0.125, -0.75, //left
          -0.125, 0.125, 0.25,
          -0.125, -0.125, -0.75,

          -0.125, 0.125, 0.25,
          -0.125, -0.125, 0.25,
          -0.125, -0.125, -0.75,

          0.125, 0.125, -0.75, //right
          0.125, 0.125, 0.25,
          0.125, -0.125, -0.75,

          0.125, 0.125, 0.25,
          0.125, -0.125, 0.25,
          0.125, -0.125, -0.75
        ],
        meshUVs: [
          0.0 + (texTB.x*ts), (uvSize*0.25) + (texTB.y*ts), //top
          uvSize + (texTB.x*ts), (uvSize*0.25) + (texTB.y*ts),
          0.0 + (texTB.x*ts), 0.0 + (texTB.y*ts),

          uvSize + (texTB.x*ts), (uvSize*0.25) + (texTB.y*ts),
          uvSize + (texTB.x*ts), 0.0 + (texTB.y*ts),
          0.0 + (texTB.x*ts), 0.0 + (texTB.y*ts),
          
          0.0 + (texTB.x*ts), uvSize + (texTB.y*ts), //bottom
          uvSize + (texTB.x*ts), uvSize + (texTB.y*ts),
          0.0 + (texTB.x*ts), (uvSize/4) + (texTB.y*ts),

          uvSize + (texTB.x*ts), uvSize + (texTB.y*ts),
          uvSize + (texTB.x*ts), (uvSize/4) + (texTB.y*ts),
          0.0 + (texTB.x*ts), (uvSize/4) + (texTB.y*ts),
          
          (uvSize*0.75) + (texLR.x*ts), uvSize + (texLR.y*ts), //left
          uvSize + (texLR.x*ts), uvSize + (texLR.y*ts),
          (uvSize*0.75) + (texLR.x*ts), 0.0 + (texLR.y*ts),

          uvSize + (texLR.x*ts), uvSize + (texLR.y*ts),
          uvSize + (texLR.x*ts), 0.0 + (texLR.y*ts),
          (uvSize*0.75) + (texLR.x*ts), 0.0 + (texLR.y*ts),
          
          (uvSize*0.75) + (texLR.x*ts), uvSize + (texLR.y*ts), //right
          uvSize + (texLR.x*ts), uvSize + (texLR.y*ts),
          (uvSize*0.75) + (texLR.x*ts), 0.0 + (texLR.y*ts),

          uvSize + (texLR.x*ts), uvSize + (texLR.y*ts),
          uvSize + (texLR.x*ts), 0.0 + (texLR.y*ts),
          (uvSize*0.75) + (texLR.x*ts), 0.0 + (texLR.y*ts),
          
          0.0 + (texF.x*ts), uvSize + (texF.y*ts), //front
          uvSize + (texF.x*ts), uvSize + (texF.y*ts),
          0.0 + (texF.x*ts), 0.0 + (texF.y*ts),

          uvSize + (texF.x*ts), uvSize + (texF.y*ts),
          uvSize + (texF.x*ts), 0.0 + (texF.y*ts),
          0.0 + (texF.x*ts), 0.0 + (texF.y*ts),
          
          0.0 + (texB.x*ts), uvSize + (texB.y*ts), //back
          uvSize + (texB.x*ts), uvSize + (texB.y*ts),
          0.0 + (texB.x*ts), 0.0 + (texB.y*ts),

          uvSize + (texB.x*ts), uvSize + (texB.y*ts),
          uvSize + (texB.x*ts), 0.0 + (texB.y*ts),
          0.0 + (texB.x*ts), 0.0 + (texB.y*ts),
          
          //---Shaft---
          
          (uvSize*0.75) + (texLR.x*ts), uvSize + (texLR.y*ts), //top
          uvSize + (texLR.x*ts), uvSize + (texLR.y*ts),
          (uvSize*0.75) + (texLR.x*ts), 0.0 + (texLR.y*ts),

          uvSize + (texLR.x*ts), uvSize + (texLR.y*ts),
          uvSize + (texLR.x*ts), 0.0 + (texLR.y*ts),
          (uvSize*0.75) + (texLR.x*ts), 0.0 + (texLR.y*ts),
          
          (uvSize*0.75) + (texLR.x*ts), uvSize + (texLR.y*ts), //bottom
          uvSize + (texLR.x*ts), uvSize + (texLR.y*ts),
          (uvSize*0.75) + (texLR.x*ts), 0.0 + (texLR.y*ts),

          uvSize + (texLR.x*ts), uvSize + (texLR.y*ts),
          uvSize + (texLR.x*ts), 0.0 + (texLR.y*ts),
          (uvSize*0.75) + (texLR.x*ts), 0.0 + (texLR.y*ts),
          
          0.0 + (texTB.x*ts), 0.0 + (texTB.y*ts), //left
          uvSize + (texTB.x*ts), 0.0 + (texTB.y*ts),
          0.0 + (texTB.x*ts), (uvSize*0.25) + (texTB.y*ts),

          uvSize + (texTB.x*ts), 0.0 + (texTB.y*ts),
          uvSize + (texTB.x*ts), (uvSize*0.25) + (texTB.y*ts),
          0.0 + (texTB.x*ts), (uvSize*0.25) + (texTB.y*ts),
          
          0.0 + (texTB.x*ts), 0.0 + (texTB.y*ts), //right
          uvSize + (texTB.x*ts), 0.0 + (texTB.y*ts),
          0.0 + (texTB.x*ts), (uvSize*0.25) + (texTB.y*ts),

          uvSize + (texTB.x*ts), 0.0 + (texTB.y*ts),
          uvSize + (texTB.x*ts), (uvSize*0.25) + (texTB.y*ts),
          0.0 + (texTB.x*ts), (uvSize*0.25) + (texTB.y*ts)
        ],
        meshFaces: [
          {dir: new THREE.Vector3(0, 1, 0), length: 6},
          {dir: new THREE.Vector3(0, -1, 0), length: 6},
          {dir: new THREE.Vector3(-1, 0, 0), length: 6},
          {dir: new THREE.Vector3(1, 0, 0), length: 6},
          {dir: new THREE.Vector3(0, 0, 1), length: 6},
          {dir: new THREE.Vector3(0, 0, -1), length: 6},
          
          {dir: new THREE.Vector3(0, 1, 0), length: 6},
          {dir: new THREE.Vector3(0, -1, 0), length: 6},
          {dir: new THREE.Vector3(-1, 0, 0), length: 6},
          {dir: new THREE.Vector3(1, 0, 0), length: 6}
        ],
        transparent: true,
        hardness: 0.5,
        logic_sink: true,
        logic_sink_update: pistonUpdate,
        postPlace: logicWirePostPlace,
        onDestroy: logicWireDestroy,
        directional: true,
        customHitbox: [
          new THREE.Box3(new THREE.Vector3(-0.5, -0.5, 0.25), new THREE.Vector3(0.5, 0.5, 0.5)),
          new THREE.Box3(new THREE.Vector3(-0.125, -0.125, -0.5), new THREE.Vector3(0.125, 0.125, 0.25))
        ]
      });
    }
  });
})();
