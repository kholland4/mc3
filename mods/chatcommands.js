(function() {
  //Some useful chat commands
  mods.registerChatCommand("/loadmod", loadMod);
  mods.registerChatCommand("/tp", function(str) {
    if(str.indexOf(",") == -1) {
      return;
    }
    var x = str.substring(0, str.indexOf(","));
    str = str.substring(str.indexOf(",") + 1);
    if(str.indexOf(",") == -1) {
      return;
    }
    var y = str.substring(0, str.indexOf(","));
    str = str.substring(str.indexOf(",") + 1);
    var z = str;
    
    var pos = new THREE.Vector3(parseFloat(x), parseFloat(y), parseFloat(z));
    
    for(var i = 0; i < 3; i++) {
      if(isNaN(pos.getComponent(i)) || !isFinite(pos.getComponent(i))) {
        return;
      }
    }
    
    chunkMeshAutoload(vectorDivide(pos, CHUNK_SIZE), new THREE.Vector3(1, 1, 1), Infinity, false);
    
    controls.getObject().position.copy(pos);
    
    return "Teleported to " + pos.x + ", " + pos.y + ", " + pos.z + "\n";
  });
  mods.registerChatCommand("/where", function() {
    var pos = controls.getObject().position;
    
    return "You are at " + pos.x.toFixed(1) + ", " + pos.y.toFixed(1) + ", " + pos.z.toFixed(1) + "\n";
  });
  mods.registerChatCommand("/give", function(str) {
    if(!isNaN(parseInt(str))) {
      str = parseInt(str);
    }
    if(getItemProps(str) == null) {
      return "Item not found\n";
    }
    
    givePlayerInventoryItem(new InvItem(str, 1));
  });
})();
