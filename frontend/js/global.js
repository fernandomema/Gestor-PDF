$( document ).ready(function() {

    // check user color theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // set dark theme
        $('body').addClass('theme-dark');
    }
    
    // Si el usuario no está logeado y quiere intentar acceder al panel, se redirigirá al login.html
    if(sessionStorage.getItem('token') == undefined){
        window.location.href = 'login.html';
    }

    // Load avatar
    $('.avatar.avatar-sm').css('background-image', 'url(' + sessionStorage.getItem('avatar') + ')');

    // Load username
    var name = sessionStorage.getItem('usuario');
    var name_first_letter_capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    $('.username-menu').text(name_first_letter_capitalized);

});


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