class Project < ActiveRecord::Base
  validates :project_name , presence: true
  validates :user , presence: true
  validates :status , presence: true
  validates :thumbnail_picture , presence: true
  validates_uniqueness_of :user, scope: :project_name
  validates :project_name, length:{maximum:30,minimum:4}
  has_many :picture
  belongs_to :user

  scope :public_projects, -> {
    joins(:user).order('updated_at desc').where(Project.arel_table[:status].eq 1)
  }

  scope :owned_by, ->(user) {
   joins(:user).order('updated_at desc').where(:user => user)
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
end
