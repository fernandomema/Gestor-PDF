$( document ).ready(function() {

    // check user color theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // set dark theme
        $('body').addClass('theme-dark');
    }
    
    // Load avatar
    $('.avatar.avatar-sm').css('background-image', 'url(' + sessionStorage.getItem('avatar') + ')');

});