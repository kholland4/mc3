(function() {
  registerModsInit(function() {
    mods.health = {};
    mods.health.enabled = true;
    
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
    
    var healthBar = document.createElement("div");
    healthBar.style.position = "absolute";
    healthBar.style.left = "0";
    healthBar.style.bottom = "10px";
    var hearts = [];
    for(var i = 0; i < 10; i++) {
      var heart = document.createElement("img");
      heart.className = "guiPixelArt";
      heart.style.width = "27px";
      heart.style.height = "27px";
      heart.src = TEXTUREPACK + "textures/misc/heart_full.png";
      hearts.push(heart);
      healthBar.appendChild(heart);
    }
    mods.health.hearts = hearts;
    mods.health.healthBar = healthBar;
    container.appendChild(healthBar);
    document.body.appendChild(container);
    
    mods.health.level = 20;
    mods.health.max = 20;
    mods.health.get = function() {
      return mods.health.level;
    };
    mods.health.set = function(level) {
      level = Math.min(Math.max(level, 0), 20);
      mods.health.level = level;
      for(var i = 0; i < 10; i++) {
        if(level > i * 2) {
          if(level >= (i + 1) * 2) {
            mods.health.hearts[i].src = TEXTUREPACK + "textures/misc/heart_full.png";
          } else {
            mods.health.hearts[i].src = TEXTUREPACK + "textures/misc/heart_half.png";
          }
        } else {
          mods.health.hearts[i].src = TEXTUREPACK + "textures/misc/heart_empty.png";
        }
      }
    };
    
    var oldYSpeed = 0;
    registerOnFrame(function(timeScale) {
      if(mods.health.enabled) {
        ySpeed = realMovement.y;
        if(!MOVEMENT_FLY) {
          var delta = Math.abs(ySpeed - oldYSpeed) * timeScale;
          if(delta > 0.2) {
            var healthHit = Math.floor((delta - 0.2) * 20);
            console.log(healthHit);
            mods.health.set(mods.health.get() - healthHit);
          }
        }
        oldYSpeed = ySpeed;
      }
    });
    
    mods.health.enable = function() {
      mods.health.enabled = true;
      oldYSpeed = realMovement.y;
      mods.health.healthBar.style.display = "block";
    };
    
    mods.health.disable = function() {
      mods.health.enabled = false;
      mods.health.healthBar.style.display = "none";
    };
  });
})();
