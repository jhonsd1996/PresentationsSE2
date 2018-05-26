# Tutorial uso de la gema omniauth

El siguiente tutoríal le enseñara como usar y configurar la gema omniauth para implementar un inicio de sesión por medio de github.

* Para crear una aplicación que se comunique con github primero sera necesario crear una aplicación OAuth de github: 
    1. Logeese en github y diragase a la pagina https://github.com/settings/developers. Seleccione el botón que dice 'Register a new application'
    2. En el campo 'Application name' puede poner cualquier nombre que desee y en 'Homepage URL' puede poner 'http://localhost:3000/'
    3. En el campo 'Authorization callback URL' debe poner 'http://localhost:3000/auth/github/callback'
        + En caso de que este trabajando en cloud9 debera poner la url de preview de cloud9, y quedara con el siguiente formato: 'https://[nombre_workspace]-[nombre-usuario].c9users.io/auth/github/callback'
    4. Acepte con el botón 'Register application'
    5. La siguiente pantalla le mostrara diferente información sobre la aplicación, tenga en cuenta los campos Client ID y Client Secret que serán usados mas tarde.
#### Una vez se tenga configurada la aplicación de github procederemos a trabajar en rails:
1. Clone el repositorio actual con el comando:
```
git clone https://github.com/UNequipoG1/presentacion_omniauth.git
```
2. Diríjase al archivo 'Gemfile' y agregue la siguiente linea al final:
```
gem 'omniauth-github'
```
3. Ejecute ```bundle install``` para instalar la gema.
4. Se deberá crear el inicializador de omniauth, para ello cree un nuevo archivo llamado ```omniauth.rb``` en la carpeta 'config/initializers' y agregue las siguientes lineas:
```
opts = { scope: 'user:email' }
Rails.application.config.middleware.use OmniAuth::Builder do
    provider :github, Rails.application.secrets.github_client_id, Rails.application.secrets.github_client_secret, opts
end
```
5. Se deberá agregar la información obtenida anteriormente de la aplicación de github para que sea posible comunicarnos con ella, abra el archivo ```config/secrets.yml``` y cámbielo de la siguiente forma:
```
development:
    secret_key_base: e839e2cc3c9e9977b5765bd3dfcabcc944c33a4d5776a58d32b2150e760b22a9649eeba7dd25e7aff50d76218b66bb48e98823e66b6732e0f6546caf34bec27a
    github_client_id: [Su Client ID]
    github_client_secret: [Su Client Secret]

test:
    secret_key_base: 8773c1ca845f1512dcbb6fdc2956eb1b87b053c563a3279dfaf74e82ed1cd481ee3949cbd4f1ebda087fffa4fafa98315507f1e4dfb9b1619d30fd52cf8a7e3c

# Do not keep production secrets in the repository,
# instead read values from the environment.
production:
    secret_key_base: <%= ENV["SECRET_KEY_BASE"] %>
```
6. Vamos a crear un modelo User en donde se guardara la información obtenida de la cuenta de github. Corra los siguientes comandos:
```
rails g model User username avatar_url email uid provider oauth_token
rails db:migrate
```
7. También crearemos un controlador de manejo de sesiones, es posible usar otra gema para este fin, como devise, pero para simplificar el tutorial lo haremos manualmente. Corra el siguiente comando:
```
rails g controller sessions new create destroy
```
8. La rutas deberán ser modificadas para que manejen la identificación de usuario correctamente. Abra el archivo ```config/routes.rb``` y modifíquelo de la siguiente manera:
```
Rails.application.routes.draw do
  get "/auth/:provider/callback", to: "sessions#create"
  get 'auth/failure', to: redirect('/')
  delete 'signout', to: 'sessions#destroy', as: 'signout'
  root to: 'sessions#new'
end
```
9. Le agregaremos código al modelo User para extraer la información obtenida al logearse a github. Abra el archivo ```app/models/user.rb``` y modifíquelo de la siguiente manera:
```
class User < ActiveRecord::Base
  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_initialize.tap do |user|
      user.email = auth.info.email
      user.uid = auth.uid
      user.provider = auth.provider
      user.avatar_url = auth.info.image
      user.username = auth.info.name
      user.oauth_token = auth.credentials.token
      user.save!
    end
  end
end
```
10. Configuraremos el controlador Sessions para manejar las sesiones. Abra el archivo ```app/controllers/sessions_controller.rb``` y modifíquelo de la siguiente manera:
```
class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.from_omniauth(request.env["omniauth.auth"])

    if user.valid?
      session[:user_id] = user.id
      redirect_to request.env['omniauth.origin']
    end
  end

  def destroy
    reset_session
    redirect_to request.referer
  end
end
```
11. Agregaremos un método helper al controlador de la aplicación para poder referirnos al usuario logeado actualmente. Abra el archivo ```app/controllers/application_controller.rb``` y modifíquelo de la siguiente manera:
```
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_user

  def current_user
    session[:user_id].nil? ? nil : User.find(session[:user_id])
  end
end
```
12. Por ultimo modificaremos la vista de inicio para mostrar el inicio de sesión usando github. Abra el archivo ```app/views/sessions/new.html.erb``` y modifíquelo de la siguiente manera:
```
<% if current_user.blank? %>
  <h1>Please Sign In</h1>
  <%= link_to 'Sign In with Github', '/auth/github' %>
<% else %>
  <p>
    You are signed in as <%= current_user.username %>.  Click the button below to sign out.
  </p>

  <%= button_to "Sign Out", signout_path, method: :delete %>
<% end %>
```
Puede probar el funcionamiento correcto al correr el comando ```rails server``` y dirigirse a 'http://localhost:3000/'. Se encontrara la opción para logearse usando github.
