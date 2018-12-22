var raycaster;
var raycastBoundingBox;
var raycastSelector;
//var mouse = new THREE.Vector2(0, 0);

function initRaycast() {
  raycaster = new THREE.Raycaster();
  
  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(4 * 3), 3));
  var material = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 2, transparent: true});
  raycastBoundingBox = new THREE.Line(geometry, material);
  scene.add(raycastBoundingBox);
  raycastBoundingBox.visible = false;
  
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  //var material = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 2, transparent: true});
  var material = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, wireframe: true});
  raycastSelector = new THREE.Mesh(geometry, material);
  //selector.material.side = THREE.DoubleSide;
  scene.add(raycastSelector);
  raycastSelector.visible = false;
  
  /*document.addEventListener("mousemove", function(e) {
    //https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_buffergeometry.html
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
	  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });*/
}

function raycastBlock(controlObject) {
  //raycaster.setFromCamera(mouse, camera);
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  var intersects = raycaster.intersectObjects(scene.children, true);
  if(intersects.length > 0) {
    for(var i = 0; i < intersects.length; i++) {
      var intersect = intersects[i];
      var object = intersect.object;
      while(object.parent != scene) { object = object.parent; }
      var face = intersect.face;
      
      //TODO: handling of non-cube meshes
      
      if(object != null && face != null && object.geometry.attributes != undefined) {
        raycastBoundingBox.geometry.attributes.position.copyAt(0, object.geometry.attributes.position, face.a);
        raycastBoundingBox.geometry.attributes.position.copyAt(1, object.geometry.attributes.position, face.b);
        raycastBoundingBox.geometry.attributes.position.copyAt(2, object.geometry.attributes.position, face.c);
        raycastBoundingBox.geometry.attributes.position.copyAt(3, object.geometry.attributes.position, face.a);
        
        object.updateMatrix();
        
        raycastBoundingBox.geometry.applyMatrix(object.matrix);
            
        raycastBoundingBox.geometry.computeBoundingBox();
        var box = raycastBoundingBox.geometry.boundingBox;
        var pointA = box.min;
        var pointB = box.max;
        var center = new THREE.Vector3((pointA.x + pointB.x) / 2, (pointA.y + pointB.y) / 2, (pointA.z + pointB.z) / 2);
        
        var extruded = center.clone();
        var intruded = center.clone();
        
        var cFactor = 0.01;
        if(pointB.x - pointA.x == 0) {
          if(controls.getObject().position.x > pointA.x) {
            //positive extrusion
            extruded.x = extruded.x + 0.5;
            intruded.x = intruded.x - 0.5;
            center.x += cFactor;
          } else {
            //negative extrusion
            extruded.x = extruded.x - 0.5;
            intruded.x = intruded.x + 0.5;
            center.x -= cFactor;
          }
        } else if(pointB.y - pointA.y == 0) {
          if(controls.getObject().position.y > pointA.y) {
            //positive extrusion
            extruded.y = extruded.y + 0.5;
            intruded.y = intruded.y - 0.5;
            center.y += cFactor;
          } else {
            //negative extrusion
            extruded.y = extruded.y - 0.5;
            intruded.y = intruded.y + 0.5;
            center.y -= cFactor;
          }
        } else if(pointB.z - pointA.z == 0) {
          if(controls.getObject().position.z > pointA.z) {
            //positive extrusion
            extruded.z = extruded.z + 0.5;
            intruded.z = intruded.z - 0.5;
            center.z += cFactor;
          } else {
            //negative extrusion
            extruded.z = extruded.z - 0.5;
            intruded.z = intruded.z + 0.5;
            center.z -= cFactor;
          }
        }
        
        raycastSelector.position.set(center.x, center.y, center.z);
        raycastSelector.scale.x = pointB.x - pointA.x;
        raycastSelector.scale.y = pointB.y - pointA.y;
        raycastSelector.scale.z = pointB.z - pointA.z;
        raycastSelector.geometry.computeVertexNormals();
        
        extruded = new THREE.Vector3(Math.round(extruded.x), Math.round(extruded.y), Math.round(extruded.z));
        intruded = new THREE.Vector3(Math.round(intruded.x), Math.round(intruded.y), Math.round(intruded.z));
        
        //TODO: make selector visible?
        
        toDestroy = intruded.clone();
        toPlace = extruded.clone();
        
        return {destroy: toDestroy, place: toPlace};
      }
    }
  }
  
  return null;
}

function showRaycastSelector() {
  raycastSelector.visible = true;
}
function hideRaycastSelector() {
  raycastSelector.visible = false;
}
