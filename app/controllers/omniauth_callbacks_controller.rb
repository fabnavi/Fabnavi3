class OmniauthCallbacksController < ApplicationController

  def persona
    # should return user
    req = request.env['omniauth.auth']['extra']['raw_info']
    if req["status"] == "okay" then
      auth = Auth.find_for_omniauth(request.env['omniauth.auth'])

      if auth.user then
        #logged in 
      else
        #user not found , Register
        user = User.new(
          email:req["email"], 
          password: Devise.friendly_token[4, 30]
        )

        if user.save! then
          #user saved!
          auth.user = user
          auth.save
        else
          #user cannot saved
          raise "User cannot saved"
        end
      end
      sign_in auth.user
      render :text  => "Login Success"
    end

  end
end
