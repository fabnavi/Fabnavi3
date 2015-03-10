class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :project_name
      t.integer :thumbnail_picture_id
      t.integer :user_id
      t.integer :status

      t.timestamps null: false
    end
    add_index :projects, [:project_name, :user_id, :status], unique: true
    add_index :projects, :project_name, unique: true
    add_index :projects, :user_id, unique: true
  end
end
