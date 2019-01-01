var modsRunOnFrame = [];
var mods = {};
var modsInit = [];
var modsInitted = false;

function initMods() {
  var r = 5; //Useful to force reload mod files
  //loadMod("mods/crafting.js"); //crafting is now included in index.html
  //loadMod("mods/daynight.js?r=" + Math.random());
  loadMod("mods/flight.js?r=" + r);
  loadMod("mods/fast.js?r=" + r);
  //loadMod("mods/creative-inventory.js");
  loadMod("mods/chest.js?r=" + r);
  loadMod("mods/door.js?r=" + r);
  //loadMod("mods/ores.js"); //ores is now included in index.html
  //loadMod("mods/debug.js");
  //loadMod("mods/chat.js?r=" + r);
  loadMod("mods/gamemode.js?r=" + r);
  loadMod("mods/chatcommands.js?r=" + r);
  loadMod("mods/farming.js?r=" + r);
  loadMod("mods/health.js?r=" + r);
  loadMod("mods/hunger.js?r=" + r);
  loadMod("mods/stairs.js?r=" + r);
  loadMod("mods/slab.js?r=" + r);
  
  //loadMod("mods/entitytest.js?r=" + r);
  
  for(var i = 0; i < modsInit.length; i++) {
    modsInit[i]();
  }
  modsInitted = true;
}

function loadMod(url) {
  /*loadf(url, function() {
    eval(this.responseText);
  });*/
  var script = document.createElement("script");
  script.src = url;
  document.head.appendChild(script);
}

function modsOnFrame(timeScale) {
  for(var i = 0; i < modsRunOnFrame.length; i++) {
    modsRunOnFrame[i](timeScale);
  }
}

function registerOnFrame(callback) {
  removeOnFrame(callback);
  modsRunOnFrame.push(callback);
}

function addOnFrame(callback) {
  registerOnFrame(callback);
}

function removeOnFrame(callback) {
  for(var i = 0; i < modsRunOnFrame.length; i++) {
    if(modsRunOnFrame[i] == callback) {
      modsRunOnFrame.splice(i, 1);
      return;
    }
  }
}

function registerModsInit(callback) {
  if(modsInitted) {
    callback();
  } else {
    modsInit.push(callback);
  }
}
