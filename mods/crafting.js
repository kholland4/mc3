function() {
  var craftingOpen = false;
  
  CREATIVE_BLOCK_PLACE = false;
  CREATIVE_BLOCK_DESTROY = false;
  
  var CRAFT_GRID_SIZE = new THREE.Vector2(3, 3);
  
  mods.craftRecipies = [
    {size: new THREE.Vector2(1, 2), shapeless: false, in: ["default:oak_planks", "default:oak_planks"], out: new InvItem("default:stick", 4)}
  ];
  mods.registerCraft = function(craft) {
    craftRecipies.push(craft);
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
          if(rec.in[n] != swCraftInv[n].name) {
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
        craftInv[index].qty--;
        if(craftInv[index].qty <= 0) {
          craftInv[index] = null;
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
        dialog.appendChild(craftOutGrid);
        guiFillBlockGrid(craftOutGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, craftOut);
        guiInteractiveGrid(craftOutGrid, craftOut, function() {
          if(craftOut[0] == null) {
            useCraft();
          } else {
            guiHandItem = craftOut[0];
            craftOut[0] = null;
            updateGUIHand();
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
