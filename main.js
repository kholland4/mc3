var VIEW_RANGE = new THREE.Vector3(3, 2, 3);

var realMovement = new THREE.Vector3(0, 0, 0);

var prevTime = performance.now();
var frameCount = 0;

function animate() {
  requestAnimationFrame(animate);
  
  var time = performance.now();
  var timeDelta = time - prevTime;
  prevTime = time;
  var timeScale = timeDelta / 1000;
  
  modsOnFrame(timeScale);
  
  //---Raycast---
  if(frameCount % 2 == 0) {
    var res = raycastBlock(controls.getObject());
    if(res != null) {
      setSelector(res);
      showRaycastSelector();
    } else {
      clearSelector();
      hideRaycastSelector();
    }
  }
  
  //---Fetch props---
  var blockIn = getBlock(vectorRound(controls.getObject().position));
  var props = getItemProps(blockIn);
  
  //---Tint---
  if(props.tintColor != null) {
    document.getElementById("tint").style.backgroundColor = props.tintColor;
  } else {
    document.getElementById("tint").style.backgroundColor = "rgba(0, 0, 0, 0.0)";
  }
  
  //---Fluid physics---
  var moveScale = 1;
  var canFloat = false;
  if(props.fluidPhysics != null) {
    moveScale *= props.fluidPhysics;
    canFloat = true;
  }
  
  //---Gravity/jump---
  var oldRealMovement = realMovement.clone();
  if(!MOVEMENT_FLY) {
    movement.y = realMovement.y;
    if(movement.y == 0 && queryKey(K_JUMP)) {
      movement.y += 6;
    } else if(canFloat && queryKey(K_VUP)) {
      movement.y = MOVEMENT_SPEED;
    }
    movement.y += -9.8 * timeScale;
    realMovement.y = movement.y;
  }
  
  //---Ease-in/out for movement
  var axes = [0, 1, 2];
  if(!MOVEMENT_FLY) {
    axes = [0, 2];
  }
  //if(MOVEMENT_FLY || oldRealMovement.y == 0) {
    axes.forEach(function(axis) {
      var diff = realMovement.getComponent(axis) - movement.getComponent(axis);
      if(Math.abs(diff) < 0.1) {
        realMovement.setComponent(axis, movement.getComponent(axis));
      } else if(diff > 0) {
        realMovement.setComponent(axis, realMovement.getComponent(axis) - 30 * timeScale);
        
        diff = realMovement.getComponent(axis) - movement.getComponent(axis);
        if(diff < 0) {
          realMovement.setComponent(axis, movement.getComponent(axis));
        }
      } else if(diff < 0) {
        realMovement.setComponent(axis, realMovement.getComponent(axis) + 30 * timeScale);
        
        diff = realMovement.getComponent(axis) - movement.getComponent(axis);
        if(diff > 0) {
          realMovement.setComponent(axis, movement.getComponent(axis));
        }
      }
    });
  //}
  
  //---Movement---
  var oldPos = controls.getObject().position.clone();
  controls.getObject().translateOnAxis(realMovement, timeScale * moveScale);
  var newPos = controls.getObject().position.clone();
  controls.getObject().position.copy(oldPos);
  [0, 1, 2].forEach(function(index) {
    var axisPos = [new THREE.Vector3(newPos.x, oldPos.y, oldPos.z), new THREE.Vector3(oldPos.x, newPos.y, oldPos.z), new THREE.Vector3(oldPos.x, oldPos.y, newPos.z)][index];
    if(!collide(axisPos)) {
      controls.getObject().position.copy(axisPos);
      oldPos = controls.getObject().position.clone();
    } else {
      //For gravity
      if(index == 1 && !MOVEMENT_FLY) {
        realMovement.y = 0;
      }
    }
  });
  
  //---Loading/unloading chunks---
  if(frameCount % 1 == 0) {
    var chunkIn = vectorDivide(controls.getObject().position, CHUNK_SIZE);
    chunkMeshAutoload(chunkIn, VIEW_RANGE, 1);
  }
  
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  
  frameCount++;
}
