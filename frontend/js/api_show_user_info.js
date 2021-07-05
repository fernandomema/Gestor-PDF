$(document).ready(function () {
    /* API para traer la información de la base de datos y mostrarla en los campos */
    
    // ---------------- Variables ----------------------
    var username = $('#username-field'),
           email = $('#email-field');

    // Obtenemos de session storage el token guardado
    var token = sessionStorage.getItem('token');

    // URL de la API a utilizar para conectarnos con el Backend
    const URL_API = 'http://127.0.0.1:8000/api/get-data';

    // Creamos el headers
    var Headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type':'application/json'
    }
    
    // AJAX para conectarnos con la API
    $.ajax({
        type: "GET",
        url: URL_API,
        headers: Headers,
        dataType: 'JSON',
        success: function (response) {
            switch(response.status){
                case 'success':
                    /* Mostramos la información del usuario en sus respectivos campos del formulario */
                    username.val(response.msg['username']);
                    email.val(response.msg['email']);
                    /* Guardamos en Session Storage los respectivos valores de username y correo para poder
                    usarlos en el archivo api_edit_user_info.js, y hacer una comparación con los valores que teclea
                    el usuario. De esta manera podremos saber si realmente ha habido un cambio de datos y 
                    hacérselo saber al Laravel. */
                    sessionStorage.setItem('usuario', response.msg['username']);
                    sessionStorage.setItem('correo', response.msg['email']);
                    break;
                case 'failed':
                    console.log(response.msg);
                    break;
                default:
                    break;
            }
        }
    });    
});
