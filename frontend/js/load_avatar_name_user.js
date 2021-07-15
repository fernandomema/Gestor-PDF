$(document).ready(function () {
    // Load avatar in user settings page
    $('#avatar-circulo').attr("src", sessionStorage.getItem('avatar') + '?s=300');
    
    // Load username in user settings page
    var name = sessionStorage.getItem('usuario');
    var name_first_letter_capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    $('.username').text('Welcome ' + name_first_letter_capitalized);
});