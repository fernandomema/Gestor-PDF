$(document).ready(function () {
    var xhrOverride = new XMLHttpRequest();
    xhrOverride.responseType = 'arraybuffer';

    $.ajax({
        type: "GET",
        url: 'https://insta-pdf.herokuapp.com/api/documents/' + findGetParameter('id') + '/file',
        xhr: function() {
            return xhrOverride;
        },
        headers: {
            'Accept': 'application/json',
            'Authorization':'Bearer '+sessionStorage.getItem('token')
        },
        success: function(data) {
            var blob = new Blob([data], {
                type: 'application/pdf'
            });
            document.querySelector('iframe').src = window.URL.createObjectURL(blob);
            if (findGetParameter('print') != null) {
                setTimeout(function() {
                    document.querySelector('iframe').contentWindow.print();
                }, 750);
            }
        },
        error: function(response){
            console.log(response);
            if (response.message == 'Unauthenticated' || response.status == 401) {
                //window.location.href = "login.html";
                console.log('unauthenticated');
            }
        }
    });
    $("#sign-form").submit(function(e) {
        e.preventDefault();
        var formData = new FormData(this);  
        formData.append('pfx', document.querySelector('input[type=file]').files[0], 'cert.pfx');
        window.test = formData;
        $.ajax({
            type: "POST",
            url: 'https://insta-pdf.herokuapp.com/api/documents/' + findGetParameter('id') + '/sign',
            headers: {
                'Accept': 'application/json',
                'Authorization':'Bearer '+sessionStorage.getItem('token')
            },
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'JSON',
            success: function (data) {
                if (data.status == 'failed') {
                    return $('#modal-alert').iziModal('open');
                }
                if (data.status == 'success') {
                    window.location.href = 'preview.html?id=' + data.document;
                }
                console.log(data);
            },
            error: function(response){
                console.log(response);
                if (response.message == 'Unauthenticated' || response.status == 401) {
                    window.location.href = "login.html";
                }
            }
        });
        return false;
    });

    $('#modal-alert').iziModal({
        headerColor: '#d43838', 
        width: 400,
        timeout: 10000, 
        pauseOnHover: true,
        timeoutProgressbar: true,
        attached: 'bottom' 
      });
});

