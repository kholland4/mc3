var textureMap;

function initTextures() {
  //TODO: dynamically-generated texture map
  textureMap = THREE.ImageUtils.loadTexture(TEXTUREPACK + "textures/textureMap.png");
  textureMap.minFilter = THREE.NearestFilter;
  textureMap.magFilter = THREE.NearestFilter;
}
