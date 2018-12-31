(function() {
  class Entity {
    constructor(object) {
      this.object = object;
      scene.add(object);
      this.movement = new THREE.Vector3(0, 0, 0);
      this.realMovement = new THREE.Vector3(0, 0, 0);
      this.fly = false;
      this.jump = false;
      this.collisionBox = [];
      this.updateCollisionBox();
    }
    
    updateCollisionBox() {
      this.collisionBox = [];
      var boundingBox = new THREE.Box3().setFromObject(this.object);
      boundingBox.min.sub(this.object.position);
      boundingBox.max.sub(this.object.position);
      
      var deltas = [];
      for(var comp = 0; comp < 3; comp++) {
        deltas.push(boundingBox.max.getComponent(comp) - boundingBox.min.getComponent(comp));
        for(var i = 0; deltas[comp] > 0.9; i++) {
          deltas[comp] = (boundingBox.max.getComponent(comp) - boundingBox.min.getComponent(comp)) / i;
        }
      }
      
      for(var x = boundingBox.min.x; x <= boundingBox.max.x; x += deltas[0]) {
        for(var y = boundingBox.min.y; y <= boundingBox.max.y; y += deltas[1]) {
          for(var z = boundingBox.min.z; z <= boundingBox.max.z; z += deltas[2]) {
            this.collisionBox.push(new THREE.Vector3(x, y, z));
          }
        }
      }
    }
    
    move(timeScale) {
      var blockIn = getBlock(vectorRound(this.object.position));
      var props = getItemProps(blockIn);
      
      //fluid physics
      var moveScale = 1;
      var canFloat = false;
      if(props.fluidPhysics != null) {
        moveScale *= props.fluidPhysics;
        canFloat = true;
      }
      
      //gravity
      if(!this.fly) {
        if(!canFloat) {
          this.movement.y = this.realMovement.y;
          if(this.movement.y == 0 && this.jump) {
            this.movement.y += 6;
          }
          this.movement.y += -9.8 * timeScale;
          this.realMovement.y = this.movement.y;
        } else {
          if(this.movement.y == 0) {
            this.realMovement.y = -4 * 0.3;
          } else {
            this.realMovement.y = this.movement.y;
          }
        }
      }
      
      var axes = [0, 1, 2];
      if(!this.fly) {
        axes = [0, 2];
      }
      for(var i = 0; i < axes.length; i++) {
        var axis = axes[i];
        var diff = this.realMovement.getComponent(axis) - this.movement.getComponent(axis);
        if(Math.abs(diff) < 0.1) {
          this.realMovement.setComponent(axis, this.movement.getComponent(axis));
        } else if(diff > 0) {
          this.realMovement.setComponent(axis, this.realMovement.getComponent(axis) - 30 * timeScale);
          
          diff = this.realMovement.getComponent(axis) - this.movement.getComponent(axis);
          if(diff < 0) {
            this.realMovement.setComponent(axis, this.movement.getComponent(axis));
          }
        } else if(diff < 0) {
          this.realMovement.setComponent(axis, this.realMovement.getComponent(axis) + 30 * timeScale);
          
          diff = this.realMovement.getComponent(axis) - this.movement.getComponent(axis);
          if(diff > 0) {
            this.realMovement.setComponent(axis, this.movement.getComponent(axis));
          }
        }
      }
      
      //movement
      var oldPos = this.object.position.clone();
      this.object.translateOnAxis(this.realMovement, timeScale * moveScale);
      var newPos = this.object.position.clone();
      this.object.position.copy(oldPos);
      for(var index = 0; index < 3; index++) {
        var axisPos = [new THREE.Vector3(newPos.x, oldPos.y, oldPos.z), new THREE.Vector3(oldPos.x, newPos.y, oldPos.z), new THREE.Vector3(oldPos.x, oldPos.y, newPos.z)][index];
        if(!this.collide(axisPos)) {
          this.object.position.copy(axisPos);
          oldPos = this.object.position.clone();
        } else {
          //For gravity
          if(index == 1 && !this.fly) {
            this.realMovement.y = 0;
          }
        }
      }
    }
    
    collide(pos) {
      for(var i = 0; i < this.collisionBox.length; i++) {
        var newPos = vectorAdd(pos, this.collisionBox[i]);
        var inBlock = new THREE.Vector3(Math.round(newPos.x), Math.round(newPos.y), Math.round(newPos.z));
        if(!getItemProps(getBlock(inBlock)).walkable) {
          return true;
        }
      }
      return false;
    }
  }
  mods.Entity = Entity;
})();
