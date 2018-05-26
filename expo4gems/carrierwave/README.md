# Tutorial uso de la gema carrierwave

El siguiente tutoríal le enseñara como usar y configurar la gema carrierwave para poder subir archivos usando una aplicación API de rails. Al final del tutorial tendrá la habilidad de subir y descargar archivos de imagen.

1. Necesitaremos una aplicación de rails configurada para trabajar como API. Clone el repositorio actual con el comando:
```
git clone https://github.com/UNequipoG1/presentacion_carrierwave.git
```
2. Haremos uso de las gemas 'carrierwave' y 'carrierwave-base64'. Abra el archivo ```Gemfile``` y agregue las siguientes lineas al final:
```
gem 'carrierwave'
gem 'carrierwave-base64'
```
3. Corra el comando ```bundle install --without production``` para instalar las gemas.
4. Crearemos un modelo y controlador que guardara la ruta de la imagen que subiremos. Corra el comando ```rails g scaffold Item picture:string```.
    + Si se queda atorado en el comando, cancelelo con 'CTRL+Z' y borre la carpeta 'bin' en el directorio del proyecto, luego corra el comando 'rake app:update:bin' y luego genere el scaffold nuevamente.
5. Corra el comando ```rails db:migrate```.
6. Vamos a generar un uploader de carrierwave para manejar la subida de archivos. Corra el comando ```rails g uploader Picture```.
7. Si abre el archivo 'app/uploader/picture_uploader.rb' podrá ver las diferentes opciones del uploader. Para permitir la subida de imágenes descomente o agregue las siguientes lineas:
```
def extension_white_list
    %w(jpg jpeg gif png)
end
```
8. Debemos montar el uploader a la columna picture del modelo para que este sea usado. Abra el archivo 'app/models/item.rb' y modifíquelo de esta manera:
```
class Item < ApplicationRecord
    mount_base64_uploader :picture, PictureUploader
end
```
9. Para poder descargar los archivos modificaremos el controlador de Item. Abra el archivo 'app/controllers/item_controller.rb' y modifique el método show de la esta manera:
```
def show
    send_file "#{Rails.root}/public/#{@item.picture.url}" 
end
```
Y listo ya puede correr ```rails s``` para probar, debido a que los archivos se deben enviar codificados en Base64, la mejor forma para probar el funcionamiento sera usando Postman, simplemente cree una petición POST a ```http://localhost:3000/items``` con el cuerpo siendo en formato json de la siguiente manera:
```
{ "item": { "picture": <imagen codificada en base64>}}
```
Puede usar una pagina como https://www.base64-image.de/ para codificar imágenes a Base64. 

Para descargar la imagen pude hacer una petición GET a ```http://localhost:3000/items/[id]``` en Postman, o acceder directamente a esa dirección en el navegador.