$(document).ready(function(){
    // ------------------- FUNCTIONS -------------------------
    /* Funcion que se encarga de cambiar el alto del contenedor del bloque de notas. 
    El alto del documento va cambiando a medida que hay un resize de pantalla */
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
    
    // Función que se encarga de leer los offsets 
    function read_top_offsets(){
        info_section = $('#info-section').offset().top;
    }

    // Función para mostrar los elementos de acuerdo al scroll (en este caso, el menú)
    function show_elements(altura, element, classname){
		/* scrollTop: su funcionalidad es la de obtener o establecer la posición 
		vertical del scroll dentro de un elemento */

		/* The vertical scroll position is the same as the number of pixels 
		that are hidden from view above the scrollable area. If the scroll 
		bar is at the very top, or if the element is not scrollable, 
		this number will be 0.*/
    	var scrollTop = $(document).scrollTop(),
    	/* Establece o devuelve las coordenadas de un elemento respecto al 
    	documento/web contenedor del mismo (toda la web). En este caso, 
    	obtenemos la cantidad de píxeles en el eje Y */
        altura_animada = $(element).offset().top;
		if (altura_animada - altura < scrollTop) {
			$(element).css({
				'opacity': '1'
			});
			$(element).addClass(classname);
		}
    }

    // Función para ocultar el menú de acuerdo al stop
    function hide_menu(altura, element, classname){
    	var scrollTop = $(document).scrollTop();
		if (altura > scrollTop) {
			$(element).css({
				'opacity': '0'
			});
			$(element).addClass(classname);
		}
    }

    // Llamamos a las funciones de mostrar y desaparecer items
    function hide_items_with_effect(){
        mostrar_items.each(function(){ show_elements(280, this, "showUpwards"); });
        desaparecer_items.each(function(){ hide_menu(350, this, "showUpwards"); });
    }

    // ------------------- VARIABLES -------------------------
    var info_section = $('#info-section').offset().top,
       about_section = $('#about-section').offset().top,
       mostrar_items = $('.mostrar'),
   desaparecer_items = $('.ocultar');

    // Leemos los offsets y los incluimos en una función en dado caso haya un redimensionamiento de pantalla
    read_top_offsets();
    changeImageHeight();

    // Llamamos a la función para ocultar el menú si nos encontramos en la parte de arriba del todo
    hide_items_with_effect();

    // Animación para ir a la sección de información 
    $('#explore-btn').on('click', function(e){
        e.preventDefault();
        $('html, body').animate({
            scrollTop: info_section - 100
        }, 1000);
    });

    // Animación para ir a la sección de acerca de nosotros 
    $('#btn-about').on('click', function(e){
        e.preventDefault();
        $('html, body').animate({
            scrollTop: about_section - 100
        }, 1000);
    });

    // ------------------- EVENTOS -------------------------
    // ------------------- Window resize events --------------------- 
    $(window).resize(function () {       // evento que se dispara cuando hay un cambio del ancho de pantalla
        read_top_offsets();
        changeImageHeight();
    });

    // ------------------- Scroll event -----------------------------
    $(window).scroll(hide_items_with_effect);
});