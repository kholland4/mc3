(function() {
  var container = document.createElement("div");
  container.style.position = "fixed";
  container.style.zIndex = 3;
  container.style.right = "0";
  container.style.top = "0";
  container.style.padding = "5px";
  container.style.paddingRight = "85px";
  container.style.fontFamily = "sans-serif";
  container.style.fontSize = "16px";
  container.style.color = "white";
  document.body.appendChild(container);
  
  var prescaler = 0;
  
  function updateDebug() {
    if(prescaler % 4 == 0) {
      var pos = controls.getObject().position;
      container.innerText = "(" + pos.x.toFixed(1) + ", " + pos.y.toFixed(1) + ", " + pos.z.toFixed(1) + ")";
    }
    prescaler++;
  }
  
  addOnFrame(updateDebug);
  
  var script = document.createElement("script");
  script.onload = function() {
    var stats = new Stats();
    stats.dom.style.left = "initial";
    stats.dom.style.right = "0";
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  };
  script.src = "lib/stats.min.js";
  document.head.appendChild(script);
})();
