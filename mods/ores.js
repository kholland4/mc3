(function() {
  var oreNames = ["ores:coal_ore", "ores:diamond_ore", "ores:emerald_ore", "ores:gold_ore", "ores:iron_ore", "ores:lapis_ore", "ores:redstone_ore"];
  var itemNames = ["ores:coal", "ores:diamond", "ores:emerald", "ores:gold_ingot", "ores:iron_ingot", "ores:lapis", "ores:redstone_dust"];
  var itemIcons = [null, null, null, null, null, "textures/items/dye_powder_blue.png", null];
  var blockNames = ["ores:coal_block", "ores:diamond_block", "ores:emerald_block", "ores:gold_block", "ores:iron_block", "ores:lapis_block", "ores:redstone_block"];
  var tex = [16, 32, 48, 64, 80, 96, 112];
  var drops = ["ores:coal", "ores:diamond", "ores:emerald", "ores:gold_ore", "ores:iron_ore", "ores:lapis", "ores:redstone_dust"];
  
  var oreDisplayNames = ["Coal Ore", "Diamond Ore", "Emerald Ore", "Gold Ore", "Iron Ore", "Lapis Lazuli Ore", "Redstone Ore"];
  var itemDisplayNames = ["Coal", "Diamond", "Emerald", "Gold Ingot", "Iron Ingot", "Lapis Lazuli", "Redstone Dust"];
  var blockDisplayNames = ["Coal Block", "Diamond Block", "Emerald Block", "Gold Block", "Iron Block", "Lapis Lazuli Block", "Redstone Block"];
  
  var oreHardness = [3, 3, 3, 3, 3, 3, 3];
  var blockHardness = [5, 5, 5, 3, 5, 3, 5];
  var oreReqToolLevel = [TOOL_LEVEL_WOOD, TOOL_LEVEL_IRON, TOOL_LEVEL_IRON, TOOL_LEVEL_IRON, TOOL_LEVEL_STONE, TOOL_LEVEL_STONE, TOOL_LEVEL_IRON];
  var blockReqToolLevel = [TOOL_LEVEL_WOOD, TOOL_LEVEL_IRON, TOOL_LEVEL_IRON, TOOL_LEVEL_IRON, TOOL_LEVEL_STONE, TOOL_LEVEL_STONE, TOOL_LEVEL_WOOD];
  
  for(var i = 0; i < oreNames.length; i++) {
    registerItem({
      name: oreNames[i],
      displayName: oreDisplayNames[i],
      drops: new InvItem(drops[i], 1),
      textureOffsetAlt: {all: new THREE.Vector2(tex[i], 80)},
      icon: "textures/icons/" + oreNames[i].substring(5) + ".png",
      groups: ["stone", "ore"],
      hardness: oreHardness[i],
      reqToolLevel: oreReqToolLevel[i]
    });
    registerItem({
      name: itemNames[i],
      displayName: itemDisplayNames[i],
      placeable: false,
      icon: itemIcons[i] || ("textures/items/" + itemNames[i].substring(5) + ".png")
    });
    
    registerItem({
      name: blockNames[i],
      displayName: blockDisplayNames[i],
      textureOffsetAlt: {all: new THREE.Vector2(tex[i], 128)},
      icon: "textures/icons/" + blockNames[i].substring(5) + ".png",
      groups: ["stone", "ore_block"],
      hardness: blockHardness[i],
      reqToolLevel: blockReqToolLevel[i]
    });
    mods.registerCraft({
      size: new THREE.Vector2(3, 3),
      shapeless: false,
      in: [itemNames[i], itemNames[i], itemNames[i], itemNames[i], itemNames[i], itemNames[i], itemNames[i], itemNames[i], itemNames[i]],
      out: new InvItem(blockNames[i], 1)
    });
    mods.registerCraft({
      size: new THREE.Vector2(1, 1),
      shapeless: false,
      in: [blockNames[i]],
      out: new InvItem(itemNames[i], 9)
    });
    
    mods.registerFurnaceRecipie({
      in: new InvItem(oreNames[i], 1),
      out: new InvItem(itemNames[i], 1)
    });
  }
  
  setItemProp("ores:coal", "furnaceFuel", 80);
  setItemProp("ores:coal_block", "furnaceFuel", 800);
  
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
  
  //---Quartz ore---
  registerItem({
    name: "ores:quartz_ore",
    displayName: "Quartz Ore",
    drops: new InvItem("ores:quartz", 1),
    textureOffsetAlt: {all: new THREE.Vector2(224, 64)},
    icon: "textures/icons/quartz_ore.png",
    groups: ["stone", "ore"],
    hardness: 3,
    reqToolLevel: TOOL_LEVEL_WOOD
  });
  registerItem({
    name: "ores:quartz",
    displayName: "Quartz",
    placeable: false,
    icon: "textures/items/quartz.png"
  });
  registerItem({
    name: "ores:quartz_block",
    displayName: "Quartz Block",
    textureOffsetAlt: {top: new THREE.Vector2(208, 80), bottom: new THREE.Vector2(240, 96), sides: new THREE.Vector2(192, 80)},
    icon: "textures/icons/quartz_block.png",
    groups: ["stone", "ore_block"],
    hardness: 0.8,
    reqToolLevel: TOOL_LEVEL_WOOD
  });
  registerItem({
    name: "ores:quartz_block_chiseled",
    displayName: "Chuseled Quartz Block",
    textureOffsetAlt: {top: new THREE.Vector2(240, 80), bottom: new THREE.Vector2(240, 80), sides: new THREE.Vector2(224, 80)},
    icon: "textures/icons/quartz_block_chiseled.png",
    groups: ["stone", "ore_block"],
    hardness: 0.8,
    reqToolLevel: TOOL_LEVEL_WOOD
  });
  registerItem({
    name: "ores:quartz_pillar",
    displayName: "Quartz Pillar",
    textureOffsetAlt: {top: new THREE.Vector2(208, 64), bottom: new THREE.Vector2(208, 64), sides: new THREE.Vector2(192, 64)},
    icon: "textures/icons/quartz_pillar.png",
    groups: ["stone", "ore_block"],
    hardness: 0.8,
    reqToolLevel: TOOL_LEVEL_WOOD
  });
  
  mods.registerFurnaceRecipie({in: new InvItem("ores:quartz_ore", 1), out: new InvItem("ores:quartz", 1)});
})();
