//TODO 名前空間を分けてwindow.onload = initをしないようにする
function init(){
  var signIn = document.getElementById('signIn') || false,
      signOut = document.getElementById('signOut') || false
        ;

  if(signIn)signIn.onclick = function(){
    navigator.id.request();
  }
  if(signOut)signOut.onclick = function(){
    navigator.id.logout();
  }
  registerPersonaCallbacks();
}
function registerPersonaCallbacks (){
  navigator.id.watch({
    loggedInEmail:CURRENT_USER,
  onlogin: function(assertion){
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
                  window.location.reload();},
                error: function(res, status, xhr){
                  console.log(res,status,xhr);
                }
              });
            }
  });



  console.log("persona callbacks registerd");
}

window.onload = init;
