class HomeController < ApplicationController

  def index 
    if user_signed_in? and  current_user.name.blank?
      redirect_to edit_user_registration_path
    else 
      render "index"
    end
  end


end
