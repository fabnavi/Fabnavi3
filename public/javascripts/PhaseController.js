var PhaseController = (function(){

  function addMode(){
    putCalibrationSheetWithShoot()
  .then(movePicture)
  .then(adjustSize)
  .then(success,fail);
  }

  function editMode(){

  }

  function playMode(){
    putCalibrationSheet()
  .then(movePicture)
  .then(adjustSize)
  .then(success,fail);
  }

  var putCalibrationSheetWithShoot = function(){
    Fabnavi.setCalibrationLine(true);
    Fabnavi.setNavigationImage("move_sheet.gif");

    var d = new $.Deferred();
    registerCallback(function(){
      console.log("Put picture");
      d.resolve();
    },[13]); 
    return d.promise();
  }

  var putCalibrationSheet = function(){
    Fabnavi.setCalibrationLine(true);
    Fabnavi.setNavigationImage("move_sheet.gif");
    Fabnavi.setCalibrationLock(true); 

    var d = new $.Deferred();
    registerCallback(function(){
      console.log("Put picture");
      d.resolve();
    },[32]); 
    return d.promise();
  }

  var movePicture = function(){
    Fabnavi.setNavigationImage("drag_image.gif");
    var d = new $.Deferred();
    registerCallback(function(){
      console.log("move Picture");
      d.resolve();
    },[32]); 
    return d.promise();
  }

  var adjustSize = function(){
    Fabnavi.setNavigationImage("adjust_asp.gif");

    var keymap = [],d = 20;
    keymap[39] = CalibrateController.changeRegionCB(-d,0);
    keymap[37] = CalibrateController.changeRegionCB(d,0);
    keymap[38] = CalibrateController.changeRegionCB(0,-d);
    keymap[40] = CalibrateController.changeRegionCB(0,d);
    Key.setKeyMap(keymap);

    var d = new $.Deferred();
    registerCallback(function(){
      console.log("adjustSize");
      d.resolve();
    }, [83]);
    return d.promise();
  }

  function success(){
    console.log("SUCCESS");
    deregister();
  }

  function fail(err){
    console.log(err.toSource());
    deregister();
    throw new Error(err);
  }

  function registerCallback(fn,keys){
    Key.deregister();
    Key.register(fn,keys); 
  }

  function deregister(){
    Key.deregister();
  }

  return {
    addMode:addMode,
    editMode:editMode,
    playMode:playMode,
  };

})();



