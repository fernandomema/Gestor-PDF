
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
        url: 'https://localhost/gpdf/Gestor-PDF/Backend/api/documents/' + findGetParameter('id') + '/file',
        xhr: function() {
            return xhrOverride;
        },
        success: function(data) {
            var blob = new Blob([data], {
                type: 'application/pdf'
            });
            document.querySelector('iframe').src = window.URL.createObjectURL(blob);
        }
    });
});

