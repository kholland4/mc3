function() {
  //---Coal ore---
  registerItem({
    name: "ores:coal_ore",
    drops: new InvItem("ores:coal", 1),
    textureOffsetAlt: {all: new THREE.Vector2(16, 80)},
    icon: "textures/icons/coal_ore.png",
    groups: ["stone", "ore"]
  });
  registerItem({
    name: "ores:coal",
    placeable: false,
    icon: "textures/items/coal.png"
  });
  
  //---Diamond ore---
  registerItem({
    name: "ores:diamond_ore",
    drops: new InvItem("ores:diamond", 1),
    textureOffsetAlt: {all: new THREE.Vector2(32, 80)},
    icon: "textures/icons/diamond_ore.png",
    groups: ["stone", "ore"]
  });
  registerItem({
    name: "ores:diamond",
    placeable: false,
    icon: "textures/items/diamond.png"
  });
  
  //---Emerald ore---
  registerItem({
    name: "ores:emerald_ore",
    drops: new InvItem("ores:emerald", 1),
    textureOffsetAlt: {all: new THREE.Vector2(48, 80)},
    icon: "textures/icons/emerald_ore.png",
    groups: ["stone", "ore"]
  });
  registerItem({
    name: "ores:emerald",
    placeable: false,
    icon: "textures/items/emerald.png"
  });
  
  //---Gold ore---
  registerItem({
    name: "ores:gold_ore",
    textureOffsetAlt: {all: new THREE.Vector2(64, 80)},
    icon: "textures/icons/gold_ore.png",
    groups: ["stone", "ore"]
  });
  registerItem({
    name: "ores:gold_ingot",
    placeable: false,
    icon: "textures/items/gold_ingot.png"
  });
  
  //---Iron ore---
  registerItem({
    name: "ores:iron_ore",
    textureOffsetAlt: {all: new THREE.Vector2(80, 80)},
    icon: "textures/icons/iron_ore.png",
    groups: ["stone", "ore"]
  });
  registerItem({
    name: "ores:iron_ingot",
    placeable: false,
    icon: "textures/items/iron_ingot.png"
  });
  
  //---Lapis ore---
  registerItem({
    name: "ores:lapis_ore",
    drops: new InvItem("ores:lapis", 1),
    textureOffsetAlt: {all: new THREE.Vector2(96, 80)},
    icon: "textures/icons/lapis_ore.png",
    groups: ["stone", "ore"]
  });
  registerItem({
    name: "ores:lapis",
    placeable: false,
    icon: "textures/items/dye_powder_blue.png"
  });
  
  //---Redstone ore---
  registerItem({
    name: "ores:redstone_ore",
    drops: new InvItem("ores:redstone_dust", 1),
    textureOffsetAlt: {all: new THREE.Vector2(112, 80)},
    icon: "textures/icons/redstone_ore.png",
    groups: ["stone", "ore"]
  });
  registerItem({
    name: "ores:redstone_dust",
    placeable: false,
    icon: "textures/items/redstone_dust.png"
  });
  
  //--- ore---
  /*registerItem({
    name: "ores:",
    drops: new InvItem("ores:", 1),
    textureOffsetAlt: {all: new THREE.Vector2(64, 80)},
    icon: "textures/icons/",
    groups: ["stone", "ore"]
  });
  registerItem({
    name: "ores:",
    placeable: false,
    icon: "textures/items/"
  });*/
}
