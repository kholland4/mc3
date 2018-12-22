var selector = null;
var itemToPlace = null;

function initMapInteract() {
  e_mousedown = function(e) {
    if(selector != null) {
      if(e.which == MOUSE_LEFT) {
        setBlock(selector.destroy, getItemID("default:air"));
        reloadLightMapNear(selector.place);
        reloadChunkMeshNear(selector.destroy);
      } else if(e.which == MOUSE_RIGHT && itemToPlace != null) {
        var props = getItemProps(itemToPlace);
        if(props.placeable) {
          var old = getBlock(selector.place);
          //TODO: don't allow placing if there's already a block there? but depends on what block
          setBlock(selector.place, itemToPlace);
          if(collide(controls.getObject().position)) {
            setBlock(selector.place, old);
          } else {
            reloadLightMapNear(selector.place);
            reloadChunkMeshNear(selector.place);
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
