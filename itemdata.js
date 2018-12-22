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
  icon: null
};
var items = [
  {name: "default:air", visible: false, walkable: true, transparent: true, placeable: false},
  {name: "default:dirt", textureOffsetAlt: {all: new THREE.Vector2(64, 112)}, icon: "textures/blocks/dirt.png"},
  {name: "default:grass_block", textureOffsetAlt: {top: new THREE.Vector2(32, 112), bottom: new THREE.Vector2(64, 112), sides: new THREE.Vector2(48, 112)}, icon: "textures/misc/grass_side.png"},
  {name: "default:stone", textureOffsetAlt: {all: new THREE.Vector2(16, 112)}, icon: "textures/blocks/stone.png"},
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
      7/16, 10/16,
      9/16, 10/16,
      9/16, 0,
      7/16, 10/16,
      7/16, 0,
      9/16, 0,
      
      //right
      9/16, 10/16,
      7/16, 10/16,
      7/16, 0,
      9/16, 10/16,
      9/16, 0,
      7/16, 0,
      
      //top
      7/16, 10/16,
      9/16, 10/16,
      9/16, 8/16,
      7/16, 10/16,
      7/16, 8/16,
      9/16, 8/16
    ],
    meshFaces: [
      {dir: new THREE.Vector3(0, 0, 1), length: 6}, //front
      {dir: new THREE.Vector3(0, 0, -1), length: 6}, //back
      {dir: new THREE.Vector3(-1, 0, 0), length: 6}, //left
      {dir: new THREE.Vector3(1, 0, 0), length: 6}, //right
      {dir: new THREE.Vector3(0, 1, 0), length: 6} //top
    ]
  }
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