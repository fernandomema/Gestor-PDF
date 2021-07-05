$( document ).ready(function() {
    $('.avatar.avatar-sm').css('background-image', 'url(' + sessionStorage.getItem('avatar') + ')');
});