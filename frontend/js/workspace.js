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
            console.log(data);
            data.workspace.elemID = data.workspace.name.replace(/\s+/g, '-');
            $("#workgroups").loadTemplate($("#workgroup-template"), data.workspace);
            if (data.workspace.documents.length > 0) {
                $("#"+data.workspace.name.replace(/\s+/g, '-')).loadTemplate($("#document-template"), data.workspace.documents);
            } else {
                $("#"+data.workspace.name.replace(/\s+/g, '-')).loadTemplate($("#empty-template"));
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