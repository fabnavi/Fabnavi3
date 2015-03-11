class CreatePictures < ActiveRecord::Migration
  def change
    create_table :pictures do |t|
      t.string :url
      t.string :thumbnail_url
      t.integer :project_id
      t.integer :order_in_project

      t.timestamps null: false
    end

  end
end
