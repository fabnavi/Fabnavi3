require "JSON"
class ProjectsController < ApplicationController
  before_filter:authenticate_user!, only: [ :edit, :update, :destroy, :create, :new , :postPicture, :deletePicture]
  before_filter :set_project, except: [:index,:create, :new]

  # GET /projects
  # GET /projects.json
  def index
    @user = current_user
    @projects = Project.public_projects
  end

  # GET /projects/1
  # GET /projects/1.json
  def show
    redirect_to root_path, :status => :forbidden  unless visible?
    render :layout => 'content'
  end

  # GET /projects/new
  def new
    @project = Project.new
  end

  # GET /projects/1/edit
  def edit
    render :layout => 'content'
  end

  # POST /projects
  # POST /projects.json
  def create
    @project = Project.new(new_project_params)
    @project.user = current_user
    @project.status = :private_project

    respond_to do |format|
      if @project.save
        format.html { redirect_to :action => "edit", :id => @project.id }
        format.json { render :show, status: :created, location: @project }
      else
        format.html { render :new }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  def post_picture
   puts "post picture----------------------------" 
    Picture.new do |p|
      p.project_id = @project.id
    end

   render :text => "http://localhost:3000/images/key_bind.png"
  rescue
    "failed"
  end

  def delete_picture
  end

  # PATCH/PUT /projects/1
  # PATCH/PUT /projects/1.json
  def update
    respond_to do |format|
      if @project.update(project_params)
        format.html { redirect_to @project, notice: 'Project was successfully updated.' }
        format.json { render :show, status: :ok, location: @project }
      else
        format.html { render :edit }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /projects/1
  # DELETE /projects/1.json
  def destroy
    @project.destroy
    respond_to do |format|
      format.html { redirect_to projects_url, notice: 'Project was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def set_project
   if params.include? :id
      @project = Project.find(params[:id])
   elsif params.include? :user_name and params.include? :project_name
      @project = Project.find_project(params[:user_name], params[:project_name])
   end
   unless @project 
    redirect_to root_path, status: 404
   end

  rescue
    redirect_to root_path, status: 404
  end

  def visible?
    @project.public_project? or (user_signed_in? and @project.user == current_user)
  end

  def new_project_params
    params[:project].permit(:project_name, :Commentary)
  end

  def project_params
   JSON.parse(params[:data])
  end
end
