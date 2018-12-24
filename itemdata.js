//Groups: dirt, wood, stone

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
  inInventory: true
};
var items = [
  {name: "default:air", visible: false, walkable: true, transparent: true, placeable: false, inInventory: false},
  {name: "default:dirt", textureOffsetAlt: {all: new THREE.Vector2(64, 112)}, icon: "textures/blocks/dirt.png", groups: ["dirt"]},
  {name: "default:grass_block", textureOffsetAlt: {top: new THREE.Vector2(32, 112), bottom: new THREE.Vector2(64, 112), sides: new THREE.Vector2(48, 112)}, icon: "textures/misc/grass_side.png", groups: ["dirt"], drops: new InvItem("default:dirt", 1)},
  {name: "default:stone", textureOffsetAlt: {all: new THREE.Vector2(16, 112)}, icon: "textures/blocks/stone.png", groups: ["stone"], drops: new InvItem("default:cobblestone", 1)},
  {name: "default:cobblestone", textureOffsetAlt: {all: new THREE.Vector2(64, 96)}, icon: "textures/blocks/cobblestone.png", groups: ["stone"]},
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
      7/128, 58/128,
      9/128, 58/128,
      9/128, 48/128,
      7/128, 58/128,
      7/128, 48/128,
      9/128, 48/128,
      
      //back
      9/128, 58/128,
      7/128, 58/128,
      7/128, 48/128,
      9/128, 58/128,
      9/128, 48/128,
      7/128, 48/128,
      
      //left
      7/128, 58/128,
      9/128, 58/128,
      9/128, 48/128,
      7/128, 58/128,
      7/128, 48/128,
      9/128, 48/128,
      
      //right
      9/128, 58/128,
      7/128, 58/128,
      7/128, 48/128,
      9/128, 58/128,
      9/128, 48/128,
      7/128, 48/128,
      
      //top
      7/128, 58/128,
      9/128, 58/128,
      9/128, 56/128,
      7/128, 58/128,
      7/128, 56/128,
      9/128, 56/128
    ],
    meshFaces: [
      {dir: new THREE.Vector3(0, 0, 1), length: 6}, //front
      {dir: new THREE.Vector3(0, 0, -1), length: 6}, //back
      {dir: new THREE.Vector3(-1, 0, 0), length: 6}, //left
      {dir: new THREE.Vector3(1, 0, 0), length: 6}, //right
      {dir: new THREE.Vector3(0, 1, 0), length: 6} //top
    ]
  },
  {name: "default:oak_wood_planks", textureOffsetAlt: {all: new THREE.Vector2(80, 112)}, icon: "textures/blocks/planks_oak.png", groups: ["wood"]},
  {name: "default:sand", textureOffsetAlt: {all: new THREE.Vector2(96, 112)}, icon: "textures/blocks/sand.png", groups: ["dirt"]},
  {name: "default:glass", textureOffsetAlt: {all: new THREE.Vector2(0, 96)}, icon: "textures/blocks/glass.png", transparent: true},
  {name: "default:oak_log", textureOffsetAlt: {top: new THREE.Vector2(16, 96), bottom: new THREE.Vector2(16, 96), sides: new THREE.Vector2(32, 96)}, icon: "textures/blocks/log_oak.png"},
  {name: "default:leaves", textureOffsetAlt: {all: new THREE.Vector2(48, 96)}, icon: "textures/misc/leaves_oak_color.png", transparent: true}
  //{name: "default:glass", textureOffsetAlt: {all: new THREE.Vector2(0, 96)}, icon: "textures/blocks/glass.png"}
];

function initItemData() {
  for(var i = 0; i < items.length; i++) {
    if("textureOffsetAlt" in items[i]) {
      var texAlt = items[i].textureOffsetAlt;
      var tex = [];
      if("all" in texAlt) {
        tex = [texAlt.all, texAlt.all, texAlt.all, texAlt.all, texAlt.all, texAlt.all];
      } else if("top" in texAlt && "bottom" in texAlt && "sides" in texAlt) {
        tex = [texAlt.top, texAlt.bottom, texAlt.sides, texAlt.sides, texAlt.sides, texAlt.sides];
      }
      items[i].textureOffset = tex;
    }
    if(!("drops" in items[i])) {
      items[i].drops = new InvItem(getItemID(items[i].name), 1);
    }
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
