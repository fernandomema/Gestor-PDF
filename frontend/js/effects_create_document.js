$(document).ready(function () {
    // Aplicamos efecto hover en los 3 iconos descriptivos de la página
    $(".description .icon-font").hover(function(){
        $(this).css({
            'font-size': '5em'
        });
    }, function(){
        $(this).css({
            'font-size': '4em'
        });
    });

    $(".description .icon-image").hover(function(){
        $(this).css({
            'width': '22%'
        });
    }, function(){
        $(this).css({
            'width': '18%'
        });
    });
});