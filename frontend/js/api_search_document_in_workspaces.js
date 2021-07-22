$(document).ready(function () {
    /* API para buscar un documento en todos los worskpaces del usuario actual */
    
    $('#search-bar').keydown(function (e) { 
        // Capturamos qué telca ha sido
        var keyCode= e.which;
        if(keyCode == 13){
            e.preventDefault(); 
            
            // Colocaremos el spinner de loading en la barra de search
            $('#spinner').html('<div class="spinner-border text-purple" role="status"></div>');
            $('.lupa').css({
                'display': 'none'
            })

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
                    // traemos de manera dinámica los workspaces y los insertamos en el DOM
                    workspaces.forEach(function (workspace) {
                        workspace.elemID = workspace.name.replace(/\s+/g, '-');
                        workspace.upload_url = 'upload.html?workspace_id='+workspace.id;
                    });
        
                    // Cargamos la plantilla workgroup template
                    $("#workgroups").loadTemplate($("#workgroup-template"), workspaces);
        
                    
                    // Dentro de cada workspace, subimos cada archivo en ese workspace
                    workspaces.forEach(function (workspace) {
                        if (workspace.documents.length > 0) {
                            workspace.documents.forEach(function (doc) {
                                doc.date = jQuery.timeago(doc.created_at);
                                doc.preview = 'preview.html?id=' + doc.id;
                                doc.sign = 'sign.html?id=' + doc.id;
                            });
                            $("#"+workspace.name.replace(/\s+/g, '-')).loadTemplate($("#document-template"), workspace.documents);
                        } else {
                            $("#"+workspace.name.replace(/\s+/g, '-')).loadTemplate($("#empty-template"), workspace);
                        }
                    });
        
                    // Borramos el botón upload documents a aquellos workspaces donde no haya ningún documento
                    $('.empty').parent().parent().parent().remove();
                    
                    // Si el spinner está girando, lo ocultamos y lo sustituimos por la lupa
                    if($('.lupa').css('display') == 'none'){
                        // Removemos el spinner giratorio
                        $('#spinner').html('');
                        // Volvemos a mostrar el icono de la lupa
                        $('.lupa').css({
                            'display': 'block'
                        })
                    }

                    // Si el número de workspaces es impar, el último div tendrá la clase col-12.
                    if (workspaces.length % 2 == 1) {
                        $("#workgroups > div").last().removeClass("col-lg-6");
                    }
                    registerDeleteButtons();
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