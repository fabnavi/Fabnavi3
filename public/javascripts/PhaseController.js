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
  .then(playSlide)
  .then(success,fail);
  }

  var playSlide = function(){

    var keymap = [],d = 20;
    keyMap[39] = Fabnavi.nextPage;
    keyMap[97] = Fabnavi.nextPage;
    keyMap[37] = Fabnavi.prevPage;
    keyMap[99] = Fabnavi.prevPage;
    keyMap[27] = Fabnavi.exit;
    Key.setKeyMap(keymap);

    var d = new $.Deferred();
    registerCallback(function(){
      d.resolve();
    },[]); 
    return d.promise();
  }

  function beforeStageChanging(){
    Fabnavi.setCalibrationLine(false); 
    Fabnavi.setCalibrationLock(false); 
    Fabnavi.setNavigationImage("");
    CalibrateController.removeMouseEvent();
    Key.clear();
  }

  var putcalibrationsheetwithshoot = function(){
    Fabnavi.setCalibrationLine(true);
    Fabnavi.setNavigationImage("move_sheet.gif");

    var d = new $.Deferred();
    registerCallback(function(){
      console.log("put picture");
      beforeStageChanging();
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
      beforeStageChanging();
      d.resolve();
    },[32]); 
    return d.promise();
  }

  var movePicture = function(){
    Fabnavi.setNavigationImage("drag_image.gif");
    Fabnavi.setCalibrationLock(false);
    Fabnavi.setCalibrationLine(true);
    CalibrateController.addMouseEvent();

    var d = new $.Deferred();
    registerCallback(function(){
      console.log("move Picture");
      beforeStageChanging();
      d.resolve();
    },[32]); 
    return d.promise();
  }

  var adjustSize = function(){
    CalibrateController.removeMouseEvent();
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
      beforeStageChanging();
      ViewConfig.save();
      d.resolve();
    }, [32]);
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



