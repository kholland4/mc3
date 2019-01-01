var collisionBox = [
  new THREE.Vector3(-0.2, 0.3, -0.2), //rear left, top
  new THREE.Vector3(0.2, 0.3, -0.2), //rear right, top
  new THREE.Vector3(-0.2, 0.3, 0.2), //front left, top
  new THREE.Vector3(0.2, 0.3, 0.2), //front right, top
  
  new THREE.Vector3(-0.2, -0.6, -0.2), //rear left, middle
  new THREE.Vector3(0.2, -0.6, -0.2), //rear right, middle
  new THREE.Vector3(-0.2, -0.6, 0.2), //front left, middle
  new THREE.Vector3(0.2, -0.6, 0.2), //front right, middle
  
  new THREE.Vector3(-0.2, -1.5, -0.2), //rear left, bottom
  new THREE.Vector3(0.2, -1.5, -0.2), //rear right, bottom
  new THREE.Vector3(-0.2, -1.5, 0.2), //front left, bottom
  new THREE.Vector3(0.2, -1.5, 0.2) //front right, bottom
];
var playerHitbox = new THREE.Box3(new THREE.Vector3(-0.2, -1.5, -0.2), new THREE.Vector3(0.2, 0.3, 0.2));

function initCollision() {
  
}

function collide(pos) {
  var pHitbox = playerHitbox.clone();
  pHitbox.min.add(pos);
  pHitbox.max.add(pos);
  
  for(var i = 0; i < collisionBox.length; i++) {
    var newPos = vectorAdd(pos, collisionBox[i]);
    var inBlock = new THREE.Vector3(Math.round(newPos.x), Math.round(newPos.y), Math.round(newPos.z));
    var props = getItemProps(getBlock(inBlock));
    if(!props.walkable) {
      if(props.customHitbox == null) {
        return true;
      } else {
        for(var n = 0; n < props.customHitbox.length; n++) {
          var hitbox = props.customHitbox[n].clone();
          hitbox.min.add(inBlock);
          hitbox.max.add(inBlock);
          /*if(hitbox.containsPoint(newPos)) {
            return true;
          }*/
          if(hitbox.intersectsBox(pHitbox)) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
