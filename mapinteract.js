var CREATIVE_BLOCK_PLACE = false;
var CREATIVE_BLOCK_DESTROY = false;
var BREAK_NUM_STAGES = 10;

var selector = null;
var itemToPlace = null;

var isBreaking = false;
var breakCountdown = 0;
var breakCountdownInitial = 0;
var breakTarget = null;
var breakOverlay;
var breakOverlayMaterials = [];

function initMapInteract() {
  e_mousedown = function(e) {
    if(selector != null) {
      if(e.which == MOUSE_LEFT) {
        interactStartBreaking();
      } else if(e.which == MOUSE_RIGHT && itemToPlace != null) {
        interactPlaceBlock();
      }
    }
  };
  e_mouseup = function(e) {
    if(e.which == MOUSE_LEFT) {
      isBreaking = false;
      breakCountdown = 0;
      breakTarget = null;
      hideBreakOverlay();
    }
  };
  registerOnFrame(function(timeScale) {
    if(isBreaking && selector != null) {
      if(breakTarget != null && selector.destroy.equals(breakTarget)) {
        breakCountdown -= timeScale;
        if(breakCountdown <= 0) {
          //isBreaking = false;
          breakCountdown = 0;
          breakTarget = null;
          hideBreakOverlay();
          
          interactBreakBlock();
          
          /*var res = raycastBlock(controls.getObject());
          if(res != null) {
            setSelector(res);
            showRaycastSelector();
          } else {
            clearSelector();
            hideRaycastSelector();
          }*/
          
          interactStartBreaking(); //TODO 1/4 sec delay
        } else {
          showBreakOverlay(selector.destroy, breakCountdown / breakCountdownInitial);
        }
      } else {
        interactStartBreaking();
      }
    }
  });
  
  for(var i = 0; i < BREAK_NUM_STAGES; i++) {
    var tex = THREE.ImageUtils.loadTexture("textures/blocks/destroy_stage_" + i + ".png");
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    
    var material = new THREE.MeshBasicMaterial({map: tex, transparent: true});
    breakOverlayMaterials.push(material);
  }
  
  var geometry = new THREE.BoxGeometry(1.001, 1.001, 1.001);
  //geometry.computeVertexNormals();
  breakOverlay = new THREE.Mesh(geometry, breakOverlayMaterials[0]);
  //breakOverlay.material.side = THREE.DoubleSide;
  scene.add(breakOverlay);
  breakOverlay.visible = false;
}

function interactStartBreaking() {
  if(selector == null) {
    return;
  }
  
  var props = getItemProps(getBlock(selector.destroy));
  var toolSpeedMul = 1;
  
  if(itemToPlace != null) {
    var toolProps = getItemProps(itemToPlace);
    if(toolProps.isTool && groupMatch(props.groups, toolProps.toolGroups)) {
      toolSpeedMul = toolProps.toolSpeedMul;
    }
  }
  
  if(props.visible) {
    isBreaking = true;
    if(!CREATIVE_BLOCK_DESTROY) {
      breakCountdown = (props.hardness * 1.5) / toolSpeedMul;
    } else {
      breakCountdown = 0.05;
    }
    breakCountdownInitial = breakCountdown;
    breakTarget = selector.destroy.clone();
    showBreakOverlay(selector.destroy, 1);
  }
}

function interactBreakBlock() {
  var old = getBlock(selector.destroy);
  if(old != getItemID("default:air")) {
    setBlock(selector.destroy, getItemID("default:air"));
    
    var props = getItemProps(old);
    
    if(props.onDestroy != null) {
      props.onDestroy(pos);
    }
    
    if(props.drops != null) {
      if(!CREATIVE_BLOCK_PLACE) {
        givePlayerInventoryItem(props.drops.clone());
      } else if(!hasPlayerInventoryItem(props.drops)) {
        givePlayerInventoryItem(props.drops.clone());
      }
    }
    
    if(itemToPlace != null) {
      var toolProps = getItemProps(itemToPlace);
      if(toolProps.isTool && groupMatch(props.groups, toolProps.toolGroups)) {
        useHUDActiveItem();
      }
    }
    
    clearBlockMeta(selector.destroy);
    
    //reloadLightMapNear(selector.place);
    //reloadChunkMeshNear(selector.destroy);
    intelligentReloadChunkMeshNear(selector.destroy);
  }
}

function interactPlaceBlock() {
  var dProps = getItemProps(getBlock(selector.destroy));
  if(dProps.interact != null && !queryKey(K_SHIFT)) {
    dProps.interact(selector.destroy.clone());
    return;
  }
  
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

function showBreakOverlay(pos, stage) {
  breakOverlay.position.copy(pos);
  breakOverlay.material = breakOverlayMaterials[range(1 - stage, 0, BREAK_NUM_STAGES - 1)];
  breakOverlay.visible = true;
}

function hideBreakOverlay() {
  breakOverlay.visible = false;
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
