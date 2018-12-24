var CREATIVE_BLOCK_PLACE = false;

var selector = null;
var itemToPlace = null;

function initMapInteract() {
  e_mousedown = function(e) {
    if(selector != null) {
      if(e.which == MOUSE_LEFT) {
        var old = getBlock(selector.destroy);
        if(old != getItemID("default:air")) {
          setBlock(selector.destroy, getItemID("default:air"));
          
          var props = getItemProps(old);
          if(props.drops != null) {
            if(!CREATIVE_BLOCK_PLACE) {
              givePlayerInventoryItem(props.drops.clone());
            } else if(!hasPlayerInventoryItem(props.drops)) {
              givePlayerInventoryItem(props.drops.clone());
            }
          }
          
          //reloadLightMapNear(selector.place);
          //reloadChunkMeshNear(selector.destroy);
          intelligentReloadChunkMeshNear(selector.destroy);
        }
      } else if(e.which == MOUSE_RIGHT && itemToPlace != null) {
        var props = getItemProps(itemToPlace);
        if(props.placeable) {
          var old = getBlock(selector.place);
          //TODO: don't allow placing if there's already a block there? but depends on what block
          setBlock(selector.place, itemToPlace);
          if(collide(controls.getObject().position)) {
            setBlock(selector.place, old);
          } else {
            useHUDActiveItem();
            intelligentReloadChunkMeshNear(selector.place);
          }
        }
      }
    }
  };
}

function setSelector(sel) {
  selector = sel;
}
function clearSelector() {
  selector = null;
}

function setItemToPlace(item) {
  itemToPlace = item;
}
function clearItemToPlace() {
  itemToPlace = null;
}
