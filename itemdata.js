//Groups: dirt, wood, stone, ore, glass, leaves

var itemDefaults = {
  visible: true,
  transparent: false,
  walkable: false,
  hardness: 1,
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
  isTool: false,
  inInventory: true,
  interact: null,
  onDestroy: null,
  noRenderAdjacent: false, //used for water and similar - even if the block is transparent, don't render its side face if the block on that side is the same as this block
  raycast: true,
  fluidPhysics: null,
  tintColor: null
};
var items = [
  {name: "default:air", visible: false, walkable: true, transparent: true, placeable: false, inInventory: false},
  {name: "default:dirt", textureOffsetAlt: {all: new THREE.Vector2(64, 112)}, icon: "textures/icons/dirt.png", groups: ["dirt"]},
  {name: "default:grass_block", textureOffsetAlt: {top: new THREE.Vector2(32, 112), bottom: new THREE.Vector2(64, 112), sides: new THREE.Vector2(48, 112)}, icon: "textures/icons/grass_block.png", groups: ["dirt"], drops: new InvItem("default:dirt", 1)},
  {name: "default:stone", textureOffsetAlt: {all: new THREE.Vector2(16, 112)}, icon: "textures/icons/stone.png", groups: ["stone"], drops: new InvItem("default:cobblestone", 1)},
  {name: "default:cobblestone", textureOffsetAlt: {all: new THREE.Vector2(64, 96)}, icon: "textures/icons/cobblestone.png", groups: ["stone"]},
  {name: "default:mossy_cobblestone", textureOffsetAlt: {all: new THREE.Vector2(192, 112)}, icon: "textures/icons/mossy_cobblestone.png", groups: ["stone"]},
  {name: "default:torch", lightLevel: 10, transparent: true, walkable: true, icon: "textures/blocks/torch_on.png", customMesh: true,
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
    ]
  },
  {name: "default:sand", textureOffsetAlt: {all: new THREE.Vector2(96, 112)}, icon: "textures/icons/sand.png", groups: ["dirt"]},
  {name: "default:glass", textureOffsetAlt: {all: new THREE.Vector2(0, 96)}, icon: "textures/icons/glass.png", transparent: true, groups: ["glass"]},
  
  {name: "default:oak_planks", textureOffsetAlt: {all: new THREE.Vector2(80, 112)}, icon: "textures/icons/oak_planks.png", groups: ["wood"]},
  {name: "default:oak_log", textureOffsetAlt: {top: new THREE.Vector2(16, 96), bottom: new THREE.Vector2(16, 96), sides: new THREE.Vector2(32, 96)}, icon: "textures/icons/oak_log.png", groups: ["wood"]},
  {name: "default:leaves", textureOffsetAlt: {all: new THREE.Vector2(48, 96)}, icon: "textures/icons/leaves.png", transparent: true, groups: ["leaves"]},
  
  {name: "default:acacia_planks", textureOffsetAlt: {all: new THREE.Vector2(128, 96)}, icon: "textures/icons/acacia_planks.png", groups: ["wood"]},
  {name: "default:acacia_log", textureOffsetAlt: {top: new THREE.Vector2(144, 96), bottom: new THREE.Vector2(144, 96), sides: new THREE.Vector2(160, 96)}, icon: "textures/icons/acacia_log.png", groups: ["wood"]},
  {name: "default:acacia_leaves", textureOffsetAlt: {all: new THREE.Vector2(176, 96)}, icon: "textures/icons/acacia_leaves.png", transparent: true, groups: ["leaves"]},
  
  {name: "default:birch_planks", textureOffsetAlt: {all: new THREE.Vector2(128, 80)}, icon: "textures/icons/birch_planks.png", groups: ["wood"]},
  {name: "default:birch_log", textureOffsetAlt: {top: new THREE.Vector2(144, 80), bottom: new THREE.Vector2(144, 80), sides: new THREE.Vector2(160, 80)}, icon: "textures/icons/birch_log.png", groups: ["wood"]},
  {name: "default:birch_leaves", textureOffsetAlt: {all: new THREE.Vector2(176, 80)}, icon: "textures/icons/birch_leaves.png", transparent: true, groups: ["leaves"]},
  
  {name: "default:jungle_planks", textureOffsetAlt: {all: new THREE.Vector2(128, 64)}, icon: "textures/icons/jungle_planks.png", groups: ["wood"]},
  {name: "default:jungle_log", textureOffsetAlt: {top: new THREE.Vector2(144, 64), bottom: new THREE.Vector2(144, 64), sides: new THREE.Vector2(160, 64)}, icon: "textures/icons/jungle_log.png", groups: ["wood"]},
  {name: "default:jungle_leaves", textureOffsetAlt: {all: new THREE.Vector2(176, 64)}, icon: "textures/icons/jungle_leaves.png", transparent: true, groups: ["leaves"]},
  
  {name: "default:spruce_planks", textureOffsetAlt: {all: new THREE.Vector2(128, 48)}, icon: "textures/icons/spruce_planks.png", groups: ["wood"]},
  {name: "default:spruce_log", textureOffsetAlt: {top: new THREE.Vector2(144, 48), bottom: new THREE.Vector2(144, 48), sides: new THREE.Vector2(160, 48)}, icon: "textures/icons/spruce_log.png", groups: ["wood"]},
  {name: "default:spruce_leaves", textureOffsetAlt: {all: new THREE.Vector2(176, 48)}, icon: "textures/icons/spruce_leaves.png", transparent: true, groups: ["leaves"]},
  
  {name: "default:water_source", textureOffsetAlt: {all: new THREE.Vector2(112, 112)}, icon: "textures/icons/water.png", transparent: true, walkable: true, noRenderAdjacent: true, raycast: false, fluidPhysics: 0.3, tintColor: "rgba(0, 0, 255, 0.3)"},
  {name: "default:bedrock", textureOffsetAlt: {all: new THREE.Vector2(128, 112)}, icon: "textures/icons/bedrock.png"},
  {name: "default:bookshelf", textureOffsetAlt: {top: new THREE.Vector2(80, 112), bottom: new THREE.Vector2(80, 112), sides: new THREE.Vector2(144, 112)}, icon: "textures/icons/bookshelf.png", groups: ["wood"]},
  {name: "default:brick_block", textureOffsetAlt: {all: new THREE.Vector2(160, 112)}, icon: "textures/icons/brick_block.png", groups: ["stone"]},
  //cactus, cake, crafting table, dispenser, dropper, various doors, plants, farmland, flowerpot, furnace, colored glass, glass pane, snowy grass, hardened clay, trapdoor, ladder, pistons
  {name: "default:clay_block", textureOffsetAlt: {all: new THREE.Vector2(176, 112)}, icon: "textures/icons/clay_block.png", groups: ["dirt"]},
  {name: "default:ice", textureOffsetAlt: {all: new THREE.Vector2(208, 112)}, icon: "textures/icons/ice.png", transparent: true, noRenderAdjacent: true, groups: ["glass"]}, //TODO: slippery ice
  {name: "default:obsidian", textureOffsetAlt: {all: new THREE.Vector2(224, 112)}, icon: "textures/icons/obsidian.png"},
  {name: "default:pumpkin", textureOffsetAlt: {top: new THREE.Vector2(240, 112), bottom: new THREE.Vector2(240, 112), sides: new THREE.Vector2(192, 96)}, icon: "textures/icons/pumpkin.png"},
  {name: "default:pumpkin_off", textureOffsetAlt: {top: new THREE.Vector2(240, 112), bottom: new THREE.Vector2(240, 112), sides: new THREE.Vector2(192, 96), front: new THREE.Vector2(208, 96)}, icon: "textures/icons/carved_pumpkin.png"},
  {name: "default:pumpkin_on", drops: new InvItem("default:pumpkin_off", 1), inInventory: false, textureOffsetAlt: {top: new THREE.Vector2(240, 112), bottom: new THREE.Vector2(240, 112), sides: new THREE.Vector2(192, 96), front: new THREE.Vector2(224, 96)}, icon: "textures/icons/carved_pumpkin.png", lightLevel: 10}
  /*{name: "default:brick_block", textureOffsetAlt: {all: new THREE.Vector2(240, 112)}, icon: "textures/icons/", groups: []},
  {name: "default:brick_block", textureOffsetAlt: {all: new THREE.Vector2(240, 112)}, icon: "textures/icons/", groups: []},
  {name: "default:brick_block", textureOffsetAlt: {all: new THREE.Vector2(256, 112)}, icon: "textures/icons/", groups: []}*/
  //{name: "default:glass", textureOffsetAlt: {all: new THREE.Vector2(0, 96)}, icon: "textures/blocks/glass.png"}
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
    }
    items[i].textureOffset = tex;
  }
  if(!("drops" in items[i])) {
    items[i].drops = new InvItem(getItemID(items[i].name), 1);
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

function registerItem(data) {
  var index = items.length;
  items.push(data);
  initItem(index);
}
