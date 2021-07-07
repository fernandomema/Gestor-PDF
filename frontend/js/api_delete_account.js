$(document).ready(function () {
    // Evento Click del botón enviar formulario
    $('#btn-delete-account').click(function (e) { 
        e.preventDefault(); 

        // Obtenemos de session storage el token guardado
        var token = sessionStorage.getItem('token');

        // URL de la API a utilizar para conectarnos con el Backend
        const URL_API = 'https://insta-pdf.herokuapp.com/api/delete-account';

        // Creamos el headers
        var Headers = {
            'Authorization': 'Bearer ' + token,
            'Content-Type':'application/json'
        }
        
        // AJAX para conectarnos con la API
        $.ajax({
            type: "POST",
            url: URL_API,
            headers: Headers,
            dataType: 'JSON',
            success: function (response) {
                switch(response.status){
                    case 'success':
                        /* Eliminamos el token del session storage y redirigimos al usuario a la página de Login */
                        sessionStorage.removeItem('token');
                        // Eliminamos del session storage el usuario y el correo
                        sessionStorage.removeItem('usuario');
                        sessionStorage.removeItem('correo');
                        window.location.href = 'https://localhost/Gestor_PDF_Frontend/frontend/pages/login.html';
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