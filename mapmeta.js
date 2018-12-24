var blockMeta = []; //TODO: chunk-based

function getBlockMeta(pos) {
  for(var i = 0; i < blockMeta.length; i++) {
    if(pos.equals(blockMeta[i].pos)) {
      return blockMeta[i].data;
    }
  }
  return {};
}

function setBlockMeta(pos, data) {
  for(var i = 0; i < blockMeta.length; i++) {
    if(pos.equals(blockMeta[i].pos)) {
      blockMeta[i].data = data;
      return;
    }
  }
  blockMeta.push({pos: pos, data: data});
}

function clearBlockMeta(pos) {
  for(var i = 0; i < blockMeta.length; i++) {
    if(pos.equals(blockMeta[i].pos)) {
      blockMeta.splice(i, 1);
      return;
    }
  }
}
