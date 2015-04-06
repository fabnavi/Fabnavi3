class Project < ActiveRecord::Base
  enum status: [:private_project, :public_project, :group_project]
  validates :project_name , presence: true
  validates :user , presence: true
  validates :status , presence: true
  validates_uniqueness_of :user, scope: :project_name
  validates :project_name, length:{maximum:30,minimum:4}
  has_many :picture
  belongs_to :user

  scope :public_projects, -> {
    joins(:user).order('updated_at desc').where(Project.arel_table[:status].eq 1)
  }

  scope :owned_by, ->(user) {
    joins(:user).order('updated_at desc').where(:user_id => user.id)
  }

  scope :public_projects_including_owned_by, ->(user) {
    joins(:user).order('updated_at desc')
      .where(Project.arel_table[:status].eq(1)
      .or(Project.arel_table[:user_id].eq(user.id)))
  }

  scope :find_project, -> (user,project_name){
    joins(:user).readonly(false).find_by(:project_name => project_name,
                                         :users => {:name => user})
  }

  scope :find_project_readonly, -> (user,project_name){
    joins(:user).find_by(:project_name => project_name,
                         :users => {:name => user})
  }

  def thumbnail_url
    url = nil
    if self.thumbnail_picture_id
      thumbnail_picture = self.picture.select{ |p| p.order_in_project == self.thumbnail_picture_id + 1 }[0] 
      url = thumbnail_picture.try(:thumbnail_url)
      url = thumbnail_picture.try(:url) if !!url
    end

    if url
      return url
    else
      return "images/noimage.gif"
    end
  end

  def path 
    self.user.name.to_s + "/" + self.project_name.to_s
  end

  def project_index 
    self.id.to_s
  end

end
