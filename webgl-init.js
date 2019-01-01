var camera;
var renderer;
var scene;
var controls;

var skybox;

function initWebGL() {
  scene = new THREE.Scene();  
  
  //---Camera---
  //THREE.PerspectiveCamera(fov, aspect, near, far)
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
  );
  
  //---Controls---
  controls = new THREE.PointerLockControls(camera);
  scene.add(controls.getObject());
  controls.enabled = true;
  
  controls.getObject().position.set(0, 50, 0);
  
  //---Renderer---
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  //Resize
  window.addEventListener("resize", function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  //Pointer lock
  renderer.domElement.addEventListener("click", function(e) {
    if(document.pointerLockElement != renderer.domElement) {
      renderer.domElement.requestPointerLock();
    }
  });
  
  //---Test objects---
  /*var hLight = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
  scene.add(hLight);*/
  
  var dLight = new THREE.DirectionalLight(0xffffff, 1);
  /*dLight.castShadow = true;
  dLight.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 1200, 2500));
  dLight.shadow.bias = 0.0001;
  dLight.shadow.mapSize.width = 2048;
  dLight.shadow.mapSize.height = 1024;*/
  scene.add(dLight);
  
  //Second light to illuminate the inside of transparent objects
  var dLight2 = new THREE.DirectionalLight(0xffffff, 1);
  dLight2.position.set(0, -1, 0); //bottom up
  scene.add(dLight2.target);
  scene.add(dLight2);
  
  /*var pLight = new THREE.PointLight(0xffffff, 0.5, 100);
  pLight.position.set(5, 5, 0);
  scene.add(pLight);*/
  
  var skyGeo = new THREE.SphereGeometry(1000, 25, 25);
  var material = new THREE.MeshBasicMaterial({color: 0x7ec0ee});
  skybox = new THREE.Mesh(skyGeo, material);
  skybox.material.side = THREE.BackSide;
  scene.add(skybox);
  
  /*var sunTex = THREE.ImageUtils.loadTexture("textures/misc/sun_clear.png");
  sunTex.minFilter = THREE.NearestFilter;
  sunTex.magFilter = THREE.NearestFilter;
  
  var sunGeo = new THREE.PlaneGeometry(512, 512);
  var material = new THREE.MeshLambertMaterial({map: sunTex, color: 0x7ec0ee, transparent: true});
  var sun = new THREE.Mesh(sunGeo, material);
  for(var face = 0; face < sun.geometry.faces.length; face++) {
    for(var comp = 0; comp < 3; comp++) {
      //console.log(sun.geometry.faces[face].vertexNormals[comp]);
      sun.geometry.faces[face].vertexNormals[comp] = new THREE.Vector3(0, 0, -2);
    }
  }
  sun.geometry.normalsNeedUpdate = true;
  sun.geometry.elementsNeedUpdate = true;
  sun.geometry.verticesNeedUpdate = true;
  sun.position.set(0, 900, 0);
  sun.rotation.x = Math.PI / 2;
  //sun.material.side = THREE.BackSide;
  scene.add(sun);*/
  
  /*var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshLambertMaterial({color: 0xff0000});
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);*/
}
