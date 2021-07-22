FilePond.registerPlugin(FilePondPluginFileValidateType);
var pond = FilePond.create(document.querySelector('.filepond'), {
    acceptedFileTypes: ['application/pdf'],
    allowMultiple: true,
    instantUpload: false,
    allowProcess: false,
    dropOnPage: true,
    dropOnElement: false
});


// Obtenemos el id del link para mostrar el nombre correspondiente del Workspace en el select option
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

var workspace_id = findGetParameter('workspace_id');

$("form").submit(function (e) {
    e.preventDefault();
    var formdata = new FormData(this);
    // append FilePond files into the form data
    pondFiles = pond.getFiles();
    for (var i = 0; i < pondFiles.length; i++) {
        // append the blob file
        formdata.append('pdf[]', pondFiles[i].file);
    }
    formdata.append('workspace', document.querySelector('[name="workspace"]').value);

    $.ajax({
        url: "https://insta-pdf.herokuapp.com/api/documents/upload",
        data: formdata,
        dataType: 'JSON',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
        processData: false,
        contentType: false,
        method: "post"
    }).done(function (response) {
        window.location.href="workspace.html?id="+document.querySelector('[name="workspace"]').value;
    });

});

$('#upload-image').on('click', function () {
    $('.filepond--label-action').click();
})

// Código para enviar a la vista upload.html segun el id del workspace

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
                // Mostraremos como selected aquel id que el usuario envíe
                if(workspace.id == workspace_id){
                    $("[name=workspace]").append(new Option(workspace.name, workspace.id, false, true));
                } else {
                    $("[name=workspace]").append(new Option(workspace.name, workspace.id));
                }
            });
            //$("[name=workspace]").first().select();
        },
        error: function(response){
            console.log(response);
            if (response.message == 'Unauthenticated' || response.status == 401) {
                window.location.href = "login.html";
            }
        }
    });
});
