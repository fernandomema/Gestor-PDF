$(document).ready(function () {
    // AJAX para conectarnos con la API
    $.ajax({
        type: "GET",
        url: "https://insta-pdf.herokuapp.com/api/workspaces",
        headers: {
            'Accept': 'application/json',
            'Authorization':'Bearer '+sessionStorage.getItem('token')
        },
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
                    $("#"+workspace.name.replace(/\s+/g, '-')).loadTemplate($("#document-template"), workspace.documents);
                } else {
                    $("#"+workspace.name.replace(/\s+/g, '-')).loadTemplate($("#empty-template"), workspace);
                    // Ocultamos botón de subir documento si no hay pdfs en el workspace
                    $('#btn-upload').css({
                        'display': 'none'
                    })
                }
            });
            // Si el número de workspaces es impar, el último div tendrá la clase col-12.
            if (workspaces.length % 2 == 1) {
                $("#workgroups > div").last().removeClass("col-lg-6");
            }
        },
        error: function(response){
            console.log(response);
            if (response.message == 'Unauthenticated' || response.status == 401) {
                window.location.href = "login.html";
            }
        }
    });
});