var Auth = (function(){
    function init(){
      var signIn = document.getElementById('signIn') || false,
          signOut = document.getElementById('signOut') || false
      ;

    if(signIn)signIn.onclick = function(){
      registerPersonaCallbacks();
      navigator.id.request();
    }
    if(signOut)signOut.onclick = function(){
      registerPersonaCallbacks();
      navigator.id.logout();
    }
  }
  function registerPersonaCallbacks (){
    navigator.id.watch({
        loggedInEmail:CURRENT_USER_EMAIL,
        onlogin: function(assertion){
          if(CURRENT_USER_EMAIL == null)return;
          $.ajax({
              type:"POST",
              url:"/users/auth/persona/callback",
              data:{assertion:assertion},
              success: function(res, status, xhr){
                window.location.reload();
              },
              error: function(res, status, xhr){
                console.log(res,status,xhr);
              }
          });
        },
        onlogout: function(){
          alert("user logout");
          $.ajax({
              type:"DELETE",
              url:"/users/sign_out",
              success: function(res, status, xhr){
                if(CURRENT_USER_EMAIL != null)
                  window.location.reload();
              },
              error: function(res, status, xhr){
                console.log(res,status,xhr);
              }
          });
        }
    });
  }
  return{
    init:init
  };
}
)();
