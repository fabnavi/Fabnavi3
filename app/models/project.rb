class Project < ActiveRecord::Base
  validates_uniqueness_of :user, scope: :project_name
  validates :project_name, length:{maximum:30,minimum:4}
  has_many :picture
  belongs_to :user

  scope :public_projects, -> {
    joins(:user).order('updated_at desc').where(Project.arel_table[:status].eq 1)
  }

  scope :owned_by, ->(userName) {
    user_id = User.find_by(:name =>userName).id
    joins(:user).order('updated_at desc')
      .where(Project.arel_table[:status].eq(1)
      .or(Project.arel_table[:user_id].eq(user_id)))
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
