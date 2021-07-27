$(document).ready(function () {
    /* API para editar un worskpace */
    
    $('#save-changes').click(function (e) { 
        e.preventDefault();
        // ---------------- Variables ----------------------
            var msg_error = $("#error_message"),
              msg_success = $('#success_message'),
           workspace_name = $('#name-field').val(),
            workspaceName_changed = false;

        // Recuperamos del Session Storage el nombre del workspace para testear si ha habido algún cambio
        workspace_name_initial_value = sessionStorage.getItem('workspace_name');

        // Comparamos si el usuario realmente ha hecho alguna modificación en el nombre del workspace
        if(workspace_name.localeCompare(workspace_name_initial_value) === 0)    workspaceName_changed = false;
        else        workspaceName_changed = true;

        // Obtenemos de session storage el token guardado
        var token = sessionStorage.getItem('token');

        // URL de la API a utilizar para conectarnos con el Backend
        const URL_API = 'https://insta-pdf.herokuapp.com/api/update-workspace';

        // Creamos el headers
        var Headers = {
            'Authorization': 'Bearer ' + token,
            Accept: 'application/json'
        }
        
        // Preparamos el Data
        var datos = {
            "id": sessionStorage.getItem('id'),
            "name": workspace_name,
            "name_changed": workspaceName_changed
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
                            window.location.href = 'workspaces.html';
                        }, 2000 );
                        $('#name-field').val('');
                        sessionStorage.removeItem('workspace_name')
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
    });
});