
# Tutorial uso de la gema will_paginate

El siguiente tutoríal le enseñara como usar y configurar la gema will_paginate para hacer queries a modelos de forma paginada.
1. Necesitaremos una aplicación de rails configurada para trabajar como API. Clone el repositorio actual con el comando:
```
git clone https://github.com/UNequipoG1/presentacion_will_paginate.git
```
2. Haremos uso de la gema 'will_paginate'. Abra el archivo ```Gemfile``` y agregue la siguiente linea al final:
```
gem 'will_paginate'
```
3. Corra el comando ```bundle install --without production``` para instalar las gemas.
4. Crearemos un modelo y controlador para probar el funcionamiento de la gema. Corra el comando  ```rails g scaffold Post title content``` .
	+ Si se queda atorado en el comando, cancelelo con 'CTRL+Z' y borre la carpeta 'bin' en el directorio del proyecto, luego corra el comando 'rake app:update:bin' y luego genere el scaffold nuevamente.
5. Corra el comando ```rails db:migrate```.
6. Crearemos el query paginado en el modelo de Post. Abra el archivo 'app/models/post.rb' y modifíquelo de esta manera:
```
class Post < ApplicationRecord
    self.per_page = 10
    
    def self.paged(page)
        paged_posts = Post.page(page)
        if paged_posts.current_page > paged_posts.total_pages
            paged_posts = Post.page(paged_posts.total_pages)
        end
        {posts: paged_posts,
         current_page: paged_posts.current_page,
         total_pages: paged_posts.total_pages}
    end
end
```
7. Para obtener los posts de forma paginada simplemente debe modificar el archivo 'app/controllers/posts_controller.rb' de la siguiente manera:
```
  def index
    @posts = Post.paged(params[:page])

    render json: @posts
  end
```
8. Antes de probar el funcionamiento debemos poblar la base de datos. Abra el archivo 'db/seeds.rb' y agregue las siguientes lineas al final:
```
40.times do 
    Post.create(title: 'TitleTest', content: 'ContentTest')
end
```
Luego corra el comando ```rails db:seed```.

9. Para probar el funcionamiento correcto simplemente debemos correr el comando ```rails s``` y dirigirnos a ```http://localhost:3000/posts?page=n``` en donde n es el numero de pagina que deseamos.
10. Si esta usado cloud9 debe correr el comando ```rails s -b 0.0.0.0``` y dirigirse a una pagina que tendrá el formato ```https://[nombre_workspace]-[nombre_usuario].c9users.io/posts?page=n```
