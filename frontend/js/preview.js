
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

$(document).ready(function () {

    

    var xhrOverride = new XMLHttpRequest();
    xhrOverride.responseType = 'arraybuffer';

    $.ajax({
        type: "GET",
        url: 'https://insta-pdf.herokuapp.com/api/documents/' + findGetParameter('id') + '/file',
        xhr: function() {
            return xhrOverride;
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Accept", "application/json"); 
            xhr.setRequestHeader("Authorization", 'Bearer '+sessionStorage.getItem('token')); 
        },
        headers: {
            'Accept': 'application/json',
            'Authorization':'Bearer '+sessionStorage.getItem('token')
        },
        dataType: 'JSON',
        success: function(data) {
            var blob = new Blob([data], {
                type: 'application/pdf'
            });
            document.querySelector('iframe').src = window.URL.createObjectURL(blob);
        },
        error: function(response){
            console.log(response);
            if (response.message == 'Unauthenticated' || response.status == 401) {
                //window.location.href = "login.html";
                console.log('unauthenticated');
            }
        }
    });
});

