class Picture < ActiveRecord::Base
  validates :url, presence: true
  validates :url , { with: URI.regexp }
  validates :project_id, presence: true
  validates :order_in_project, presence: true
  validates :order_in_project, numericality: true
end
