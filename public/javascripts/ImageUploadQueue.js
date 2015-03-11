
THUMBNAIL_WIDTH = 440;
THUMBNAIL_HEIGHT = 320;

var ImageUploadQueue = function ImageUploadQueue(){
  var queue = [],
      runninng=false,
      timer = null
  ;

/**
 *  @param obj 
 *      Object.img.src
 *      Object.loadedImg
 *
 */
function push (obj) {
  queue.push(obj);
}

function clear () {
  queue = [];
  runninng = false;
}

function start(){
  timer = setInterval(function(){
      fire(); 
  },5000);
}

function stop () {
  clearInterval(timer); 
}

function fire () {
  if(runninng){
    return 0;
  }
  runninng = true;
  if (queue.length < 1) {
    Publisher.unsubscribe("Upload");
    runninng = false;
    notice("No task");
    return -1;
  }
  Publisher.subscribe("Upload",queue.length+" images");
  var cachedImage = queue[0];
  var url = cachedImage.img.src;
  /* Original, thumbnail
   * Load Image -> ConvertImage -> PostImage
   * UpdateURLList
   */
  if(cachedImage.hasOwnProperty("loadedImg")){
    notice("Loading Image...");
    $.when(
      cachedImage.loadedImg
      .then(cropAndConvertImageToDataURL(false))
      .then(postPicture(url))
      .then(updateURLList(false)),
      cachedImage.loadedImg
      .then(cropAndConvertImageToDataURL(true))
      .then(postPicture(generateThumbnailURL(url)))
      .then(updateURLList(true)))
    .done(function(a,b){
        queue.shift();
        this.runninng = false;
    })
    .fail(function(e){
        this.runninng = false;
        console.log(e.toSource());
    });
  }
}

/**
 * cropping image with view config area 
 * and convert it to DataURL
 * @param img {Image}
 * @return {String (Deferred)}
 */

function cropAndConvertImageToDataURL(isThumbnail) {
  return function(img){
    var d = $.Deferred();
    try{
      var cvs = document.createElement('canvas');
      if(isThumbnail){
        cvs.width = THUMBNAIL_WIDTH;
        cvs.height = THUMBNAIL_HEIGHT;
      } else {
        cvs.width = img.naturalWidth;
        cvs.height = img.naturalHeight;
      }
      ImageConverter.drawImage(img,cvs,ViewConfig.conf());
      d.resolve(convertImgToDataURL(cvs));
    } catch (e){
      d.reject(e);
    }
    return d.promise();
  }
}

/**
 * @param cvs {HTMLCanvas2d}
 * @return {String} DataURL format
 *
 */
function convertImgToDataURL(cvs){
  notice("Converting...");
  return cvs.toDataURL("image/jpeg").substring(23);
}

function generateThumbnailURL(url){
  return url.replace(/.JPG/,"_thumbnail.JPG");
}

function updateURLList(isThumbnail){
  return function(resultUrl,url){
    var d = $.Deferred();
    notice("Image Posted!!!");
    var res = resultUrl.replace("\"","","g");
    if(isThumbnail){
      Director.list().addThumbnailURLFromLocalURL(res,url);
    } else {
      Director.list().addGlobalURLFromLocalURL(res,url);
    }
    //  RecordController.updateList();
    notice("Posting Playlist Files...");
    Server.postPlaylist();
    notice("Posted Playlist Files!!");
    //  queue.splice(0,1);
    runninng = false;
    d.resolve(url);
    return d.promise();
  }
}

/** 
 * PostPicture
 *
 *  @param data {String} dataURL format
 *  @param localImageURL {String}
 *  @return {Deferred}
 */
function postPicture(localImageURL){
  return function(data){
    notice("Posting Picture....");
    var d = $.Deferred();
    $.post("/project/postPicture",
      { 
        data:data,
        project_id:Detail.projectName(),
        author:Detail.author(),
        url:localImageURL
      },function(res,err){
        if(err != "success"){
          console.log(err);
          notice("Error to post picture");
          runninng = false;
          d.reject(err);
        } else {
          d.resolve(res,localImageURL);
        }
    });
    return d.promise();
  };
}

return {
  push:push,
  fire:fire,
  start:start,
};
}();

var notice = function(mes){
  console.log("NOTICE=============",mes);
  Publisher.update("Upload",mes);
}
