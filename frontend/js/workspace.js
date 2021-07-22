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
            workspaces.forEach(function (workspace) {
                workspace.elemID = workspace.name.replace(/\s+/g, '-');
            });
            $("#workgroups").loadTemplate($("#workgroup-template"), workspaces);
            // Traemos los documentos que están almacenados en los workspaces
            workspaces.forEach(function (workspace) {
                // Si hay más de 1 documento, lo cargamos
                if (workspace.documents.length > 0) {
                    workspace.documents.forEach(function (doc){
                        doc.date = jQuery.timeago(doc.created_at);
                    });
                    $("#"+workspace.name.replace(/\s+/g, '-')).loadTemplate($("#document-template"), workspace.documents);
                } else {
                    // Si no hay documentos, cargamos template vacía
                    $("#"+workspace.name.replace(/\s+/g, '-')).loadTemplate($("#empty-template"));
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
});