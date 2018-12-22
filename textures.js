var textureMap;

function initTextures() {
  textureMap = THREE.ImageUtils.loadTexture("textureMap.png");
  textureMap.minFilter = THREE.NearestFilter;
  textureMap.magFilter = THREE.NearestFilter;
}
