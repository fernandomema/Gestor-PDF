$(document).ready(function () {
    // AJAX para conectarnos con la API
    $.ajax({
        type: "GET",
        url: "https://insta-pdf.herokuapp.com/api/workspaces/" + findGetParameter('id'),
        headers: {
            'Accept': 'application/json',
            'Authorization':'Bearer '+sessionStorage.getItem('token')
        },
        dataType: 'JSON',
        success: function (data) {
            // Ponemos como rol debajo del avatar: Manager of 'nombreWorkspace'
            $('#role').text('Manager of '+data.workspace.name);

            // Traemos en el select del modal 'create document' el nombre del workspace actual
            $("[name=workspace]").append(new Option(data.workspace.name, data.workspace.id));

            // Reemplazamos aquellos nombres de workspaces que tengan espacios por '-'
            data.workspace.elemID = data.workspace.name.replace(/\s+/g, '-');
            
            // Cargamos el workspace en la template
            $("#workgroups").loadTemplate($("#workgroup-template"), data.workspace);
            
            // Si el workspace tiene al menos 1 documento...
            if (data.workspace.documents.length > 0) {
                // Por cada documento, recorremos y le asignamos sus rutas...
                data.workspace.documents.forEach(function(doc) {
                    doc.preview = 'preview.html?id=' + doc.id;
                    doc.sign = 'sign.html?id=' + doc.id;
                    doc.print = 'preview.html?id=' + doc.id + '&print=true';
                    doc.css_edit = doc.type == 'document' ? 'display:none;' : 'display:block;';
                    doc.date = jQuery.timeago(doc.created_at);
                });
                // Y cargamos la plantilla
                $("#"+data.workspace.name.replace(/\s+/g, '-')).loadTemplate($("#document-template"), data.workspace.documents);
            } else {    
                // Si el workspace no tiene documentos, cargamos una plantilla vacía
                $("#"+data.workspace.name.replace(/\s+/g, '-')).loadTemplate($("#empty-template"), data.workspace);
            }          
        },
        error: function(response){
            // Si hay error de autenticación, redigirimos al login.html
            if (response.message == 'Unauthenticated' || response.status == 401) {
                window.location.href = "login.html";
            }
        }
    });
});