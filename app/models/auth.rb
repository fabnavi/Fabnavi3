class Auth < ActiveRecord::Base
  
  validates :provider, presence: true
  validates :uid, presence: true
  belongs_to :user




  def self.find_for_omniauth(auth)
    provider = auth["provider"]
    uid = auth["uid"]
    if provider  == "persona" then
      userAuth = Auth.where(uid: uid, provider: provider).first 
      if userAuth then
        return userAuth
      else 
        return Auth.new(uid: uid, provider: provider)
      end
    else
      raise "Provider #{auth["provider"]} is not recognized"
    end
  end

end
