function() {
  registerInputHandler("keydown", function(e) {
    if(e.keyCode == 75) { //k
      MOVEMENT_FLY = !MOVEMENT_FLY;
    }
  });
}
