(function() {
  var geometry = new THREE.BoxGeometry(1.001, 1.001, 1.001);
  var material = new THREE.MeshBasicMaterial({color: 0xff0000});
  var obj = new THREE.Mesh(geometry, material);
  obj.renderOrder = 15;
  obj.position.set(-80, 10, 65);
  
  var e = new mods.Entity(obj);
  registerOnFrame(function(timeScale) {
    e.move(timeScale);
  });
  mods.e = e;
})();
