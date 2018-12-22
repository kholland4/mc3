var collisionBox = [
  new THREE.Vector3(-0.2, 0.3, -0.2), //rear left, top
  new THREE.Vector3(0.2, 0.3, -0.2), //rear right, top
  new THREE.Vector3(-0.2, 0.3, 0.2), //front left, top
  new THREE.Vector3(0.2, 0.3, 0.2), //front right, top
  
  new THREE.Vector3(-0.2, -1.5, -0.2), //rear left, bottom
  new THREE.Vector3(0.2, -1.5, -0.2), //rear right, bottom
  new THREE.Vector3(-0.2, -1.5, 0.2), //front left, bottom
  new THREE.Vector3(0.2, -1.5, 0.2) //front right, bottom
];

function initCollision() {
  
}

function collide(pos) {
  for(var i = 0; i < collisionBox.length; i++) {
    var newPos = vectorAdd(pos, collisionBox[i]);
    var inBlock = new THREE.Vector3(Math.round(newPos.x), Math.round(newPos.y), Math.round(newPos.z));
    if(!getItemProps(getBlock(inBlock)).walkable) {
      return true;
    }
  }
  return false;
}
