(function() {
  function swapDoor(pos) {
    var block = getBlock(pos);
    var props = getItemProps(block);
    if(props.name == "door:door_closed") {
      intelligentSetBlock(pos, getItemID("door:door_open"));
    } else if(props.name == "door:door_open") {
      intelligentSetBlock(pos, getItemID("door:door_closed"));
    } else if(props.name == "door:trapdoor_closed") {
      intelligentSetBlock(pos, getItemID("door:trapdoor_open"));
    } else if(props.name == "door:trapdoor_open") {
      intelligentSetBlock(pos, getItemID("door:trapdoor_closed"));
    }
  }
  
  registerItem({
    name: "door:door_closed",
    icon: "textures/items/door_wood.png",
    groups: ["wood"],
    hardness: 3,
    interact: swapDoor,
    customMesh: true,
    meshVertices: [
      //front
      -0.5, 1.499, 0.5,
      0.5, 1.499, 0.5,
      -0.5, -0.5, 0.5,
       
      0.5, 1.499, 0.5,
      0.5, -0.5, 0.5,
      -0.5, -0.5, 0.5,
      
      //back
      -0.5, 1.499, 0.375,
      0.5, 1.499, 0.375,
      -0.5, -0.5, 0.375,
       
      0.5, 1.499, 0.375,
      0.5, -0.5, 0.375,
      -0.5, -0.5, 0.375,
      
      //left
      -0.5, 1.499, 0.375,
      -0.5, 1.499, 0.5,
      -0.5, -0.5, 0.375,

      -0.5, 1.499, 0.5,
      -0.5, -0.5, 0.5,
      -0.5, -0.5, 0.375,
      
      //right
      0.5, 1.499, 0.375,
      0.5, 1.499, 0.5,
      0.5, -0.5, 0.375,

      0.5, 1.499, 0.5,
      0.5, -0.5, 0.5,
      0.5, -0.5, 0.375,
      
      //top
      -0.5, 1.499, 0.375,
      0.5, 1.499, 0.375,
      -0.5, 1.499, 0.5,

      0.5, 1.499, 0.375,
      0.5, 1.499, 0.5,
      -0.5, 1.499, 0.5,
      
      //bottom
      -0.5, -0.5, 0.375,
      0.5, -0.5, 0.375,
      -0.5, -0.5, 0.5,

      0.5, -0.5, 0.375,
      0.5, -0.5, 0.5,
      -0.5, -0.5, 0.5
    ],
    meshUVs: [
      //front
      80/512, 64/512,
      96/512, 64/512,
      80/512, 32/512,

      96/512, 64/512,
      96/512, 32/512,
      80/512, 32/512,
      
      //back
      80/512, 64/512,
      96/512, 64/512,
      80/512, 32/512,

      96/512, 64/512,
      96/512, 32/512,
      80/512, 32/512,
      
      //left
      80/512, 64/512,
      81/512, 64/512,
      80/512, 32/512,

      81/512, 64/512,
      81/512, 32/512,
      80/512, 32/512,
      
      //right
      95/512, 64/512,
      96/512, 64/512,
      95/512, 32/512,

      96/512, 64/512,
      96/512, 32/512,
      95/512, 32/512,
      
      //top
      80/512, 64/512,
      96/512, 64/512,
      80/512, 63/512,

      96/512, 64/512,
      96/512, 63/512,
      80/512, 63/512,
      
      //bottom
      80/512, 33/512,
      96/512, 33/512,
      80/512, 32/512,

      96/512, 33/512,
      96/512, 32/512,
      80/512, 32/512
    ],
    meshFaces: [
      {dir: new THREE.Vector3(0, 0, 1), length: 6},
      {dir: new THREE.Vector3(0, 0, -1), length: 6},
      {dir: new THREE.Vector3(-1, 0, 0), length: 6},
      {dir: new THREE.Vector3(1, 0, 0), length: 6},
      {dir: new THREE.Vector3(0, 1, 0), length: 6},
      {dir: new THREE.Vector3(0, -1, 0), length: 6}
    ],
    transparent: true,
    customHitbox: [new THREE.Box3(new THREE.Vector3(-0.5, -0.5, 0.375), new THREE.Vector3(0.5, 1.5, 0.5))]
  });
  
  registerItem({
    name: "door:door_open",
    icon: "textures/items/door_wood.png",
    groups: ["wood"],
    hardness: 3,
    inInventory: false,
    drops: new InvItem("door:door_closed", 1),
    interact: swapDoor,
    customMesh: true,
    meshVertices: [
      //right
      -0.375, 1.499, 0.5,
      -0.375, 1.499, -0.5,
      -0.375, -0.5, 0.5,

      -0.375, 1.499, -0.5,
      -0.375, -0.5, -0.5,
      -0.375, -0.5, 0.5,
      
      //left
      -0.5, 1.499, 0.5,
      -0.5, 1.499, -0.5,
      -0.5, -0.5, 0.5,

      -0.5, 1.499, -0.5,
      -0.5, -0.5, -0.5,
      -0.5, -0.5, 0.5,
      
      //front
      -0.5, 1.499, 0.5,
      -0.375, 1.499, 0.5,
      -0.5, -0.5, 0.5,

      -0.375, 1.499, 0.5,
      -0.375, -0.5, 0.5,
      -0.5, -0.5, 0.5,
      
      //back
      -0.5, 1.499, -0.5,
      -0.375, 1.499, -0.5,
      -0.5, -0.5, -0.5,

      -0.375, 1.499, -0.5,
      -0.375, -0.5, -0.5,
      -0.5, -0.5, -0.5,
      
      //top
      -0.5, 1.499, 0.5,
      -0.5, 1.499, -0.5,
      -0.375, 1.499, 0.5,

      -0.5, 1.499, -0.5,
      -0.375, 1.499, -0.5,
      -0.375, 1.499, 0.5,
      
      //bottom
      -0.5, -0.5, 0.5,
      -0.5, -0.5, -0.5,
      -0.375, -0.5, 0.5,

      -0.5, -0.5, -0.5,
      -0.375, -0.5, -0.5,
      -0.375, -0.5, 0.5
    ],
    meshUVs: [
      //right (front)
      80/512, 64/512,
      96/512, 64/512,
      80/512, 32/512,

      96/512, 64/512,
      96/512, 32/512,
      80/512, 32/512,
      
      //left (back)
      80/512, 64/512,
      96/512, 64/512,
      80/512, 32/512,

      96/512, 64/512,
      96/512, 32/512,
      80/512, 32/512,
      
      //front (left)
      80/512, 64/512,
      81/512, 64/512,
      80/512, 32/512,

      81/512, 64/512,
      81/512, 32/512,
      80/512, 32/512,
      
      //back (right)
      95/512, 64/512,
      96/512, 64/512,
      95/512, 32/512,

      96/512, 64/512,
      96/512, 32/512,
      95/512, 32/512,
      
      //top
      80/512, 64/512,
      96/512, 64/512,
      80/512, 63/512,

      96/512, 64/512,
      96/512, 63/512,
      80/512, 63/512,
      
      //bottom
      80/512, 33/512,
      96/512, 33/512,
      80/512, 32/512,

      96/512, 33/512,
      96/512, 32/512,
      80/512, 32/512
    ],
    meshFaces: [
      {dir: new THREE.Vector3(1, 0, 0), length: 6},
      {dir: new THREE.Vector3(-1, 0, 0), length: 6},
      {dir: new THREE.Vector3(0, 0, 1), length: 6},
      {dir: new THREE.Vector3(0, 0, -1), length: 6},
      {dir: new THREE.Vector3(0, 1, 0), length: 6},
      {dir: new THREE.Vector3(0, -1, 0), length: 6}
    ],
    transparent: true,
    customHitbox: [new THREE.Box3(new THREE.Vector3(-0.5, -0.5, -0.5), new THREE.Vector3(-0.375, 1.5, 0.5))]
  });
  
  mods.registerCraft({
    size: new THREE.Vector2(2, 3),
    shapeless: false,
    in: ["group:planks", "group:planks", "group:planks", "group:planks", "group:planks", "group:planks"],
    out: new InvItem("door:door_closed", 1)
  });
  
  var tex = new THREE.Vector2(0, 128);
  var ts = textureMapIndexScale;
  registerItem({
    name: "door:trapdoor_closed",
    icon: "textures/icons/oak_trapdoor.png",
    groups: ["wood"],
    hardness: 3,
    interact: swapDoor,
    customMesh: true,
    meshVertices: [
      //top
      -0.5, 0.5, -0.5,
      0.5, 0.5, -0.5,
      -0.5, 0.5, 0.5,

      0.5, 0.5, -0.5,
      0.5, 0.5, 0.5,
      -0.5, 0.5, 0.5,

      //bottom
      -0.5, 0.375, -0.5,
      0.5, 0.375, -0.5,
      -0.5, 0.375, 0.5,

      0.5, 0.375, -0.5,
      0.5, 0.375, 0.5,
      -0.5, 0.375, 0.5,
      
      //left
      -0.5, 0.5, -0.5,
      -0.5, 0.5, 0.5,
      -0.5, 0.375, -0.5,

      -0.5, 0.5, 0.5,
      -0.5, 0.375, 0.5,
      -0.5, 0.375, -0.5,
      
      //right
      0.5, 0.5, -0.5,
      0.5, 0.5, 0.5,
      0.5, 0.375, -0.5,

      0.5, 0.5, 0.5,
      0.5, 0.375, 0.5,
      0.5, 0.375, -0.5,
      
      //front
      -0.5, 0.5, 0.5,
      0.5, 0.5, 0.5,
      -0.5, 0.375, 0.5,

      0.5, 0.5, 0.5,
      0.5, 0.375, 0.5,
      -0.5, 0.375, 0.5,
      
      //back
      -0.5, 0.5, -0.5,
      0.5, 0.5, -0.5,
      -0.5, 0.375, -0.5,

      0.5, 0.5, -0.5,
      0.5, 0.375, -0.5,
      -0.5, 0.375, -0.5
    ],
    meshUVs: [
      //top
      0.0 + (tex.x*ts), uvSize + (tex.y*ts),
      uvSize + (tex.x*ts), uvSize + (tex.y*ts),
      0.0 + (tex.x*ts), 0.0 + (tex.y*ts),

      uvSize + (tex.x*ts), uvSize + (tex.y*ts),
      uvSize + (tex.x*ts), 0.0 + (tex.y*ts),
      0.0 + (tex.x*ts), 0.0 + (tex.y*ts),
      
      //bottom
      0.0 + (tex.x*ts), uvSize + (tex.y*ts),
      uvSize + (tex.x*ts), uvSize + (tex.y*ts),
      0.0 + (tex.x*ts), 0.0 + (tex.y*ts),

      uvSize + (tex.x*ts), uvSize + (tex.y*ts),
      uvSize + (tex.x*ts), 0.0 + (tex.y*ts),
      0.0 + (tex.x*ts), 0.0 + (tex.y*ts),
      
      //left
      uvSize/16 + (tex.x*ts), uvSize + (tex.y*ts),
      uvSize/16 + (tex.x*ts), 0 + (tex.y*ts),
      0.0 + (tex.x*ts), uvSize + (tex.y*ts),

      uvSize/16 + (tex.x*ts), 0.0 + (tex.y*ts),
      0.0 + (tex.x*ts), 0.0 + (tex.y*ts),
      0.0 + (tex.x*ts), uvSize + (tex.y*ts),
      
      //right
      uvSize + (tex.x*ts), uvSize + (tex.y*ts),
      uvSize + (tex.x*ts), 0 + (tex.y*ts),
      uvSize*(15/16) + (tex.x*ts), uvSize + (tex.y*ts),

      uvSize + (tex.x*ts), 0.0 + (tex.y*ts),
      uvSize*(15/16) + (tex.x*ts), 0.0 + (tex.y*ts),
      uvSize*(15/16) + (tex.x*ts), uvSize + (tex.y*ts),
      
      //front
      0.0 + (tex.x*ts), uvSize/16 + (tex.y*ts),
      uvSize + (tex.x*ts), uvSize/16 + (tex.y*ts),
      0.0 + (tex.x*ts), 0.0 + (tex.y*ts),

      uvSize + (tex.x*ts), uvSize/16 + (tex.y*ts),
      uvSize + (tex.x*ts), 0.0 + (tex.y*ts),
      0.0 + (tex.x*ts), 0.0 + (tex.y*ts),
      
      //back
      0.0 + (tex.x*ts), uvSize + (tex.y*ts),
      uvSize + (tex.x*ts), uvSize + (tex.y*ts),
      0.0 + (tex.x*ts), uvSize*(15/16) + (tex.y*ts),

      uvSize + (tex.x*ts), uvSize + (tex.y*ts),
      uvSize + (tex.x*ts), uvSize*(15/16) + (tex.y*ts),
      0.0 + (tex.x*ts), uvSize*(15/16) + (tex.y*ts)
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
    customHitbox: [new THREE.Box3(new THREE.Vector3(-0.5, 0.375, -0.5), new THREE.Vector3(0.5, 0.5, 0.5))]
  });
  
  var tex = new THREE.Vector2(0, 128);
  var ts = textureMapIndexScale;
  registerItem({
    name: "door:trapdoor_open",
    icon: "textures/icons/oak_trapdoor.png",
    inInventory: false,
    drops: new InvItem("door:trapdoor_closed", 1),
    groups: ["wood"],
    hardness: 3,
    interact: swapDoor,
    customMesh: true,
    meshVertices: [
      //top
      -0.375, 0.5, -0.5,
      -0.375, 0.5, 0.5,
      -0.5, 0.5, -0.5,

      -0.375, 0.5, 0.5,
      -0.5, 0.5, 0.5,
      -0.5, 0.5, -0.5,

      //bottom
      -0.375, -0.5, -0.5,
      -0.375, -0.5, 0.5,
      -0.5, -0.5, -0.5,

      -0.375, -0.5, 0.5,
      -0.5, -0.5, 0.5,
      -0.5, -0.5, -0.5,
      
      //1      24
      //
      //
      //36     5
      
      //36     1
      //
      //
      //5     24
      
      //left
      -0.5, 0.5, 0.5,
      -0.5, -0.5, 0.5,
      -0.5, 0.5, -0.5,

      -0.5, -0.5, 0.5,
      -0.5, -0.5, -0.5,
      -0.5, 0.5, -0.5,
      
      //right
      -0.375, 0.5, 0.5,
      -0.375, -0.5, 0.5,
      -0.375, 0.5, -0.5,

      -0.375, -0.5, 0.5,
      -0.375, -0.5, -0.5,
      -0.375, 0.5, -0.5,
      
      //front
      -0.375, 0.5, 0.5,
      -0.375, -0.5, 0.5,
      -0.5, 0.5, 0.5,

      -0.375, -0.5, 0.5,
      -0.5, -0.5, 0.5,
      -0.5, 0.5, 0.5,
      
      //back
      -0.375, 0.5, -0.5,
      -0.375, -0.5, -0.5,
      -0.5, 0.5, -0.5,

      -0.375, -0.5, -0.5,
      -0.5, -0.5, -0.5,
      -0.5, 0.5, -0.5
    ],
    meshUVs: [
      //top (left)
      uvSize/16 + (tex.x*ts), uvSize + (tex.y*ts),
      uvSize/16 + (tex.x*ts), 0 + (tex.y*ts),
      0.0 + (tex.x*ts), uvSize + (tex.y*ts),

      uvSize/16 + (tex.x*ts), 0.0 + (tex.y*ts),
      0.0 + (tex.x*ts), 0.0 + (tex.y*ts),
      0.0 + (tex.x*ts), uvSize + (tex.y*ts),
      
      //bottom (right)
      uvSize + (tex.x*ts), uvSize + (tex.y*ts),
      uvSize + (tex.x*ts), 0 + (tex.y*ts),
      uvSize*(15/16) + (tex.x*ts), uvSize + (tex.y*ts),

      uvSize + (tex.x*ts), 0.0 + (tex.y*ts),
      uvSize*(15/16) + (tex.x*ts), 0.0 + (tex.y*ts),
      uvSize*(15/16) + (tex.x*ts), uvSize + (tex.y*ts),
      
      //left (bottom)
      0.0 + (tex.x*ts), uvSize + (tex.y*ts),
      uvSize + (tex.x*ts), uvSize + (tex.y*ts),
      0.0 + (tex.x*ts), 0.0 + (tex.y*ts),

      uvSize + (tex.x*ts), uvSize + (tex.y*ts),
      uvSize + (tex.x*ts), 0.0 + (tex.y*ts),
      0.0 + (tex.x*ts), 0.0 + (tex.y*ts),
      
      //right (top)
      0.0 + (tex.x*ts), uvSize + (tex.y*ts),
      uvSize + (tex.x*ts), uvSize + (tex.y*ts),
      0.0 + (tex.x*ts), 0.0 + (tex.y*ts),

      uvSize + (tex.x*ts), uvSize + (tex.y*ts),
      uvSize + (tex.x*ts), 0.0 + (tex.y*ts),
      0.0 + (tex.x*ts), 0.0 + (tex.y*ts),
      
      //front
      0.0 + (tex.x*ts), uvSize/16 + (tex.y*ts),
      uvSize + (tex.x*ts), uvSize/16 + (tex.y*ts),
      0.0 + (tex.x*ts), 0.0 + (tex.y*ts),

      uvSize + (tex.x*ts), uvSize/16 + (tex.y*ts),
      uvSize + (tex.x*ts), 0.0 + (tex.y*ts),
      0.0 + (tex.x*ts), 0.0 + (tex.y*ts),
      
      //back
      0.0 + (tex.x*ts), uvSize + (tex.y*ts),
      uvSize + (tex.x*ts), uvSize + (tex.y*ts),
      0.0 + (tex.x*ts), uvSize*(15/16) + (tex.y*ts),

      uvSize + (tex.x*ts), uvSize + (tex.y*ts),
      uvSize + (tex.x*ts), uvSize*(15/16) + (tex.y*ts),
      0.0 + (tex.x*ts), uvSize*(15/16) + (tex.y*ts)
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
    customHitbox: [new THREE.Box3(new THREE.Vector3(-0.5, -0.5, -0.5), new THREE.Vector3(-0.375, 0.5, 0.5))]
  });
})();
