class CreateAuths < ActiveRecord::Migration
  def change
    create_table :auths do |t|
      t.string :uid
      t.string :provider
      t.integer :user_id

      t.timestamps null: false
    end
  add_index :auths, [:uid, :provider], unique:  true
  end
end
