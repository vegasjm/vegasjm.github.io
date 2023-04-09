// jQuery

var ORACULO_SENTIDOS = ORACULO_SENTIDOS || {
  barajado: false,
  currentCardFromDeck:0,
  maxCardsFromFeck:5,
  init: function() {
    this.loadTablero();
    this.buildButtonsBehaviour();
	this.textos.show(this.textos.inicial);
	this.WIZARD.init();
  },
  WIZARD:{
	  init: function(){
		// Hacer que la mano del wizard parpadee en intervalos de 300ms
		var wizardHandInterval = setInterval(function() {
		  $("#wizard-hand").fadeToggle(300);
		}, 300);
	  }
  },
  loadTablero: function() {
    // Cargar la imagen de la parte trasera de las cartas
    var cartaAtras = new Image();
    cartaAtras.src = "images/left-mazo.jpg";

    // Obtener el contenedor de las cartas
    var contenedorCartas = $("#contenedor-cartas");

    // Definir la separación horizontal y vertical entre las cartas en el contenedor
    var separacion = 1;
	
   // Definir la separación horizontal entre los rectangulos de cartas
    var separacionResultados = 5;

    // Obtener el ancho del tablero
    var tableroAncho = $("#tablero").width();

	  // Crear un nuevo elemento div para el rectángulo
	  var rectangulo = $("<div>");
	  rectangulo.addClass("rectangulo");
	  rectangulo.css({
		top: -850+(contenedorCartas.height() + separacionResultados) + "px",
		left: ((tableroAncho / 8) + (1 * (210 + separacionResultados))) + "px"
	  });
	  // Agregar el rectángulo al contenedor
	  contenedorCartas.append(rectangulo);
	  
	  	  // Crear un nuevo elemento div para el rectángulo
	  var rectangulo2 = $("<div>");
	  rectangulo2.addClass("rectangulo");
	  rectangulo2.css({
		top: -850+(contenedorCartas.height() + separacionResultados) + "px",
		left: ((tableroAncho / 8) + (2 * (210 + 50 +separacionResultados))) + "px"
	  });
	  // Agregar el rectángulo al contenedor
	  contenedorCartas.append(rectangulo2);
	  
	  	  // Crear un nuevo elemento div para el rectángulo
	  var rectangulo3 = $("<div>");
	  rectangulo3.addClass("rectangulo");
	  rectangulo3.css({
		top: -425+(contenedorCartas.height() + separacionResultados) + "px",
		left: ((tableroAncho / 8) + (1 * (210 + separacionResultados))) + "px"
	  });
	  // Agregar el rectángulo al contenedor
	  contenedorCartas.append(rectangulo3);
	  
	  	  // Crear un nuevo elemento div para el rectángulo
	  var rectangulo4 = $("<div>");
	  rectangulo4.addClass("rectangulo");
	  rectangulo4.css({
		top: -425+(contenedorCartas.height() + separacionResultados) + "px",
		left: ((tableroAncho / 8) + (2 * (210 + 50 + separacionResultados))) + "px"
	  });
	  // Agregar el rectángulo al contenedor
	  contenedorCartas.append(rectangulo4);
	  
	  	  // Crear un nuevo elemento div para el rectángulo
	  var rectangulo5 = $("<div>");
	  rectangulo5.addClass("rectangulo");
	  rectangulo5.css({
		top: 0+(contenedorCartas.height() + separacionResultados) + "px",
		left: ((tableroAncho / 4) + (1 * (210 + 25 + separacionResultados))) + "px"
	  });
	  // Agregar el rectángulo al contenedor
	  contenedorCartas.append(rectangulo5);
    

    for (var i = 0; i < 10; i++) {
      // Crear un nuevo elemento div para la carta
      var carta = $("<div>");
      carta.addClass("carta");

      // Establecer la posición de la carta
      carta.css({
        top: i * (separacion + 1) + "px",
        left: i * (separacion + 1) + "px"
      });

      // Agregar la carta al contenedor
      contenedorCartas.append(carta);
    }
  },
  buildButtonsBehaviour: function() {
    $("#boton-barajar").click(function() {
	  ORACULO_SENTIDOS.barajarButtonEffect();
    });
    $("#boton-barajar").on("click", function() {
      // función que ejecuta el efecto de barajado
      ORACULO_SENTIDOS.barajar();
    });
	$('#contenedor-cartas').click(function() {
	  ORACULO_SENTIDOS.moveAndDiscoverCardEffect();
	});
  },
  moveAndDiscoverCardEffect: function(){
	  if (ORACULO_SENTIDOS.barajado) {
		if (ORACULO_SENTIDOS.currentCardFromDeck == 5) {
		  ORACULO_SENTIDOS.currentCardFromDeck = 0;
		  ORACULO_SENTIDOS.barajado = false;
		} else {
		  // Seleccionar la última carta en el contenedor de cartas
		  const $ultimaCarta = $('.carta').last();

		  // Guardar la posición original de la carta
		  const originalPos = $ultimaCarta.offset();

		  // Mover la última carta al primer elemento con la clase "rectangulo"
		  const $currentRectangulo = $('.rectangulo').eq(ORACULO_SENTIDOS.currentCardFromDeck);
		  ORACULO_SENTIDOS.currentCardFromDeck++;
		  const cartaWidth = $ultimaCarta.width();
		  const cartaHeight = $ultimaCarta.height();
		  const rectanguloWidth = $currentRectangulo.width();
		  const rectanguloHeight = $currentRectangulo.height();
		  const cartaPosX = (rectanguloWidth - cartaWidth) / 2;
		  const cartaPosY = (rectanguloHeight - cartaHeight) / 2;

		  // Clonar la carta y agregarla al body en la posición original
		  const $clonedCarta = $ultimaCarta.clone();
		  $clonedCarta.appendTo('body').css({
			position: 'absolute',
			top: originalPos.top,
			left: originalPos.left,
			zIndex: 1000
		  });

		  // Obtener la posición final de la carta en el rectángulo
		  const finalPos = $currentRectangulo.offset();

		  // Animar la carta clonada para que se desplace desde la posición original a la posición final
		  $clonedCarta.animate({
			top: finalPos.top + cartaPosY,
			left: finalPos.left + cartaPosX
		  }, 'slow', function() {
			// Eliminar la carta original del contenedor y agregar la carta clonada al rectángulo
			$ultimaCarta.remove();
			const randomImage = Math.floor(Math.random() * 44) + 1;
			$clonedCarta.appendTo($currentRectangulo).css({
			  backgroundImage: 'url("images/carta%20(' + randomImage + ').jpg")', // Cambiar el fondo de la carta a una imagen aleatoria
			  backgroundSize: 'contain',
			  backgroundRepeat: 'no-repeat',
			  backgroundPosition: 'center',
			  position: 'static',
			  top: '',
			  left: '',
			  zIndex: '',
			  important: 'true'
			});
		  });
		}
	  }
  },
  barajarButtonEffect: function(){
	  $(this).css({
		"background-color": "#4c2600",
		"color": "#fff"
	  });
	  $("#audio-click")[0].play();
	  setTimeout(function() {
		$("#boton-barajar").css("background-color", "#FFDAB9");
		$("#boton-barajar").css("cursor", "default");
		$("#boton-barajar").css("color", "#000");
		$("#boton-barajar").hover(function() {
			$("#boton-barajar").css("background-color", "#663300");
			$("#boton-barajar").css("cursor", "pointer");
			$("#boton-barajar").css("color", "#fff");
		  },
		  function() {
			$("#boton-barajar").css("background-color", "#FFDAB9");
			$("#boton-barajar").css("cursor", "default");
			$("#boton-barajar").css("color", "#000");
		  }
		);
	  }, 300);
  },
  barajar: function() {
    // Obtener el botón de barajar
	var botonBarajar = $('#boton-barajar');

	// Deshabilitar el botón
	botonBarajar.prop('disabled', true);
	botonBarajar.off('click');

	// Obtener todas las cartas
	var cartas = $('.carta');

	// Calcular la posición central del div con id "tablero"
	var centroX = $('#tablero').width() / 3;
	var centroY = $('#tablero').height() / -5;

	// Calcular la posición inicial de las cartas
	cartas.each(function() {
		var pos = $(this).position();
			$(this).attr('data-posicion-inicial', JSON.stringify({ left: pos.left, top: pos.top }));
	});

	// Esperar 1 segundo antes de ejecutar la siguiente animación
	var x = 0;
	var intervalID = setInterval(function() {
		// Calcular la posición final de las cartas
		var posFinal = [];
		cartas.each(function() {
			var offsetX = Math.random() * 600 - 300; // Aleatorizar la posición final
			var offsetY = Math.random() * 300 - 150; // Cambiar aquí el valor para ajustar la posición vertical
			posFinal.push({ left: centroX + offsetX, top: centroY + offsetY });
		});

		// Animar las cartas hacia la posición final
		cartas.each(function(index) {
			$(this).animate(posFinal[index], 750);
		});
		if (++x === 5) {
		// Esperar 1 segundo antes de ejecutar la siguiente animación
			setTimeout(function() {
				// Animar las cartas de vuelta a su posición inicial
				cartas.each(function(index) {
				var posInicial = JSON.parse($(this).attr('data-posicion-inicial'));
				$(this).animate(posInicial, 1000);
				});
			}, 25);
			ORACULO_SENTIDOS.barajado = true;
			window.clearInterval(intervalID);
		}
	}, 750);
  },
  textos:{
	  writtingSpeed: 25,
	  inicial: 'Para hacer tus consultas debes concentrarte en el asunto que te interesa. Seguir las instrucciones del botón y del recuadro, incluidos en el tapete. Recuerda que la primera carta es la respuesta a tu consulta y la segunda y tercera su evolución. Puedes realizar tantas consultas como desees sobre ti o las personas de tu interés.',
	  show: function(texto){        
		var i = 0;
		var intervalo = setInterval(function() {
			if (i < texto.length) {
			  $("#wizard-textbox").append(texto.charAt(i));
			  i++;
			} else {
			  clearInterval(intervalo);
			}
		}, ORACULO_SENTIDOS.textos.writtingSpeed);
	  }
  }
};
// Inicializar el juego cuando se cargue el documento
$(document).ready(function() {
	ORACULO_SENTIDOS.init();
});
