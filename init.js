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
  
  var startY = mapHeight(new THREE.Vector2(0, 0)) + 5;
  controls.getObject().position.set(0, startY, 0);
  
  chunkMeshAutoload(new THREE.Vector3(0, Math.floor(startY / CHUNK_SIZE.y), 0), new THREE.Vector3(1, 1, 1), Infinity);
  
  animate();
}

document.addEventListener("DOMContentLoaded", init);
