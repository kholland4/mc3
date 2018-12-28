function() {
  var craftingOpen = false;
  
  CREATIVE_BLOCK_PLACE = false;
  CREATIVE_BLOCK_DESTROY = false;
  
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
    {size: new THREE.Vector2(2, 2), shapeless: false, in: ["default:stone", "default:stone", "default:stone", "default:stone"], out: new InvItem("default:stone_bricks", 4)},
    //TODO melon (9x default:melon_slice)
    
    {size: new THREE.Vector2(1, 1), shapeless: false, in: ["default:oak_log"], out: new InvItem("default:oak_planks", 4)},
    {size: new THREE.Vector2(1, 1), shapeless: false, in: ["default:acacia_log"], out: new InvItem("default:acacia_planks", 4)},
    {size: new THREE.Vector2(1, 1), shapeless: false, in: ["default:birch_log"], out: new InvItem("default:birch_planks", 4)},
    {size: new THREE.Vector2(1, 1), shapeless: false, in: ["default:jungle_log"], out: new InvItem("default:jungle_planks", 4)},
    {size: new THREE.Vector2(1, 1), shapeless: false, in: ["default:spruce_log"], out: new InvItem("default:spruce_planks", 4)},
    
    {size: new THREE.Vector2(1, 2), shapeless: false, in: ["default:coal", "default:stick"], out: new InvItem("default:torch", 4)},
    {size: new THREE.Vector2(1, 2), shapeless: false, in: ["default:charcoal", "default:stick"], out: new InvItem("default:torch", 4)}
    /*{size: new THREE.Vector2(3, 3), shapeless: false, in: [], out: new InvItem("default:", 1)},
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
            if(rec.in[n].startsWith("group:")) {
              var targetGroup = rec.in[n].substring(6);
              var props = getItemProps(swCraftInv[n].id);
              if(props.groups.includes(targetGroup)) {
                continue;
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
  
  document.addEventListener("keydown", function(e) {
    if(document.pointerLockElement == renderer.domElement && !e.repeat) {
      if(e.keyCode == 69) { //e
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
    } else if(craftingOpen) {
      if(e.keyCode == 69) {
        craftingOpen = false;
        closePopup();
        return;
      }
    }
  });
}
