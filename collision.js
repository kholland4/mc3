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
        var facing = null;
        if(props.directional) {
          var meta = getBlockMeta(inBlock);
          if("facing" in meta) {
            facing = meta.facing;
          }
        }
        
        for(var n = 0; n < props.customHitbox.length; n++) {
          var hitbox = props.customHitbox[n].clone();
          if(facing != null) {
            for(var n2 = 0; n2 < facing; n2++) {
              var v_x = hitbox.min.x; var v_z = hitbox.min.z;
              hitbox.min.x = v_z; hitbox.min.z = -v_x;
              
              var v_x = hitbox.max.x; var v_z = hitbox.max.z;
              hitbox.max.x = v_z; hitbox.max.z = -v_x;
            }
          }
          if(hitbox.min.x > hitbox.max.x) { var temp = hitbox.max.x; hitbox.max.x = hitbox.min.x; hitbox.min.x = temp; }
          if(hitbox.min.y > hitbox.max.y) { var temp = hitbox.max.y; hitbox.max.y = hitbox.min.y; hitbox.min.y = temp; }
          if(hitbox.min.z > hitbox.max.z) { var temp = hitbox.max.z; hitbox.max.z = hitbox.min.z; hitbox.min.z = temp; }
          
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
