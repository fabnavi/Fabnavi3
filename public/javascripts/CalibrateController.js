var CalibrateController = function () {
  var x  = 0,
      y = 0,
      w = 1000,
      h = 1000,
      cx = 0,
      cy = 0,
      lx,
      ly,
      drag = false,
      zi = false,
      zo = false,
      as=1,
      cvs,
      aspShift = false,
      isInitalized = false
  ;

function dbg(){
  console.log("x: "+x);
  console.log("y: "+y);
  console.log("w: "+w);
  console.log("h: "+h);
  console.log("cx: "+cx);
  console.log("cy: "+cy);
  console.log("lx: "+lx);
  console.log("ly: "+ly);
}

function zoomIn  (_shift) {
  var shift = _shift | 10;
  w -= shift;
  h -= shift*as;
  validateWH();
  update();
}

function zoomOut  (_shift) {
  var shift = _shift | 10;
  w += shift;
  h += shift*as;
  validateWH();
  update();
}

function changeAspectRatio (_shift){
  w += _shift;
  validateWH();
  update();
  updateXYFromWH();
}

function validateWH(){
  if(w < 2)w = 2;
  if(h < 2)h = 2;
}

function moveRelatively(dx,dy){
  cx -= dx;
  cy += dy;
  update();
}

function loadFromViewConfig(){
  var conf = ViewConfig.conf();
  x = conf.x || 0;
  y = conf.y || 0;
  w = conf.w || 1000;
  h = conf.h || 1000; 
  validateWH();
}

function init (){
  cvs = document.getElementById('cvs');
  setInterval(function(){
      if(zi)zoomIn();
      if(zo)zoomOut();
  },50);
  loadFromViewConfig();
  updateXYFromWH();
}

function toggleAspectShiftMode(){
  aspShift = !aspShift;
}

function addMouseEvent (){
  if(Director.calibrateLock()){
    removeMouseEvent();
    return -1;
  }
  cvs.onwheel = function(e){
    e.preventDefault();
    var y = e.deltaY;
    if(y>0)zoomOut(y);
    else zoomIn(-y);
  };
  cvs.onmousedown = function (e) {
    drag = true;
    lx = e.clientX;
    ly = e.clientY;
  };
  cvs.onmouseup = function (e){
    drag = false;
  };
  cvs.onmousemove= function (e){
    if(drag){
      var eX = e.clientX;
      if(aspShift){
        changeAspectRatio(lx - eX);
        lx = eX;
      }else {
        var eY = e.clientY;
        moveRelatively(lx - eX,eY - ly); 
        lx =  eX;
        ly =  eY;
      }
    }
  };
}

function removeMouseEvent (){
  cvs.onwheel = "";
  cvs.onmousedown = "";
  cvs.onmouseup = "";
  cvs.onmousemove= "";
}

function updateXYFromWH  () {
  as = h/w;
  cx = Math.floor(w/2) + Number(x);
  cy = Math.floor(h/2) + Number(y);
}

function updateXYFromCenter (){
  x = cx - Math.floor(w/2);
  y = cy - Math.floor(h/2);
}

function update (){
  updateXYFromCenter();
  if(isInitalized)ViewConfig.setConf({x:x,y:y,w:w,h:h});
  else { 
   initConf();
  }
  Director.redraw();
}

function initConf(){
    var c = "";
    if(c = MainView.getCurrentImage()){
      w = c.naturalWidth;
      h = c.naturalHeight;
      isInitalized = true;
     }
}

return {
  init:init,
  addMouseEvent:addMouseEvent,
  removeMouseEvent:removeMouseEvent,
  toggleAspBtn:toggleAspectShiftMode,
};
} ();
