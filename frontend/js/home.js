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
            $("#workgroups").loadTemplate($("#workgroup-template"), workspaces);
            workspaces.forEach(function (workspace) {
                $("#"+workspace.name).loadTemplate($("#document-template"), workspace.documents);
            });
            // documents.forEach(function (document) {
            //     $("#document-container").loadTemplate($("#document-template"), {
            //         title: document.name,
            //     });
            // })            
        },
        error: function(response){
            console.log(response);
            if (response.message == 'Unauthenticated' || response.status == 401) {
                window.location.href = "login.html";
            }
        }
    });
});