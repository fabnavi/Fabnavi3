class OmniauthCallbacksController < ApplicationController

  def persona

    #render :text => request.env['omniauth.auth'].to_hash.status
    req = request.env['omniauth.auth']['extra']['raw_info']
    if req["status"] == "okay" then
      user = User.from_omniauth(request.env['omniauth.auth'])
      puts user
      redirect_to new_user_registration_path
=begin
      if user.persisted?
        flash.notice = "Logged in"
        sign_in_and_redirect user
      else 
        session["devise.user_attributes"] = user.attributes
        redirect_to new_user_registeration_url
      end

=end
    end
  end

end
