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
   if(CURRENT_USER == null){
    CURRENT_USER = {email: ""};
   }
   console.log("registered");
    navigator.id.watch({
        loggedInEmail:CURRENT_USER.email,
        onlogin: function(assertion){
         console.log(CURRENT_USER);
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
                if(CURRENT_USER.email != null)
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
