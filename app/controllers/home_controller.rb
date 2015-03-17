class HomeController < ApplicationController
  def show
    if signed_in?
      @user = current_user
      @projects = Project.owned_by(@user.name)
      render :layout => 'projects' 
    else
      flash[:notice] = "Please Login"
      redirect_to root_path
    end 
  end
end
