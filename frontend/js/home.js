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
            workspaces.forEach(function (workspace) {
                if (workspace.documents.length > 0) {
                    $("#"+workspace.name.replace(/\s+/g, '-')).loadTemplate($("#document-template"), workspace.documents);
                } else {
                    $("#"+workspace.name.replace(/\s+/g, '-')).loadTemplate($("#empty-template"));
                }
            });
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