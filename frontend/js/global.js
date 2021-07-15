$( document ).ready(function() {

    // check user color theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // set dark theme
        $('body').addClass('theme-dark');
    }
    
    // Load avatar
    $('.avatar.avatar-sm').css('background-image', 'url(' + sessionStorage.getItem('avatar') + ')');

    // Load username
    var name = sessionStorage.getItem('usuario');
    var name_first_letter_capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    $('.username-menu').text(name_first_letter_capitalized);

});