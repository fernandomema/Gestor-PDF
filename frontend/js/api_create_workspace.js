$(document).ready(function () {
    /* API para crear un worskpace */
    
    $('#create-workspace').click(function (e) { 
        e.preventDefault();
        // ---------------- Variables ----------------------
            var msg_error = $("#error_message"),
              msg_success = $('#success_message'),
          workspace_input = $('#workspace-field').val();

        // Obtenemos de session storage el token guardado
        var token = sessionStorage.getItem('token');

        // URL de la API a utilizar para conectarnos con el Backend
        const URL_API = 'https://insta-pdf.herokuapp.com/api/create-workspace';

        // Creamos el headers
        var Headers = {
            'Authorization': 'Bearer ' + token,
            Accept: 'application/json'
        }
        
        // Preparamos el Data
        var datos = {
            "name": workspace_input
        };

        // AJAX para conectarnos con la API
        $.ajax({
            type: "POST",
            url: URL_API,
            headers: Headers,
            data: datos,
            dataType: 'JSON',
            success: function (response) {
                // Reemplazamos los \n por <br /> para mostrar el mensaje json de una mejor forma
                var structured_message = response.msg.replace(/\\n/g,"<br />");
                switch(response.status){
                    case 'success':
                        msg_success.fadeIn().html(structured_message);
                        msg_error.hide();

                        setTimeout(function() {
                            msg_success.fadeOut("slow");
                        }, 2000 );
                        $('#workspace-field').val('');
                        break;
                    case 'failed':
                        msg_error.fadeIn().html(structured_message); 
                        setTimeout(function() {
                            msg_error.fadeOut("slow");
                        }, 5000 );
                        break;
                    default:
                        break;
                }
            },
            error: function(){
                console.log('ha entrado aqui ERROR');
                msg_error.fadeIn().html('Error');
                setTimeout(function() {
                    msg_error.fadeOut("slow");
                }, 2000 );
            }
        });    
    });
});