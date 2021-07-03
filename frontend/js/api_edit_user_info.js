$(document).ready(function () {
    /* API para actualizar la información del usuario */
    
    // Evento Click del botón enviar formulario
    $('#submit').click(function (e) { 
        e.preventDefault(); 
        // ---------------- Variables ----------------------
                var username = $('#username-field').val(),
                       email = $('#email-field').val(),
            //     current_pass = $('#password-current-field').val(),
            //         new_pass = $('#password-new-field').val(),
            // confirm_new_pass = $('#password-repeat-field').val(),
                   msg_error = $("#error_message"),
                 msg_success = $('#success_message');
                //  update_password, conectar_api = false;
    
        // Hacemos simples validaciones desde el frontal
        if(username.length == 0 || email.length == 0)    msg_error.show().html("Username field and email field cannot be empty");
        else {
            // Obtenemos de session storage el token guardado
            var token = sessionStorage.getItem('token');
            
            // URL de la API a utilizar para conectarnos con el Backend
            const URL_API = 'http://127.0.0.1:8000/api/edit';
            
            var Data = {
                "name": username,
                "email": email
            }

            console.log(Data);

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
                data: Data,
                crossDomain: true,
                dataType: 'JSON',
                success: function (response) {
                    // Reemplazamos los \n por <br /> para mostrar el mensaje json de una mejor forma
                    var structured_message = response.msg.replace(/\\n/g,"<br />");
                    switch(response.status){
                        case 'success':
                            /* Mostramos la información del usuario en sus respectivos campos del formulario */
                            msg_success.fadeIn().html(structured_message);
                            msg_error.hide();
                            setTimeout(function() {
                                msg_success.fadeOut("slow");
                            }, 2000 );
                            break;
                        case 'failed':
                            msg_error.fadeIn().html(structured_message); 
                            setTimeout(function() {
                                msg_error.fadeOut("slow");
                            }, 2000 );
                            break;
                        default:
                            break;
                    }
                },
                error: function(){
                    msg_error.fadeIn().html('Error'); 
                    setTimeout(function() {
                        msg_error.fadeOut("slow");
                    }, 2000 );
                }
            });    
        }
    });
});