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

    $('#adduser-button').on('click', function() {
        $.ajax({
            type: "GET",
            url: "https://insta-pdf.herokuapp.com/api/workspaces/" + findGetParameter('id') + '/join/' + $('input[name=user]').val,
            headers: {
                'Accept': 'application/json',
                'Authorization':'Bearer '+sessionStorage.getItem('token')
            },
            dataType: 'JSON',
            success: function (data) {
                console.log(data);

            },
            error: function(response){
                console.log(response);
                if (response.message == 'Unauthenticated' || response.status == 401) {
                    window.location.href = "login.html";
                }
            }
        });
    })

    $('#modal-alert').iziModal({
        headerColor: '#7cd438', 
        width: 400,
        timeout: 10000, 
        pauseOnHover: true,
        timeoutProgressbar: true,
        attached: 'bottom' 
    });
});