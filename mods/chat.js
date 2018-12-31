(function() {
  mods.chatCommands = {};
  mods.registerChatCommand = function(command, callback) {
    mods.chatCommands[command] = callback;
  };
  
  var chat;
  
  var chatInput = "";
  var chatLog = "";
  var chatOpen = false;
  
  function runChatCommand(str) {
    var args = [];
    while(str.indexOf(" ") != -1) {
      var idx = str.indexOf(" ");
      args.push(str.substring(0, str.indexOf(" ")));
      str = str.substring(str.indexOf(" ") + 1);
    }
    args.push(str);
    str = "";
    
    if(args.length < 1) {
      return;
    }
    if(args[0] in mods.chatCommands) {
      var ret = mods.chatCommands[args[0]](args[1]);
      if(ret != undefined) {
        chatLog += ret;
      }
    } else {
      chatLog += "Command not found\n";
    }
  }
  
  function openChat(str) {
    if(chat == undefined) {
      chat = document.createElement("div");
      chat.style.position = "fixed";
      chat.style.left = "0";
      chat.style.right = "0";
      chat.style.top = "0";
      chat.style.maxHeight = "200px";
      chat.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
      chat.style.color = "white";
      chat.style.fontSize = "14px";
      chat.style.fontFamily = "monospace";
      chat.style.overflowY = "auto";
      chat.style.display = "none";
      document.body.appendChild(chat);
    }
    if(controls.enabled) {
      controls.enabled = false;
      document.exitPointerLock();
    }
    
    chatInput = "";
    chat.style.display = "block";
    
    chatOpen = true;
    updateChat(str);
  }
  
  function updateChat(str = "", keyCode = null) {
    if(keyCode == 10 || keyCode == 13) { //enter
      runChatCommand(chatInput);
      chatInput = "";
    } else if(keyCode == 8) { //backspace
      if(chatInput.length > 0) {
        chatInput = chatInput.substring(0, chatInput.length - 1);
      }
    } else {
      //TODO check for printable char
      chatInput += str;
    }
    
    chat.innerText = chatLog + "] " + chatInput;
    chat.scrollBy(0, 1000);
  }
  
  function closeChat() {
    chatOpen = false;
    popupOpen = false;
    chatInput = "";
    chat.style.display = "none";
    
    if(document.pointerLockElement != renderer.domElement) {
      renderer.domElement.requestPointerLock();
    }
    controls.enabled = true;
  }
  
  document.addEventListener("keydown", function(e) {
    if(document.pointerLockElement == renderer.domElement && !e.repeat && !chatOpen) {
      if(e.keyCode == 191) { //slash
        openChat();
      }
    } else if(chatOpen) {
      if(e.keyCode == 27) { //esc
        closeChat();
      } else if(e.keyCode == 8) { //backspace
        updateChat("", e.keyCode);
      }
    }
  });
  
  document.addEventListener("keypress", function(e) {
    if(chatOpen) {
      if(e.charCode) {
        updateChat(String.fromCharCode(e.charCode), e.keyCode);
      }
    }
  });
  
  document.addEventListener("click", function(e) {
    if(chatOpen) {
      closeChat();
    }
  });
})();
