//Groups: dirt, wood, stone, ore, glass, leaves, ore_block, wool, planks, log, axe, pickaxe

var TOOL_LEVEL_NONE = 0;
var TOOL_LEVEL_WOOD = 1;
var TOOL_LEVEL_STONE = 2;
var TOOL_LEVEL_IRON = 3;
var TOOL_LEVEL_DIAMOND = 4;
var TOOL_LEVEL_GOLD = 3;

var itemDefaults = {
  visible: true,
  transparent: false,
  walkable: false,
  textureOffset: [new THREE.Vector2(16, 112), new THREE.Vector2(16, 112), new THREE.Vector2(16, 112), new THREE.Vector2(16, 112), new THREE.Vector2(16, 112), new THREE.Vector2(16, 112)],
  lightLevel: 0,
  customMesh: false,
  meshVertices: null,
  meshUVs: null,
  meshFaces: null,
  placeable: true,
  icon: null,
  groups: [],
  drops: null,
  stackable: true,
  maxStack: 64,
  isConsumable: true,
  inInventory: true,
  interact: null,
  onPlace: null,
  onDestroy: null,
  noRenderAdjacent: false, //used for water and similar - even if the block is transparent, don't render its side face if the block on that side is the same as this block
  raycast: true,
  fluidPhysics: null,
  tintColor: null,
  displayName: "",
  isTool: false,
  toolLife: 0,
  toolGroups: [],
  toolSpeedMul: 1,
  toolLevel: TOOL_LEVEL_NONE,
  hardness: 1,
  reqToolLevel: TOOL_LEVEL_NONE,
  furnaceFuel: null,
  isFood: false,
  foodPoints: 0,
  foodSat: 0
};
var items = [
  {name: "default:air", visible: false, walkable: true, transparent: true, placeable: false, inInventory: false},
  {name: "default:dirt", displayName: "Dirt", textureOffsetAlt: {all: new THREE.Vector2(64, 112)}, icon: "textures/icons/dirt.png", groups: ["dirt"], hardness: 0.5},
  {name: "default:grass_block", displayName: "Grass Block", textureOffsetAlt: {top: new THREE.Vector2(32, 112), bottom: new THREE.Vector2(64, 112), sides: new THREE.Vector2(48, 112)}, icon: "textures/icons/grass_block.png", groups: ["dirt"], drops: new InvItem("default:dirt", 1), hardness: 0.6},
  {name: "default:stone", displayName: "Stone", textureOffsetAlt: {all: new THREE.Vector2(16, 112)}, icon: "textures/icons/stone.png", groups: ["stone"], drops: new InvItem("default:cobblestone", 1), hardness: 1.5, reqToolLevel: TOOL_LEVEL_WOOD},
  {name: "default:cobblestone", displayName: "Cobblestone", textureOffsetAlt: {all: new THREE.Vector2(64, 96)}, icon: "textures/icons/cobblestone.png", groups: ["stone"], hardness: 2, reqToolLevel: TOOL_LEVEL_WOOD},
  {name: "default:mossy_cobblestone", displayName: "Mossy Cobblestone", textureOffsetAlt: {all: new THREE.Vector2(192, 112)}, icon: "textures/icons/mossy_cobblestone.png", groups: ["stone"], hardness: 2, reqToolLevel: TOOL_LEVEL_WOOD},
  {name: "default:torch", displayName: "Torch", lightLevel: 10, transparent: true, walkable: true, icon: "textures/blocks/torch_on.png", customMesh: true,
    meshVertices: [
      //front
      -0.0625, 0.125, 0.0625,
      0.0625, 0.125, 0.0625,
      0.0625, -0.5, 0.0625,
      -0.0625, 0.125, 0.0625,
      -0.0625, -0.5, 0.0625,
      0.0625, -0.5, 0.0625,
      
      
      //back
      -0.0625, 0.125, -0.0625,
      0.0625, 0.125, -0.0625,
      0.0625, -0.5, -0.0625,
      -0.0625, 0.125, -0.0625,
      -0.0625, -0.5, -0.0625,
      0.0625, -0.5, -0.0625,
      
      //left
      -0.0625, 0.125, -0.0625,
      -0.0625, 0.125, 0.0625,
      -0.0625, -0.5, 0.0625,
      -0.0625, 0.125, -0.0625,
      -0.0625, -0.5, -0.0625,
      -0.0625, -0.5, 0.0625,
      
      //right
      0.0625, 0.125, -0.0625,
      0.0625, 0.125, 0.0625,
      0.0625, -0.5, 0.0625,
      0.0625, 0.125, -0.0625,
      0.0625, -0.5, -0.0625,
      0.0625, -0.5, 0.0625,
      
      //top
      -0.0625, 0.125, -0.0625,
      0.0625, 0.125, -0.0625,
      0.0625, 0.125, 0.0625,
      -0.0625, 0.125, -0.0625,
      -0.0625, 0.125, 0.0625,
      0.0625, 0.125, 0.0625
      //TODO: bottom
    ],
    meshUVs: [
      //front
      71/512, 58/512,
      73/512, 58/512,
      73/512, 48/512,
      71/512, 58/512,
      71/512, 48/512,
      73/512, 48/512,
      
      //back
      73/512, 58/512,
      71/512, 58/512,
      71/512, 48/512,
      73/512, 58/512,
      73/512, 48/512,
      71/512, 48/512,
      
      //left
      71/512, 58/512,
      73/512, 58/512,
      73/512, 48/512,
      71/512, 58/512,
      71/512, 48/512,
      73/512, 48/512,
      
      //right
      73/512, 58/512,
      71/512, 58/512,
      71/512, 48/512,
      73/512, 58/512,
      73/512, 48/512,
      71/512, 48/512,
      
      //top
      71/512, 58/512,
      73/512, 58/512,
      73/512, 56/512,
      71/512, 58/512,
      71/512, 56/512,
      73/512, 56/512
    ],
    meshFaces: [
      {dir: new THREE.Vector3(0, 0, 1), length: 6}, //front
      {dir: new THREE.Vector3(0, 0, -1), length: 6}, //back
      {dir: new THREE.Vector3(-1, 0, 0), length: 6}, //left
      {dir: new THREE.Vector3(1, 0, 0), length: 6}, //right
      {dir: new THREE.Vector3(0, 1, 0), length: 6} //top
    ],
    hardness: 0
  },
  {name: "default:sand", displayName: "Sand", textureOffsetAlt: {all: new THREE.Vector2(96, 112)}, icon: "textures/icons/sand.png", groups: ["dirt"], hardness: 0.5},
  {name: "default:glass", displayName: "Glass", textureOffsetAlt: {all: new THREE.Vector2(0, 96)}, icon: "textures/icons/glass.png", transparent: true, groups: ["glass"], hardness: 0.3},
  
  {name: "default:oak_planks", displayName: "Oak Planks", textureOffsetAlt: {all: new THREE.Vector2(80, 112)}, icon: "textures/icons/oak_planks.png", groups: ["wood", "planks"], hardness: 2, furnaceFuel: 15},
  {name: "default:oak_log", displayName: "Oak Log", textureOffsetAlt: {top: new THREE.Vector2(16, 96), bottom: new THREE.Vector2(16, 96), sides: new THREE.Vector2(32, 96)}, icon: "textures/icons/oak_log.png", groups: ["wood", "log"], hardness: 2, furnaceFuel: 15},
  {name: "default:leaves", displayName: "Oak Leaves", onDestroy: function() { if(Math.random() < 0.08) { givePlayerInventoryItem(new InvItem("default:apple", 1)); } return true; }, textureOffsetAlt: {all: new THREE.Vector2(48, 96)}, icon: "textures/icons/leaves.png", transparent: true, groups: ["leaves"], hardness: 0.2},
  
  {name: "default:acacia_planks", displayName: "Acacia Planks", textureOffsetAlt: {all: new THREE.Vector2(128, 96)}, icon: "textures/icons/acacia_planks.png", groups: ["wood", "planks"], hardness: 2, furnaceFuel: 15},
  {name: "default:acacia_log", displayName: "Acacia Log", textureOffsetAlt: {top: new THREE.Vector2(144, 96), bottom: new THREE.Vector2(144, 96), sides: new THREE.Vector2(160, 96)}, icon: "textures/icons/acacia_log.png", groups: ["wood", "log"], hardness: 2, furnaceFuel: 15},
  {name: "default:acacia_leaves", displayName: "Acacia Leaves", textureOffsetAlt: {all: new THREE.Vector2(176, 96)}, icon: "textures/icons/acacia_leaves.png", transparent: true, groups: ["leaves"], hardness: 0.2},
  
  {name: "default:birch_planks", displayName: "Birch Planks", textureOffsetAlt: {all: new THREE.Vector2(128, 80)}, icon: "textures/icons/birch_planks.png", groups: ["wood", "planks"], hardness: 2, furnaceFuel: 15},
  {name: "default:birch_log", displayName: "Birch Log", textureOffsetAlt: {top: new THREE.Vector2(144, 80), bottom: new THREE.Vector2(144, 80), sides: new THREE.Vector2(160, 80)}, icon: "textures/icons/birch_log.png", groups: ["wood", "log"], hardness: 2, furnaceFuel: 15},
  {name: "default:birch_leaves", displayName: "Birch Leaves", textureOffsetAlt: {all: new THREE.Vector2(176, 80)}, icon: "textures/icons/birch_leaves.png", transparent: true, groups: ["leaves"], hardness: 0.2},
  
  {name: "default:jungle_planks", displayName: "Jungle Planks", textureOffsetAlt: {all: new THREE.Vector2(128, 64)}, icon: "textures/icons/jungle_planks.png", groups: ["wood", "planks"], hardness: 2, furnaceFuel: 15},
  {name: "default:jungle_log", displayName: "Jungle Log", textureOffsetAlt: {top: new THREE.Vector2(144, 64), bottom: new THREE.Vector2(144, 64), sides: new THREE.Vector2(160, 64)}, icon: "textures/icons/jungle_log.png", groups: ["wood", "log"], hardness: 2, furnaceFuel: 15},
  {name: "default:jungle_leaves", displayName: "Jungle Leaves", textureOffsetAlt: {all: new THREE.Vector2(176, 64)}, icon: "textures/icons/jungle_leaves.png", transparent: true, groups: ["leaves"], hardness: 0.2},
  
  {name: "default:spruce_planks", displayName: "Spruce Planks", textureOffsetAlt: {all: new THREE.Vector2(128, 48)}, icon: "textures/icons/spruce_planks.png", groups: ["wood", "planks"], hardness: 2, furnaceFuel: 15},
  {name: "default:spruce_log", displayName: "Spruce Log", textureOffsetAlt: {top: new THREE.Vector2(144, 48), bottom: new THREE.Vector2(144, 48), sides: new THREE.Vector2(160, 48)}, icon: "textures/icons/spruce_log.png", groups: ["wood", "log"], hardness: 2, furnaceFuel: 15},
  {name: "default:spruce_leaves", displayName: "Spruce Leaves", textureOffsetAlt: {all: new THREE.Vector2(176, 48)}, icon: "textures/icons/spruce_leaves.png", transparent: true, groups: ["leaves"], hardness: 0.2},
  
  {name: "default:water_source", displayName: "Water Source", textureOffsetAlt: {all: new THREE.Vector2(112, 112)}, icon: "textures/icons/water.png", transparent: true, walkable: true, noRenderAdjacent: true, raycast: false, fluidPhysics: 0.3, tintColor: "rgba(0, 0, 255, 0.3)"},
  {name: "default:bedrock", displayName: "Bedrock", textureOffsetAlt: {all: new THREE.Vector2(128, 112)}, icon: "textures/icons/bedrock.png", hardness: 1000000},
  {name: "default:bookshelf", displayName: "Bookshelf", textureOffsetAlt: {top: new THREE.Vector2(80, 112), bottom: new THREE.Vector2(80, 112), sides: new THREE.Vector2(144, 112)}, icon: "textures/icons/bookshelf.png", groups: ["wood"], hardness: 1.5, furnaceFuel: 15},
  {name: "default:brick_block", displayName: "Brick Block", textureOffsetAlt: {all: new THREE.Vector2(160, 112)}, icon: "textures/icons/brick_block.png", groups: ["stone"], hardness: 2, reqToolLevel: TOOL_LEVEL_WOOD},
  //cactus, cake, crafting table, dispenser, dropper, various doors, plants, farmland, flowerpot, furnace, colored glass, glass pane, snowy grass, hardened clay, trapdoor, ladder, pistons, redstone lamp, tnt, trapdoor
  {name: "default:clay_block", displayName: "Clay Block", textureOffsetAlt: {all: new THREE.Vector2(176, 112)}, icon: "textures/icons/clay_block.png", groups: ["dirt"], hardness: 0.6},
  {name: "default:ice", displayName: "Ice", textureOffsetAlt: {all: new THREE.Vector2(208, 112)}, icon: "textures/icons/ice.png", transparent: true, noRenderAdjacent: true, groups: ["glass", "pickaxe"], hardness: 0.5}, //TODO: slippery ice
  {name: "default:obsidian", displayName: "Obsidian", textureOffsetAlt: {all: new THREE.Vector2(224, 112)}, icon: "textures/icons/obsidian.png", hardness: 50, groups: ["pickaxe"], reqToolLevel: TOOL_LEVEL_DIAMOND},
  {name: "default:pumpkin", displayName: "Pumpkin", textureOffsetAlt: {top: new THREE.Vector2(240, 112), bottom: new THREE.Vector2(240, 112), sides: new THREE.Vector2(192, 96)}, icon: "textures/icons/pumpkin.png", hardness: 1, groups: ["axe"]},
  {name: "default:pumpkin_off", displayName: "Carved Pumpkin", textureOffsetAlt: {top: new THREE.Vector2(240, 112), bottom: new THREE.Vector2(240, 112), sides: new THREE.Vector2(192, 96), front: new THREE.Vector2(208, 96)}, icon: "textures/icons/carved_pumpkin.png", hardness: 1, groups: ["axe"]},
  {name: "default:pumpkin_on", displayName: "Jack-o-Lantern", textureOffsetAlt: {top: new THREE.Vector2(240, 112), bottom: new THREE.Vector2(240, 112), sides: new THREE.Vector2(192, 96), front: new THREE.Vector2(224, 96)}, icon: "textures/icons/carved_pumpkin_on.png", lightLevel: 10, hardness: 1, groups: ["axe"]},
  {name: "default:melon", displayName: "Melon", drops: new InvItem("default:melon_slice", 5), textureOffsetAlt: {top: new THREE.Vector2(192, 0), bottom: new THREE.Vector2(192, 0), sides: new THREE.Vector2(208, 0)}, icon: "textures/icons/melon.png", hardness: 1, groups: ["axe"]},
  
  {name: "default:sandstone", displayName: "Sandstone", textureOffsetAlt: {top: new THREE.Vector2(240, 64), bottom: new THREE.Vector2(192, 48), sides: new THREE.Vector2(208, 48)}, icon: "textures/icons/sandstone.png", hardness: 0.8, groups: ["pickaxe"], reqToolLevel: TOOL_LEVEL_WOOD},
  {name: "default:sandstone_carved", displayName: "Carved Sandstone", textureOffsetAlt: {top: new THREE.Vector2(240, 64), bottom: new THREE.Vector2(192, 48), sides: new THREE.Vector2(224, 48)}, icon: "textures/icons/sandstone_carved.png", hardness: 0.8, groups: ["pickaxe"], reqToolLevel: TOOL_LEVEL_WOOD},
  {name: "default:sandstone_smooth", displayName: "Smooth Sandstone", textureOffsetAlt: {top: new THREE.Vector2(240, 64), bottom: new THREE.Vector2(192, 48), sides: new THREE.Vector2(240, 48)}, icon: "textures/icons/sandstone_smooth.png", hardness: 0.8, groups: ["pickaxe"], reqToolLevel: TOOL_LEVEL_WOOD},
  
  {name: "default:stonebrick", displayName: "Stone Brick", textureOffsetAlt: {all: new THREE.Vector2(128, 32)}, icon: "textures/icons/stonebrick.png", groups: ["stone"], hardness: 1.5},
  {name: "default:stonebrick_carved", displayName: "Carved Stone Brick", textureOffsetAlt: {all: new THREE.Vector2(144, 32)}, icon: "textures/icons/stonebrick_carved.png", groups: ["stone"], hardness: 1.5},
  {name: "default:stonebrick_cracked", displayName: "Cracked Stone Brick", textureOffsetAlt: {all: new THREE.Vector2(160, 32)}, icon: "textures/icons/stonebrick_cracked.png", groups: ["stone"], hardness: 1.5},
  {name: "default:stonebrick_mossy", displayName: "Mossy Stone Brick", textureOffsetAlt: {all: new THREE.Vector2(176, 32)}, icon: "textures/icons/stonebrick_mossy.png", groups: ["stone"], hardness: 1.5},
  
  {name: "default:wool_black", displayName: "Black Wool", textureOffsetAlt: {all: new THREE.Vector2(192, 32)}, icon: "textures/icons/wool_black.png", groups: ["wool"], hardness: 0.8, furnaceFuel: 5},
  {name: "default:wool_blue", displayName: "Blue Wool", textureOffsetAlt: {all: new THREE.Vector2(208, 32)}, icon: "textures/icons/wool_blue.png", groups: ["wool"], hardness: 0.8, furnaceFuel: 5},
  {name: "default:wool_brown", displayName: "Brown Wool", textureOffsetAlt: {all: new THREE.Vector2(224, 32)}, icon: "textures/icons/wool_brown.png", groups: ["wool"], hardness: 0.8, furnaceFuel: 5},
  {name: "default:wool_cyan", displayName: "Cyan Wool", textureOffsetAlt: {all: new THREE.Vector2(240, 32)}, icon: "textures/icons/wool_cyan.png", groups: ["wool"], hardness: 0.8, furnaceFuel: 5},
  {name: "default:wool_gray", displayName: "Gray Wool", textureOffsetAlt: {all: new THREE.Vector2(128, 16)}, icon: "textures/icons/wool_gray.png", groups: ["wool"], hardness: 0.8, furnaceFuel: 5},
  {name: "default:wool_green", displayName: "Green Wool", textureOffsetAlt: {all: new THREE.Vector2(144, 16)}, icon: "textures/icons/wool_green.png", groups: ["wool"], hardness: 0.8, furnaceFuel: 5},
  {name: "default:wool_light_blue", displayName: "Light Blue Wool", textureOffsetAlt: {all: new THREE.Vector2(160, 16)}, icon: "textures/icons/wool_light_blue.png", groups: ["wool"], hardness: 0.8, furnaceFuel: 5},
  {name: "default:wool_lime", displayName: "Lime Wool", textureOffsetAlt: {all: new THREE.Vector2(176, 16)}, icon: "textures/icons/wool_lime.png", groups: ["wool"], hardness: 0.8, furnaceFuel: 5},
  {name: "default:wool_magenta", displayName: "Magenta Wool", textureOffsetAlt: {all: new THREE.Vector2(192, 16)}, icon: "textures/icons/wool_magenta.png", groups: ["wool"], hardness: 0.8, furnaceFuel: 5},
  {name: "default:wool_orange", displayName: "Orange Wool", textureOffsetAlt: {all: new THREE.Vector2(208, 16)}, icon: "textures/icons/wool_orange.png", groups: ["wool"], hardness: 0.8, furnaceFuel: 5},
  {name: "default:wool_pink", displayName: "Pink Wool", textureOffsetAlt: {all: new THREE.Vector2(224, 16)}, icon: "textures/icons/wool_pink.png", groups: ["wool"], hardness: 0.8, furnaceFuel: 5},
  {name: "default:wool_purple", displayName: "Purple Wool", textureOffsetAlt: {all: new THREE.Vector2(240, 16)}, icon: "textures/icons/wool_purple.png", groups: ["wool"], hardness: 0.8, furnaceFuel: 5},
  {name: "default:wool_red", displayName: "Red Wool", textureOffsetAlt: {all: new THREE.Vector2(128, 0)}, icon: "textures/icons/wool_red.png", groups: ["wool"], hardness: 0.8, furnaceFuel: 5},
  {name: "default:wool_silver", displayName: "Light Gray Wool", textureOffsetAlt: {all: new THREE.Vector2(144, 0)}, icon: "textures/icons/wool_silver.png", groups: ["wool"], hardness: 0.8, furnaceFuel: 5},
  {name: "default:wool_white", displayName: "White Wool", textureOffsetAlt: {all: new THREE.Vector2(160, 0)}, icon: "textures/icons/wool_white.png", groups: ["wool"], hardness: 0.8, furnaceFuel: 5},
  {name: "default:wool_yellow", displayName: "Yellow Wool", textureOffsetAlt: {all: new THREE.Vector2(176, 0)}, icon: "textures/icons/wool_yellow.png", groups: ["wool"], hardness: 0.8, furnaceFuel: 5},
  //{name: "default:glass", textureOffsetAlt: {all: new THREE.Vector2(0, 96)}, icon: "textures/blocks/glass.png"}
  
  {name: "default:mushroom_brown", displayName: "Brown Mushroom", xmesh: true, textureOffsetAlt: {all: new THREE.Vector2(128, 128)}, transparent: true, walkable: true, icon: "textures/blocks/mushroom_brown.png", hardness: 0},
  {name: "default:mushroom_red", displayName: "Red Mushroom", xmesh: true, textureOffsetAlt: {all: new THREE.Vector2(144, 128)}, transparent: true, walkable: true, icon: "textures/blocks/mushroom_red.png", hardness: 0},
  {name: "default:flower_rose", displayName: "Rose", xmesh: true, textureOffsetAlt: {all: new THREE.Vector2(0, 80)}, transparent: true, walkable: true, icon: "textures/blocks/flower_rose.png", hardness: 0},
  {name: "default:grass", displayName: "Grass", xmesh: true, textureOffsetAlt: {all: new THREE.Vector2(0, 64)}, transparent: true, walkable: true, icon: "textures/misc/grass.png", hardness: 0},
  {name: "default:sugarcane", displayName: "Sugarcane", xmesh: true, textureOffsetAlt: {all: new THREE.Vector2(96, 64)}, transparent: true, walkable: true, icon: "textures/items/reeds.png", hardness: 0},
  {name: "default:deadbush", displayName: "Dead Bush", xmesh: true, textureOffsetAlt: {all: new THREE.Vector2(224, 0)}, transparent: true, walkable: true, icon: "textures/blocks/deadbush.png", hardness: 0},
  
  {name: "default:apple", displayName: "Apple", placeable: false, icon: "textures/items/apple.png", isFood: true, foodPoints: 4, foodSat: 2.4},
  {name: "default:apple_golden", displayName: "Golden Apple", placeable: false, icon: "textures/items/apple_golden.png", isFood: true, foodPoints: 4, foodSat: 9.6},
  {name: "default:beef_cooked", displayName: "Steak", placeable: false, icon: "textures/items/beef_cooked.png", isFood: true, foodPoints: 8, foodSat: 12.8},
  {name: "default:beef_raw", displayName: "Raw Beef", placeable: false, icon: "textures/items/beef_raw.png", isFood: true, foodPoints: 3, foodSat: 1.8},
  {name: "default:bread", displayName: "Bread", placeable: false, icon: "textures/items/bread.png", isFood: true, foodPoints: 5, foodSat: 6},
  {name: "default:carrot", displayName: "Carrot", placeable: false, icon: "textures/items/carrot.png", isFood: true, foodPoints: 3, foodSat: 3.6},
  {name: "default:carrot_golden", displayName: "Golden Carrot", placeable: false, icon: "textures/items/carrot_golden.png", isFood: true, foodPoints: 6, foodSat: 14.4},
  {name: "default:chicken_cooked", displayName: "Cooked Chicken", placeable: false, icon: "textures/items/chicken_cooked.png", isFood: true, foodPoints: 6, foodSat: 7.2},
  {name: "default:chicken_raw", displayName: "Raw Chicken", placeable: false, icon: "textures/items/chicken_raw.png", isFood: true, foodPoints: 2, foodSat: 1.2},
  {name: "default:cocoa_beans", displayName: "Cocoa Beans", placeable: false, icon: "textures/misc/cocoa_beans.png"},
  {name: "default:cookie", displayName: "Cookie", placeable: false, icon: "textures/items/cookie.png", isFood: true, foodPoints: 2, foodSat: 0.4},
  {name: "default:egg", displayName: "Egg", placeable: false, icon: "textures/items/egg.png", maxStack: 16},
  {name: "default:fish_cod_cooked", displayName: "Cooked Cod", placeable: false, icon: "textures/items/fish_cod_cooked.png", isFood: true, foodPoints: 5, foodSat: 6},
  {name: "default:fish_cod_raw", displayName: "Raw Cod", placeable: false, icon: "textures/items/fish_cod_raw.png", isFood: true, foodPoints: 2, foodSat: 0.4},
  {name: "default:fish_salmon_cooked", displayName: "Cooked Salmon", placeable: false, icon: "textures/items/fish_salmon_cooked.png", isFood: true, foodPoints: 6, foodSat: 9.6},
  {name: "default:fish_salmon_raw", displayName: "Raw Salmon", placeable: false, icon: "textures/items/fish_salmon_raw.png", isFood: true, foodPoints: 2, foodSat: 0.4},
  {name: "default:melon_slice", displayName: "Melon Slice", placeable: false, icon: "textures/items/melon.png", isFood: true, foodPoints: 2, foodSat: 1.2},
  {name: "default:mushroom_stew", displayName: "Mushroom Stew", placeable: false, icon: "textures/items/mushroom_stew.png", stackable: false, maxStack: 1, isFood: true, foodPoints: 6, foodSat: 7.2},  
  {name: "default:porkchop_cooked", displayName: "Cooked Porkchop", placeable: false, icon: "textures/items/porkchop_cooked.png", isFood: true, foodPoints: 8, foodSat: 12.8},
  {name: "default:porkchop_raw", displayName: "Raw Porkchop", placeable: false, icon: "textures/items/porkchop_raw.png", isFood: true, foodPoints: 3, foodSat: 1.8},
  {name: "default:potato", displayName: "Potato", placeable: false, icon: "textures/items/potato.png", isFood: true, foodPoints: 1, foodSat: 0.6},
  {name: "default:potato_baked", displayName: "Baked Potato", placeable: false, icon: "textures/items/potato_baked.png", isFood: true, foodPoints: 5, foodSat: 6},
  {name: "default:pumpkin_pie", displayName: "Pumpkin Pie", placeable: false, icon: "textures/items/pumpkin_pie.png", isFood: true, foodPoints: 8, foodSat: 4.8},
  {name: "default:sugar", displayName: "Sugar", placeable: false, icon: "textures/items/sugar.png"},
  //{name: "default:sugarcane", displayName: "Sugarcane", placeable: false, icon: "textures/items/reeds.png"},
  {name: "default:wheat", displayName: "Wheat", placeable: false, icon: "textures/items/wheat.png"},
  //TODO cake!!!
  
  {name: "default:arrow", displayName: "Arrow", placeable: false, icon: "textures/items/arrow.png"},
  {name: "default:bone", displayName: "Bone", placeable: false, icon: "textures/items/bone.png"},
  {name: "default:book", displayName: "Book", placeable: false, icon: "textures/items/book_normal.png"},
  {name: "default:book_writable", displayName: "Book and Quill", placeable: false, icon: "textures/items/book_writable.png", stackable: false, maxStack: 1}, //TODO
  {name: "default:book_written", displayName: "Written Book", placeable: false, icon: "textures/items/book_written.png", stackable: false, maxStack: 1}, //TODO
  {name: "default:bowl", displayName: "Bowl", placeable: false, icon: "textures/items/bowl.png"},
  {name: "default:bow", displayName: "Bow", placeable: false, icon: "textures/items/bow_standby.png", stackable: false, maxStack: 1}, //TODO
  {name: "default:brick", displayName: "Brick", placeable: false, icon: "textures/items/brick.png"},
  {name: "default:charcoal", displayName: "Charcoal", placeable: false, icon: "textures/items/charcoal.png", furnaceFuel: 80},
  {name: "default:clay", displayName: "Clay", placeable: false, icon: "textures/items/clay_ball.png"},
  {name: "default:feather", displayName: "Feather", placeable: false, icon: "textures/items/feather.png"},
  {name: "default:fishing_rod", displayName: "Fishing Rod", placeable: false, icon: "textures/items/fishing_rod_uncast.png"}, //TODO
  {name: "default:flint", displayName: "Flint", placeable: false, icon: "textures/items/flint.png"},
  {name: "default:gunpowder", displayName: "Gunpowder", placeable: false, icon: "textures/items/gunpowder.png"},
  {name: "default:boat", displayName: "Boat", placeable: false, icon: "textures/items/oak_boat.png"}, //TODO
  {name: "default:leather", displayName: "Leather", placeable: false, icon: "textures/items/leather.png"},
  {name: "default:paper", displayName: "Paper", placeable: false, icon: "textures/items/paper.png"},
  {name: "default:stick", displayName: "Stick", placeable: false, icon: "textures/items/stick.png", furnaceFuel: 5},
  {name: "default:string", displayName: "String", placeable: false, icon: "textures/items/string.png"},
  
  {name: "default:diamond_axe", displayName: "Diamond Axe", placeable: false, icon: "textures/items/diamond_axe.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 1562, toolGroups: ["wood", "axe"], toolSpeedMul: 8, toolLevel: TOOL_LEVEL_DIAMOND},
  {name: "default:diamond_hoe", displayName: "Diamond Hoe", placeable: false, icon: "textures/items/diamond_hoe.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 1562, toolGroups: [], toolSpeedMul: 8, toolLevel: TOOL_LEVEL_DIAMOND},
  {name: "default:diamond_pickaxe", displayName: "Diamond Pickaxe", placeable: false, icon: "textures/items/diamond_pickaxe.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 1562, toolGroups: ["stone", "ore_block", "pickaxe"], toolSpeedMul: 8, toolLevel: TOOL_LEVEL_DIAMOND},
  {name: "default:diamond_shovel", displayName: "Diamond Shovel", placeable: false, icon: "textures/items/diamond_shovel.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 1562, toolGroups: ["dirt"], toolSpeedMul: 8, toolLevel: TOOL_LEVEL_DIAMOND},
  {name: "default:diamond_sword", displayName: "Diamond Sword", placeable: false, icon: "textures/items/diamond_sword.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 1562, toolGroups: ["leaves", "wool"], toolSpeedMul: 8, toolLevel: TOOL_LEVEL_DIAMOND},
  {name: "default:gold_axe", displayName: "Gold Axe", placeable: false, icon: "textures/items/gold_axe.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 33, toolGroups: ["wood", "axe"], toolSpeedMul: 12, toolLevel: TOOL_LEVEL_GOLD},
  {name: "default:gold_hoe", displayName: "Gold Hoe", placeable: false, icon: "textures/items/gold_hoe.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 33, toolGroups: [], toolSpeedMul: 12, toolLevel: TOOL_LEVEL_GOLD},
  {name: "default:gold_pickaxe", displayName: "Gold Pickaxe", placeable: false, icon: "textures/items/gold_pickaxe.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 33, toolGroups: ["stone", "ore_block", "pickaxe"], toolSpeedMul: 12, toolLevel: TOOL_LEVEL_GOLD},
  {name: "default:gold_shovel", displayName: "Gold Shovel", placeable: false, icon: "textures/items/gold_shovel.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 33, toolGroups: ["dirt"], toolSpeedMul: 12, toolLevel: TOOL_LEVEL_GOLD},
  {name: "default:gold_sword", displayName: "Gold Sword", placeable: false, icon: "textures/items/gold_sword.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 33, toolGroups: ["leaves", "wool"], toolSpeedMul: 12, toolLevel: TOOL_LEVEL_GOLD},
  {name: "default:iron_axe", displayName: "Iron Axe", placeable: false, icon: "textures/items/iron_axe.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 251, toolGroups: ["wood", "axe"], toolSpeedMul: 6, toolLevel: TOOL_LEVEL_IRON},
  {name: "default:iron_hoe", displayName: "Iron Hoe", placeable: false, icon: "textures/items/iron_hoe.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 251, toolGroups: [], toolSpeedMul: 6, toolLevel: TOOL_LEVEL_IRON},
  {name: "default:iron_pickaxe", displayName: "Iron Pickaxe", placeable: false, icon: "textures/items/iron_pickaxe.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 251, toolGroups: ["stone", "ore_block", "pickaxe"], toolSpeedMul: 6, toolLevel: TOOL_LEVEL_IRON},
  {name: "default:iron_shovel", displayName: "Iron Shovel", placeable: false, icon: "textures/items/iron_shovel.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 251, toolGroups: ["dirt"], toolSpeedMul: 6, toolLevel: TOOL_LEVEL_IRON},
  {name: "default:iron_sword", displayName: "Iron Sword", placeable: false, icon: "textures/items/iron_sword.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 251, toolGroups: ["leaves", "wool"], toolSpeedMul: 6, toolLevel: TOOL_LEVEL_IRON},
  {name: "default:stone_axe", displayName: "Stone Axe", placeable: false, icon: "textures/items/stone_axe.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 132, toolGroups: ["wood", "axe"], toolSpeedMul: 4, toolLevel: TOOL_LEVEL_STONE},
  {name: "default:stone_hoe", displayName: "Stone Hoe", placeable: false, icon: "textures/items/stone_hoe.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 132, toolGroups: [], toolSpeedMul: 4, toolLevel: TOOL_LEVEL_STONE},
  {name: "default:stone_pickaxe", displayName: "Stone Pickaxe", placeable: false, icon: "textures/items/stone_pickaxe.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 132, toolGroups: ["stone", "ore_block", "pickaxe"], toolSpeedMul: 4, toolLevel: TOOL_LEVEL_STONE},
  {name: "default:stone_shovel", displayName: "Stone Shovel", placeable: false, icon: "textures/items/stone_shovel.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 132, toolGroups: ["dirt"], toolSpeedMul: 4, toolLevel: TOOL_LEVEL_STONE},
  {name: "default:stone_sword", displayName: "Stone Sword", placeable: false, icon: "textures/items/stone_sword.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 132, toolGroups: ["leaves", "wool"], toolSpeedMul: 4, toolLevel: TOOL_LEVEL_STONE},
  {name: "default:wood_axe", displayName: "Wood Axe", placeable: false, icon: "textures/items/wood_axe.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 60, toolGroups: ["wood", "axe"], toolSpeedMul: 2, toolLevel: TOOL_LEVEL_WOOD, furnaceFuel: 10},
  {name: "default:wood_hoe", displayName: "Wood Hoe", placeable: false, icon: "textures/items/wood_hoe.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 60, toolGroups: [], toolSpeedMul: 2, toolLevel: TOOL_LEVEL_WOOD, furnaceFuel: 10},
  {name: "default:wood_pickaxe", displayName: "Wood Pickaxe", placeable: false, icon: "textures/items/wood_pickaxe.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 60, toolGroups: ["stone", "ore_block", "pickaxe"], toolSpeedMul: 2, toolLevel: TOOL_LEVEL_WOOD, furnaceFuel: 10},
  {name: "default:wood_shovel", displayName: "Wood Shovel", placeable: false, icon: "textures/items/wood_shovel.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 60, toolGroups: ["dirt"], toolSpeedMul: 2, toolLevel: TOOL_LEVEL_WOOD, furnaceFuel: 10},
  {name: "default:wood_sword", displayName: "Wood Sword", placeable: false, icon: "textures/items/wood_sword.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 60, toolGroups: ["leaves", "wool"], toolSpeedMul: 2, toolLevel: TOOL_LEVEL_WOOD, furnaceFuel: 10},
  {name: "default:shears", displayName: "Shears", placeable: false, icon: "textures/items/shears.png", stackable: false, maxStack: 1, isConsumable: false, isTool: true, toolLife: 238, toolGroups: ["leaves", "wool"], toolSpeedMul: 5},
  
  //TODO: working buckets
  {name: "default:bucket", displayName: "Bucket", placeable: false, icon: "textures/items/bucket_empty.png", maxStack: 16},
  {name: "default:bucket_water", displayName: "Water Bucket", placeable: false, icon: "textures/items/bucket_water.png", stackable: false, maxStack: 1},
  {name: "default:bucket_lava", displayName: "Lava Bucket", placeable: false, icon: "textures/items/bucket_lava.png", stackable: false, maxStack: 1}
  //TODO milk bucket
  
  //TODO bottles
  //TODO cake
  //TODO armor
  //TODO dyes
  //TODO maps
  //TODO minecart
  //TODO sign
  //TODO bonemeal
  
  //TODO plants
    //seeds and farming
    //cocoa plant
    //cactus
    //saplings!!!
    //sugarcane growth
    //proper plant breaking
  //TODO flowerpot
  
  //TODO: writeable books
];

function initItem(i) {
  if("textureOffsetAlt" in items[i]) {
    var texAlt = items[i].textureOffsetAlt;
    var tex = [];
    if("all" in texAlt) {
      tex = [texAlt.all, texAlt.all, texAlt.all, texAlt.all, texAlt.all, texAlt.all];
    } else if("top" in texAlt && "bottom" in texAlt && "front" in texAlt && "sides" in texAlt) {
      tex = [texAlt.top, texAlt.bottom, texAlt.sides, texAlt.front, texAlt.sides, texAlt.sides];
    } else if("top" in texAlt && "bottom" in texAlt && "sides" in texAlt) {
      tex = [texAlt.top, texAlt.bottom, texAlt.sides, texAlt.sides, texAlt.sides, texAlt.sides];
    } else if("top" in texAlt && "bottom" in texAlt && "front" in texAlt && "back" in texAlt && "left" in texAlt && "right" in texAlt) {
      tex = [texAlt.top, texAlt.bottom, texAlt.left, texAlt.right, texAlt.front, texAlt.back];
    }
    items[i].textureOffset = tex;
  }
  if(!("drops" in items[i])) {
    items[i].drops = new InvItem(getItemID(items[i].name), 1);
  }
  if("xmesh" in items[i] && "textureOffset" in items[i]) {
    if(items[i].xmesh) {
      items[i].customMesh = true;
      items[i].meshVertices = [
        //face 1
        -0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        -0.5, -0.5, 0.5,

        0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        
        //face 2
        -0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        -0.5, -0.5, -0.5,

        0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5
      ];
      items[i].meshUVs = [
        //face 1
        0.0 + (items[i].textureOffset[0].x * textureMapIndexScale), uvSize + (items[i].textureOffset[0].y * textureMapIndexScale),
        uvSize + (items[i].textureOffset[0].x * textureMapIndexScale), uvSize + (items[i].textureOffset[0].y * textureMapIndexScale),
        0.0 + (items[i].textureOffset[0].x * textureMapIndexScale), 0.0 + (items[i].textureOffset[0].y * textureMapIndexScale),

        uvSize + (items[i].textureOffset[0].x * textureMapIndexScale), uvSize + (items[i].textureOffset[0].y * textureMapIndexScale),
        uvSize + (items[i].textureOffset[0].x * textureMapIndexScale), 0.0 + (items[i].textureOffset[0].y * textureMapIndexScale),
        0.0 + (items[i].textureOffset[0].x * textureMapIndexScale), 0.0 + (items[i].textureOffset[0].y * textureMapIndexScale),
        
        //face 2
        0.0 + (items[i].textureOffset[1].x * textureMapIndexScale), uvSize + (items[i].textureOffset[1].y * textureMapIndexScale),
        uvSize + (items[i].textureOffset[1].x * textureMapIndexScale), uvSize + (items[i].textureOffset[1].y * textureMapIndexScale),
        0.0 + (items[i].textureOffset[1].x * textureMapIndexScale), 0.0 + (items[i].textureOffset[1].y * textureMapIndexScale),

        uvSize + (items[i].textureOffset[1].x * textureMapIndexScale), uvSize + (items[i].textureOffset[1].y * textureMapIndexScale),
        uvSize + (items[i].textureOffset[1].x * textureMapIndexScale), 0.0 + (items[i].textureOffset[1].y * textureMapIndexScale),
        0.0 + (items[i].textureOffset[1].x * textureMapIndexScale), 0.0 + (items[i].textureOffset[1].y * textureMapIndexScale)
      ];
      items[i].meshFaces = [
        {dir: new THREE.Vector3(0, 1, 0), length: 6},
        {dir: new THREE.Vector3(0, 1, 0), length: 6}
      ];
    }
  }
}

function initItemData() {
  for(var i = 0; i < items.length; i++) {
    initItem(i);
  }
}

var nextID = 0;
var itemIDMap = {};

function getItemID(name) {
  if(name in itemIDMap) {
    return itemIDMap[name];
  }
  var itemExists = false;
  for(var i = 0; i < items.length; i++) {
    if(items[i].name == name) {
      itemExists = true;
      break;
    }
  }
  if(!itemExists) {
    return null;
  }
  itemIDMap[name] = nextID;
  nextID++;
  return itemIDMap[name];
}

function getItemName(id) {
  for(var key in itemIDMap) {
    if(itemIDMap[key] == id) {
      return key;
    }
  }
  return null;
}

//TODO: pre-calculate properties?
function getItemProps(name) { //accepts name or ID
  if(typeof name == "number") { //actually an ID
    name = getItemName(name);
  }
  var props = deepcopy(itemDefaults);
  var propsToTranspose = {};
  var itemExists = false;
  for(var i = 0; i < items.length; i++) {
    if(items[i].name == name) {
      itemExists = true;
      propsToTranspose = items[i];
      break;
    }
  }
  if(!itemExists) {
    return null;
  }
  
  for(var key in propsToTranspose) {
    props[key] = propsToTranspose[key];
  }
  
  return props;
}

function setItemProp(name, prop, value) { //accepts name or ID
  if(typeof name == "number") { //actually an ID
    name = getItemName(name);
  }
  var index;
  var itemExists = false;
  for(var i = 0; i < items.length; i++) {
    if(items[i].name == name) {
      itemExists = true;
      index = i;
      break;
    }
  }
  if(!itemExists) {
    return false;
  }
  
  items[index][prop] = value;
  
  return true;
}

function registerItem(data) {
  var index = items.length;
  items.push(data);
  initItem(index);
}

function groupMatch(groupsA, groupsB) {
  for(var i = 0; i < groupsA.length; i++) {
    for(var n = 0; n < groupsB.length; n++) {
      if(groupsA[i] == groupsB[n]) {
        return true;
      }
    }
  }
  return false;
}
