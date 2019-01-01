(function() {
  registerModsInit(function() {
    mods.registerSlab = function(item, displayName, icon) {
      var props = getItemProps(item);
      if(displayName == undefined) {
        displayName = props.displayName + " Slab";
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
        newProps.name = "slab:" + props.name.substring(props.name.indexOf(":") + 1) + "_slab";
      } else {
        newProps.name = "slab:" + props.name + "_slab";
      }
      newProps.displayName = displayName;
      
      newProps.customMesh = true;
      newProps.meshVertices = [
        -0.5, 0, -0.5, //top
        0.5, 0, -0.5,
        -0.5, 0, 0.5,

        0.5, 0, -0.5,
        0.5, 0, 0.5,
        -0.5, 0, 0.5,

        -0.5, -0.5, -0.5, //bottom
        0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,

        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,

        -0.5, 0, -0.5, //left
        -0.5, 0, 0.5,
        -0.5, -0.5, -0.5,

        -0.5, 0, 0.5,
        -0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5,

        0.5, 0, -0.5, //right
        0.5, 0, 0.5,
        0.5, -0.5, -0.5,

        0.5, 0, 0.5,
        0.5, -0.5, 0.5,
        0.5, -0.5, -0.5,

        -0.5, 0, 0.5, //front
        0.5, 0, 0.5,
        -0.5, -0.5, 0.5,

        0.5, 0, 0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,

        -0.5, 0, -0.5, //back
        0.5, 0, -0.5,
        -0.5, -0.5, -0.5,

        0.5, 0, -0.5,
        0.5, -0.5, -0.5,
        -0.5, -0.5, -0.5
      ];
      var tex = props.textureOffset;
      var ts = textureMapIndexScale;
      newProps.meshUVs = [
        //top
        0.0 + (tex[0].x*ts), uvSize + (tex[0].y*ts),
        uvSize + (tex[0].x*ts), uvSize + (tex[0].y*ts),
        0.0 + (tex[0].x*ts), 0.0 + (tex[0].y*ts),
        
        uvSize + (tex[0].x*ts), uvSize + (tex[0].y*ts),
        uvSize + (tex[0].x*ts), 0.0 + (tex[0].y*ts),
        0.0 + (tex[0].x*ts), 0.0 + (tex[0].y*ts),
        
        //bottom
        0.0 + (tex[1].x*ts), uvSize + (tex[1].y*ts),
        uvSize + (tex[1].x*ts), uvSize + (tex[1].y*ts),
        0.0 + (tex[1].x*ts), 0.0 + (tex[1].y*ts),
        
        uvSize + (tex[1].x*ts), uvSize + (tex[1].y*ts),
        uvSize + (tex[1].x*ts), 0.0 + (tex[1].y*ts),
        0.0 + (tex[1].x*ts), 0.0 + (tex[1].y*ts),
        
        //left
        0.0 + (tex[2].x*ts), uvSize/2 + (tex[2].y*ts),
        uvSize + (tex[2].x*ts), uvSize/2 + (tex[2].y*ts),
        0.0 + (tex[2].x*ts), 0.0 + (tex[2].y*ts),
        
        uvSize + (tex[2].x*ts), uvSize/2 + (tex[2].y*ts),
        uvSize + (tex[2].x*ts), 0.0 + (tex[2].y*ts),
        0.0 + (tex[2].x*ts), 0.0 + (tex[2].y*ts),
        
        //right
        0.0 + (tex[3].x*ts), uvSize/2 + (tex[3].y*ts),
        uvSize + (tex[3].x*ts), uvSize/2 + (tex[3].y*ts),
        0.0 + (tex[3].x*ts), 0.0 + (tex[3].y*ts),
        
        uvSize + (tex[3].x*ts), uvSize/2 + (tex[3].y*ts),
        uvSize + (tex[3].x*ts), 0.0 + (tex[3].y*ts),
        0.0 + (tex[3].x*ts), 0.0 + (tex[3].y*ts),
        
        //front
        0.0 + (tex[4].x*ts), uvSize/2 + (tex[4].y*ts),
        uvSize + (tex[4].x*ts), uvSize/2 + (tex[4].y*ts),
        0.0 + (tex[4].x*ts), 0.0 + (tex[4].y*ts),
        
        uvSize + (tex[4].x*ts), uvSize/2 + (tex[4].y*ts),
        uvSize + (tex[4].x*ts), 0.0 + (tex[4].y*ts),
        0.0 + (tex[4].x*ts), 0.0 + (tex[4].y*ts),
        
        //back
        0.0 + (tex[5].x*ts), uvSize/2 + (tex[5].y*ts),
        uvSize + (tex[5].x*ts), uvSize/2 + (tex[5].y*ts),
        0.0 + (tex[5].x*ts), 0.0 + (tex[5].y*ts),
        
        uvSize + (tex[5].x*ts), uvSize/2 + (tex[5].y*ts),
        uvSize + (tex[5].x*ts), 0.0 + (tex[5].y*ts),
        0.0 + (tex[5].x*ts), 0.0 + (tex[5].y*ts)
      ];
      newProps.meshFaces = [
        {dir: new THREE.Vector3(0, 1, 0), length: 6},
        {dir: new THREE.Vector3(0, -1, 0), length: 6},
        {dir: new THREE.Vector3(-1, 0, 0), length: 6},
        {dir: new THREE.Vector3(1, 0, 0), length: 6},
        {dir: new THREE.Vector3(0, 0, 1), length: 6},
        {dir: new THREE.Vector3(0, 0, -1), length: 6}
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
      
      registerItem(newProps);
      
      mods.registerCraft({
        size: new THREE.Vector2(3, 1),
        shapeless: false,
        in: [
          item, item, item
        ],
        out: new InvItem(newProps.name, 6)
      });
      
      return newProps.name;
    };
    
    mods.registerSlab("default:oak_planks", "Oak Slab", "textures/icons/oak_slab.png");
    mods.registerSlab("default:spruce_planks", "Spruce Slab", "textures/icons/spruce_slab.png");
    mods.registerSlab("default:birch_planks", "Birch Slab", "textures/icons/birch_slab.png");
    mods.registerSlab("default:jungle_planks", "Jungle Slab", "textures/icons/jungle_slab.png"); //FIXME rename "Jungle Wood Slab"?
    mods.registerSlab("default:acacia_planks", "Acacia Slab", "textures/icons/acacia_slab.png");
    
    mods.registerSlab("default:sandstone", "Sandstone Slab", "textures/icons/sandstone_slab.png");
    mods.registerSlab("default:cobblestone", "Cobblestone Slab", "textures/icons/cobblestone_slab.png");
    mods.registerSlab("default:mossy_cobblestone", "Mossy Cobblestone Slab", "textures/icons/cobblestone_slab_mossy.png");
    mods.registerSlab("default:stone", "Stone Slab", "textures/icons/stone_slab.png");
    mods.registerSlab("default:brick_block", "Brick Slab", "textures/icons/brick_slab.png");
    mods.registerSlab("default:stonebrick", "Stone Brick Slab", "textures/icons/stonebrick_slab.png");
    mods.registerSlab("default:stonebrick_mossy", "Mossy Stone Brick Slab", "textures/icons/stonebrick_slab_mossy.png");
    
    if(getItemID("ores:quartz_block") != null) {
      mods.registerSlab("ores:quartz_block", "Quartz Slab", "textures/icons/quartz_slab.png");
    }
  });
})();
