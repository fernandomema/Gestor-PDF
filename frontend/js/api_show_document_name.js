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
    // API para traer el nombre del documento
    $.ajax({
        type: "GET",
        url: 'https://insta-pdf.herokuapp.com/api/documents/' + findGetParameter('id'),
        headers: {
            'Accept': 'application/json',
            'Authorization':'Bearer '+sessionStorage.getItem('token')
        },
        success: function(response) {
            switch(response.status){
                case 'success':
                    console.log(response.msg)
                    break;
                case 'failed':
                    console.log(response.msg)
                    break;
                default:
                    break;
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
});