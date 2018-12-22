var selector = null;

function initMapInteract() {
  e_click = function(e) {
    if(selector != null) {
      if(e.which == MOUSE_LEFT) {
        setBlock(selector.destroy, getItemID("default:air"));
        reloadLightMapNear(selector.place);
        reloadChunkMeshNear(selector.destroy);
      } else if(e.which == MOUSE_RIGHT) {
        var old = getBlock(selector.place);
        setBlock(selector.place, getItemID("default:torch"));
        if(collide(controls.getObject().position)) {
          setBlock(selector.place, old);
        } else {
          reloadLightMapNear(selector.place);
          reloadChunkMeshNear(selector.place);
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
