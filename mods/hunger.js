(function() {
  registerModsInit(function() {
    mods.hunger = {};
    mods.hunger.enabled = true;
    
    var hud = document.getElementById("hud");
    var container = document.createElement("div");
    container.style.width = hud.clientWidth + "px";
    container.style.height = hud.clientHeight + "px";
    container.style.zIndex = "1";
    container.style.position = "fixed";
    container.style.bottom = hud.clientHeight + "px";
    container.style.left = "50%";
    container.style.transform = "translateX(-50%)";
    container.style.fontSize = "0";
    
    var hungerBar = document.createElement("div");
    hungerBar.style.position = "absolute";
    hungerBar.style.right = "0";
    hungerBar.style.bottom = "10px";
    var drumsticks = [];
    for(var i = 0; i < 10; i++) {
      var drumstick = document.createElement("img");
      drumstick.className = "guiPixelArt";
      drumstick.style.width = "27px";
      drumstick.style.height = "27px";
      drumstick.src = "textures/misc/drumstick_full.png";
      drumsticks.push(drumstick);
      hungerBar.appendChild(drumstick);
    }
    mods.hunger.drumsticks = drumsticks;
    mods.hunger.hungerBar = hungerBar
    container.appendChild(hungerBar);
    document.body.appendChild(container);
    
    mods.hunger.level = 20;
    mods.hunger.max = 20;
    mods.hunger.saturation = 5;
    mods.hunger.exhaustion = 0;
    mods.hunger.get = function() {
      return mods.hunger.level;
    };
    mods.hunger.set = function(level) {
      level = Math.min(Math.max(level, 0), 20);
      var delta = level - mods.hunger.level;
      mods.hunger.level = level;
      for(var i = 0; i < 10; i++) {
        if(level > i * 2) {
          if(level >= (i + 1) * 2) {
            mods.hunger.drumsticks[9 - i].src = "textures/misc/drumstick_full.png";
          } else {
            mods.hunger.drumsticks[9 - i].src = "textures/misc/drumstick_half.png";
          }
        } else {
          mods.hunger.drumsticks[9 - i].src = "textures/misc/drumstick_empty.png";
        }
      }
    }
    mods.hunger.getExhaustion = function() {
      return mods.hunger.exhaustion;
    };
    mods.hunger.setExhaustion = function(level) {
      mods.hunger.exhaustion = level;
      while(mods.hunger.exhaustion > 4) {
        mods.hunger.exhaustion -= 4;
        if(mods.hunger.saturation > 0) {
          mods.hunger.saturation -= 1;
          if(mods.hunger.saturation < 0) {
            mods.hunger.saturation = 0;
          }
        } else {
          mods.hunger.set(mods.hunger.get() - 1);
        }
      }
    };
    
    //TODO regen with sat > 0 and hunger < 20 and hunger >= 18
    //TODO other sources of exhaustion
    setInterval(function() {
      if(mods.hunger.enabled) {
        if(mods.hunger.get() == mods.hunger.max && mods.hunger.saturation > 0 && mods.health.get() < mods.health.max) {
          mods.health.set(mods.health.get() + 1);
          mods.hunger.setExhaustion(mods.hunger.getExhaustion() + 6);
        }
      }
    }, 500);
    
    setInterval(function() {
      if(mods.hunger.enabled) {
        if(mods.hunger.get() >= mods.hunger.max - 2 && mods.hunger.saturation == 0 && mods.health.get() < mods.health.max) {
          mods.health.set(mods.health.get() + 1);
          mods.hunger.setExhaustion(mods.hunger.getExhaustion() + 6);
        } else if(mods.hunger.get() == 0 && mods.health.get() > 1) {
          mods.health.set(mods.health.get() - 1);
        }
      }
    }, 4000);
    
    mods.hunger.eat = function(foodPoints, foodSat) {
      if(mods.hunger.enabled) {
        mods.hunger.set(mods.hunger.get() + foodPoints);
        mods.hunger.saturation = Math.max(Math.min(mods.hunger.get(), mods.hunger.saturation + foodSat), 0);
      }
    };
    
    //TODO handle items created after this is run
    //TODO fix multiple bindings (ie planting potatoes and carrots)
    for(var i = 0; i < items.length; i++) {
      var name = items[i].name;
      var props = getItemProps(name);
      if(props.isFood && !props.placeable) {
        setItemProp(name, "placeable", true);
        setItemProp(name, "onPlace", function(pos, itemToPlace) {
          var props = getItemProps(itemToPlace);
          if(props.isFood) {
            mods.hunger.eat(props.foodPoints, props.foodSat);
            useHUDActiveItem();
          }
          return false;
        });
      }
    }
    
    mods.hunger.enable = function() {
      mods.hunger.enabled = true;
      mods.hunger.hungerBar.style.display = "block";
    };
    
    mods.hunger.disable = function() {
      mods.hunger.enabled = false;
      mods.hunger.hungerBar.style.display = "none";
    };
  });
})();
