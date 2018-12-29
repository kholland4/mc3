var GUI_DIALOG_PADDING = 20;
var GUI_CELL_MARGIN = 7;

var popupOpen = false;

var guiHand;
var guiHandItem = null;

function initGUI() {
  guiHand = document.createElement("div");
  guiHand.id = "guiHand";
  document.body.appendChild(guiHand);
  
  document.addEventListener("mousemove", function(e) {
    if(popupOpen) {
      guiHand.style.left = e.clientX + "px";
      guiHand.style.top = e.clientY + "px";
    }
  });
}

function openPopup() {
  if(controls.enabled) {
    controls.enabled = false;
    document.exitPointerLock();
  }
  
  guiHandItem = null;
  updateGUIHand();
  
  var popup = document.getElementById("popup");
  while(popup.firstChild) { popup.removeChild(popup.firstChild); }
  popup.style.display = "block";
  popupOpen = true;
  return popup;
}

function closePopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "none";
  while(popup.firstChild) { popup.removeChild(popup.firstChild); }
  popupOpen = false;
  
  guiHandItem = null;
  updateGUIHand();
  
  if(document.pointerLockElement != renderer.domElement) {
    renderer.domElement.requestPointerLock();
  }
  controls.enabled = true;
}

function updateGUIHand() {
  while(guiHand.firstChild) { guiHand.removeChild(guiHand.firstChild); }
  if(guiHandItem != null) {
    guiHand.appendChild(guiHandItem.render(HUD_CELL_SIZE, HUD_ICON_SIZE));
  }
}

function guiGenDialog() {
  var dialog = document.createElement("div");
  dialog.className = "guiDialog";
  return dialog;
}

function guiSelectiveChildren(el) {
  var res = [];
  for(var i = 0; i < el.children.length; i++) {
    if(el.children[i].className == "guiBlockCell") {
      res.push(el.children[i]);
    }
  }
  return res;
}

function guiGenBlockGrid(size, cellSize, idPrefix) {
  var container = document.createElement("div");
  container.className = "guiBlockGridContainer";
  
  for(var y = 0; y < size.y; y++) {
    for(var x = 0; x < size.x; x++) {
      var cell = document.createElement("div");
      cell.className = "guiBlockCell";
      cell.id = idPrefix + (y * size.x + x).toString();
      cell.style.width = cellSize + "px";
      cell.style.height = cellSize + "px";
      container.appendChild(cell);
    }
    if(y < size.y - 1) {
      container.appendChild(document.createElement("br"));
    }
  }
  
  return container;
}

function guiFillBlockGrid(grid, cellSize, iconSize, data) {
  var c = guiSelectiveChildren(grid);
  for(var i = 0; i < Math.min(data.length, c.length); i++) {
    var cell = c[i];
    while(cell.firstChild) { cell.removeChild(cell.firstChild); }
    if(data[i] != null) {
      cell.appendChild(data[i].render(cellSize, iconSize));
    }
  }
}

function guiInteractiveGrid(grid, data, callback, altData = null, altCallback = null) {
  var c = guiSelectiveChildren(grid);
  for(var i = 0; i < Math.min(c.length, data.length); i++) {
    var cell = c[i];
    cell.dataset.index = i;
    cell.addEventListener("click", function(e) {
      var cellItem = data[this.dataset.index];
      if(queryKey(K_SHIFT)) {
        if(cellItem != null && altData != null) {
          data[this.dataset.index] = null;
          var res = giveInventoryItem(altData, cellItem);
          if(!res) {
            data[this.dataset.index] = cellItem;
          } else {
            callback();
            if(altCallback != null) {
              altCallback();
            }
          }
        }
      } else {
        if(cellItem != null && guiHandItem == null) {
          guiHandItem = data[this.dataset.index];
          data[this.dataset.index] = null;
          updateGUIHand();
          callback();
        } else if(cellItem == null && guiHandItem != null) {
          data[this.dataset.index] = guiHandItem;
          guiHandItem = null;
          updateGUIHand();
          callback();
        } else if(cellItem != null && guiHandItem != null) {
          var merged = mergeInventoryItems(cellItem, guiHandItem);
          if(merged != null) {
            data[this.dataset.index] = merged;
            guiHandItem = null;
            updateGUIHand();
            callback();
          } else {
            var temp = cellItem;
            data[this.dataset.index] = guiHandItem;
            guiHandItem = temp;
            updateGUIHand();
            callback();
          }
        }
      }
    });
    
    cell.addEventListener("contextmenu", function(e) {
      e.preventDefault();
      var cellItem = data[this.dataset.index];
      if(cellItem == null && guiHandItem != null) {
        if(guiHandItem.qty == 1) {
          data[this.dataset.index] = guiHandItem;
          guiHandItem = null;
          updateGUIHand();
          callback();
        } else if(guiHandItem.qty > 1) {
          data[this.dataset.index] = new InvItem(guiHandItem.id, 1);
          guiHandItem.qty--;
          updateGUIHand();
          callback();
        }
      } else if(cellItem != null && guiHandItem != null) {
        var newItem = new InvItem(guiHandItem.id, 1);
        var merged = mergeInventoryItems(cellItem, newItem);
        if(merged != null) {
          data[this.dataset.index] = merged;
          guiHandItem.qty--;
          if(guiHandItem.qty <= 0) {
            guiHandItem = null;
          }
          updateGUIHand();
          callback();
        }
      }
    });
  }
}

function guiGenSpacer(size) {
  var spacer = document.createElement("div");
  spacer.style.width = size.x + "px";
  spacer.style.height = size.y + "px";
  return spacer;
}
