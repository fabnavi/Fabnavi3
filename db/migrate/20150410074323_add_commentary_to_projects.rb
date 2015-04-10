class AddCommentaryToProjects < ActiveRecord::Migration
  def change
    add_column :projects, :Commentary, :string
  end
end
