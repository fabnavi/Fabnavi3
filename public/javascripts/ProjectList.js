var ProjectList =  function(){
  var selectedOpIndex = 0;

  function init(){
    load();
    authInit();
    KeyBind.init();
  }

  function load () {

    selectedId = "";
    var makeButtons = document.getElementsByClassName('makeButton');
    for (var i = 0; i < makeButtons.length;i++){
      makeButtons[i].onclick = function(e){ 
        selectedId = e.target.parentElement.id;
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
    if(!AUTHOR_NAME)return false;
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

  function newProject(){
    alert("Stub");
  }
  function add () {
    if(document.getElementById(selectedId).getElementsByClassName('addButton').length == 0)return 0;
    selectOp(2);
    alert("Add photo");
    if(selectedId == "newProject"){
      return 0;
    }
    window.location += "add/"+selectedId;
  }

  function play () {
    if(selectedId == "__newProject__"){
      window.location = "/new";
      return 0;
    }
    if(document.getElementById(selectedId).getElementsByClassName('makeButton').length == 0)return 0;
    selectOp(0);
    window.location += "project/"+selectedId;
  }

  function edit () {
    if(document.getElementById(selectedId).getElementsByClassName('editButton').length == 0)return 0;
    selectOp(1);
    if(selectedId == "__newProject__"){
      window.location = "/new";
      return 0;
    }
    window.location += "edit/"+selectedId;
  }

  function del(){
    var elem = document.getElementById(selectedId);
    if(!elem || elem.getElementsByClassName('deleteButton').length == 0)return 0;
    selectOp(3);
    if(confirm("are you sure to delete project :" + selectedId)){
      elem.remove();
      var data = selectedId.split('/');
      $.get("/project/delete?project_id="+data[1]+"&author="+data[0]);
    }
  }

  function authInit(){
    var signIn = document.getElementById('signin');
    var signOut= document.getElementById('signout');
    var author_name = document.getElementById('author_name');
    var author_email = document.getElementById('author_email');
    var avatar = document.getElementById('avatar');
    var header = document.getElementById('header');
    if(AUTHOR_EMAIL != null){
      author_email.textContent = AUTHOR_EMAIL;
      if(AUTHOR_NAME != null){
        author_name.textContent = AUTHOR_NAME;
        signIn.style.display = "none";
        header.onclick = function(){
          if(signOut.className == ""){
            signOut.className = "show";
          } else {
            signOut.className = "";
          }
        };
      }else {
        header.className = "";
      }

    } else {
      author_email.textContent = "Plese sign in with Persona";
      signOut.style.display = "none";
      author_name.className = "hide";
      author_email.className = "hide";
      avatar.className = "hide";
      header.className = "hide";
    }

    if(signIn){
      signIn.onclick = function(){navigator.id.request();};
    }
    if(signOut){
      author_name.onclick = null;
      signOut.onclick = function(){navigator.id.logout();};
    }

    navigator.id.watch({
        loggedInEmail:AUTHOR_EMAIL,
        onlogin: function(assertion){
          $.ajax(
            { type : 'POST',
              url: '/users/sign_in',
              data:{assertion:assertion},
              success:function(res,status,xhr){
                window.location = res;
              },
              error:function(res,status,xhr){
                console.log(res);
                alert("login failure" + res);
              },
          });
        },

        onlogout:function(){
          $.ajax(
            {type:'DELETE',
              url:'/users/sign_out/',
              success:function(res,status,xhr){window.location.reload();},
              error:function(res,status,xhr){alert("logout failure" + res);},
          });
            }
        });
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
        newProject:newProject,
      }
      }();

