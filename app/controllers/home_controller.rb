class HomeController < ApplicationController
  def show
    if signed_in?
      @projects = Project.all_projects
      @user = current_user
      render :layout => 'projects' 
    else
      flash[:notice] = "Please Login"
      redirect_to root_path
    end 
  end
end
