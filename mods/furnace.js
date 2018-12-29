(function() {
  //TODO remove from furnaces array on destroy
  
  var furnaceOpen = false;
  var updateFurnaceUI = function() {};
  
  mods.furnaceRecipies = [
    {in: new InvItem("default:porkchop_raw", 1), out: new InvItem("default:porkchop_cooked", 1)},
    {in: new InvItem("default:beef_raw", 1), out: new InvItem("default:beef_cooked", 1)},
    {in: new InvItem("default:chicken_raw", 1), out: new InvItem("default:chicken_cooked", 1)},
    {in: new InvItem("default:fish_cod_raw", 1), out: new InvItem("default:fish_cod_cooked", 1)},
    {in: new InvItem("default:fish_salmon_raw", 1), out: new InvItem("default:fish_salmon_cooked", 1)},
    {in: new InvItem("default:potato", 1), out: new InvItem("default:potato_baked", 1)},
    {in: new InvItem("default:sand", 1), out: new InvItem("default:glass", 1)},
    {in: new InvItem("default:cobblestone", 1), out: new InvItem("default:stone", 1)},
    {in: new InvItem("default:clay", 1), out: new InvItem("default:brick", 1)},
    {in: new InvItem("default:stonebrick", 1), out: new InvItem("default:stonebrick_cracked", 1)},
    
    {in: new InvItem("default:oak_log", 1), out: new InvItem("default:charcoal", 1)},
    {in: new InvItem("default:acacia_log", 1), out: new InvItem("default:charcoal", 1)},
    {in: new InvItem("default:birch_log", 1), out: new InvItem("default:charcoal", 1)},
    {in: new InvItem("default:jungle_log", 1), out: new InvItem("default:charcoal", 1)},
    {in: new InvItem("default:spruce_log", 1), out: new InvItem("default:charcoal", 1)}
  ];
  
  mods.registerFurnaceRecipie = function(rec) {
    mods.furnaceRecipies.push(rec);
  };
  
  var furnaces = [];
  
  var activeFurnacePos = null;
  var furnaceIn = [null, null];
  var furnaceOut = [null];
  function processFurnace(pos) {
    var meta = getBlockMeta(pos);
    if(!("fuelCountdown" in meta)) { meta.fuelCountdown = 0; }
    if(!("fuelCountdownInitial" in meta)) { meta.fuelCountdownInitial = 0; }
    if(!("itemCountdown" in meta)) { meta.itemCountdown = 0; }
    if(!("itemCountdownInitial" in meta)) { meta.itemCountdownInitial = 10; }
    if(!("isSmelting" in meta)) { meta.isSmelting = false; }
    if(!("recIndex" in meta)) { meta.recIndex = null; }
    
    if(!("furnaceIn" in meta)) { meta.furnaceIn = [null, null]; }
    if(!("furnaceOut" in meta)) { meta.furnaceOut = [null]; }
    if(meta.furnaceIn == undefined) { meta.furnaceIn = [null, null]; }
    if(meta.furnaceOut == undefined) { meta.furnaceOut = [null]; }
    
    var code = "";
    if(!furnaceOpen || !pos.equals(activeFurnacePos)) {
      code = "var furnaceIn = meta.furnaceIn; var furnaceOut = meta.furnaceOut;";
    }
    eval(code);
    
    if(furnaceIn[0] == null) {
      meta.isSmelting = false;
      setBlockMeta(pos, meta);
      updateFurnace(pos);
      return;
    }
    
    if(meta.fuelCountdown <= 0) {
      if(furnaceIn[1] == null) {
        meta.isSmelting = false;
        setBlockMeta(pos, meta);
        updateFurnace(pos);
        return;
      }
      var fuelProps = getItemProps(furnaceIn[1].id);
      if(fuelProps.furnaceFuel == null || fuelProps.furnaceFuel <= 0) {
        meta.isSmelting = false;
        setBlockMeta(pos, meta);
        updateFurnace(pos);
        return;
      }
    }
    
    var recValid = false;
    for(var i = 0; i < mods.furnaceRecipies.length; i++) {
      if(mods.furnaceRecipies[i].in.typeMatch(furnaceIn[0]) && furnaceIn[0].qty >= mods.furnaceRecipies[i].in.qty) {
        recValid = true;
        meta.recIndex = i;
      }
    }
    if(!recValid) {
      meta.isSmelting = false;
      setBlockMeta(pos, meta);
      updateFurnace(pos);
      return;
    }
    
    if(meta.isSmelting && meta.itemCountdown <= 0) {
      rec = mods.furnaceRecipies[meta.recIndex];
      furnaceIn[0].qty -= rec.in.qty;
      if(furnaceIn[0].qty <= 0) {
        furnaceIn[0] = null;
        meta.isSmelting = false;
      }
      if(furnaceOut[0] == null) {
        furnaceOut[0] = rec.out.clone();
      } else {
        var merged = mergeInventoryItems(furnaceOut[0], rec.out);
        if(merged == null) {
          meta.isSmelting = false;
          if(furnaceIn[0] == null) {
            furnaceIn[0] = rec.in.clone();
          }
        } else {
          furnaceOut[0] = merged;
        }
      }
      meta.furnaceIn = furnaceIn;
      meta.furnaceOut = furnaceOut;
      if(meta.isSmelting) {
        meta.itemCountdown = meta.itemCountdownInitial;
      }
      setBlockMeta(pos, meta);
      processFurnace(pos);
      updateFurnace(pos);
    }
    
    if(!meta.isSmelting) {
      meta.itemCountdown = meta.itemCountdownInitial;
      meta.isSmelting = true;
      //setBlockMeta(pos, meta);
    }
    
    if(meta.isSmelting && meta.fuelCountdown <= 0) {
      furnaceIn[1].qty--;
      if(furnaceIn[1].qty <= 0) {
        furnaceIn[1] = null;
      }
      meta.fuelCountdown = fuelProps.furnaceFuel;
      meta.fuelCountdownInitial = meta.fuelCountdown;
      meta.furnaceIn = furnaceIn;
      //setBlockMeta(pos, meta);
      //updateFurnace(pos);
    }
    
    setBlockMeta(pos, meta);
    updateFurnace(pos);
  }
  
  function updateFurnace(pos) {
    if(furnaceOpen) {
      updateFurnaceUI();
    }
    
    var meta = getBlockMeta(pos);
    
    var targetBlock = getItemID("furnace:furnace_off");
    if(meta.fuelCountdown > 0) {
      targetBlock = getItemID("furnace:furnace_on");
    }
    
    var old = getBlock(pos);
    if(old != targetBlock) {
      intelligentSetBlock(pos, targetBlock);
    }
  }
  
  var accTimeScale = 0;
  registerOnFrame(function(timeScale) {
    accTimeScale += timeScale;
    if(frameCount % 5 == 0) {
      timeScale = accTimeScale;
      accTimeScale = 0;
      for(var i = 0; i < furnaces.length; i++) {
        var pos = furnaces[i];
        var meta = getBlockMeta(pos);
        if(meta.fuelCountdown > 0) {
          meta.fuelCountdown -= timeScale;
        }
        if(meta.isSmelting) {
          meta.itemCountdown -= timeScale;
        }
        setBlockMeta(pos, meta);
        processFurnace(pos);
      }
    }
  });
  
  function openFurnace(pos) {
    activeFurnacePos = pos.clone();
    var popup = openPopup();
    var dialog = guiGenDialog();
    popup.appendChild(dialog);
    
    var found = false;
    for(var i = 0; i < furnaces.length; i++) {
      if(furnaces[i].equals(pos)) {
        found = true;
      }
    }
    if(!found) {
      furnaces.push(pos.clone());
    }
    
    var meta = getBlockMeta(pos);
    if(!("furnaceIn" in meta)) { meta.furnaceIn = [null, null]; }
    if(!("furnaceOut" in meta)) { meta.furnaceOut = [null]; }
    if(meta.furnaceIn == undefined) { meta.furnaceIn = [null, null]; }
    if(meta.furnaceOut == undefined) { meta.furnaceOut = [null]; }
    furnaceIn = meta.furnaceIn;
    furnaceOut = meta.furnaceOut;
    
    function updateFurnaceGrid() {
      processFurnace(activeFurnacePos);
      guiFillBlockGrid(furnaceInGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, furnaceIn);
      guiFillBlockGrid(furnaceOutGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, furnaceOut);
    }
    
    updateFurnaceUI = function() {
      guiFillBlockGrid(furnaceInGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, furnaceIn);
      guiFillBlockGrid(furnaceOutGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, furnaceOut);
      
      var meta = getBlockMeta(activeFurnacePos);
      
      var arrowPos = 0;
      if(meta.isSmelting) {
        arrowPos = 1 - (meta.itemCountdown / meta.itemCountdownInitial);
      }
      arrow.src = "textures/misc/arrow_stage_" + range(arrowPos, 1, 23) + ".png";
      
      var firePos = 0;
      if("fuelCountdown" in meta) {
        if(meta.fuelCountdown > 0) {
          firePos = meta.fuelCountdown / meta.fuelCountdownInitial;
        }
      }
      fire.src = "textures/misc/fire_stage_" + range(firePos, 1, 13) + ".png";
    };
    
    function updatePIGrid() {
      guiFillBlockGrid(invGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, playerInventory);
      updatePlayerInventory();
    }
    
    var firePadding = HUD_CELL_SIZE / 2;
    
    var furnaceInGrid = guiGenBlockGrid(new THREE.Vector2(1, 2), HUD_CELL_SIZE, "furnaceIn");
    furnaceInGrid.style.position = "absolute";
    furnaceInGrid.style.left = GUI_DIALOG_PADDING + (firePadding * 2) + 70 + "px";
    furnaceInGrid.style.top = GUI_DIALOG_PADDING + "px";
    dialog.appendChild(furnaceInGrid);
    guiFillBlockGrid(furnaceInGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, furnaceIn);
    guiInteractiveGrid(furnaceInGrid, furnaceIn, updateFurnaceGrid, playerInventory, updatePIGrid);
    
    var firePos = 0;
    if("fuelCountdown" in meta) {
      if(meta.fuelCountdown > 0) {
        firePos = meta.fuelCountdown / meta.fuelCountdownInitial;
      }
    }
    var fire = document.createElement("img");
    fire.src = "textures/misc/fire_stage_" + range(firePos, 1, 13) + ".png";
    fire.style.display = "block";
    fire.className = "guiPixelArt";
    fire.style.width = "70px";
    fire.style.height = "70px";
    fire.style.position = "absolute";
    fire.style.left = GUI_DIALOG_PADDING + firePadding + "px";
    fire.style.top = GUI_DIALOG_PADDING + ((furnaceInGrid.clientHeight - 85) / 2) + "px";
    dialog.appendChild(fire);
    
    var arrowPos = 0;
    if(meta.isSmelting) {
      arrowPos = 1 - (meta.itemCountdown / meta.itemCountdownInitial);
    }
    var arrowPadding = HUD_CELL_SIZE / 2;
    var arrow = document.createElement("img");
    arrow.src = "textures/misc/arrow_stage_" + range(arrowPos, 1, 23) + ".png";
    arrow.style.display = "block";
    arrow.className = "guiPixelArt";
    arrow.style.width = "120px";
    arrow.style.height = "85px";
    arrow.style.position = "absolute";
    arrow.style.left = GUI_DIALOG_PADDING + (firePadding * 2) + fire.clientWidth + furnaceInGrid.clientWidth + arrowPadding + "px";
    arrow.style.top = GUI_DIALOG_PADDING + ((furnaceInGrid.clientHeight - 85) / 2) + "px";
    dialog.appendChild(arrow);
    
    var furnaceOutGrid = guiGenBlockGrid(new THREE.Vector2(1, 1), HUD_CELL_SIZE, "furnaceOut");
    furnaceOutGrid.style.position = "absolute";
    furnaceOutGrid.style.left = GUI_DIALOG_PADDING + (firePadding * 2) + fire.clientWidth + furnaceInGrid.clientWidth + arrow.clientWidth + (arrowPadding * 2) + "px";
    furnaceOutGrid.style.top = GUI_DIALOG_PADDING + (furnaceInGrid.clientHeight / 4) + "px";
    dialog.appendChild(furnaceOutGrid);
    guiFillBlockGrid(furnaceOutGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, furnaceOut);
    guiInteractiveGrid(furnaceOutGrid, furnaceOut, updateFurnaceGrid, playerInventory, updatePIGrid);
    
    dialog.appendChild(guiGenSpacer(new THREE.Vector2(0, furnaceInGrid.clientHeight + (HUD_CELL_SIZE / 2))));
    
    var invGrid = guiGenBlockGrid(PLAYER_INVENTORY_GRID_SIZE, HUD_CELL_SIZE, "inv");
    dialog.appendChild(invGrid);
    guiFillBlockGrid(invGrid, HUD_CELL_SIZE, HUD_ICON_SIZE, playerInventory);
    guiInteractiveGrid(invGrid, playerInventory, updatePIGrid, furnaceIn, updateFurnaceGrid);
    
    furnaceOpen = true;
  }
  
  document.addEventListener("keydown", function(e) {
    if(furnaceOpen) {
      if(e.keyCode == 69) {
        furnaceOpen = false;
        activeFurnacePos = null;
        closePopup();
        return;
      }
    }
  });
  
  registerItem({
    name: "furnace:furnace_off",
    displayName: "Furnace",
    textureOffsetAlt: {top: new THREE.Vector2(64, 64), bottom: new THREE.Vector2(64, 64), sides: new THREE.Vector2(48, 64), front: new THREE.Vector2(16, 64)},
    icon: "textures/icons/furnace.png",
    groups: ["stone"],
    hardness: 3.5,
    interact: openFurnace
  });
  registerItem({
    name: "furnace:furnace_on",
    displayName: "Furnace",
    drops: new InvItem("furnace:furnace_off", 1),
    inInventory: false,
    textureOffsetAlt: {top: new THREE.Vector2(64, 64), bottom: new THREE.Vector2(64, 64), sides: new THREE.Vector2(48, 64), front: new THREE.Vector2(32, 64)},
    icon: "textures/icons/furnace.png",
    groups: ["stone"],
    hardness: 3.5,
    interact: openFurnace
  });
  
  mods.registerCraft({
    size: new THREE.Vector2(3, 3),
    shapeless: false,
    in: ["default:cobblestone", "default:cobblestone", "default:cobblestone", "default:cobblestone", null, "default:cobblestone", "default:cobblestone", "default:cobblestone", "default:cobblestone"],
    out: new InvItem("furnace:furnace_off", 1)
  });
  mods.registerCraft({
    size: new THREE.Vector2(3, 3),
    shapeless: false,
    in: ["default:stone", "default:stone", "default:stone", "default:stone", null, "default:stone", "default:stone", "default:stone", "default:stone"],
    out: new InvItem("furnace:furnace_off", 1)
  });
})();
