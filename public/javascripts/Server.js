var Server = function (){

  function setThumbnail (index){
   console.log(index);
    $.post("/project/setThumbnail",
      {
        id:Project.id,
        user_id:Project.user_id,
        thumbnail_picture_id:index
      },
      function(){},
      "jsonp");
  }

  function postPlaylist (){
    var lst = Fabnavi.list();
    console.log("save lock:loadingLength",lst.saveLock());
    if(lst.saveLock() == false){
     Publisher.unsubscribe("Playlist");
    $.post("/projects/update",
      {
        id:Project.id,
        user_id:Project.user_id,
        data:JSON.stringify(lst.getUploadList()),
      },
      function(){},
      "json");
  } else {
    Publisher.subscribe("Playlist","Cannot Save, Please Retry later");
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
    $.post("/projects/post_picture",
      { 
        data:data,
        url:localImageURL,
        id:Project.id,
        user_id:Project.user_id,
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
    setThumbnail:setThumbnail,
    postPlaylist:postPlaylist,
    postPicture:postPicture,
  };
  }();
