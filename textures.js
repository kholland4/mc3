var textureMap;

function initTextures() {
  //TODO: dynamically-generated texture map
  textureMap = THREE.ImageUtils.loadTexture("textures/textureMap.png");
  textureMap.minFilter = THREE.NearestFilter;
  textureMap.magFilter = THREE.NearestFilter;
}
