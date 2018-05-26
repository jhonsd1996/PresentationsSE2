Rails.application.routes.draw do
  resources :posts
  get "pdfs/show", to:  "pdfs#show"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
