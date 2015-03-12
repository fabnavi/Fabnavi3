function init(){
  var signIn = document.getElementById('signIn'),
      signOut = document.getElementById('signOut')
  ;

if(signIn)signIn.onclick = function(){
  navigator.id.request();
}
if(signOut)signOut.onclick = function(){
  navigator.id.logout();
}

navigator.id.watch({
    onlogin: function(assertion){
      console.log(assertion);
      $.ajax({
          type:"POST",
          url:"/users/auth/persona/callback",
          data:{assertion:assertion},
          success: function(res, status, xhr){
           console.log(res);
           cosole.log(status);
          },
          error: function(res, status, xhr){console.log(res,status,xhr);}
      });
    },
    onlogout: function(){
      alert("user logout");
      $.ajax({
          type:"DELETE",
          url:"/users/sign_out",
          data:{assertion:assertion},
          success: function(res, status, xhr){console.log(res,status,xhr);},
          error: function(res, status, xhr){console.log(res,status,xhr);}
      });
    }
});


console.log("hoge");
}

window.onload = init;
