# Tutorial uso de la gema  wicked_pdf
La gema de ruby **wicked_pdf** permite la creación automática de archivos pdf para Ruby on Rails, este tutorial presenta la forma más básica para implementarla en aplicaciones tipo API.
## Implementación básica
1. Primero necesitamos el esqueleto de una aplicación de rails configurada para trabajar como API. Clone el repositorio actual con el comando:
```
git clone https://github.com/UNequipoG1/presentacion_wicked_pdf.git
```
>Esta aplicación tiene un modelo (*Post*) ya creado que utilizaremos más adelante. Por ahora debemos hacer un *rails db:migrate*.
>Para poder ingesar datos al modelo *Post* podemos usar CURL de la siguente forma:
```bash
curl -X POST -i 'http://0.0.0.0:3000/posts' -d "post[name]=Este es un post" -d "post[content]=Este es el contenido del post"
```
 2. Ahora instalaremos la gema **wicked_pdf** para poder trabajar puesto que **wicked_pdf** es un *wrapper* de la gema **wkhtmltopdf-binary**  tambien debemos instalarla:
 > En el archivo GemFile añadimos las siguientes líneas:
  ```
 gem 'wicked_pdf'
 gem 'wkhtmltopdf-binary'
 ```
 >Luego ejecutamos el comando:
   ```
 bundle install
 ```
 >Tambien ejecutamos ```rails db:migrate``` para hacer la migracion del modelo Post que esta en el esqueleto.
 3. Ahora creamos un inicializador para *wicked_pdf* con el comando:
```
rails generate wicked_pdf
```
 4. El inicializador crea el archivo '/config/initializers/wicked_pdf.rb' Dentro de ese archivo veremos la línea *exe_path: '/usr/local/bin/wkhtmltopdf',* comentada, para poder ver donde está la herramienta *wkhtmltopdf* en nuestro equipo ejecutamos el siguiente comando, descomentamos la línea y remplazamos el *path*.
 ```
 which wkhtmltopdf
```
5. Ahora crearemos un controlador para los pdfs con el comando:
```
rails generate controller Pdfs
``` 
6. Escribimos el siguiente código en el archivo '/app/controllers/pdfs_controller.rb':
```ruby
class  PdfsController  <  ActionController::Base
	def  show
		respond_to do |format|
			format.pdf do
				render pdf: "template", template: "../views/pdfs/template"  
			end

		end

	end
end
```
>Donde:
>- *template:* es la dirección del archivo html a convertir
>-  Usamos *ActionController::Base* y no *ApplicationController* pues **wicked_pdf** no genera bien los archivos pdf para aplicaciones tipo API es decir aplicaciones con *ActionController::API*.
7. Para poder ver que está funcionando con el *tempalte* básico que tenemos, añademos la ruta al archivo *routes.rb* con la línea:
```
get "pdfs/show", to:  "pdfs#show"
```
> En la ruta *http://0.0.0.0:3000/pdfs/show.pdf* podemos ver un pdf básico que muestra un *Hola mundo*

## Mejorando el template
Ahora vamos a hacer un template más relevante, en este ejemplo mostraremos la informacion de todos los *Posts* del modelo *Post*
1. En el controlador *pdfs_controller* añadimos el metodo *get_model* para poder tener referencia a todos los *Posts*:
```ruby
def get_model
	@posts = Post.all
end
```
> Tambien añadimos el llamado a *get_model* dentro de *show*
2. Añadimos las siguientes líneas al template en el archivo '/app/views/pdfs/template.pdf.erb':
```
<h1>Posts</h1>
  <table>
    <th>Id</th>
    <th>Nombre</th>
    <th>Content</th>
    <% @posts.each do |post| %>
      <tr>
          <td><%= post.id %></td>
          <td><%= post.name %></td>
          <td><%= post.content %></td>
      </tr>
    <% end %>
  </table>
```
