var HUD_ITEM_COUNT = 9;
var HUD_KEYS = [K_HUD_1, K_HUD_2, K_HUD_3, K_HUD_4, K_HUD_5, K_HUD_6, K_HUD_7, K_HUD_8, K_HUD_9];
var HUD_CELL_SIZE = 60; //pixels
var HUD_ICON_SIZE = 55; //pixels

var HUD_SELECTOR_OFFSET = new THREE.Vector2(-4, -4);
var HUD_SELECTOR_DELTA = new THREE.Vector2(HUD_CELL_SIZE + 4, 0);

var hudItems = [];
var hudSelector = 0;
var hudCells = [];
var hudSelectorDOM;

function initHUD() {
  registerInputHandler("keydown", hudKeydown);
  
  for(var i = 0; i < HUD_ITEM_COUNT; i++) {
    hudItems.push(null);
  }
  
  //setup HTML/CSS
  var container = document.getElementById("hud");
  //container.style.width = (HUD_CELL_SIZE * HUD_ITEM_COUNT) + "px";
  //container.style.height = HUD_CELL_SIZE + "px";
  
  for(var i = 0; i < HUD_ITEM_COUNT; i++) {
    var cell = document.createElement("div");
    cell.className = "hudCell";
    cell.style.width = HUD_CELL_SIZE + "px";
    cell.style.height = HUD_CELL_SIZE + "px";
    hud.appendChild(cell);
    hudCells.push(cell);
  }
  
  hudSelectorDOM = document.createElement("div");
  hudSelectorDOM.style.width = HUD_CELL_SIZE + "px";
  hudSelectorDOM.style.height = HUD_CELL_SIZE + "px";
  hudSelectorDOM.id = "hudSelector";
  hud.appendChild(hudSelectorDOM);
  
  /*hudItems[0] = getItemID("default:stone");
  hudItems[1] = getItemID("default:dirt");
  hudItems[2] = getItemID("default:grass_block");
  hudItems[3] = getItemID("default:torch");
  hudItems[4] = getItemID("default:oak_wood_planks");
  hudItems[5] = getItemID("default:sand");
  hudItems[6] = getItemID("default:glass");
  hudItems[7] = getItemID("default:oak_log");
  hudItems[8] = getItemID("default:leaves");*/
  
  updateHUD();
  updateHUDSelector();
}

function hudKeydown(e) {
  for(var i = 0; i < HUD_KEYS.length && i < HUD_ITEM_COUNT; i++) {
    if(e.keyCode == HUD_KEYS[i]) {
      hudSelector = i;
      updateHUDSelector();
      return;
    }
  }
}

function updateHUD() {
  for(var i = 0; i < HUD_ITEM_COUNT; i++) {
    var cell = hudCells[i];
    while(cell.firstChild) { cell.removeChild(cell.firstChild); }
    if(hudItems[i] != null) {
      cell.appendChild(hudItems[i].render(HUD_CELL_SIZE, HUD_ICON_SIZE));
    }
  }
}

function updateHUDSelector() {
  hudSelectorDOM.style.left = HUD_SELECTOR_OFFSET.x + (HUD_SELECTOR_DELTA.x * hudSelector) + "px";
  hudSelectorDOM.style.top = HUD_SELECTOR_OFFSET.y + (HUD_SELECTOR_DELTA.y * hudSelector) + "px";
  
  if(hudItems[hudSelector] == null) {
    setItemToPlace(null);
  } else {
    setItemToPlace(hudItems[hudSelector].id);
  }
}

function getHUDItem(slot) {
  if(slot < HUD_ITEM_COUNT) {
    return hudItems[slot];
  }
  return null;
}

function setHUDItem(slot, item) {
  if(slot < HUD_ITEM_COUNT) {
    hudItems[slot] = item;
    updateHUD();
    updateHUDSelector();
  }
}

function useHUDActiveItem() {
  //active item has been placed/used
  if(hudItems[hudSelector] == null) {
    return;
  }
  if(CREATIVE_BLOCK_PLACE) {
    return;
  }
  
  if(hudItems[hudSelector].isConsumable) {
    hudItems[hudSelector].qty--;
    if(hudItems[hudSelector].qty <= 0) {
      hudItems[hudSelector] = null;
    }
    setPlayerInventoryItem(hudSelector, hudItems[hudSelector]); //FIXME
  } else if(hudItems[hudSelector].isTool) {
    hudItems[hudSelector].toolLife--;
    if(hudItems[hudSelector].toolLife <= 0) {
      hudItems[hudSelector] = null;
    }
    setPlayerInventoryItem(hudSelector, hudItems[hudSelector]); //FIXME
  }
}
