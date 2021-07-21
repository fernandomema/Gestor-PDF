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
                    workspace.documents.forEach(function (doc) {
                        doc.preview = 'preview.html?id=' + doc.id;
                        doc.sign = 'sign.html?id=' + doc.id;
                    });
                    $("#"+workspace.name.replace(/\s+/g, '-')).loadTemplate($("#document-template"), workspace.documents);
                } else {
                    $("#"+workspace.name.replace(/\s+/g, '-')).loadTemplate($("#empty-template"), workspace);
                }
            });

            // Borramos el botón upload documents a aquellos workspaces donde no haya ningún documento
            $('.empty').parent().parent().find('.btn-upload').remove();

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
});

function registerDeleteButtons() {
    $('.delete-doc-btn').on('click', function() {
        $(this).parent().parent().find('svg')[0].outerHTML = '<div class="spinner-border text-purple" role="status"></div>';
        $.ajax({
            type: "GET",
            url: "https://insta-pdf.herokuapp.com/api/documents/" + this.getAttribute('doc-id') + "/delete",
            headers: {
                'Accept': 'application/json',
                'Authorization':'Bearer '+sessionStorage.getItem('token')
            },
            dataType: 'JSON',
            success: function (data) {
                if (data.status == 'success') {
                    $(this).parent().parent().parent().parent().parent().remove();
                } else {
                    console.log(data);
                }
            }.bind(this),
            error: function(response){
                console.log(response);
                if (response.message == 'Unauthenticated' || response.status == 401) {
                    window.location.href = "login.html";
                }
            }
        });
    });
}