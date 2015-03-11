var Director = function(){

  var viewStatusList = ["Initializing","loadingImage","showing"],
      viewStatus= 0,
      modeList = ["play","add","edit"],
      recordingModeList = ["Play","Calibrate","Crop","Add"],
      recordingMode = 0,
      calibrateLock = true,
      ImageList,
      localImageList,
      showingImageList,
      queueingImageList,
      mode = null,
      counter
  ;

function init (_mode){
  mode = modeList.indexOf(_mode);
  if(mode == -1){
    new Error("mode is invalid");
  }

  /* Before */  
  ImageList = CachableImageList();
  MainView.init();
  Detail.init();
  ImageList.initWithURLArray(PICTURES_DATA);
  showingImageList = ImageList;
  ViewConfig.init();
  CalibrateController.init();
  UIPanel.init();

  /*  Initialize each Mode   */
  switch(mode){
    case 0:
    initAsPlayMode();
    break;
    case 1:
    initAsAddMode();
    break;
    case 2:
    initAsEditMode();
    break;
    default:
    break
  }

  /*  After   */
  KeyBind[modeList[mode]]();

  /* Finish Initializing */
  viewStatus = 1;
  showPage();
}

/* Initilizers */
function initAsPlayMode(){
  showingImageList = ImageList;
  setCalibrateMode();
}

function initAsAddMode(){
  Camera.init();
  localImageList = CachableImageList();
  localImageList.initEditor();
  queueingImageList = localImageList;
  showingImageList = localImageList;
  if(PICTURES_DATA.length == 0){
    showingImageList.initWithURLArray([]);
    setCropMode();
  } else {
    setAddMode();
  }
}

function initAsEditMode(){
  showingImageList.initEditor();
  UIPanel.setEditMode();
}

function setCalibrateMode(){
  recordingMode = 1;
  calibrateLock = false; 
  switchShowingList(false);
  UIPanel.setCalibrateMode();
  CalibrateController.addMouseEvent();
  Publisher.update("Mode","Calibrate");
}

function setCropMode(){
  recordingMode = 2;
  calibrateLock = false; 
  switchShowingList(true);
  MainView.showCalibrateLine();
  UIPanel.setCalibrateMode();
  Publisher.update("Mode","Crop");
  CalibrateController.addMouseEvent();
}

function setAddMode(){
  recordingMode = 3;
  calibrateLock = true; 
  switchShowingList(false);
  UIPanel.setNormalMode();
  CalibrateController.removeMouseEvent();
  Publisher.update("Mode","Add");
}

function setPlayMode(){
  recordingMode = 0;
  calibrateLock = true; 
  switchShowingList(false);
  UIPanel.setNormalMode();
  CalibrateController.removeMouseEvent();
  Publisher.update("Mode","Play");
}

function getCalibrateLock(){
  return calibrateLock;
}

/* Common fabnavi methods*/
function getModeInt(){
  return mode;
}

function getViewStatusInt(){
  return viewStatus;
}

function getViewStatus (){
  return viewStatusList[viewStatus];
}

function getMode(){
  return modeList[mode];
}

function nextPage(){
  viewStatus = 1;
  showingImageList.next();
  showPage();
}

function prevPage(){
  viewStatus = 1;
  showingImageList.prev();
  showPage();
}

function setPage(i){
  if(showingImageList.setPage(i) !== false){
    viewStatus = 1;
    showPage(); 
  }
}

function reloadPage(){
  setPage(showingImageList.index());
}

function showPage(){
  UIPanel.setCounterText(showingImageList.index() + 1 + "/" + showingImageList.maxLength()); 
  var deferredImage;
  if(deferredImage = showingImageList.getDeferredImage()){
    MainView.clear();
    MainView.showWaitMessage();
    deferredImage.then(function(img){
        MainView.draw(img);
        viewStatus = 2;
        afterShowing();
    });
  }
}

function afterShowing(){
  if(recordingMode == 2) {
    MainView.showCalibrateLine();
  }
}

function getRecordingMode(){
  return recordingMode;
}

function redraw(){
  viewStatus = 1;
  MainView.redraw();
  viewStatus = 2;
  if(recordingMode == 2)MainView.showCalibrateLine();
}

function toggleConsole(){
  UIPanel.toggle();
}

function toggleEditor() {
  showingImageList.toggleEditor();
}

/* recorder interface */
function switchShowingList(isLocalOnly){
  isLocalOnly = isLocalOnly || false;
  if(isLocalOnly || (localImageList && showingImageList == ImageList)){
    showingImageList = localImageList;
  } else {
    showingImageList = ImageList;
  }
}

function shoot(){
  if(recordingMode == 0)throw new Error("PlayMode cannot take picture");
  Camera.ping().done(function(){
      MainView.clear();
      UIPanel.hide();
      showingImageList.hideEditor();
      Camera.shoot().then(function(url){
          redraw();
          var res = showingImageList.push(url,showingImageList.index());
          nextPage();
          ImageUploadQueue.push(res);
      });
  }).fail(function(){
      alert("Please Connect to Camera");
  });
}

function shootAndGetURLWithDeferred(){

}

function getShowingImageList(){
  return showingImageList;
}

function updateShowingImageList(a){
  showingImageList.updateListWithURLArray(a);
}

function setThumbnail(){
 Server.setThumbnail(showingImageList.index());
} 

function removePage(){
  if(showingImageList.length() >1){
    showingImageList.remove(showingImageList.index());
    reloadPage();
  }
}

function exitProject(){
  if(confirm("Are you sure to exit this page?")){
    setTimeout(function(){
        window.location.pathname = "/";
    },10);
  }
}

return {
  init:init,
  mode:getModeInt,
  viewStatus:getViewStatusInt,
  getMode:getMode,
  getViewStatus:getViewStatus,
  nextPage:nextPage,
  prevPage:prevPage,
  setPage:setPage,
  redraw:redraw,
  toggleConsole:toggleConsole,
  shoot:shoot,

  toggleShowingList:switchShowingList,
  toggleEditor:toggleEditor,
  setThumbnail:setThumbnail,

  list:getShowingImageList,
  updateShowingImageList:updateShowingImageList,
  removePage:removePage,
  reloadPage:reloadPage,
  exit:exitProject,
  calibrateLock:getCalibrateLock,
  recordingMode:getRecordingMode,

  setCalibrateMode:setCalibrateMode,
  setPlayMode:setPlayMode,
  setCropMode:setCropMode,
  setAddMode:setAddMode,
};
}();
