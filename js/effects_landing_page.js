$(document).ready(function(){
    // ------------------- FUNCTIONS -------------------------
    function changeImageHeight(){
        if(window.innerWidth <= 500){
            var cw = $('.description .paper').width();
            if(window.innerWidth > 400 && window.innerWidth <= 500) cw = cw * 1.1;  
            if(window.innerWidth > 312 && window.innerWidth <= 400)  cw = cw * 1.5;    
            if(window.innerWidth > 278 && window.innerWidth <= 312)  cw = cw * 2; 
            if(window.innerWidth <= 278)  cw = cw * 2.5; 
            $('.description .paper').css({
                'height': cw + 'px'
            });
        } else {
            $('.description .paper').css({
                'height': '270px'
            });
        }
    }
    
    function read_top_offsets(){
        info_section = $('#info-section').offset().top;
    }

    // ------------------- VARIABLES -------------------------
    var info_section = $('#info-section').offset().top;

    // Leemos los offsets y los incluimos en una función en dado caso haya un redimensionamiento de pantalla
    read_top_offsets();
    changeImageHeight();

    // Animación para ir a la sección de información 
    $('#explore-btn').on('click', function(e){
        e.preventDefault();
        $('html, body').animate({
            scrollTop: info_section - 100
        }, 1000);
    });

    // ------------------- EVENTOS -------------------------
    // ------------------- Window resize events --------------------- 
    $(window).resize(function () {       // evento que se dispara cuando hay un cambio del ancho de pantalla
        read_top_offsets();
        changeImageHeight();
    });
});