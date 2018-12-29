(function() {
  var craftingOpen = false;
  
  CREATIVE_BLOCK_PLACE = false;
  CREATIVE_BLOCK_DESTROY = false;
  mods.CREATIVE_MODE = false;
  
  var CRAFT_GRID_SIZE = new THREE.Vector2(3, 3);
  
  mods.craftRecipies = [
    {size: new THREE.Vector2(1, 2), shapeless: false, in: ["group:planks", "group:planks"], out: new InvItem("default:stick", 4)},
    {size: new THREE.Vector2(2, 2), shapeless: false, in: ["default:brick", "default:brick", "default:brick", "default:brick"], out: new InvItem("default:brick_block", 1)},
    {size: new THREE.Vector2(2, 2), shapeless: false, in: ["default:clay", "default:clay", "default:clay", "default:clay"], out: new InvItem("default:clay_block", 1)},
    {size: new THREE.Vector2(2, 2), shapeless: false, in: ["default:sand", "default:sand", "default:sand", "default:sand"], out: new InvItem("default:sandstone", 1)},
    {size: new THREE.Vector2(2, 2), shapeless: false, in: ["default:sandstone", "default:sandstone", "default:sandstone", "default:sandstone"], out: new InvItem("default:sandstone_smooth", 4)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: ["group:planks", "group:planks", "group:planks", "default:book", "default:book", "default:book", "group:planks", "group:planks", "group:planks"], out: new InvItem("default:bookshelf", 1)},
    {size: new THREE.Vector2(1, 2), shapeless: true, in: ["default:pumpkin_off", "default:torch"], out: new InvItem("default:pumpkin_on", 1)},
    {size: new THREE.Vector2(2, 2), shapeless: false, in: ["default:string", "default:string", "default:string", "default:string"], out: new InvItem("default:wool_white", 1)},
    {size: new THREE.Vector2(1, 1), shapeless: false, in: ["default:wool_white"], out: new InvItem("default:string", 4)},
    {size: new THREE.Vector2(2, 2), shapeless: false, in: ["default:stone", "default:stone", "default:stone", "default:stone"], out: new InvItem("default:stonebrick", 4)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: ["default:melon_slice", "default:melon_slice", "default:melon_slice", "default:melon_slice", "default:melon_slice", "default:melon_slice", "default:melon_slice", "default:melon_slice", "default:melon_slice"], out: new InvItem("default:melon", 1)},
    
    //Logs to planks
    {size: new THREE.Vector2(1, 1), shapeless: false, in: ["default:oak_log"], out: new InvItem("default:oak_planks", 4)},
    {size: new THREE.Vector2(1, 1), shapeless: false, in: ["default:acacia_log"], out: new InvItem("default:acacia_planks", 4)},
    {size: new THREE.Vector2(1, 1), shapeless: false, in: ["default:birch_log"], out: new InvItem("default:birch_planks", 4)},
    {size: new THREE.Vector2(1, 1), shapeless: false, in: ["default:jungle_log"], out: new InvItem("default:jungle_planks", 4)},
    {size: new THREE.Vector2(1, 1), shapeless: false, in: ["default:spruce_log"], out: new InvItem("default:spruce_planks", 4)},
    
    {size: new THREE.Vector2(1, 2), shapeless: false, in: ["ores:coal", "default:stick"], out: new InvItem("default:torch", 4)},
    {size: new THREE.Vector2(1, 2), shapeless: false, in: ["default:charcoal", "default:stick"], out: new InvItem("default:torch", 4)},
    
    //Food
    {size: new THREE.Vector2(3, 1), shapeless: false, in: ["default:wheat", "default:wheat", "default:wheat"], out: new InvItem("default:bread", 1)},
    {size: new THREE.Vector2(2, 2), shapeless: true, in: ["default:mushroom_red", "default:mushroom_brown", null, "default:bowl"], out: new InvItem("default:mushroom_stew", 1)},
    {size: new THREE.Vector2(2, 2), shapeless: true, in: ["default:pumpkin", "default:sugar", null, "default:egg"], out: new InvItem("default:pumpkin_pie", 1)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: ["ores:gold_ingot", "ores:gold_ingot", "ores:gold_ingot", "ores:gold_ingot", "default:apple", "ores:gold_ingot", "ores:gold_ingot", "ores:gold_ingot", "ores:gold_ingot"], out: new InvItem("default:apple_golden", 1)},
    {size: new THREE.Vector2(3, 1), shapeless: false, in: ["default:wheat", "default:cocoa_beans", "default:wheat"], out: new InvItem("default:cookie", 8)},
    {size: new THREE.Vector2(2, 1), shapeless: true, in: ["default:carrot", "ores:gold_ingot"], out: new InvItem("default:carrot_golden", 1)},
    
    //Diamond tools
    {size: new THREE.Vector2(2, 3), shapeless: false, in: ["ores:diamond", "ores:diamond", "ores:diamond", "default:stick", null, "default:stick"], out: new InvItem("default:diamond_axe", 1)},
    {size: new THREE.Vector2(2, 3), shapeless: false, in: ["ores:diamond", "ores:diamond", null, "default:stick", null, "default:stick"], out: new InvItem("default:diamond_hoe", 1)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: ["ores:diamond", "ores:diamond", "ores:diamond", null, "default:stick", null, null, "default:stick", null], out: new InvItem("default:diamond_pickaxe", 1)},
    {size: new THREE.Vector2(1, 3), shapeless: false, in: ["ores:diamond", "default:stick", "default:stick"], out: new InvItem("default:diamond_shovel", 1)},
    {size: new THREE.Vector2(1, 3), shapeless: false, in: ["ores:diamond", "ores:diamond", "default:stick"], out: new InvItem("default:diamond_sword", 1)},
    
    //Gold tools
    {size: new THREE.Vector2(2, 3), shapeless: false, in: ["ores:gold_ingot", "ores:gold_ingot", "ores:gold_ingot", "default:stick", null, "default:stick"], out: new InvItem("default:gold_axe", 1)},
    {size: new THREE.Vector2(2, 3), shapeless: false, in: ["ores:gold_ingot", "ores:gold_ingot", null, "default:stick", null, "default:stick"], out: new InvItem("default:gold_hoe", 1)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: ["ores:gold_ingot", "ores:gold_ingot", "ores:gold_ingot", null, "default:stick", null, null, "default:stick", null], out: new InvItem("default:gold_pickaxe", 1)},
    {size: new THREE.Vector2(1, 3), shapeless: false, in: ["ores:gold_ingot", "default:stick", "default:stick"], out: new InvItem("default:gold_shovel", 1)},
    {size: new THREE.Vector2(1, 3), shapeless: false, in: ["ores:gold_ingot", "ores:gold_ingot", "default:stick"], out: new InvItem("default:gold_sword", 1)},
    
    //Iron tools
    {size: new THREE.Vector2(2, 3), shapeless: false, in: ["ores:iron_ingot", "ores:iron_ingot", "ores:iron_ingot", "default:stick", null, "default:stick"], out: new InvItem("default:iron_axe", 1)},
    {size: new THREE.Vector2(2, 3), shapeless: false, in: ["ores:iron_ingot", "ores:iron_ingot", null, "default:stick", null, "default:stick"], out: new InvItem("default:iron_hoe", 1)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: ["ores:iron_ingot", "ores:iron_ingot", "ores:iron_ingot", null, "default:stick", null, null, "default:stick", null], out: new InvItem("default:iron_pickaxe", 1)},
    {size: new THREE.Vector2(1, 3), shapeless: false, in: ["ores:iron_ingot", "default:stick", "default:stick"], out: new InvItem("default:iron_shovel", 1)},
    {size: new THREE.Vector2(1, 3), shapeless: false, in: ["ores:iron_ingot", "ores:iron_ingot", "default:stick"], out: new InvItem("default:iron_sword", 1)},
    
    //Stone tools
    {size: new THREE.Vector2(2, 3), shapeless: false, in: ["default:stone", "default:stone", "default:stone", "default:stick", null, "default:stick"], out: new InvItem("default:stone_axe", 1)},
    {size: new THREE.Vector2(2, 3), shapeless: false, in: ["default:stone", "default:stone", null, "default:stick", null, "default:stick"], out: new InvItem("default:stone_hoe", 1)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: ["default:stone", "default:stone", "default:stone", null, "default:stick", null, null, "default:stick", null], out: new InvItem("default:stone_pickaxe", 1)},
    {size: new THREE.Vector2(1, 3), shapeless: false, in: ["default:stone", "default:stick", "default:stick"], out: new InvItem("default:stone_shovel", 1)},
    {size: new THREE.Vector2(1, 3), shapeless: false, in: ["default:stone", "default:stone", "default:stick"], out: new InvItem("default:stone_sword", 1)},
    {size: new THREE.Vector2(2, 3), shapeless: false, in: ["default:cobblestone", "default:cobblestone", "default:cobblestone", "default:stick", null, "default:stick"], out: new InvItem("default:stone_axe", 1)},
    {size: new THREE.Vector2(2, 3), shapeless: false, in: ["default:cobblestone", "default:cobblestone", null, "default:stick", null, "default:stick"], out: new InvItem("default:stone_hoe", 1)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: ["default:cobblestone", "default:cobblestone", "default:cobblestone", null, "default:stick", null, null, "default:stick", null], out: new InvItem("default:stone_pickaxe", 1)},
    {size: new THREE.Vector2(1, 3), shapeless: false, in: ["default:cobblestone", "default:stick", "default:stick"], out: new InvItem("default:stone_shovel", 1)},
    {size: new THREE.Vector2(1, 3), shapeless: false, in: ["default:cobblestone", "default:cobblestone", "default:stick"], out: new InvItem("default:stone_sword", 1)},
    
    //Wood tools
    {size: new THREE.Vector2(2, 3), shapeless: false, in: ["group:planks", "group:planks", "group:planks", "default:stick", null, "default:stick"], out: new InvItem("default:wood_axe", 1)},
    {size: new THREE.Vector2(2, 3), shapeless: false, in: ["group:planks", "group:planks", null, "default:stick", null, "default:stick"], out: new InvItem("default:wood_hoe", 1)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: ["group:planks", "group:planks", "group:planks", null, "default:stick", null, null, "default:stick", null], out: new InvItem("default:wood_pickaxe", 1)},
    {size: new THREE.Vector2(1, 3), shapeless: false, in: ["group:planks", "default:stick", "default:stick"], out: new InvItem("default:wood_shovel", 1)},
    {size: new THREE.Vector2(1, 3), shapeless: false, in: ["group:planks", "group:planks", "default:stick"], out: new InvItem("default:wood_sword", 1)},
    
    //Shears
    {size: new THREE.Vector2(2, 2), shapeless: false, in: [null, "ores:iron_ingot", "ores:iron_ingot", null], out: new InvItem("default:shears", 1)},
    
    {size: new THREE.Vector2(3, 3), shapeless: false, in: [null, "default:stick", "default:string", "default:stick", null, "default:string", null, "default:stick", "default:string"], out: new InvItem("default:bow", 1)},
    {size: new THREE.Vector2(1, 3), shapeless: false, in: ["default:flint", "default:stick", "default:feather"], out: new InvItem("default:arrow", 4)},
    {size: new THREE.Vector2(3, 2), shapeless: false, in: ["group:planks", null, "group:planks", null, "group:planks", null], out: new InvItem("default:bowl", 4)},
    {size: new THREE.Vector2(1, 1), shapeless: false, in: ["default:sugarcane"], out: new InvItem("default:sugar", 1)},
    {size: new THREE.Vector2(3, 2), shapeless: false, in: ["ores:iron_ingot", null, "ores:iron_ingot", null, "ores:iron_ingot", null], out: new InvItem("default:bucket", 1)},
    {size: new THREE.Vector2(2, 2), shapeless: true, in: ["default:paper", "default:paper", "default:paper", "default:leather"], out: new InvItem("default:book", 1)},
    //TODO book and quill
    {size: new THREE.Vector2(3, 1), shapeless: false, in: ["default:sugarcane", "default:sugarcane", "default:sugarcane"], out: new InvItem("default:paper", 3)}
    
    /*{size: new THREE.Vector2(3, 3), shapeless: false, in: [], out: new InvItem("default:", 1)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: [], out: new InvItem("default:", 1)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: [], out: new InvItem("default:", 1)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: [], out: new InvItem("default:", 1)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: [], out: new InvItem("default:", 1)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: [], out: new InvItem("default:", 1)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: [], out: new InvItem("default:", 1)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: [], out: new InvItem("default:", 1)},
    {size: new THREE.Vector2(3, 3), shapeless: false, in: [], out: new InvItem("default:", 1)}*/
  ];
  mods.registerCraft = function(craft) {
    mods.craftRecipies.push(craft);
  };
  
  var craftSwSize = CRAFT_GRID_SIZE.clone();
  var craftSwOffset = new THREE.Vector3(0, 0);
  var craftRecIndex = null;
  var craftInv = [];
  for(var i = 0; i < CRAFT_GRID_SIZE.x * CRAFT_GRID_SIZE.y; i++) {
    craftInv.push(null);
  }
  var craftOut = [null];
  
  var realCraftOut = null;
  function processCraft() {
    var swCraftInv = []; //"shrinkwrap" craftInv - shrink to fit contents
    var swSize = CRAFT_GRID_SIZE.clone();
    var swOffset = new THREE.Vector3(0, 0);
    
    for(var x = 0; x < CRAFT_GRID_SIZE.x; x++) {
      var empty = true;
      for(var y = 0; y < CRAFT_GRID_SIZE.y; y++) {
        if(craftInv[y * CRAFT_GRID_SIZE.x + x] != null) {
          empty = false;
        }
      }
      if(empty) {
        if(swOffset.x == x) {
          swOffset.x++;
          swSize.x--;
        } else {
          swSize.x--;
        }
      }
    }
    
    for(var y = 0; y < CRAFT_GRID_SIZE.y; y++) {
      var empty = true;
      for(var x = 0; x < CRAFT_GRID_SIZE.x; x++) {
        if(craftInv[y * CRAFT_GRID_SIZE.x + x] != null) {
          empty = false;
        }
      }
      if(empty) {
        if(swOffset.y == y) {
          swOffset.y++;
          swSize.y--;
        } else {
          swSize.y--;
        }
      }
    }
    
    craftSwSize = swSize;
    craftSwOffset = swOffset;
    
    for(var y = swOffset.y; y < swOffset.y + swSize.y; y++) {
      for(var x = swOffset.x; x < swOffset.x + swSize.x; x++) {
        swCraftInv.push(craftInv[y * CRAFT_GRID_SIZE.x + x]);
      }
    }
    
    for(var i = 0; i < mods.craftRecipies.length; i++) {
      var rec = mods.craftRecipies[i];
      if(rec.size.equals(swSize)) {
        var ok = true;
        for(var n = 0; n < swSize.x * swSize.y; n++) {
          if(swCraftInv[n] == null) {
            if(rec.in[n] != null) {
              ok = false;
            }
            continue;
          }
          if(rec.in[n] != swCraftInv[n].name) {
            if(rec.in[n] != null) {
              if(rec.in[n].startsWith("group:")) {
                var targetGroup = rec.in[n].substring(6);
                var props = getItemProps(swCraftInv[n].id);
                if(props.groups.includes(targetGroup)) {
                  continue;
                }
              }
            }
            ok = false;
          }
        }
        
        if(ok) {
          realCraftOut = rec.out.clone();
          craftOut[0] = realCraftOut.clone();
          craftRecIndex = i;
          return;
        }
      }
    }
    
    //TODO: shapeless recipies
    
    realCraftOut = null;
    craftOut[0] = null;
  }
  
  function useCraft() {
    //assumes everything is in a valid state from a call to processCraft
    for(var x = 0; x < craftSwSize.x; x++) {
      for(var y = 0; y < craftSwSize.y; y++) {
        var index = (y + craftSwOffset.y) * CRAFT_GRID_SIZE.x + (x + craftSwOffset.x);
        if(craftInv[index] != null) {
          craftInv[index].qty--;
          if(craftInv[index].qty <= 0) {
            craftInv[index] = null;
          }
        }
      }
    }
    processCraft();
  }
  
  function openCrafting() {
    craftingOpen = true;
    var popup = openPopup();
    var dialog = guiGenDialog();
    popup.appendChild(dialog);
    
    function updateCraftGrid() {
      processCraft();
      guiFillBlockGrid(craftGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, craftInv);
      guiFillBlockGrid(craftOutGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, craftOut);
    }
    
    function updatePIGrid() {
      guiFillBlockGrid(invGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, playerInventory);
      updatePlayerInventory();
    }
    
    //TODO: shift-click picks up a whole stack
    var craftGrid = guiGenBlockGrid(CRAFT_GRID_SIZE, HUD_CELL_SIZE, "craft");
    dialog.appendChild(craftGrid);
    guiFillBlockGrid(craftGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, craftInv);
    guiInteractiveGrid(craftGrid, craftInv, updateCraftGrid, playerInventory, updatePIGrid);
    
    var craftOutGrid = guiGenBlockGrid(new THREE.Vector2(1, 1), HUD_CELL_SIZE, "craftOut");
    
    craftOutGrid.style.position = "absolute";
    craftOutGrid.style.left = GUI_DIALOG_PADDING + craftGrid.clientWidth + "px";
    craftOutGrid.style.top = GUI_DIALOG_PADDING + GUI_CELL_MARGIN * 2 + HUD_CELL_SIZE + "px";
    
    dialog.appendChild(craftOutGrid);
    guiFillBlockGrid(craftOutGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, craftOut);
    guiInteractiveGrid(craftOutGrid, craftOut, function() {
      if(craftOut[0] == null) {
        useCraft();
      } else {
        if(guiHandItem == null) {
          guiHandItem = craftOut[0];
        } else {
          guiHandItem = mergeInventoryItems(craftOut[0], guiHandItem)
        }
        craftOut[0] = null;
        updateGUIHand();
        useCraft();
      }
      guiFillBlockGrid(craftOutGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, craftOut);
      guiFillBlockGrid(craftGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, craftInv);
    }, playerInventory, updatePIGrid);
    
    dialog.appendChild(guiGenSpacer(new THREE.Vector2(0, HUD_CELL_SIZE / 2)));
    
    var invGrid = guiGenBlockGrid(PLAYER_INVENTORY_GRID_SIZE, HUD_CELL_SIZE, "inv");
    dialog.appendChild(invGrid);
    guiFillBlockGrid(invGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, playerInventory);
    guiInteractiveGrid(invGrid, playerInventory, updatePIGrid, craftInv, updateCraftGrid);
  }
  
  document.addEventListener("keydown", function(e) {
    if(document.pointerLockElement == renderer.domElement && !e.repeat) {
      if(e.keyCode == 69 && mods.CREATIVE_MODE == false) { //e
        openCrafting();
      }
    } else if(craftingOpen) {
      if(e.keyCode == 69) {
        craftingOpen = false;
        closePopup();
        return;
      }
    }
  });
  
  //---Crafting table---
  registerItem({
    name: "crafting:crafting_table",
    displayName: "Crafting Table",
    textureOffsetAlt: {top: new THREE.Vector2(80, 96), bottom: new THREE.Vector2(80, 96), left: new THREE.Vector2(112, 96), right: new THREE.Vector2(112, 96), front: new THREE.Vector2(96, 96), back: new THREE.Vector2(96, 96)},
    icon: "textures/icons/crafting_table.png",
    groups: ["wood"],
    hardness: 2.5,
    interact: openCrafting
  });
  mods.registerCraft({
    size: new THREE.Vector2(2, 2),
    shapeless: false,
    in: ["group:planks", "group:planks", "group:planks", "group:planks"],
    out: new InvItem("crafting:crafting_table", 1)
  });
})();
