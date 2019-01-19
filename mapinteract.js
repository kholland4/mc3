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
      } else if(e.which == MOUSE_RIGHT) {
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
    var tex = THREE.ImageUtils.loadTexture(TEXTUREPACK + "textures/misc/destroy_stage_" + i + ".png");
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    
    var material = new THREE.MeshBasicMaterial({map: tex, transparent: true});
    breakOverlayMaterials.push(material);
  }
  
  var geometry = new THREE.BoxGeometry(1.001, 1.001, 1.001);
  //geometry.computeVertexNormals();
  breakOverlay = new THREE.Mesh(geometry, breakOverlayMaterials[0]);
  //breakOverlay.material.side = THREE.DoubleSide;
  breakOverlay.renderOrder = 5;
  scene.add(breakOverlay);
  breakOverlay.visible = false;
}

function interactStartBreaking() {
  if(selector == null) {
    return;
  }
  
  var props = getItemProps(getBlock(selector.destroy));
  var toolSpeedMul = 1;
  var toolHelps = false;
  
  if(itemToPlace != null) {
    var toolProps = getItemProps(itemToPlace);
    if(toolProps.isTool && groupMatch(props.groups, toolProps.toolGroups)) {
      toolSpeedMul = toolProps.toolSpeedMul;
      if(toolProps.toolLevel >= props.reqToolLevel) {
        toolHelps = true;
      }
    }
  }
  if(props.reqToolLevel <= 0) {
    toolHelps = true;
  }
  
  if(props.visible) {
    isBreaking = true;
    if(!CREATIVE_BLOCK_DESTROY) {
      if(toolHelps) {
        breakCountdown = (props.hardness * 1.5) / toolSpeedMul;
      } else {
        breakCountdown = (props.hardness * 5) / toolSpeedMul;
      }
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
      var ret = props.onDestroy(selector.destroy.clone());
      if(ret === false) {
        return;
      }
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
      if(toolProps.isTool && groupMatch(props.groups, toolProps.toolGroups) && toolProps.toolLevel >= props.reqToolLevel) {
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
  
  if(itemToPlace != null) {
    var props = getItemProps(itemToPlace);
    if(props.placeable) {
      if(props.onPlace != null) {
        var ret = props.onPlace(selector.place.clone(), itemToPlace);
        if(ret === false) {
          return;
        }
      }
      
      var old = getBlock(selector.place);
      //TODO: don't allow placing if there's already a block there? but depends on what block
      setBlock(selector.place, itemToPlace);
      if(collide(controls.getObject().position)) {
        setBlock(selector.place, old);
      } else {
        if(props.directional) {
          var rot = mod(controls.getObject().rotation.y, Math.PI * 2);
          var facing = 0;
          facing = Math.round((rot / (Math.PI * 2)) * 4);
          var meta = getBlockMeta(selector.place);
          meta.facing = facing;
          setBlockMeta(selector.place, meta);
        }
        useHUDActiveItem();
        
        if(props.postPlace != null) {
          props.postPlace(selector.place.clone(), itemToPlace);
        }
        
        intelligentReloadChunkMeshNear(selector.place);
      }
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
