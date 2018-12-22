function vectorAdd(vecA, vecB) {
  return new THREE.Vector3(vecA.x + vecB.x, vecA.y + vecB.y, vecA.z + vecB.z);
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
