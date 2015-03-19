class CustomFailure < Devise::FailureApp
  def redirect_url
     if warden_message == :timeout
      flash[:timedout] = true
      path = if request.get?
              attempted_path
             else
              request.referrer
             end
      path || scope_url
     else
      scope_url
     end
  end

  # You need to override respond to eliminate recall
  def respond
    if http_auth?
      http_auth
    elsif warden_options[:recall]
     recall
    else
      redirect
    end
  end
end 
