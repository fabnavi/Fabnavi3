var PhaseController = (function(){

  function addMode(){
    putCalibrationSheet()
  .then(movePicture)
  .then(adjustSize)
  .then(success,fail);
  }

  function editMode(){

  }

  function playMode(){

  }

  var putCalibrationSheet = function(){
    var d = new $.Deferred();
    registerCallback(function(){
      console.log("Put picture");
      d.resolve();
    },[13]); 
    return d.promise();
  }

  var movePicture = function(){
    var d = new $.Deferred();
    registerCallback(function(){
      console.log("move Picture");
      d.resolve();
    },[32]); 
    return d.promise();
  }

  var adjustSize = function(){
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
    KeyBind.deregister();
    KeyBind.register(fn,keys); 
  }

  function deregister(){
    KeyBind.deregister();
  }

  return {
    addMode:addMode,
    editMode:editMode,
    playMode:playMode,
  };

})();



