var ProjectList =  function(){
  var selectedOpIndex = 0;

  function init(){
    load();
    KeyBind.init();
  }

  function load () {

    selectedId = "";
    var makeButtons = document.getElementsByClassName('makeButton');
    for (var i = 0; i < makeButtons.length;i++){
      makeButtons[i].onclick = function(e){ 
        selectedId = e.target.parentElement.id;
        console.log(selectedId);
        play();
      };
    }

    var deleteButtons = document.getElementsByClassName('deleteButton');
    for (var i = 0; i < deleteButtons.length;i++){
      deleteButtons[i].onclick = function(e){
        selectedId = e.target.parentElement.id;

      }
    }
    var addButtons = document.getElementsByClassName('addButton');
    for (var i = 0; i < addButtons.length;i++){
      addButtons[i].onclick = function(e){
        selectedId = e.target.parentElement.id;
        add();
      }
    }

    var editButtons = document.getElementsByClassName('editButton');
    for (var i = 0; i < editButtons.length;i++){
      editButtons[i].onclick = function(e){
        selectedId = e.target.parentElement.id;
        edit();
      }
    }

    var projects = document.getElementsByTagName('li');
    for(var i = 0; i< projects.length;i++){
      projects[i].onclick = function(e){
        var target;
        if(e.target.tagName != "LI"){
          target = e.target.parentNode; 
        } else {
          target = e.target;
        }
        select(target);
      }
    }
    var newProject;
    if(newProject = document.getElementById('__newProject__')){
      newProject.onclick = function(){
        selectedId = "__newProject__";
        play();
      }
    }

    select($('li')[0]);
  }

  function select(target) {
    if(!target ||  target.tagName != "LI")return 0;
    $('li').removeClass('selectedItem');
    target.className = 'selectedItem';
    selectedId = target.id;
    selectOp(0);
  }

  function prev  () {
    if(selectedId == "")return 0;
    var s = document.getElementById(selectedId).previousElementSibling;
    if(s == null)return 0;
    select(s); 
  }

  function next () {
    if(selectedId == ""){
      select($("li")[0]);
      return 0;
    }
    var s = document.getElementById(selectedId).nextElementSibling;
    if(s == null)return 0;
    select(s); 
  }

  function up(){
    selectOp(selectedOpIndex - 1);
  }

  function down(){
    selectOp(selectedOpIndex + 1);
  }

  function selectOp(maybeIndex){
    if(maybeIndex < 0){
      selectedOpIndex = 0;
      return false;
    } else if (maybeIndex > 3){
      selectedOpIndex = 3;
      return false;
    }
    if( document.getElementById(selectedId) == null) return;
    var lst = document.getElementById(selectedId).childNodes;
    var inputIndex = 0;
    for(i in lst){
      var li = lst[i];
      if(li.tagName == "INPUT"){
        li.className = li.className.replace(/selectedOp/,"");
        if(inputIndex == maybeIndex){
          li.className += " selectedOp";
          selectedOpIndex = maybeIndex;
        }
        inputIndex++; 
      }
    }
  }

  function fire(){
    var lst = ['play','edit','add','del'];
    ProjectList[lst[selectedOpIndex]]();
  }

  function add () {
    alert("stub");
    if(document.getElementById(selectedId).getElementsByClassName('addButton').length == 0)return 0;
    selectOp(2);
    alert("Add photo");
    if(selectedId == "newProject"){
      return 0;
    }
    redirect("add",selectedId);
  }

  function play () {
    if(selectedId == "__newProject__"){
      redirect("new");
    }else {
      if(document.getElementById(selectedId).getElementsByClassName('makeButton').length == 0)return 0;
      selectOp(0);
      redirect("show",selectedId);
    }
  }

  function edit () {
    if(document.getElementById(selectedId).getElementsByClassName('editButton').length == 0)return 0;
    selectOp(1);
    if(selectedId == "__newProject__"){
      redirect("new");
    }else {
      redirect("edit",selectedId);
    }
  }

  function del(){
    alert("stub");
    var elem = document.getElementById(selectedId);
    if(!elem || elem.getElementsByClassName('deleteButton').length == 0)return 0;
    selectOp(3);
    if(confirm("are you sure to delete project :" + selectedId)){
      elem.remove();
      var data = selectedId.split('/');
      $.get("/projects/delete?project_id="+data[1]+"&author="+data[0]);
    }
  }

  function redirect(op, arg){
    switch(op){
      case "new":
        window.location = "http://" + window.location.host + "/projects/new";
      break;
      case "show":
        window.location = "http://" + window.location.host + "/projects/" + arg;
        break;
      case "edit":
        window.location = "http://" + window.location.host + "/projects/" + arg + "/edit";
        break;
      default:
        console.log(op);
      throw Error("Undefined Operation");
    }
  }
  return {
    init:init,
    prev:prev,
    next:next,
    fire:fire,
    add:add,
    play:play,
    edit:edit,
    up:up,
    down:down,
    del:del,
  }
  }();

