(function() {
  if(!("CREATIVE_MODE" in mods)) {
    mods.CREATIVE_MODE = false;
  }
  mods.setGameMode = function(mode) {
    if(mode == "survival") {
      mods.CREATIVE_MODE = false;
      CREATIVE_BLOCK_PLACE = false;
      CREATIVE_BLOCK_DESTROY = false;
      if("health" in mods) {
        mods.health.enable();
      }
      if("hunger" in mods) {
        mods.hunger.enable();
      }
    } else if(mode == "creative") {
      mods.CREATIVE_MODE = true;
      CREATIVE_BLOCK_PLACE = true;
      CREATIVE_BLOCK_DESTROY = true;
      if("health" in mods) {
        mods.health.disable();
      }
      if("hunger" in mods) {
        mods.hunger.disable();
      }
    }
  };
  mods.registerChatCommand("/gamemode", mods.setGameMode);
})();
