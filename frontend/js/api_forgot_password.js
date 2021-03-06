$(document).ready(function () {
    // Evento Click del botón enviar formulario
    $('#submit').click(function (e) { 
        e.preventDefault(); 
        // ---------------- Variables ----------------------
                var email = $('#email-field').val(),
                msg_error = $("#error_message"),
              msg_success = $('#success_message'),
          boton_container = $('.btn-container'),
                  spinner = $('#spinner-circulando');
        
        // Conexión con la API
        if(email.length == 0)    msg_error.show().html("This field is required");  
        else{
            // Inmediatamente que se presiona el botón, cambiamos el texto por un spinner giratorio,
            spinner.html('<button class="submit-btn" type="button" disabled><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...</button>');
            boton_container.hide();

            // URL de la API a utilizar para conectarnos con el Backend
            const URL_API = 'https://insta-pdf.herokuapp.com/api/forgot-password';

            // Creamos el arreglo data (los datos a enviar)
            var Data = {
                "email": email
            };

            // AJAX para conectarnos con la API
            $.ajax({
                type: "POST",
                url: URL_API,
                data: Data,
                dataType: 'JSON',
                success: function (response) {
                    boton_container.show();
                    spinner.html('');
                    // Reemplazamos los \n por <br /> para mostrar el mensaje json de una mejor forma
                    var structured_message = response.msg.replace(/\\n/g,"<br />");
                    switch(response.status){
                        case 'success':
                            msg_success.fadeIn().html(structured_message);
                            msg_error.hide();
                            setTimeout(function() {
                                msg_success.fadeOut("slow");
                            }, 2000 );
                            $('#email-field').val('');
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
                    boton_container.show();
                    spinner.html('');
                    msg_error.fadeIn().html("Error"); 
                    setTimeout(function() {
                        msg_error.fadeOut("slow");
                    }, 2000 );
                }
            });
        }
    });
});