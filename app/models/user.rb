class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable, :omniauthable, :omniauth_providers => [:persona]
  has_many :auths, dependent: :destroy


  def password_required?
    #TODO check whether this is secure?
    bybug.pry
    super && auths.length > 0
  end
end
