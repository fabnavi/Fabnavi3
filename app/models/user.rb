class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  validates :email , presence: true
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable, :omniauthable, :omniauth_providers => [:persona]
  has_many :auths, dependent: :destroy

  def update_with_password(params, *options)
   p
    if encrypted_password.blank?
      update_attributes(params, *options)
    else
      super
    end
  end

  def password_required?
    #TODO check whether this is secure?
    #bybug.pry
    super && auths.length == 0
  end
end
