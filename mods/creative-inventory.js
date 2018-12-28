(function() {
  var creativeInventoryOpen = false;
  //registerInputHandler("keydown", function(e) {});
  
  CREATIVE_BLOCK_PLACE = true;
  CREATIVE_BLOCK_DESTROY = true;
  
  document.addEventListener("keydown", function(e) {
    if(document.pointerLockElement == renderer.domElement && !e.repeat) {
      if(e.keyCode == 69) { //e
        /*if(creativeInventoryOpen) {
          creativeInventoryOpen = false;
          closePopup();
          return;
        }*/
        
        creativeInventoryOpen = true;
        var popup = openPopup();
        var dialog = guiGenDialog();
        popup.appendChild(dialog);
        
        var creativeInventory = [];
        for(var i = 0; i < items.length; i++) {
          if(getItemProps(items[i].name).inInventory) {
            creativeInventory.push(new InvItem(items[i].name, 1));
          }
        }
        /*creativeInventory.sort(function(a, b) {
          return a.name > b.name;
        });*/
        
        var mCreativeInventory = [];
        for(var i = 0; i < creativeInventory.length; i++) {
          mCreativeInventory.push(creativeInventory[i].clone());
        }
        
        //TODO: shift-click picks up a whole stack
        var grid = guiGenBlockGrid(new THREE.Vector2(9, Math.ceil(creativeInventory.length / 9)), HUD_CELL_SIZE, "creative");
        var container = document.createElement("div");
        container.style.height = "300px";
        container.style.overflowY = "scroll";
        container.appendChild(grid);
        dialog.appendChild(container);
        guiFillBlockGrid(grid, HUD_CELL_SIZE, HUD_ICON_SIZE, mCreativeInventory);
        guiInteractiveGrid(grid, mCreativeInventory, function() {
          for(var i = 0; i < creativeInventory.length; i++) {
            mCreativeInventory[i] = creativeInventory[i].clone();
          }
          guiFillBlockGrid(grid, HUD_CELL_SIZE, HUD_ICON_SIZE, mCreativeInventory);
        }, playerInventory, function() {
          guiFillBlockGrid(invGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, playerInventory);
          updatePlayerInventory();
        });
        
        dialog.appendChild(guiGenSpacer(new THREE.Vector2(0, HUD_CELL_SIZE / 2)));
        
        var invGrid = guiGenBlockGrid(PLAYER_INVENTORY_GRID_SIZE, HUD_CELL_SIZE, "inv");
        dialog.appendChild(invGrid);
        guiFillBlockGrid(invGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, playerInventory);
        guiInteractiveGrid(invGrid, playerInventory, function() {
          guiFillBlockGrid(invGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, playerInventory);
          updatePlayerInventory();
        }, mCreativeInventory, function() {
          for(var i = 0; i < creativeInventory.length; i++) {
            mCreativeInventory[i] = creativeInventory[i].clone();
          }
          guiFillBlockGrid(grid, HUD_CELL_SIZE, HUD_ICON_SIZE, mCreativeInventory);
        });
      }
    } else if(creativeInventoryOpen) {
      if(e.keyCode == 69) {
        creativeInventoryOpen = false;
        closePopup();
        return;
      }
    }
  });
})();
