(function() {
  registerModsInit(function() {
    mods.registerStairs = function(item, displayName, icon) {
      var props = getItemProps(item);
      if(displayName == undefined) {
        displayName = props.displayName + " Stairs";
      }
      
      //FIXME if interact, onplace, etc. present
      var newProps = {};
      for(var i = 0; i < items.length; i++) {
        if(items[i].name == props.name) {
          newProps = deepcopy(items[i]);
          break;
        }
      }
      
      //FIXME if two identical item names in different namespaces
      if(props.name.indexOf(":") != -1) {
        newProps.name = "stairs:" + props.name.substring(props.name.indexOf(":") + 1) + "_stairs";
      } else {
        newProps.name = "stairs:" + props.name + "_stairs";
      }
      newProps.displayName = displayName;
      
      newProps.customMesh = true;
      newProps.meshVertices = [
        //top back
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, 0,

        0.5, 0.5, -0.5,
        0.5, 0.5, 0,
        -0.5, 0.5, 0,
        
        //top front
        -0.5, 0, 0,
        0.5, 0, 0,
        -0.5, 0, 0.5,

        0.5, 0, 0,
        0.5, 0, 0.5,
        -0.5, 0, 0.5,
        
        //bottom
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,

        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
        
        //front top
        -0.5, 0.5, 0,
        0.5, 0.5, 0,
        -0.5, 0, 0,

        0.5, 0.5, 0,
        0.5, 0, 0,
        -0.5, 0, 0,
        
        //front bottom
        -0.5, 0, 0.5,
        0.5, 0, 0.5,
        -0.5, -0.5, 0.5,

        0.5, 0, 0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
        
        //back
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,

        0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,
        -0.5, -0.5, -0.5,
        
        //left
        //14  5
        //
        //    67  8
        //
        //3      29
        -0.5, 0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5,

        -0.5, 0.5, -0.5,
        -0.5, 0.5, 0,
        -0.5, 0, 0,

        -0.5, 0, 0,
        -0.5, 0, 0.5,
        -0.5, -0.5, 0.5,
        
        //right
        0.5, 0.5, -0.5,
        0.5, -0.5, 0.5,
        0.5, -0.5, -0.5,

        0.5, 0.5, -0.5,
        0.5, 0.5, 0,
        0.5, 0, 0,

        0.5, 0, 0,
        0.5, 0, 0.5,
        0.5, -0.5, 0.5
      ];
      var tex = props.textureOffset;
      var ts = textureMapIndexScale;
      newProps.meshUVs = [
        //top back
        0.0 + (tex[0].x*ts), uvSize + (tex[0].y*ts),
        uvSize + (tex[0].x*ts), uvSize + (tex[0].y*ts),
        0.0 + (tex[0].x*ts), uvSize/2 + (tex[0].y*ts),
        
        uvSize + (tex[0].x*ts), uvSize + (tex[0].y*ts),
        uvSize + (tex[0].x*ts), uvSize/2 + (tex[0].y*ts),
        0.0 + (tex[0].x*ts), uvSize/2 + (tex[0].y*ts),
        
        //top front
        0.0 + (tex[0].x*ts), uvSize/2 + (tex[0].y*ts),
        uvSize + (tex[0].x*ts), uvSize/2 + (tex[0].y*ts),
        0.0 + (tex[0].x*ts), 0.0 + (tex[0].y*ts),
        
        uvSize + (tex[0].x*ts), uvSize/2 + (tex[0].y*ts),
        uvSize + (tex[0].x*ts), 0.0 + (tex[0].y*ts),
        0.0 + (tex[0].x*ts), 0.0 + (tex[0].y*ts),
        
        //bottom
        0.0 + (tex[1].x*ts), uvSize + (tex[1].y*ts),
        uvSize + (tex[1].x*ts), uvSize + (tex[1].y*ts),
        0.0 + (tex[1].x*ts), 0.0 + (tex[1].y*ts),
        
        uvSize + (tex[1].x*ts), uvSize + (tex[1].y*ts),
        uvSize + (tex[1].x*ts), 0.0 + (tex[1].y*ts),
        0.0 + (tex[1].x*ts), 0.0 + (tex[1].y*ts),
        
        //front top
        0.0 + (tex[4].x*ts), uvSize + (tex[4].y*ts),
        uvSize + (tex[4].x*ts), uvSize + (tex[4].y*ts),
        0.0 + (tex[4].x*ts), uvSize/2 + (tex[4].y*ts),
        
        uvSize + (tex[4].x*ts), uvSize + (tex[4].y*ts),
        uvSize + (tex[4].x*ts), uvSize/2 + (tex[4].y*ts),
        0.0 + (tex[4].x*ts), uvSize/2 + (tex[4].y*ts),
        
        //front bottom
        0.0 + (tex[4].x*ts), uvSize/2 + (tex[4].y*ts),
        uvSize + (tex[4].x*ts), uvSize/2 + (tex[4].y*ts),
        0.0 + (tex[4].x*ts), 0.0 + (tex[4].y*ts),
        
        uvSize + (tex[4].x*ts), uvSize/2 + (tex[4].y*ts),
        uvSize + (tex[4].x*ts), 0.0 + (tex[4].y*ts),
        0.0 + (tex[4].x*ts), 0.0 + (tex[4].y*ts),
        
        //back
        0.0 + (tex[5].x*ts), uvSize + (tex[5].y*ts),
        uvSize + (tex[5].x*ts), uvSize + (tex[5].y*ts),
        0.0 + (tex[5].x*ts), 0.0 + (tex[5].y*ts),
        
        uvSize + (tex[5].x*ts), uvSize + (tex[5].y*ts),
        uvSize + (tex[5].x*ts), 0.0 + (tex[5].y*ts),
        0.0 + (tex[5].x*ts), 0.0 + (tex[5].y*ts),
        
        //left
        0.0 + (tex[2].x*ts), uvSize + (tex[2].y*ts),
        uvSize + (tex[2].x*ts), 0.0 + (tex[2].y*ts),
        0.0 + (tex[2].x*ts), 0.0 + (tex[2].y*ts),
        
        0.0 + (tex[2].x*ts), uvSize + (tex[2].y*ts),
        uvSize/2 + (tex[2].x*ts), uvSize + (tex[2].y*ts),
        uvSize/2 + (tex[2].x*ts), uvSize/2 + (tex[2].y*ts),
        
        uvSize/2 + (tex[2].x*ts), uvSize/2 + (tex[2].y*ts),
        uvSize + (tex[2].x*ts), uvSize/2 + (tex[2].y*ts),
        uvSize + (tex[2].x*ts), 0.0 + (tex[2].y*ts),
        
        //right
        0.0 + (tex[3].x*ts), uvSize + (tex[3].y*ts),
        uvSize + (tex[3].x*ts), 0.0 + (tex[3].y*ts),
        0.0 + (tex[3].x*ts), 0.0 + (tex[3].y*ts),
        
        0.0 + (tex[3].x*ts), uvSize + (tex[3].y*ts),
        uvSize/2 + (tex[3].x*ts), uvSize + (tex[3].y*ts),
        uvSize/2 + (tex[3].x*ts), uvSize/2 + (tex[3].y*ts),
        
        uvSize/2 + (tex[3].x*ts), uvSize/2 + (tex[3].y*ts),
        uvSize + (tex[3].x*ts), uvSize/2 + (tex[3].y*ts),
        uvSize + (tex[3].x*ts), 0.0 + (tex[3].y*ts)
      ];
      newProps.meshFaces = [
        {dir: new THREE.Vector3(0, 1, 0), length: 12},
        {dir: new THREE.Vector3(0, -1, 0), length: 6},
        {dir: new THREE.Vector3(0, 0, 1), length: 12},
        {dir: new THREE.Vector3(0, 0, -1), length: 6},
        {dir: new THREE.Vector3(-1, 0, 0), length: 9},
        {dir: new THREE.Vector3(1, 0, 0), length: 9}
      ];
      if("drops" in newProps) {
        delete newProps.drops;
      }
      newProps.transparent = true;
      if(icon != undefined) {
        newProps.icon = icon;
      }
      
      if(props.groups.includes("planks")) {
        newProps.groups.splice(newProps.groups.indexOf("planks"), 1);
      }
      
      newProps.customHitbox = [
        new THREE.Box3(new THREE.Vector3(-0.5, -0.5, -0.5), new THREE.Vector3(0.5, 0, 0.5)),
        new THREE.Box3(new THREE.Vector3(-0.5, -0.5, -0.5), new THREE.Vector3(0.5, 0.5, 0))
      ];
      
      newProps.directional = true;
      
      registerItem(newProps);
      
      mods.registerCraft({
        size: new THREE.Vector2(3, 3),
        shapeless: false,
        in: [
          item, null, null,
          item, item, null,
          item, item, item
        ],
        out: new InvItem(newProps.name, 4)
      });
      
      mods.registerCraft({
        size: new THREE.Vector2(3, 3),
        shapeless: false,
        in: [
          null, null, item,
          null, item, item,
          item, item, item
        ],
        out: new InvItem(newProps.name, 4)
      });
      
      return newProps.name;
    };
    
    mods.registerStairs("default:oak_planks", "Oak Stairs", "textures/icons/oak_stairs.png");
    mods.registerStairs("default:spruce_planks", "Spruce Stairs", "textures/icons/spruce_stairs.png");
    mods.registerStairs("default:birch_planks", "Birch Stairs", "textures/icons/birch_stairs.png");
    mods.registerStairs("default:jungle_planks", "Jungle Stairs", "textures/icons/jungle_stairs.png"); //FIXME rename "Jungle Wood Stairs"?
    mods.registerStairs("default:acacia_planks", "Acacia Stairs", "textures/icons/acacia_stairs.png");
    
    mods.registerStairs("default:sandstone", "Sandstone Stairs", "textures/icons/sandstone_stairs.png");
    mods.registerStairs("default:cobblestone", "Cobblestone Stairs", "textures/icons/cobblestone_stairs.png");
    mods.registerStairs("default:mossy_cobblestone", "Mossy Cobblestone Stairs", "textures/icons/cobblestone_stairs_mossy.png");
    mods.registerStairs("default:stone", "Stone Stairs", "textures/icons/stone_stairs.png");
    mods.registerStairs("default:brick_block", "Brick Stairs", "textures/icons/brick_stairs.png");
    mods.registerStairs("default:stonebrick", "Stone Brick Stairs", "textures/icons/stonebrick_stairs.png");
    mods.registerStairs("default:stonebrick_mossy", "Mossy Stone Brick Stairs", "textures/icons/stonebrick_stairs_mossy.png");
    
    if(getItemID("ores:quartz_block") != null) {
      mods.registerStairs("ores:quartz_block", "Quartz Stairs", "textures/icons/quartz_stairs.png");
    }
  });
})();
