function coalOreNoise(position) {
  if(position.y > 0) {
    return false;
  }
  
  var scale = 4;
  var thresh = 0.75;
  
  return noise3D(position, scale) > thresh;
}

function ironOreNoise(position) {
  if(position.y > -32) {
    return false;
  }
  
  var scale = 3;
  var thresh = 0.76;
  
  return noise3D(position, scale) > thresh;
}

function goldOreNoise(position) {
  if(position.y > -128) {
    return false;
  }
  
  var scale = 5;
  var thresh = 0.83;
  
  return noise3D(position, scale) > thresh;
}

function diamondOreNoise(position) {
  if(position.y > -128) {
    return false;
  }
  
  var scale = 3.5;
  var thresh = 0.83;
  
  return noise3D(position, scale) > thresh;
}
