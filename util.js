function vectorAdd(vecA, vecB) {
  return new THREE.Vector3(vecA.x + vecB.x, vecA.y + vecB.y, vecA.z + vecB.z);
}

function vectorMultiply(vecA, vecB) {
  return new THREE.Vector3(vecA.x * vecB.x, vecA.y * vecB.y, vecA.z * vecB.z);
}

function vectorDivide(vecA, vecB) {
  return new THREE.Vector3(Math.floor(vecA.x / vecB.x), Math.floor(vecA.y / vecB.y), Math.floor(vecA.z / vecB.z));
}

function vectorMod(vecA, vecB) {
  //https://stackoverflow.com/a/4467559
  return new THREE.Vector3(((vecA.x % vecB.x) + vecB.x) % vecB.x, ((vecA.y % vecB.y) + vecB.y) % vecB.y, ((vecA.z % vecB.z) + vecB.z) % vecB.z);
}

function deepcopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function loadf(url, callback, timeout = null, timeoutCallback = null) {
  var xhttp = new XMLHttpRequest();
  xhttp._callback = callback;
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4) {
      this._callback();
    }
  };
  if(timeout != null) {
    xhttp.timeout = timeout;
  }
  if(timeoutCallback != null) {
    xhttp.ontimeout = timeoutCallback;
  }
  xhttp.open("GET", url);
  xhttp.send();
}

function arrayEquals(array1, array2) {
  if(array1 == null || array2 == null) { return false; }
  if(array1.length != array2.length) { return false; }
  
  for(var i = 0; i < array1.length; i++) {
    if(array1[i] != array2[i]) {
      return false;
    }
  }
  return true;
}
