$(document).ready(function () {
    /* API para actualizar la información del usuario */
    
    // Evento Click del botón enviar formulario
    $('#submit').click(function (e) { 
        e.preventDefault(); 
        // ---------------- Variables ----------------------
                var username = $('#username-field').val(),
                       email = $('#email-field').val(),
                current_pass = $('#password-current-field').val(),
                    new_pass = $('#password-new-field').val(),
            confirm_new_pass = $('#password-repeat-field').val(),
                   msg_error = $("#error_message"),
                 msg_success = $('#success_message');
        // -------------------------------------------------
        var usernamed_changed, email_changed = false,
        update_password = false,
        //  Recuperamos de Session storage el valor de los campos usuario y correo para hacer la comparación
        username_initial_value = sessionStorage.getItem('usuario');
        email_initial_value = sessionStorage.getItem('correo');

        // Hacemos simples validaciones desde el frontal
        if(username.length == 0 || email.length == 0)    msg_error.show().html("Username field and email field cannot be empty");
        else {
            // Antes de proceder a conectarnos con la API, verificamos si el usuario ha hechos cambios en username
            if(username.localeCompare(username_initial_value) === 0)          usernamed_changed = false;
            else                                                              usernamed_changed = true;

            // Verificamos si el usuario ha hechos cambios en email
            if(email.localeCompare(email_initial_value) === 0)                email_changed = false;
            else                                                              email_changed = true;

            /* Verificamos si el usuario ha escrito algo en alguno de los campos de la contraseña, si es así, da a
            entender que quiere modificar su contraseña. */
            if(current_pass.length != 0 || new_pass.length != 0 || confirm_new_pass != 0)   update_password = true;
            else                                                                            update_password = false;
            
            // Obtenemos de session storage el token guardado
            var token = sessionStorage.getItem('token');
            
            // URL de la API a utilizar para conectarnos con el Backend
            const URL_API = 'https://insta-pdf.herokuapp.com/api/edit';
            
            // Creamos el headers
            var Headers = {
                'Authorization': 'Bearer ' + token,
                 Accept: 'application/json'
            };

            // Preparamos la información a enviar
            if(!update_password){       // Si el usuario solamente quiere cambiar el nombre o el correo, entonces...
                var Data = {
                    "name_changed": usernamed_changed,
                    "email_changed": email_changed,
                    "update_pass": update_password,
                    "name": username,
                    "email": email
                };
            } else {                    // Si el usuario quiere cambiar su contraseña, entonces...
                var Data = {
                    "name_changed": usernamed_changed,
                    "email_changed": email_changed,
                    "update_pass": update_password,
                    "name": username,
                    "email": email,
                    "current_password": current_pass,
                    "new_password": new_pass,
                    "confirm_new_password": confirm_new_pass
                };
            }
            
            // AJAX para conectarnos con la API
            $.ajax({
                type: "POST",
                url: URL_API,
                headers: Headers,
                data: Data,
                dataType: 'JSON',
                success: function (response) {
                    // Reemplazamos los \n por <br /> para mostrar el mensaje json de una mejor forma
                    var structured_message = response.msg.replace(/\\n/g,"<br />");
                    // usernamed_changed = false;
                    switch(response.status){
                        case 'success':
                            /* Mostramos la información del usuario en sus respectivos campos del formulario */
                            msg_success.fadeIn().html(structured_message);
                            msg_error.hide();
                            setTimeout(function() {
                                msg_success.fadeOut("slow");
                            }, 3000 );
                            // Limpiamos los campos de las contraseñas si ha sido exitoso el guardado de cambios
                            $('#password-current-field').val('');
                            $('#password-new-field').val('');
                            $('#password-repeat-field').val('');

                            // Procedemos a modificar el nombre de usuario en session storage y en la página de settings
                            if(usernamed_changed){
                                var name = username;
                                sessionStorage.setItem('usuario', name);
                                var name_first_letter_capitalized = name.charAt(0).toUpperCase() + name.slice(1);
                                $('.username').text('Welcome ' + name_first_letter_capitalized);
                                $('.username-menu').text(name_first_letter_capitalized);
                            }
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
                    msg_error.fadeIn().html('Error');
                    setTimeout(function() {
                        msg_error.fadeOut("slow");
                    }, 2000 );
                }
            });    
        }
    });
});