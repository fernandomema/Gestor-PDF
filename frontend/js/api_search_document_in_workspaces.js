$(document).ready(function () {
    /* API para buscar un documento en todos los worskpaces del usuario actual */
    
    $('#search-bar').keydown(function (e) { 
        // Capturamos qué telca ha sido
        var keyCode= e.which;
        if(keyCode == 13){
            e.preventDefault(); 
            // Obtenemos de session storage el token guardado
            var token = sessionStorage.getItem('token');
    
            // URL de la API a utilizar para conectarnos con el Backend
            const URL_API = 'https://insta-pdf.herokuapp.com/api/search-documents';
    
            // Creamos el headers
            var Headers = {
                'Authorization': 'Bearer ' + token,
                Accept: 'application/json'
            }
            
            // Preparamos el Data
            var datos = {
                "name": $('#search-bar').val()
            };
            console.log(datos["name"]);
            // AJAX para conectarnos con la API
            $.ajax({
                type: "GET",
                url: URL_API,
                headers: Headers,
                data: datos,
                dataType: 'JSON',
                success: function (workspaces) {
                    console.log(workspaces);

                    workspaces.forEach(function (workspace){
                        if(workspace.documents.length > 0){
                            workspace.documents.forEach(function (doc) {
                                doc.preview = 'preview.html?id=' + doc.id;
                                doc.sign = 'sign.html?id=' + doc.id;
                            });
                            $("#"+workspace.name.replace(/\s+/g, '-')).loadTemplate($("#document-template"), workspace.documents);
                        }
                    });
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