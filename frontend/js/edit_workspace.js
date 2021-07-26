$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "https://insta-pdf.herokuapp.com/api/workspaces/" + findGetParameter('id'),
        headers: {
            'Accept': 'application/json',
            'Authorization':'Bearer '+sessionStorage.getItem('token')
        },
        dataType: 'JSON',
        success: function (data) {
            var users = [];
            data.workspace.users.forEach(function (user) {
                users.push({
                    username: user.username,
                    avatar: jsGravatar({ email: user.email, defaultImage: 'blank' })
                });
            });
                        
            // Cargamos la plantilla workgroup template
            $(".form-selectgroup").loadTemplate($("#user-template"), users);
        },
        error: function(response){
            console.log(response);
            if (response.message == 'Unauthenticated' || response.status == 401) {
                window.location.href = "login.html";
            }
        }
    });
});