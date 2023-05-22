// jQuery

var ORACULO_SENTIDOS = ORACULO_SENTIDOS || {
  barajado: false,
  currentCardFromDeck:0,
  maxCardsFromFeck:5,
  card1:null,
  card2:null,
  init: function() {
    this.loadTablero();
    this.buildButtonsBehaviour();
	this.textos.show(this.textos.inicial,this.WIZARD.init);
  },
  WIZARD:{
	  init: function(){		
		var botonesTipoConsulta =  $('.tipo_consulta_button');
			botonesTipoConsulta.prop('disabled', false);
			botonesTipoConsulta.on('click');
		$("#wizard-hand").css("display", "block");
		// Hacer que la mano del wizard parpadee en intervalos de 300ms
		var wizardHandInterval = setInterval(function() {
		  $("#wizard-hand").fadeToggle(300);
		}, 300);
		ORACULO_SENTIDOS.WIZARD.moveHandTo('contenedor-tipos-consultas');
	  }, 
	  moveHandTo: function(id, isReset){
		if(isReset){
			$("#wizard-hand").css("top","50%");
			$("#wizard-hand").css("left","40px");
		}
		$("#wizard-hand").css("display", "block");
		$("#wizard-hand").css("visibility", "visible");

		var div1 = $("#wizard-hand");
		var div2 = $("#"+id);
		var startPos = div1.offset();
		var endPos = div2.offset();

		// Calcular los valores relativos de movimiento
		var leftPos = endPos.left - startPos.left + div2.width() / 2 - div1.width() / 2 - parseInt(div2.css('left')); // Añadir posición relativa en el eje x del div2
		var topPos = endPos.top - startPos.top + div2.height() / 2 - div1.height() / 2 - parseInt(div2.css('top')); // Añadir posición relativa en el eje y del div2

		if(leftPos<0) leftPos = leftPos*-1;if(topPos<0) topPos = topPos*-1;
		
		var div2Width = div2.outerWidth()*0.80; // Anchura de div2 más 10px
		var div2Height = div2.outerHeight() / 2; // Mitad de la altura de div2
		
		// Animar el movimiento del div1 hasta la posición del div2
		div1.animate({
		  left: (leftPos+div2Width) + "px", // Utilizamos valores relativos
		  top: (topPos+div2Height) + "px" // Utilizamos valores relativos
		}, 1000); // Duración de la animación en milisegundos (en este caso, 1000 ms o 1 segundo)
	  },
	  hideHand: function(){
		  $("#wizard-hand").css("display", "none");
		  $("#wizard-hand").css("visibility", "hidden");
	  },
	  showHand: function(){
		  $("#wizard-hand").css("display", "block");
		  $("#wizard-hand").css("visibility", "visible");
	  }
  },
  
  loadTablero: function() {
	// Obtener el botón de barajar
	var botonBarajar = $('#boton-barajar');

	// Deshabilitar el botón
	botonBarajar.prop('disabled', true);
	botonBarajar.off('click');
	
	var botonsTipoConsulta =  $('.tipo_consulta_button');
	// Deshabilitar los botones
	botonsTipoConsulta.prop('disabled', true);
	botonsTipoConsulta.off('click');
	
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
		left: ((tableroAncho / 5) + (1 * (210 + 50 + separacionResultados))) + "px"
	  });
	  // Agregar el rectángulo al contenedor
	  contenedorCartas.append(rectangulo);
	  
	  	  // Crear un nuevo elemento div para el rectángulo
	  var rectangulo2 = $("<div>");
	  rectangulo2.addClass("rectangulo");
	  rectangulo2.css({
		top: -425+(contenedorCartas.height() + separacionResultados) + "px",
		left: ((tableroAncho / 5) + (1 * (210 + 50 + separacionResultados))) + "px"
	  });
	  // Agregar el rectángulo al contenedor
	  contenedorCartas.append(rectangulo2);
	  
	  	  // Crear un nuevo elemento div para el rectángulo
	  var rectangulo3 = $("<div>");
	  rectangulo3.addClass("rectangulo");
	  rectangulo3.css({
		top: 0+(contenedorCartas.height() + separacionResultados) + "px",
		left: ((tableroAncho / 5) + (1 * (210 + 50 + separacionResultados))) + "px"
	  });
	  // Agregar el rectángulo al contenedor
	  contenedorCartas.append(rectangulo3);
    

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
	$('.tipo_consulta_button').click(function(el) {
	  ORACULO_SENTIDOS.tipoConsultaButtonEffect(el);
	});
	$('.tipo_consulta_button').click(function() {
	  ORACULO_SENTIDOS.chooseConsultaType();
	});
  },
  chooseConsultaType: function(){
	  	var botonsTipoConsulta =  $('.tipo_consulta_button');
		// Deshabilitar los botones
		botonsTipoConsulta.prop('disabled', true);
		botonsTipoConsulta.off('click');
		this.textos.show(this.textos.barajar,ORACULO_SENTIDOS.WIZARD.moveHandTo('boton-barajar',true));
		// Obtener el botón de barajar
		var botonBarajar = $('#boton-barajar');

		// habilitar el botón
		botonBarajar.prop('disabled', false);
		botonBarajar.on('click');
  },
  moveAndDiscoverCardEffect: function(){
	  if (ORACULO_SENTIDOS.barajado) {
		if (ORACULO_SENTIDOS.currentCardFromDeck == 3) {
		  ORACULO_SENTIDOS.card1 = null;
		  ORACULO_SENTIDOS.card2 = null;
		  ORACULO_SENTIDOS.currentCardFromDeck = 0;
		  ORACULO_SENTIDOS.barajado = false;
		} else {
		  ORACULO_SENTIDOS.WIZARD.hideHand();
		  $("#audio-arrastrar")[0].play();
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
			let randomImage = null; 
			while(randomImage == null){
				let tempImage = Math.floor(Math.random() * 44) + 1;
				if(tempImage != ORACULO_SENTIDOS.card1 && tempImage != ORACULO_SENTIDOS.card2){
					randomImage = tempImage;
				}
			}
			if(ORACULO_SENTIDOS.currentCardFromDeck==1){
				ORACULO_SENTIDOS.card1 = randomImage;
			}
			if(ORACULO_SENTIDOS.currentCardFromDeck==2){
				ORACULO_SENTIDOS.card2 = randomImage;
			}
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
		  if(ORACULO_SENTIDOS.currentCardFromDeck <= 2){
			  setTimeout(function() {
				ORACULO_SENTIDOS.WIZARD.showHand();
			  }, 1000);
		  }else{
			  $('#contenedor-cartas').hover(
			   function () {
				  $(this).css({"cursor":"default"});
			   }, 
			   function () {
				  $(this).css({"cursor":"default"});
			   }
			);
			var restartGameButton = function(){
				$("#wizard-textbox").html($("#wizard-textbox").text()+'<button id="restartgame">Consultar de nuevo</button>');
				$("#restartgame").on("click", function() {
					document.location.reload();
				});
			};
			ORACULO_SENTIDOS.textos.show(ORACULO_SENTIDOS.textos.finalText,restartGameButton);
		  }
		}
	  }
  },
  tipoConsultaButtonEffect: function(el){
	  var selectedButton = $(el.target);
	  selectedButton.css({
		"background-color": "#4c2600",
		"color": "#fff"
	  });
	  $("#audio-click")[0].play();
	  setTimeout(function() {
		selectedButton.css("background-image", "linear-gradient(to bottom, #00FFFF, #00BFFF)");
		selectedButton.css("cursor", "default");
		selectedButton.css("color", "#000");
		selectedButton.hover(function() {
			selectedButton.css("background-image", "linear-gradient(to bottom, #00008B, #1E90FF)");
			selectedButton.css("cursor", "pointer");
			selectedButton.css("color", "#fff");
		  },
		  function() {
			selectedButton.css("background-image", "linear-gradient(to bottom, #00FFFF, #00BFFF)");
			selectedButton.css("cursor", "default");
			selectedButton.css("color", "#000");
		  }
		);
	  }, 300);
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
	ORACULO_SENTIDOS.WIZARD.hideHand();
	$("#audio-barajar")[0].play();
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
			ORACULO_SENTIDOS.textos.show(ORACULO_SENTIDOS.textos.cartas,ORACULO_SENTIDOS.WIZARD.moveHandTo('contenedor-cartas'));
			$('#contenedor-cartas').hover(
			   function () {
				  $(this).css({"cursor":"pointer"});
			   }, 
			   function () {
				  $(this).css({"cursor":"default"});
			   }
			);
		}
	}, 250);
  },
  textos:{
	  writtingSpeed: 25,
	  inicial: 'Para hacer tus consultas debes concentrarte en el asunto que te interesa y seguir las instrucciones. Recuerda que la primera carta es la respuesta a tu consulta y la segunda y tercera su evolución. Puedes realizar tantas consultas como desees sobre ti o las personas de tu interés. Para empezar elige un tema de los 5 que aparecen en el recuadro.',
	  barajar: 'Cuando te hayas concentrado lo suficiente en el tema seleccionado puedes barajar el mazo, tomate el tiempo que necesites.',
	  cartas: 'Ahora debes de seleccionar 3 cartas de una en una, recuerda que la primera carta es la respuesta a tu consulta, la segunda su evolución a corto plazo y tercera su evolución a largo plazo. ',
	  finalText: 'Tu consulta ha finalizado, el significado de las cartas debes de interpretarlo segun tus percepciones. Recuerda que puedes realizar tantas consultas como desees sobre ti o las personas de tu interés.',
	  show: function(texto, func){      
		$("#wizard-textbox").text('');	  
		var i = 0;
		var intervalo = setInterval(function() {
			if (i < texto.length) {
			  $("#wizard-textbox").append(texto.charAt(i));
			  i++;
			} else {
			  clearInterval(intervalo);
			  if(func!=null) func();
			}
		}, ORACULO_SENTIDOS.textos.writtingSpeed);
	  }
  }
};
// Inicializar el juego cuando se cargue el documento
$(document).ready(function() {
	ORACULO_SENTIDOS.init();
});
