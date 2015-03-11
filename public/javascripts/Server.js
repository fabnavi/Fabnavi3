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
    var lst = Director.list();
    console.log(lst.saveLock);
    if(lst.saveLock() == false){
     Publisher.unsubscribe("Playlist");
    $.post("/project/postConfig",
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

  return {
    setThumbnail:setThumbnail,
    postPlaylist:postPlaylist,
  };
  }();
