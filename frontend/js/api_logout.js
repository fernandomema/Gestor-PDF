$(document).ready(function () {
    // Evento Click del botón enviar formulario
    $('#logout-btn').click(function (e) { 
        e.preventDefault(); 

        // Obtenemos de session storage el token guardado
        var token = sessionStorage.getItem('token');
        console.log(token);

        // URL de la API a utilizar para conectarnos con el Backend
        const URL_API = 'http://127.0.0.1:8000/api/logout';

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
                        console.log(response.msg);
                        sessionStorage.removeItem('token');
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
});