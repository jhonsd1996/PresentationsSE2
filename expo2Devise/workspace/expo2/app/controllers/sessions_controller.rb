class SessionsController < ApplicationController
    
    def create
        user = User.where(email: params[:email]).first
        
        if user.vakud_password?(params[:password])
            render json: user.as_json(only: [:email]), status:ok
        else
            head(:unathorized)
        end
    end
    def destroy
       
    end

end
