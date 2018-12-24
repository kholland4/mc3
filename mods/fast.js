function() {
  var defaultMovementSpeed = MOVEMENT_SPEED;
  var fastMovementSpeed = MOVEMENT_SPEED * 3;
  registerInputHandler("keydown", function(e) {
    if(e.keyCode == 74) { //j
      if(MOVEMENT_SPEED <= defaultMovementSpeed) {
        MOVEMENT_SPEED = fastMovementSpeed;
      } else {
        MOVEMENT_SPEED = defaultMovementSpeed;
      }
    }
  });
}
