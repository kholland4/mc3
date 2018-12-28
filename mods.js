var modsRunOnFrame = [];
var mods = {};

function initMods() {
  loadMod("mods/crafting.js");
  //loadMod("mods/daynight.js?r=" + Math.random());
  loadMod("mods/flight.js");
  loadMod("mods/fast.js");
  //loadMod("mods/creative-inventory.js");
  loadMod("mods/chest.js");
  loadMod("mods/door.js");
  loadMod("mods/ores.js");
  //loadMod("mods/debug.js");
}

function loadMod(url) {
  loadf(url, function() {
    eval("var modFunc = " + this.responseText + ";");
    modFunc();
  });
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
