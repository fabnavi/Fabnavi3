var KeyBind = function () {

  var keyMap = [],
      trigger = [],
      triggeredPromise = null
  ;

function setKeyMap(){
  window.onkeydown = function(e) {
    var key = e.keyCode,
        i = 0
         ;

    for(i = 0; i < trigger.length; ++i){
      if(trigger[i] == key){
        triggeredPromise();
      }
    }

    if(keyMap.hasOwnProperty(key)){
      keyMap[key]();
    } else {
      console.log(key);
    }
  }
}

function playMode(){
  clearKeyMap();
  commonKeyMap();
  setKeyMap();
}

function addMode(){
  clearKeyMap();
  commonKeyMap();
  keyMap[13] = Director.shoot;
  keyMap[69] = Director.toggleEditor;
  keyMap[88] = Director.removePage;
  keyMap[84] = Director.setThumbnail;
  //keyMap[83] = Server.postPlaylist;
  setKeyMap();
}

function editMode(){
  clearKeyMap();
  commonKeyMap();
  keyMap[69] = Director.toggleEditor;
  keyMap[88] = Director.removePage;
  keyMap[84] = Director.setThumbnail;
  //keyMap[83] = Server.postPlaylist;
  setKeyMap();
}

function commonKeyMap() {
  keyMap[39] = Director.nextPage;
  keyMap[97] = Director.nextPage;
  keyMap[37] = Director.prevPage;
  keyMap[99] = Director.prevPage;
  keyMap[68] = Director.toggleConsole;
  keyMap[67] = ViewConfig.save;
  keyMap[27] = Director.exit;
}

function clearKeyMap(){
  keyMap = [];
}

function showKeyMap(){
  return keyMap;
}

function register(promise, keys){
  trigger = keys;
  triggeredPromise = promise;
}

function deregister(){
  trigger = [];
  triggeredPromise = null;
}

return {
  register:register,
  deregister:deregister,
  play:playMode,
  add:addMode,
  edit:editMode,
  keyMap:showKeyMap,
  mode:"Project"
};
}();

