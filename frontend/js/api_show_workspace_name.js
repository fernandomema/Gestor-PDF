$(document).ready(function () {
    /* API para mostrar info del worskpace seleccionado */
    
    // Obtenemos el id del link para mostrar el nombre correspondiente del Workspace
    var url = new URL(window.location.href);
    var search_params = url.searchParams;
    var id = search_params.get('id');
    // guardamos el id original para prevenir que el usuario quiera modificar el id desde la url
    sessionStorage.setItem('id', id);

    // ---------------- Variables ----------------------
     var msg_error = $("#error_message"),
    workspace_name = $('#name-field');
    
    // Obtenemos de session storage el token guardado
    var token = sessionStorage.getItem('token');
        
    // URL de la API a utilizar para conectarnos con el Backend
    const URL_API = 'https://insta-pdf.herokuapp.com/api/edit-workspace';
    
    // Creamos el headers
    var Headers = {
        'Authorization': 'Bearer ' + token,
        Accept: 'application/json'
    }
    
    // Preparamos el Data
    var datos = {
        "id": sessionStorage.getItem('id')
    };

    // AJAX para conectarnos con la API
    $.ajax({
        type: "GET",
        url: URL_API,
        headers: Headers,
        data: datos,
        dataType: 'JSON',
        success: function (response) {
            switch(response.status){
                case 'success':
                    /* Mostramos el nombre del workspace en su respectivo campo */
                    workspace_name.val(response.msg['workspace_name']);
                    break;
                case 'failed':
                    // Reemplazamos los \n por <br /> para mostrar el mensaje json de una mejor forma
                    var structured_message = response.msg.replace(/\\n/g,"<br />");
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