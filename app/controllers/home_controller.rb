class HomeController < ApplicationController
 
  def index 
    @user = current_user
    render "index"
  end


end
