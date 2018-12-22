var HUD_ITEM_COUNT = 9;
var HUD_KEYS = [K_HUD_1, K_HUD_2, K_HUD_3, K_HUD_4, K_HUD_5, K_HUD_6, K_HUD_7, K_HUD_8, K_HUD_9];
var HUD_CELL_SIZE = 60; //pixels
var HUD_ICON_SIZE = 50; //pixels

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
  
  hudItems[0] = getItemID("default:stone");
  hudItems[1] = getItemID("default:dirt");
  hudItems[2] = getItemID("default:grass_block");
  hudItems[3] = getItemID("default:torch");
  
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
      var item = hudItems[i];
      var props = getItemProps(item);
      var icon;
      if(props.icon != null) {
        icon = props.icon;
      } else {
        icon = "textures/blocks/stone.png";
      }
      
      var img = document.createElement("img");
      img.className = "hudIcon";
      img.style.width = HUD_ICON_SIZE + "px";
      img.style.height = HUD_ICON_SIZE + "px";
      img.style.top = ((HUD_CELL_SIZE - HUD_ICON_SIZE) / 2) + "px";
      img.style.left = ((HUD_CELL_SIZE - HUD_ICON_SIZE) / 2) + "px";
      img.src = icon;
      cell.appendChild(img);
    }
  }
}

function updateHUDSelector() {
  hudSelectorDOM.style.left = HUD_SELECTOR_OFFSET.x + (HUD_SELECTOR_DELTA.x * hudSelector) + "px";
  hudSelectorDOM.style.top = HUD_SELECTOR_OFFSET.y + (HUD_SELECTOR_DELTA.y * hudSelector) + "px";
  
  setItemToPlace(hudItems[hudSelector]);
}
