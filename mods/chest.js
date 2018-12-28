(function() {
  var chestOpen = false;
  
  function openChest(pos) {
    chestOpen = true;
    var popup = openPopup();
    var dialog = guiGenDialog();
    popup.appendChild(dialog);
    
    var meta = getBlockMeta(pos);
    if(!("chestContents" in meta)) {
      meta.chestContents = [];
      for(var i = 0; i < 9 * 4; i++) {
        meta.chestContents.push(null);
      }
      setBlockMeta(pos, meta);
    }
    
    var chestGrid = guiGenBlockGrid(new THREE.Vector2(9, 4), HUD_CELL_SIZE, "chest");
    dialog.appendChild(chestGrid);
    guiFillBlockGrid(chestGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, meta.chestContents);
    guiInteractiveGrid(chestGrid, meta.chestContents, function() {
      guiFillBlockGrid(chestGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, meta.chestContents);
      setBlockMeta(pos, meta);
    }, playerInventory, function() {
      guiFillBlockGrid(invGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, playerInventory);
      updatePlayerInventory();
    });
    
    dialog.appendChild(guiGenSpacer(new THREE.Vector2(0, HUD_CELL_SIZE / 2)));
    
    var invGrid = guiGenBlockGrid(PLAYER_INVENTORY_GRID_SIZE, HUD_CELL_SIZE, "inv");
    dialog.appendChild(invGrid);
    guiFillBlockGrid(invGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, playerInventory);
    guiInteractiveGrid(invGrid, playerInventory, function() {
      guiFillBlockGrid(invGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, playerInventory);
      updatePlayerInventory();
    }, meta.chestContents, function() {
      guiFillBlockGrid(chestGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, meta.chestContents);
      setBlockMeta(pos, meta);
    });
  }
  
  document.addEventListener("keydown", function(e) {
    if(chestOpen && (e.keyCode == 27 || e.keyCode == 69)) { //esc or e
      chestOpen = false;
      closePopup();
      return;
    }
  });
  
  registerItem({
    name: "chest:chest",
    icon: "textures/icons/chest.png",
    groups: ["wood"],
    interact: openChest,
    customMesh: true,
    meshVertices: [
      //top
      -0.4375, 0.375, -0.4375,
      0.4375, 0.375, -0.4375,
      -0.4375, 0.375, 0.4375,
      0.4375, 0.375, -0.4375,
      0.4375, 0.375, 0.4375,
      -0.4375, 0.375, 0.4375,
      
      //bottom
      -0.4375, -0.5, -0.4375,
      0.4375, -0.5, -0.4375,
      -0.4375, -0.5, 0.4375,
      0.4375, -0.5, -0.4375,
      0.4375, -0.5, 0.4375,
      -0.4375, -0.5, 0.4375,
      
      //left upper
      -0.4375, 0.375, -0.4375,
      -0.4375, 0.375, 0.4375,
      -0.4375, 0.0625, 0.4375,
      -0.4375, 0.375, -0.4375,
      -0.4375, 0.0625, -0.4375,
      -0.4375, 0.0625, 0.4375,
      
      //left lower
      -0.4375, 0.0625, -0.4375,
      -0.4375, 0.0625, 0.4375,
      -0.4375, -0.5, 0.4375,
      -0.4375, 0.0625, -0.4375,
      -0.4375, -0.5, -0.4375,
      -0.4375, -0.5, 0.4375,
      
      //right upper
      0.4375, 0.375, -0.4375,
      0.4375, 0.375, 0.4375,
      0.4375, 0.0625, 0.4375,
      0.4375, 0.375, -0.4375,
      0.4375, 0.0625, -0.4375,
      0.4375, 0.0625, 0.4375,
      
      //right lower
      0.4375, 0.0625, -0.4375,
      0.4375, 0.0625, 0.4375,
      0.4375, -0.5, 0.4375,
      0.4375, 0.0625, -0.4375,
      0.4375, -0.5, -0.4375,
      0.4375, -0.5, 0.4375,
      
      //front upper
      -0.4375, 0.375, 0.4375,
      0.4375, 0.375, 0.4375,
      0.4375, 0.0625, 0.4375,
      -0.4375, 0.375, 0.4375,
      -0.4375, 0.0625, 0.4375,
      0.4375, 0.0625, 0.4375,
      
      //front lower
      -0.4375, 0.0625, 0.4375,
      0.4375, 0.0625, 0.4375,
      0.4375, -0.5, 0.4375,
      -0.4375, 0.0625, 0.4375,
      -0.4375, -0.5, 0.4375,
      0.4375, -0.5, 0.4375,
      
      //back upper
      -0.4375, 0.375, -0.4375,
      0.4375, 0.375, -0.4375,
      0.4375, 0.0625, -0.4375,
      -0.4375, 0.375, -0.4375,
      -0.4375, 0.0625, -0.4375,
      0.4375, 0.0625, -0.4375,
      
      //back lower
      -0.4375, 0.0625, -0.4375,
      0.4375, 0.0625, -0.4375,
      0.4375, -0.5, -0.4375,
      -0.4375, 0.0625, -0.4375,
      -0.4375, -0.5, -0.4375,
      0.4375, -0.5, -0.4375,
      
      //latch front - (7, 5) relative to upper left (-1, -3) relative to center
      -0.0625, 0.1875, 0.5,
      0.0625, 0.1875, 0.5,
      0.0625, -0.0625, 0.5,
      -0.0625, 0.1875, 0.5,
      -0.0625, -0.0625, 0.5,
      0.0625, -0.0625, 0.5,
      
      //latch top
      -0.0625, 0.1875, 0.4375,
      0.0625, 0.1875, 0.4375,
      0.0625, 0.1875, 0.5,
      -0.0625, 0.1875, 0.4375,
      -0.0625, 0.1875, 0.5,
      0.0625, 0.1875, 0.5,
      
      //latch bottom
      -0.0625, -0.0625, 0.4375,
      0.0625, -0.0625, 0.4375,
      0.0625, -0.0625, 0.5,
      -0.0625, -0.0625, 0.4375,
      -0.0625, -0.0625, 0.5,
      0.0625, -0.0625, 0.5,
      
      //latch left
      -0.0625, 0.1875, 0.4375,
      -0.0625, 0.1875, 0.5,
      -0.0625, -0.0625, 0.5,
      -0.0625, 0.1875, 0.4375,
      -0.0625, -0.0625, 0.4375,
      -0.0625, -0.0625, 0.5,
      
      //latch right
      0.0625, 0.1875, 0.4375,
      0.0625, 0.1875, 0.5,
      0.0625, -0.0625, 0.5,
      0.0625, 0.1875, 0.4375,
      0.0625, -0.0625, 0.4375,
      0.0625, -0.0625, 0.5
    ],
    meshUVs: [
      //top
      14/512, 0.125 - 0,
      28/512, 0.125 - 0,
      14/512, 0.125 - 14/512,
      28/512, 0.125 - 0,
      28/512, 0.125 - 14/512,
      14/512, 0.125 - 14/512,
      
      //bottom
      14/512, 0.125 - 0,
      28/512, 0.125 - 0,
      14/512, 0.125 - 14/512,
      28/512, 0.125 - 0,
      28/512, 0.125 - 14/512,
      14/512, 0.125 - 14/512,
      
      //left upper
      0, 0.125 - 14/512,
      14/512, 0.125 - 14/512,
      14/512, 0.125 - 19/512,
      0, 0.125 - 14/512,
      0, 0.125 - 19/512,
      14/512, 0.125 - 19/512,
      
      //left lower
      0, 0.125 - 33/512,
      14/512, 0.125 - 33/512,
      14/512, 0.125 - 43/512,
      0, 0.125 - 33/512,
      0, 0.125 - 43/512,
      14/512, 0.125 - 43/512,
      
      //right upper
      0, 0.125 - 14/512,
      14/512, 0.125 - 14/512,
      14/512, 0.125 - 19/512,
      0, 0.125 - 14/512,
      0, 0.125 - 19/512,
      14/512, 0.125 - 19/512,
      
      //right lower
      0, 0.125 - 33/512,
      14/512, 0.125 - 33/512,
      14/512, 0.125 - 43/512,
      0, 0.125 - 33/512,
      0, 0.125 - 43/512,
      14/512, 0.125 - 43/512,
      
      //front upper
      14/512, 0.125 - 14/512,
      28/512, 0.125 - 14/512,
      28/512, 0.125 - 19/512,
      14/512, 0.125 - 14/512,
      14/512, 0.125 - 19/512,
      28/512, 0.125 - 19/512,
      
      //front lower
      14/512, 0.125 - 33/512,
      28/512, 0.125 - 33/512,
      28/512, 0.125 - 43/512,
      14/512, 0.125 - 33/512,
      14/512, 0.125 - 43/512,
      28/512, 0.125 - 43/512,
      
      //back upper
      0, 0.125 - 14/512,
      14/512, 0.125 - 14/512,
      14/512, 0.125 - 19/512,
      0, 0.125 - 14/512,
      0, 0.125 - 19/512,
      14/512, 0.125 - 19/512,
      
      //back lower
      0, 0.125 - 33/512,
      14/512, 0.125 - 33/512,
      14/512, 0.125 - 43/512,
      0, 0.125 - 33/512,
      0, 0.125 - 43/512,
      14/512, 0.125 - 43/512,
      
      //latch front
      1/512, 0.125 - 1/512,
      3/512, 0.125 - 1/512,
      3/512, 0.125 - 5/512,
      1/512, 0.125 - 1/512,
      1/512, 0.125 - 5/512,
      3/512, 0.125 - 5/512,
      
      //latch top
      1/512, 0.125 - 0,
      3/512, 0.125 - 0,
      3/512, 0.125 - 1/512,
      1/512, 0.125 - 0,
      1/512, 0.125 - 1/512,
      3/512, 0.125 - 1/512,
      
      //latch bottom
      1/512, 0.125 - 0,
      3/512, 0.125 - 0,
      3/512, 0.125 - 1/512,
      1/512, 0.125 - 0,
      1/512, 0.125 - 1/512,
      3/512, 0.125 - 1/512,
      
      //latch left
      0, 0.125 - 1/512,
      1/512, 0.125 - 1/512,
      1/512, 0.125 - 5/512,
      0, 0.125 - 1/512,
      0, 0.125 - 5/512,
      1/512, 0.125 - 5/512,
      
      //latch right
      0, 0.125 - 1/512,
      1/512, 0.125 - 1/512,
      1/512, 0.125 - 5/512,
      0, 0.125 - 1/512,
      0, 0.125 - 5/512,
      1/512, 0.125 - 5/512
    ],
    meshFaces: [
      {dir: new THREE.Vector3(0, 1, 0), length: 6}, //top
      {dir: new THREE.Vector3(0, -1, 0), length: 6}, //bottom
      {dir: new THREE.Vector3(-1, 0, 0), length: 6}, //left upper
      {dir: new THREE.Vector3(-1, 0, 0), length: 6}, //left lower
      {dir: new THREE.Vector3(1, 0, 0), length: 6}, //right upper
      {dir: new THREE.Vector3(1, 0, 0), length: 6}, //right lower
      {dir: new THREE.Vector3(0, 0, 1), length: 6}, //front upper
      {dir: new THREE.Vector3(0, 0, 1), length: 6}, //front lower
      {dir: new THREE.Vector3(0, 0, -1), length: 6}, //back upper
      {dir: new THREE.Vector3(0, 0, -1), length: 6}, //back lower
      {dir: new THREE.Vector3(0, 0, 1), length: 6}, //latch front
      {dir: new THREE.Vector3(0, 1, 0), length: 6}, //latch top
      {dir: new THREE.Vector3(0, -1, 0), length: 6}, //latch bottom
      {dir: new THREE.Vector3(-1, 0, 0), length: 6}, //latch left
      {dir: new THREE.Vector3(1, 0, 0), length: 6}  //latch right
    ],
    transparent: true
  });
  
  mods.registerCraft({
    size: new THREE.Vector2(3, 3),
    shapeless: false,
    in: ["group:planks", "group:planks", "group:planks", "group:planks", null, "group:planks", "group:planks", "group:planks", "group:planks"],
    out: new InvItem("chest:chest", 1)
  });
})();
