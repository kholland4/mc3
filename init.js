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
  
  //setBlock(new THREE.Vector3(0, 45, 0), getItemID("default:torch"));
  
  chunkMeshAutoload(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1), Infinity);
  
  animate();
}

document.addEventListener("DOMContentLoaded", init);
