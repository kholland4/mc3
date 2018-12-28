class InvItem {
  constructor(id, qty) {
    if(typeof id == "string") {
      this._id = null;
      this.name = id;
    } else {
      this._id = id;
      this.name = getItemName(id);
    }
    this.qty = qty;
    this._stackable = null;
    this._maxStack = null;
    
    //this.type = "";
    this._isConsumable = null;
    this._isTool = null;
    
    this._toolLife = null;
  }
  
  get id() {
    if(this._id == null) {
      this._id = getItemID(this.name);
    }
    return this._id;
  }
  
  get stackable() {
    if(this._stackable == null) {
      this._stackable = getItemProps(this.id).stackable;
    }
    return this._stackable;
  }
  
  get maxStack() {
    if(this._maxStack == null) {
      this._maxStack = getItemProps(this.id).maxStack;
    }
    return this._maxStack;
  }
  
  get isConsumable() {
    if(this._isConsumable == null) {
      this._isConsumable = getItemProps(this.id).isConsumable;
    }
    return this._isConsumable;
  }
  
  get isTool() {
    if(this._isTool == null) {
      this._isTool = getItemProps(this.id).isTool;
    }
    return this._isTool;
  }
  
  get toolLife() {
    if(this._toolLife == null) {
      this._toolLife = getItemProps(this.id).toolLife;
    }
    return this._toolLife;
  }
  
  set toolLife(val) {
    this._toolLife = val;
  }
  
  render(cellSize, iconSize) {
    var container = document.createElement("div");
    container.className = "invItemContainer";
    container.style.width = cellSize + "px";
    container.style.height = cellSize + "px";
    
    var item = this.id;
    var props = getItemProps(item);
    var icon;
    if(props.icon != null) {
      icon = props.icon;
    } else {
      icon = "textures/blocks/beacon.png"; //TODO: question mark?
    }
    
    container.title = props.displayName;
    
    var img = document.createElement("img");
    img.className = "invItemIcon";
    img.style.width = iconSize + "px";
    img.style.height = iconSize + "px";
    img.style.top = ((cellSize - iconSize) / 2) + "px";
    img.style.left = ((cellSize - iconSize) / 2) + "px";
    img.src = icon;
    container.appendChild(img);
    
    if(this.qty > 1) {
      var badge = document.createElement("div");
      badge.className = "invItemBadge";
      badge.style.fontSize = (cellSize / 3) + "px";
      badge.style.bottom = ((cellSize - iconSize) / 4) + "px";
      badge.style.right = ((cellSize - iconSize) / 4) + "px";
      badge.innerText = this.qty.toString();
      container.appendChild(badge);
    }
    
    if(this.isTool) {
      if(this.toolLife < props.toolLife) {
        var amt = this.toolLife / props.toolLife;
        
        var bar = document.createElement("div");
        bar.className = "invItemBar";
        bar.style.bottom = ((cellSize - iconSize) / 2) + "px";
        bar.style.left = ((cellSize - iconSize) / 2) + "px";
        bar.style.width = (amt * iconSize) + "px";
        container.appendChild(bar);
      }
    }
    
    return container;
  }
  
  typeMatch(compareItem) {
    return this.id == compareItem.id;
  }
  
  equals(compareItem) {
    return this.id == compareItem.id && this.qty == compareItem.qty;
  }
  
  clone() {
    return new InvItem(this.id, this.qty); //TODO replicate tool wear, etc
  }
}

var PLAYER_INVENTORY_SIZE = 36;
var PLAYER_INVENTORY_GRID_SIZE = new THREE.Vector2(9, 4);
var playerInventory = [];

function initInventory() {
  for(var i = 0; i < PLAYER_INVENTORY_SIZE; i++) {
    playerInventory.push(null);
  }
  
  /*setPlayerInventoryItem(0, new InvItem("default:stone", 1));
  setPlayerInventoryItem(1, new InvItem("default:dirt", 1));
  setPlayerInventoryItem(2, new InvItem("default:grass_block", 5));
  setPlayerInventoryItem(3, new InvItem("default:torch", 1));
  setPlayerInventoryItem(4, new InvItem("default:oak_wood_planks", 1));
  setPlayerInventoryItem(5, new InvItem("default:sand", 2));
  setPlayerInventoryItem(6, new InvItem("default:glass", 1));
  setPlayerInventoryItem(7, new InvItem("default:oak_log", 1));
  setPlayerInventoryItem(8, new InvItem("default:leaves", 64));*/
  
  //updateInventory();
}

function updatePlayerInventory() {
  for(var i = 0; i < HUD_ITEM_COUNT; i++) {
    //if(!getHUDItem(i).equals(playerInventory[i])) {
      setHUDItem(i, playerInventory[i]);
    //}
  }
}

function getInventoryItem(inv, slot) {
  if(slot < inv.length) {
    return inv[slot];
  }
  return null;
}

function setInventoryItem(inv, slot, item) {
  if(slot < inv.length) {
    inv[slot] = item;
    if(inv == playerInventory && slot < HUD_ITEM_COUNT) {
      setHUDItem(slot, item);
    }
  }
}

function setPlayerInventoryItem(slot, item) {
  if(slot < PLAYER_INVENTORY_SIZE) {
    playerInventory[slot] = item;
    if(slot < HUD_ITEM_COUNT) {
      setHUDItem(slot, item);
    }
  }
}

function giveInventoryItem(inv, item) {
  for(var i = 0; i < inv.length; i++) {
    if(inv[i] == null) {
      continue;
    }
    if(item.typeMatch(inv[i])) {
      if(item.stackable && inv[i].stackable && item.qty + inv[i].qty <= inv[i].maxStack) {
        inv[i].qty += item.qty;
        return true;
      }
    }
  }
  
  for(var i = 0; i < inv.length; i++) {
    if(inv[i] == null) {
      inv[i] = item;
      return true;
    }
  }
  
  return false;
}

function takeInventoryItem(inv, item) {
  for(var i = 0; i < inv.length; i++) {
    if(inv[i] == null) {
      continue;
    }
    if(item.typeMatch(inv[i])) {
      if(inv[i].qty == item.qty) {
        inv[i] = null;
        return true;
      } else if(inv[i].qty > item.qty) {
        inv[i].qty -= item.qty;
        return true;
      } else {
        continue;
      }
    }
  }
  return false;
}

function hasInventoryItem(inv, item) {
  for(var i = 0; i < inv.length; i++) {
    if(inv[i] == null) {
      continue;
    }
    if(item.typeMatch(inv[i])) {
      if(inv[i].qty == item.qty) {
        return true;
      } else if(inv[i].qty > item.qty) {
        return true;
      } else {
        continue;
      }
    }
  }
  return false;
}

function givePlayerInventoryItem(item) {
  ret = giveInventoryItem(playerInventory, item);
  updatePlayerInventory();
  return ret;
}

function takePlayerInventoryItem(item) {
  ret = takeInventoryItem(playerInventory, item);
  updatePlayerInventory();
  return ret;
}

function hasPlayerInventoryItem(item) {
  return hasInventoryItem(playerInventory, item);
}

function mergeInventoryItems(item1, item2) {
  if(item1 == null || item2 == null) { return null; }
  
  if(item1.typeMatch(item2)) {
    if(item1.stackable && item2.stackable && item1.qty + item2.qty <= item1.maxStack) {
      var newItem = item1.clone();
      newItem.qty += item2.qty;
      return newItem;
    }
  }
  
  return null;
}
