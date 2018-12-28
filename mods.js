var modsRunOnFrame = [];
var mods = {};

function initMods() {
  var r = 2;
  //loadMod("mods/crafting.js"); //crafting is now included in index.html
  //loadMod("mods/daynight.js?r=" + Math.random());
  loadMod("mods/flight.js?r=" + r);
  loadMod("mods/fast.js?r=" + r);
  //loadMod("mods/creative-inventory.js");
  loadMod("mods/chest.js?r=" + r);
  loadMod("mods/door.js?r=" + r);
  //loadMod("mods/ores.js"); //ores is now included in index.html
  //loadMod("mods/debug.js");
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
