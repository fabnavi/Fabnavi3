Rails.application.config.middleware.use OmniAuth::Builder do
  provider :persona
end

