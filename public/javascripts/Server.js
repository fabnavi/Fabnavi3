var Server = function (){

  function setThumbnail (index){
   console.log(index);
    $.post("/project/setThumbnail",
      {
        project_id:Detail.projectName(),
        author:Detail.author(),
        thumbnail:index
      },
      function(){},
      "jsonp");
  }

  function postPlaylist (){
    var lst = Fabnavi.list();
    console.log(lst.saveLock);
    if(lst.saveLock() == false){
     Publisher.unsubscribe("Playlist");
    $.post("/projects/",
      {
        project_id:Detail.projectName(),
        data:JSON.stringify(lst.list()),
        author:Detail.author()
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
    setThumbnail:setThumbnail,
    postPlaylist:postPlaylist,
    postPicture:postPicture,
  };
  }();
