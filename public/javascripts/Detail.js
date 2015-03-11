var Detail = function(){
  var author = "",
      projectName = "",
      projectURL = "",
      thumbnailURL = ""
  ;

function init(){
  projectName = PROJECT_DATA.projectName;
  author = PROJECT_DATA.author;
  Publisher.subscribe("Name",projectName);
}

function getProjectName(){
  return projectName;
}

function getAuthor(){
  return author;
}

function getProjectURL(){
  return projectURL;
}

return {
  init : init,
  author:getAuthor,
  projectName:getProjectName,
  projectURL:getProjectURL,
  thumbnailURL:thumbnailURL,
};

}();
