function init() {
  initTextures();
  initItemData();
  initMap();
  initWebGL();
  initInput();
  initRaycast();
  initMapInteract();
  initCollision();
  initHUD();
  initInventory();
  initGUI();
  initMods();
  
  //setBlock(new THREE.Vector3(0, 45, 0), getItemID("default:torch"));
  
  var startPos = new THREE.Vector3(-80, 0, 65);
  startPos.y = mapHeight(new THREE.Vector2(startPos.x, startPos.z)) + 5;
  
  controls.getObject().position.copy(startPos);
  
  givePlayerInventoryItem(new InvItem("ores:diamond_block", 9));
  givePlayerInventoryItem(new InvItem("ores:emerald_block", 9));
  givePlayerInventoryItem(new InvItem("ores:gold_block", 9));
  givePlayerInventoryItem(new InvItem("ores:iron_block", 9));
  givePlayerInventoryItem(new InvItem("ores:lapis_block", 9));
  givePlayerInventoryItem(new InvItem("ores:redstone_block", 9));
  
  chunkMeshAutoload(vectorDivide(startPos, CHUNK_SIZE), new THREE.Vector3(1, 1, 1), Infinity);
  
  animate();
}

document.addEventListener("DOMContentLoaded", init);
