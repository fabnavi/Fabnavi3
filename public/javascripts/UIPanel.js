function HideableDOM(id ){
  this.id = id;
  this.elem = document.getElementById(id);
  this.hide();
}
HideableDOM.prototype = {
  hide:function(){
    this.elem.classList.remove("show");
    this.elem.classList.add("hide");
  },
  show:function(){
    this.elem.classList.remove("hide");
    this.elem.classList.add("show");
  },
  text :function(){
    return this.elem.textContent;
  },
  setText:function(str){
    this.elem.innerHTML= str;
  },
  onclick:function(cb){
    this.elem.onclick = cb;
  }
};

var UIPanel =  function () {
  var editElement,
      propertyElement,
      calibrateElement,
      mainPanel,
      informationElement,
      usageElement,

  /* Buttons  */
  zoomInBtn,
  zoomOutBtn,
  aspBtn,
  saveConfigBtn,
  isShowPanel,
  counter
  ;

function init(){
  Publisher.subscribe("Mode","Play");

  counter = new HideableDOM("counter");
  mainPanel = new HideableDOM('panel');
  editElement = new HideableDOM('editProject');
  propertyElement = new HideableDOM('property');
  calibrateElement = new HideableDOM('calibrate');
  informationElement = new HideableDOM('info');
  usageElement = new HideableDOM('usage');


  document.getElementById('savePlaylist').onclick = function(){
  };

  document.getElementById('setThumbnail').onclick = function(){
    Director.setThumbnail();
  };

  document.getElementById('edit_tab').onclick = Director.setPlayMode;
  document.getElementById('property_tab').onclick = Director.setPlayMode;
  document.getElementById('calibrate_tab').onclick = Director.setCalibrateMode;
  if(Director.mode() == 1){
    var crop_tab = new HideableDOM('crop_tab');
    crop_tab.onclick(Director.setCropMode);
    crop_tab.show();
  }

  initCalibrateButtons();

  informationElement.hide();
  setInterval(function(){
      informationElement.setText(Publisher.publish());
      document.title = Publisher.getOneLineTopic(); 
  },500);
}

function setCalibrateMode(){
  propertyElement.hide(); 
  editElement.hide();
  calibrateElement.show();
  usageElement.show();
  setUsage("Calibrate Mode : Please drag and scroll picture");
}

function setEditMode(){
  propertyElement.hide(); 
  editElement.show();
  calibrateElement.hide();
}

function setNormalMode(){
  propertyElement.show(); 
  calibrateElement.hide();
  editElement.hide();
}

function hideUIPanel(){
  mainPanel.hide();
  counter.hide();
  informationElement.hide();
  usageElement.hide();
  isShowPanel = false;
}

function showUIPanel(){
  mainPanel.show();
  counter.show();
  informationElement.show();
  usageElement.show();
  isShowPanel = true;
}

function togglePanel(){
  if(isShowPanel) hideUIPanel();
  else showUIPanel();
}

function initCalibrateButtons(){
  zoomOutBtn = document.getElementById('zoomOut');
  zoomInBtn = document.getElementById('zoomIn');
  aspBtn = document.getElementById('aspectShift');
  saveConfigBtn = document.getElementById('save');

  saveConfigBtn.onclick = ViewConfig.save;
  zoomInBtn.onclick = CalibrateController.zoomIn;
  zoomOutBtn.onclick = CalibrateController.zoomOut;
  aspBtn.onclick = CalibrateController.toggleAspBtn;
}

function setCounterText(str){
  counter.setText(str);
}

function setInformation(str){
  informationElement.setText(str);
}

function setUsage(str){
  usageElement.setText(str);
}


return {
  init:init,
  show:showUIPanel,
  hide:hideUIPanel,
  toggle:togglePanel,
  setCounterText:setCounterText,
  setInformation:setInformation,
  setUsage:setUsage,
  setCalibrateMode:setCalibrateMode,
  setNormalMode:setNormalMode,
  setEditMode:setEditMode,
};

} ();
