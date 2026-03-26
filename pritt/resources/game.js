var PRITT_GAME = PRITT_GAME || {
    language: null,
    phase: 'world-selector',
    world: 1,
	world_1:false,
	world_2:false,
	world_3:false,
    randomPiecesByDefault: 3,
    gameDuration: 60,
	gameDurationInterval:null,
	imgPuzzleURL: './resources/img/world-1-puzzle.png',
    init: function() {
        this.loadLanguageSelector();
        this.loadHeader();
        this.loadHome();
        this.loadWorlds();
        this.loadGamePhase1();
        this.loadGamePhase2();
        this.loadLegal();
		this.loadFooter();
		this.finishWorld();

        this.checkURLParams();
    },
    checkURLParams: function() {
        const params = new URLSearchParams(window.location.search);

        const lang = params.get('lang');
        const templates = params.get('templates');

        if (lang) {
            loadLanguage(lang);
        }

        if (templates) {
            PRITT_GAME.clearScreenAndShow(['#multimedia','#legal'], '#1578A7', null, false);
            $('#footer-item-home').removeClass('active');
            $('#footer-item-multimedia').addClass('active');
            $('#forest-keeper-video').height($('#forest-keeper-video').width()*(9/16));
            $('#unicorn-video').height($('#unicorn-video').width()*(9/16));
            $('#ogre-video').height($('#ogre-video').width()*(9/16));
            $('#dragon-video').height($('#dragon-video').width()*(9/16));
            $('#fairy-video').height($('#fairy-video').width()*(9/16));
            $('#house-video').height($('#house-video').width()*(9/16));
            $('#rainbow-video').height($('#rainbow-video').width()*(9/16));
            $('#river-video').height($('#river-video').width()*(9/16));
        }
    },
	loadLegal: function(){
		$('#btn-imprimt').on('touch click', function(e) {
			PRITT_GAME.clearScreenAndShow(['#imprimt','#legal'], '#3FB1CE', './resources/img/bg.png', true);
			e.stopPropagation();
        });
		$('#btn-termsOfUse').on('touch click', function(e) {
			PRITT_GAME.clearScreenAndShow(['#termsOfUse','#legal'], '#3FB1CE', './resources/img/bg.png', true);
			e.stopPropagation();
        });
		$('#btn-dataPrivacyStatement').on('touch click', function(e) {
			PRITT_GAME.clearScreenAndShow(['#dataPrivacyStatement','#legal'], '#3FB1CE', './resources/img/bg.png', true);
			e.stopPropagation();
        });
		$('#btn-usResidents').on('touch click', function(e) {
			PRITT_GAME.clearScreenAndShow(['#usResidents','#legal'], '#3FB1CE', './resources/img/bg.png', true);
			e.stopPropagation();
        });
	},
    loadLanguageSelector: function() {
        $('#btn-languageSelector').on('touch click', function(e) {
            var language = $('#languageSelector').find(":selected").val();
            PRITT_GAME.language = language;
            if(PRITT_GAME.language!=null && (PRITT_GAME.language=='cs' || PRITT_GAME.language=='de' || PRITT_GAME.language=='sk' || PRITT_GAME.language=='tr')){
                $('#scissors').attr("src", "./resources/img/scissors_"+PRITT_GAME.language+".png");
            }else{
                $('#scissors').attr("src", "./resources/img/scissors.png");
            }
            if(PRITT_GAME.language!=null && (PRITT_GAME.language=='de' || PRITT_GAME.language=='tr')) {
                $('#pritt-logo').attr("src", "./resources/img/pritt_"+PRITT_GAME.language+".png");
            }else{
                $('#pritt-logo').attr("src", "./resources/img/pritt.png");
            }
            loadLanguage(PRITT_GAME.language);
            PRITT_GAME.loadHome();
			e.stopPropagation();
        });
    },
	loadHeader: function() {
		$('#btn-logo-pritt').on('touch click', function(e) {
			PRITT_GAME.loadHome();
			e.stopPropagation();
        });
		$('#btn-back-home').on('touch click', function(e) {
			PRITT_GAME.loadHome();
			e.stopPropagation();
        });
		$('#btn-go-to-templates').on('touch click', function(e) {
			PRITT_GAME.clearScreenAndShow(['#multimedia','#legal'], '#1578A7', null, false);
			$('#footer-item-home').removeClass('active');
			$('#footer-item-multimedia').addClass('active');
			$('#forest-keeper-video').height($('#forest-keeper-video').width()*(9/16));
			$('#unicorn-video').height($('#unicorn-video').width()*(9/16));
			$('#ogre-video').height($('#ogre-video').width()*(9/16));
			$('#dragon-video').height($('#dragon-video').width()*(9/16));
			$('#fairy-video').height($('#fairy-video').width()*(9/16));
			$('#house-video').height($('#house-video').width()*(9/16));
			$('#rainbow-video').height($('#rainbow-video').width()*(9/16));
			$('#river-video').height($('#river-video').width()*(9/16));
			e.stopPropagation();
        });		
    },
    loadFooter: function() {
        $('#footer-item-settings').on('touch click', function(e) {
			PRITT_GAME.clearScreenAndShow(['#settings'], '#0c3554', './resources/img/bg-lang.png', false);
			$('#page-menu-footer').css('display', 'none');
			e.stopPropagation();			
        });
		$('#footer-item-home').on('touch click', function(e) {
			PRITT_GAME.loadHome();
			e.stopPropagation();
        });
		$('#footer-item-info').on('touch click', function(e) {
			PRITT_GAME.loadHome();
			e.stopPropagation();
        });
		$('#footer-item-multimedia').on('touch click', function(e) {
			PRITT_GAME.clearScreenAndShow(['#multimedia','#legal'], '#1578A7', null, false);
			$('#footer-item-home').removeClass('active');
			$('#footer-item-multimedia').addClass('active');
			$('#forest-keeper-video').height($('#forest-keeper-video').width()*(9/16));
			$('#unicorn-video').height($('#unicorn-video').width()*(9/16));
			$('#ogre-video').height($('#ogre-video').width()*(9/16));
			$('#dragon-video').height($('#dragon-video').width()*(9/16));
			$('#fairy-video').height($('#fairy-video').width()*(9/16));
			$('#house-video').height($('#house-video').width()*(9/16));
			$('#rainbow-video').height($('#rainbow-video').width()*(9/16));
			$('#river-video').height($('#river-video').width()*(9/16));
			e.stopPropagation();
        });

		$('.video-grid').find('a').each(function(idx, el) {
		let degrees = (Math.floor(Math.random() * 21) - 10);
		$(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
					'-moz-transform' : 'rotate('+ degrees +'deg)',
					'-ms-transform' : 'rotate('+ degrees +'deg)',
					'transform' : 'rotate('+ degrees +'deg)'});
		});
    },
    loadHome: function() {
        if (PRITT_GAME.language == null) {
			PRITT_GAME.clearScreenAndShow(['#settings'], '#0c3554', './resources/img/bg-lang.png', false);
			$('#page-menu-footer').css('display', 'none');
        } else {
			PRITT_GAME.clearScreenAndShow(['.menu-home','#legal'], '#3FB1CE', './resources/img/bg.png', true);
			if(!PRITT_GAME.world_1){
				$(".btn-home-world[data-world='1']").css('background-image', 'url(./resources/img/bg-world/bg-1-dark.png');
			}else{
				$(".btn-home-world[data-world='1']").css('background-image', 'url(./resources/img/bg-world/bg-1-light.png');
			}
			
			if(!PRITT_GAME.world_3){
				$(".btn-home-world[data-world='3']").css('background-image', 'url(./resources/img/bg-world/bg-3-dark.png');
			}else{
				$(".btn-home-world[data-world='3']").css('background-image', 'url(./resources/img/bg-world/bg-3-light.png');
			}
			
			if(PRITT_GAME.world_2 && !PRITT_GAME.world_1 && !PRITT_GAME.world_3) $(".btn-home-world[data-world='2']").css('background-image', 'url(./resources/img/bg-world/bg-2-light.png');
			if(PRITT_GAME.world_2 && PRITT_GAME.world_1 && !PRITT_GAME.world_3) $(".btn-home-world[data-world='2']").css('background-image', 'url(./resources/img/bg-world/bg-2-light-1-light.png');
			if(PRITT_GAME.world_2 && !PRITT_GAME.world_1 && PRITT_GAME.world_3) $(".btn-home-world[data-world='2']").css('background-image', 'url(./resources/img/bg-world/bg-2-light-3-light.png');
			if(PRITT_GAME.world_2 && PRITT_GAME.world_1 && PRITT_GAME.world_3) $(".btn-home-world[data-world='2']").css('background-image', 'url(./resources/img/bg-world/bg-2-all-light.png');
			if(!PRITT_GAME.world_2 && !PRITT_GAME.world_1 && !PRITT_GAME.world_3) $(".btn-home-world[data-world='2']").css('background-image', 'url(./resources/img/bg-world/bg-2-dark.png');
			if(!PRITT_GAME.world_2 && PRITT_GAME.world_1 && !PRITT_GAME.world_3) $(".btn-home-world[data-world='2']").css('background-image', 'url(./resources/img/bg-world/bg-2-dark-1-light.png');
			if(!PRITT_GAME.world_2 && !PRITT_GAME.world_1 && PRITT_GAME.world_3) $(".btn-home-world[data-world='2']").css('background-image', 'url(./resources/img/bg-world/bg-2-dark-3-light.png');
			if(!PRITT_GAME.world_2 && PRITT_GAME.world_1 && PRITT_GAME.world_3) $(".btn-home-world[data-world='2']").css('background-image', 'url(./resources/img/bg-world/bg-2-dark-1-light-3-light.png');
			
			$(".btn-home-world[data-world='1']").css('height', 'calc(0.4927 * '+$(".btn-home-world[data-world='1']").width()+'px)');
			$(".btn-home-world[data-world='2']").css('height', 'calc(0.4927 * '+$(".btn-home-world[data-world='2']").width()+'px)');
			$(".btn-home-world[data-world='3']").css('height', 'calc(0.4927 * '+$(".btn-home-world[data-world='3']").width()+'px)');
			$('.go-to-templates').css('display', 'block');
			$('#footer-item-home').addClass('active');
			$('#footer-item-multimedia').removeClass('active');
        }
    },
    loadWorlds: function() {
        $('.btn-home-world').on('touch click', function(e) {
			e.stopPropagation();
			setTimeout(() => {
                $(window).scrollTop();
				document.documentElement.scrollTop;
				window.scrollTo(0,0);
				window.scrollY;
            }, 100);
            PRITT_GAME.phase = 'game-1';
            PRITT_GAME.world = $(this).attr('data-world');
            $('#legal').css('display', 'none');
			$('#page-menu-footer').css('display', 'none');
			$('.go-to-templates').css('display', 'none');
			$('.back-home').css('display', 'block');
            setTimeout(function() {
				var heightGame = window.innerHeight - $("#page-header").height() - ($("#menu-footer").height());
                $('.menu-home').css('display', 'none');
                $('#game-intro').css('display', 'flex');
				$('#game-intro').css('height', heightGame + 'px');
                $('.game-character-img').attr("src", './resources/img/world-' + PRITT_GAME.world + '/world-' + PRITT_GAME.world + '-character.png');
				$("#game-world-player-congrats").attr("src", './resources/img/world-' + PRITT_GAME.world + '-player.png');
                $('#world-item').attr("src", './resources/img/world-'+PRITT_GAME.world+'/diamond-' + PRITT_GAME.world + '_1.png');
                if (PRITT_GAME.world == 2 || PRITT_GAME.world == 3) {
                    $('.game-character-img').css('float', 'right');
                    $('#game-wizard-text').css('transform', 'rotate(-42deg)');
					$('#game-wizard-text-p').css('transform', 'rotate(14deg)');
                    if (PRITT_GAME.world == 2) {
                        $('.body-inner').css('background-color', '#F4E0B3');
                        $('.game-character-img').css('max-width', '26vh');
                        $('#game-wizard-text-p').html('');
                        showText('#game-wizard-text-p', t('game2_init_conversation'), 0, 25);
                    }
                    if (PRITT_GAME.world == 3) {
                        $('.body-inner').css('background-color', '#8652A9');
                        $('.game-character-img').css('max-width', '28vh');
                        $('#game-wizard-text-p').html('');
                        showText('#game-wizard-text-p', t('game3_init_conversation'), 0, 25);
                    }
                } else {
                    if (PRITT_GAME.world == 1) {
                        $('.body-inner').css('background-color', '#fbeda4');
						$('#game-wizard-text').css('transform', 'rotate(+14deg)');
						$('#game-wizard-text-p').css('transform', 'rotate(+14deg)');
                        $('.game-character-img').css('float', 'left');
                        $('.game-character-img').css('max-width', '28vh');
                        $('#game-wizard-text-p').html('');
                        showText('#game-wizard-text-p', t('game1_init_conversation'), 0, 25);
                    }
                }
                $('.body-inner').css('background-image', 'url(./resources/img/world-' + PRITT_GAME.world + '/world-' + PRITT_GAME.world + '-bg1.png)');
            }, 500);
			e.stopPropagation();
        });
    },
    loadGamePhase1: function() {
        $('#btn-start-game-phase1').on('touch click', function(e) {
			$('.logo-pritt').css('width', '100px');
			$('.go-to-templates').css('display', 'none');
			$('.back-home').css('display', 'block');
            setTimeout(() => {
                $(window).scrollTop();
				document.documentElement.scrollTop;
				window.scrollTo(0,0);
				window.scrollY;
            }, 100);
            var heightGame = window.innerHeight - $("#page-header").height() - ($("#menu-footer").height());
            if (PRITT_GAME.world == 1) $('.body-inner').css('background-color', '#E1D48D');
            if (PRITT_GAME.world == 2) $('.body-inner').css('background-color', '#B3E6DA');
            if (PRITT_GAME.world == 3) $('.body-inner').css('background-color', '#57319D');
            $('.body-inner').css('background-image', 'url(./resources/img/world-' + PRITT_GAME.world + '/world-' + PRITT_GAME.world + '-bg2.png)');
            $('#game-intro').css('display', 'none');
            $('#game-phase1').css('display', 'block');
            $('#game-phase1-stats').css('display', 'flex');
            $('#game-phase1-stats').css('visibility', 'visible');
            var canvas = document.getElementById('game');
            var contentContainerNode = document.getElementById('game-phase1');
            canvas.height = heightGame;
            canvas.width = contentContainerNode.offsetWidth;
            $('#game-phase1-stats').css('height', heightGame + 'px');
            $('#game-phase1-stats').css('width', contentContainerNode.offsetWidth + 'px');
            $('#game-phase1').css('height', heightGame + 'px');
			PRITT_GAME.pendingTime = PRITT_GAME.gameDuration;
            updateClock(PRITT_GAME.gameDuration);
            resize();
			$('#page-menu-footer').css('display', 'none');
			e.stopPropagation();
        });
    },
	loadGamePhase2: function() {
		$('#btn-start-game-phase2').on('touch click', function(e) {
			$('.logo-pritt').css('width', '100px');
			$('.go-to-templates').css('display', 'none');
			$('.back-home').css('display', 'block');
            setTimeout(() => {
                $(window).scrollTop();
				document.documentElement.scrollTop;
				window.scrollTo(0,0);
				window.scrollY;
            }, 100);
            var heightGame = window.innerHeight - $("#page-header").height() - ($("#menu-footer").height());
            if (PRITT_GAME.world == 1) $('.body-inner').css('background-color', '#E1D48D');
            if (PRITT_GAME.world == 2) $('.body-inner').css('background-color', '#B3E6DA');
            if (PRITT_GAME.world == 3) $('.body-inner').css('background-color', '#57319D');
            $('.body-inner').css('background-image', 'url(./resources/img/world-' + PRITT_GAME.world + '/world-' + PRITT_GAME.world + '-bg2.png)');
            $('#game-phase1').css('display', 'none');
            $('#game-phase1-stats').css('display', 'none');
			$('#game-phase2').css('display', 'block');
			var canvas = document.getElementById('game');
            $(canvas).empty();
            $('#game-phase2').css('height', heightGame + 'px');
			PRITT_GAME.imgPuzzleURL='./resources/img/world-' + PRITT_GAME.world + '-puzzle.png';
			clearInterval(PRITT_GAME.gameDurationInterval);
			updateClock(PRITT_GAME.gameDuration);
			initPuzzle(PRITT_GAME.imgPuzzleURL);
			$('#page-menu-footer').css('display', 'none');
			e.stopPropagation();
        });
	},
	loadGameCompleted: function() {
		PRITT_GAME.clearScreenAndShow(['#game-completed'], '#23851A', './resources/img/world-' + PRITT_GAME.world + '-final.png', false);
		    if (PRITT_GAME.world == 1) $('.body-inner').css('background-color', '#23851A');
            if (PRITT_GAME.world == 2) $('.body-inner').css('background-color', '#50A8E2');
            if (PRITT_GAME.world == 3) $('.body-inner').css('background-color', '#C075A3');
		setTimeout(() => {
			$(window).scrollTop();
			document.documentElement.scrollTop;
			window.scrollTo(0,0);
			window.scrollY;
		}, 100);
		$('#legal').css('display', 'none');
		$('#page-menu-footer').css('display', 'none');
		setTimeout(function() {
			var heightGame = window.innerHeight - $("#page-header").height() - ($("#menu-footer").height());
			$('.menu-home').css('display', 'none');
			$('#game-completed').css('display', 'flex');
			$('#game-completed').css('height', heightGame + 'px');
			$('.game-character-img').attr("src", './resources/img/world-' + PRITT_GAME.world + '-player.png');
			if (PRITT_GAME.world == 2 || PRITT_GAME.world == 3) {
				$('.game-character-img').css('float', 'right');
				$('#game-wizard-text-completed').css('transform', 'rotate(-42deg)');
				$('#game-wizard-text-completed-p').css('transform', 'rotate(14deg)');
				if (PRITT_GAME.world == 2) {
					$('.game-character-img').css('max-width', '26vh');
					$('#game-wizard-text-completed-p').html('');
					showText('#game-wizard-text-completed-p', t('game2_final_conversation'), 0, 25);
				}
				if (PRITT_GAME.world == 3) {
					$('.game-character-img').css('max-width', '28vh');
					$('#game-wizard-text-completed-p').html('');
					showText('#game-wizard-text-completed-p', t('game3_final_conversation'), 0, 25);
				}
			} else {
				if (PRITT_GAME.world == 1) {
					$('#game-wizard-text-completed').css('transform', 'rotate(+14deg)');
					$('#game-wizard-text-completed-p').css('transform', 'rotate(+14deg)');
					$('.game-character-img').css('float', 'left');
					$('.game-character-img').css('max-width', '28vh');
					$('#game-wizard-text-completed-p').html('');
					showText('#game-wizard-text-completed-p', t('game1_final_conversation'), 0, 25);
				}
			}
		}, 500);
    },
	finishWorld: function(){
		$('#btn-game-completed').on('touch click', function(e) {
			PRITT_GAME.loadHome();
			e.stopPropagation();
		});
		$('#btn-templates-completed').on('touch click', function(e) {
			PRITT_GAME.clearScreenAndShow(['#multimedia','#legal'], '#1578A7', null, false);
			$('#footer-item-home').removeClass('active');
			$('#footer-item-multimedia').addClass('active');
			$('#forest-keeper-video').height($('#forest-keeper-video').width()*(9/16));
			$('#unicorn-video').height($('#unicorn-video').width()*(9/16));
			$('#ogre-video').height($('#ogre-video').width()*(9/16));
			$('#dragon-video').height($('#dragon-video').width()*(9/16));
			$('#fairy-video').height($('#fairy-video').width()*(9/16));
			$('#house-video').height($('#house-video').width()*(9/16));
			$('#rainbow-video').height($('#rainbow-video').width()*(9/16));
			$('#river-video').height($('#river-video').width()*(9/16));
			e.stopPropagation();
        });		
	},
	clearScreenAndShow: function(pageIds, bgColor, bgUrl, repeat){
		var canvas = document.getElementById('game');
        $(canvas).empty();
		$('#imprimt').css('display', 'none');
		$('#termsOfUse').css('display', 'none');
		$('#dataPrivacyStatement').css('display', 'none');
		$('#usResidents').css('display', 'none');
		$('#settings').css('display', 'none');
		$('#legal').css('display', 'none');
		$('.menu-home').css('display', 'none');
		$('#game-intro').css('display', 'none');
        $('#game-phase1').css('display', 'none');
		$('#game-phase1-stats').css('display', 'none');
		$('#game-phase2').css('display', 'none');
		$('#multimedia').css('display', 'none');
		$('#game-completed').css('display', 'none');
		
		$('.body-inner').css('background-color', bgColor);
		$('.body-inner').css('background-image', (bgUrl==null?'':(bgUrl=='none'?'none':'url('+bgUrl+')')));
		
		$('.go-to-templates').css('display', 'none');
		$('.back-home').css('display', 'none');
		$('.logo-pritt').css('width', '175px');
		$('#page-header .justify-content-center').css('margin', 'auto');
		clearInterval(PRITT_GAME.gameDurationInterval);
		pageIds.forEach(function (pageId, index) {
		  $(pageId).css('display', 'block');
		});
		$('#page-menu-footer').css('display', 'block');
		gameOver();
		onPlay(-1);
		setTimeout(() => {
			$(window).scrollTop();
			document.documentElement.scrollTop;
			window.scrollTo(0,0);
			window.scrollY;
		}, 100);
	}
}

window.onload = function() {
    PRITT_GAME.init();
};


var showText = function(target, message, index, interval) {
    if (index < message.length) {
        $(target).html($(target).html() + message[index++].replace('@', '<br/>'));
        setTimeout(function() {
            showText(target, message, index, interval);
        }, interval);
    }
	calculateDimensions();
}

window.updateClock = function(time) {
	$('#pendingSeconds').html(time);
	if (time == 0) {
		gameOver();
	} else {
		time -= 1;
		PRITT_GAME.gameDurationInterval = setTimeout("updateClock(" + time + ")", 1000);
	}
}

window.openFullScreen =  function(){
	if(document.querySelector("body").requestFullscreen) {
		document.querySelector("body").requestFullscreen();
	  } else if(document.querySelector("body").mozRequestFullScreen) {
		document.querySelector("body").mozRequestFullScreen();
	  } else if(document.querySelector("body").webkitRequestFullscreen) {
		document.querySelector("body").webkitRequestFullscreen();
	  } else if(document.querySelector("body").msRequestFullscreen) {
		document.querySelector("body").msRequestFullscreen();
	  }
}

window.exitFullScreen =  function(){
	if(document.querySelector("body").exitFullscreen) {
		document.querySelector("body").exitFullscreen();
	  } else if(document.querySelector("body").mozCancelFullScreen) {
		document.querySelector("body").mozCancelFullScreen();
	  } else if(document.querySelector("body").webkitExitFullscreen) {
		document.querySelector("body").webkitExitFullscreen();
	  } else if(document.querySelector("body").msExitFullscreen) {
		document.querySelector("body").msExitFullscreen();
	  }
}


var player1,player2,player3,player4,player5,player6,player7,player8;
  
window.onPlay = function(currentPlayer){
	  if(currentPlayer!=1) player1.pause();
	  if(currentPlayer!=2) player2.pause();
	  if(currentPlayer!=3) player3.pause();
	  if(currentPlayer!=4) player4.pause();
	  if(currentPlayer!=5) player5.pause();
	  if(currentPlayer!=6) player6.pause();
	  if(currentPlayer!=7) player7.pause();
	  if(currentPlayer!=8) player8.pause();
  }

document.addEventListener('DOMContentLoaded', () => { 
  // This is the bare minimum JavaScript. You can opt to pass no arguments to setup.
  player1 = new Plyr('#forest-keeper-video');
  player2 = new Plyr('#unicorn-video');
  player3 = new Plyr('#ogre-video');
  player4 = new Plyr('#dragon-video');
  player5 = new Plyr('#fairy-video');
  player6 = new Plyr('#house-video');
  player7 = new Plyr('#rainbow-video');
  player8 = new Plyr('#river-video');
  
  player1.on('play', (data) => onPlay(1));
  player2.on('play', (data) => onPlay(2));
  player3.on('play', (data) => onPlay(3));
  player4.on('play', (data) => onPlay(4));
  player5.on('play', (data) => onPlay(5));
  player6.on('play', (data) => onPlay(6));
  player7.on('play', (data) => onPlay(7));
  player8.on('play', (data) => onPlay(8));

});

window.addEventListener('load', calculateDimensions);
window.addEventListener('resize', calculateDimensions);

function calculateDimensions() {

  // =========================================================
  // Bloque 1: Elementos iniciales
  // =========================================================
  const divs = document.querySelectorAll('#game-wizard-img, #game-wizard-text');
  let maxHeight = 0;
  let maxWidth = 0; // Inicializamos la anchura máxima

  // 1. Reiniciar las dimensiones para el recálculo
  divs.forEach(div => {
    div.style.height = '';
    div.style.width = ''; // Reiniciamos la anchura
  });

  // 2. Encontrar la Altura Y Anchura máxima
  divs.forEach(div => {
    if (div.offsetHeight > maxHeight) {
      maxHeight = div.offsetHeight;
    }
    // Lógica para encontrar la anchura máxima
    if (div.offsetWidth > maxWidth) {
      maxWidth = div.offsetWidth;
    }
  });

  // 3. Aplicar las dimensiones máximas a todos los divs (solo si son mayores que 0)
  if (maxHeight > 0 && maxWidth > 0) {
    divs.forEach(div => {
      div.style.height = maxHeight + 'px';
      div.style.width = maxWidth + 'px'; // Aplicamos la anchura máxima
    });
  }

  // ---

  // =========================================================
  // Bloque 2: Elementos 'Completed'
  // =========================================================
  const divsCompleted = document.querySelectorAll('#game-wizard-img-completed, #game-wizard-text-completed');
  let maxHeightCompleted = 0;
  let maxWidthCompleted = 0; // Inicializamos la anchura máxima para este grupo

  // 1. Reiniciar las dimensiones para el recálculo
  divsCompleted.forEach(div => {
    div.style.height = '';
    div.style.width = ''; // Reiniciamos la anchura
  });

  // 2. Encontrar la Altura Y Anchura máxima
  divsCompleted.forEach(div => {
    // Nota: Aquí corregimos un posible error. Debes comparar con maxHeightCompleted, no con maxHeight del bloque anterior.
    if (div.offsetHeight > maxHeightCompleted) {
      maxHeightCompleted = div.offsetHeight;
    }
    // Lógica para encontrar la anchura máxima
    if (div.offsetWidth > maxWidthCompleted) {
      maxWidthCompleted = div.offsetWidth;
    }
  });

  // 3. Aplicar las dimensiones máximas a todos los divs (solo si son mayores que 0)
  if (maxHeightCompleted > 0 && maxWidthCompleted > 0) {
    divsCompleted.forEach(div => {
      div.style.height = maxHeightCompleted + 'px';
      div.style.width = maxWidthCompleted + 'px'; // Aplicamos la anchura máxima
    });
  }
}