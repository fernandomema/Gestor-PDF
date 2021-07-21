$(document).ready(function () {
    /* API para buscar un documento en todos los worskpaces del usuario actual */
    
    $('#search-bar').keyup(function (e) { 
       
        if(e.keyCode == 13){
            // Obtenemos de session storage el token guardado
            var token = sessionStorage.getItem('token');
    
            // URL de la API a utilizar para conectarnos con el Backend
            const URL_API = 'https://insta-pdf.herokuapp.com/api/documents/search';
    
            // Creamos el headers
            var Headers = {
                'Authorization': 'Bearer ' + token,
                Accept: 'application/json'
            }
            
            // Preparamos el Data
            var datos = {
                "name": $('#search-bar').val()
            };
    
            // AJAX para conectarnos con la API
            $.ajax({
                type: "GET",
                url: URL_API,
                headers: Headers,
                data: datos,
                dataType: 'JSON',
                success: function (workspaces) {
                    console.log(workspaces);
                },
                error: function(response){
                    console.log(response);
                    if (response.message == 'Unauthenticated' || response.status == 401) {
                        window.location.href = "login.html";
                    }
                }
            });    
        }
    });
});