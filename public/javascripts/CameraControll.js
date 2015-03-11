
var Camera = function() {
  var connected = false,
      heartbeat = null;

  function init () {
    if(document.sonycameracontroller == undefined){
      alert("Addon is not  installed");
      window.open("https://github.com/hrl7/SonyCameraRemoteControllerAddon/blob/master/addon/sonycameraremotecontroller.xpi?raw=true");
      return false;
    }
    document.sonycameracontroller.setup({ipaddress: "10.0.0.1", port: 10000, version: "1.0"},false,true);

    heartbeat = window.setInterval(function(){
        ping();
    },5000);
    return true;
  }

  function zoomOnce(){
    var d = $.Deferred();
    document.sonycameracontroller.zoomIn(function(res){
        setTimeout(function(){
            d.resolve();
        },700);
    });
    return d.promise();
  }

  function shoot () {
    var d = $.Deferred();
    var t = window.setTimeout(function(){
        d.reject("Camera Not Respond");        
    },3000);
    var listener = 
    function (url,res) {
      window.clearTimeout(t);
      setTimeout(function(){
        d.resolve(url);
     },100);
    };
    document.sonycameracontroller.take(listener);

    return d.promise();
  }

  function ping(){
    var d = $.Deferred();
    try{
      var r = new XMLHttpRequest();
      var t = window.setTimeout(function(){
          r.abort();
          connected = false;
          d.reject(false);
      },2000);
      r.onload = function(e){
        window.clearTimeout(t);
        connected = true;
        d.resolve(true);
      };
      r.open("GET","http://10.0.0.1:10000",true);
      r.send();
    } catch(e){
    }
    return d.promise();
  }

  return {
    init:init,
    shoot:shoot,
    ping:ping,
  };
  }();
