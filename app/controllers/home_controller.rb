class HomeController < ApplicationController
  def show
    @projects = Project.all_projects
    @user = current_user
    render :layout => 'projects' 
  end
end
