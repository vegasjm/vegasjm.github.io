var PRITT_GAME = PRITT_GAME || {
    language: null,
    phase: 'world-selector',
    world: 1,
	world_1:false,
	world_2:false,
	world_3:false,
    gameDuration: 90,
    gameRestarted: false,
	imgPuzzleURL: './resources/img/world-1-puzzle.png',
    init: function() {
        this.loadLanguageSelector();
        this.loadHome();
        this.loadWorlds();
        this.loadGamePhase1();
        this.loadGamePhase2();
        this.loadLegal();
		this.loadFooter();
    },
	loadLegal: function(){
		$('#btn-imprimt').on('touch click', function(e) {
			PRITT_GAME.clearScreenAndShow(['#imprimt','#legal'], '#DEBE82', 'none');
        });
		$('#btn-termsOfUse').on('touch click', function(e) {
			PRITT_GAME.clearScreenAndShow(['#termsOfUse','#legal'], '#DEBE82', 'none');
        });
		$('#btn-dataPrivacyStatement').on('touch click', function(e) {
			PRITT_GAME.clearScreenAndShow(['#dataPrivacyStatement','#legal'], '#DEBE82', 'none');
        });
		$('#btn-usResidents').on('touch click', function(e) {
			PRITT_GAME.clearScreenAndShow(['#usResidents','#legal'], '#DEBE82', 'none');
        });
	},
    loadLanguageSelector: function() {
        $('#btn-languageSelector').on('touch click', function(e) {
            var language = $('#languageSelector').find(":selected").val();
            PRITT_GAME.language = language;
            //TODO: Load all texts function	
            PRITT_GAME.loadHome();
        });
    },
    loadFooter: function() {
        $('#footer-item-settings').on('touch click', function(e) {
			PRITT_GAME.clearScreenAndShow(['#settings'], '#DEBE82', './resources/img/bg-lang.png');
			$('#page-menu-footer').css('display', 'none');
        });
		$('#footer-item-home').on('touch click', function(e) {
			PRITT_GAME.loadHome();
        });
    },
    loadHome: function() {
        if (PRITT_GAME.language == null) {
			PRITT_GAME.clearScreenAndShow(['#settings'], '#DEBE82', './resources/img/bg-lang.png');
			$('#page-menu-footer').css('display', 'none');
        } else {
			PRITT_GAME.clearScreenAndShow(['.menu-home','#legal'], '#1578A7', null);
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



        }
    },
    loadWorlds: function() {
        $('.btn-home-world').on('touch click', function(e) {
			setTimeout(() => {
                $(window).scrollTop();
				document.documentElement.scrollTop;
				window.scrollTo(0,0);
				window.scrollY;
            }, 100);
            PRITT_GAME.phase = 'game-1';
            PRITT_GAME.world = $(this).attr('data-world');
            $('#legal').css('display', 'none');
            setTimeout(function() {
                $('.menu-home').css('display', 'none');
                $('#game-intro').css('display', 'flex');
                $('.game-character-img').attr("src", './resources/img/world-' + PRITT_GAME.world + '/world-' + PRITT_GAME.world + '-character.png');
                $('#world-item').attr("src", './resources/img/diamond-' + PRITT_GAME.world + '.png');
                if (PRITT_GAME.world == 2 || PRITT_GAME.world == 3) {
                    $('.game-character-img').css('float', 'right');
                    $('#game-wizard').css('transform', 'rotate(-28deg)');
                    $('#game-wizard').css('margin-left', '-5rem');
                    if (PRITT_GAME.world == 2) {
                        $('.body-inner').css('background-color', '#F4E0B3');
                        $('.game-character-img').css('max-width', '26vh');
                        $('#game-wizard-text').html('');
                        showText('#game-wizard-text', 'Oh no! @The rainbow on my @beach is gone!', 0, 75);
                    }
                    if (PRITT_GAME.world == 3) {
                        $('.body-inner').css('background-color', '#8652A9');
                        $('.game-character-img').css('max-width', '28vh');
                        $('#game-wizard-text').html('');
                        showText('#game-wizard-text', 'I need your help to @make my cave @shine again!', 0, 75);
                    }
                } else {
                    if (PRITT_GAME.world == 1) {
                        $('.body-inner').css('background-color', '#fbeda4');
                        $('#game-wizard').css('transform', 'rotate(0deg)');
                        $('#game-wizard').css('margin-left', '-1rem');
                        $('.game-character-img').css('float', 'left');
                        $('.game-character-img').css('max-width', '28vh');
                        $('#game-wizard-text').html('');
                        showText('#game-wizard-text', 'This forest is losing @its magic... @Will you help me?', 0, 75);
                    }
                }
                $('.body-inner').css('background-image', 'url(./resources/img/world-' + PRITT_GAME.world + '/world-' + PRITT_GAME.world + '-bg1.png)');
            }, 500);
        });
    },
    loadGamePhase1: function() {
        $('#btn-start-game-phase1').on('touch click', function(e) {
            setTimeout(() => {
                $(window).scrollTop();
				document.documentElement.scrollTop;
				window.scrollTo(0,0);
				window.scrollY;
            }, 100);
            var heightGame = window.innerHeight - $("#page-header").height() - ($("#menu-footer").height() * 2);
            if (PRITT_GAME.world == 1) $('.body-inner').css('background-color', '#E1D48D');
            if (PRITT_GAME.world == 2) $('.body-inner').css('background-color', '#B3E6DA');
            if (PRITT_GAME.world == 3) $('.body-inner').css('background-color', '#57319D');
            $('.body-inner').css('background-image', 'url(./resources/img/world-' + PRITT_GAME.world + '/world-' + PRITT_GAME.world + '-bg2.png)');
            $('#game-intro').css('display', 'none');
            $('#game-phase1').css('display', 'block');
            $('#game-phase1-stats').css('display', 'flex');
            var canvas = document.getElementById('game');
            var contentContainerNode = document.getElementById('game-phase1');
            canvas.height = heightGame;
            canvas.width = contentContainerNode.offsetWidth;
            $('#game-phase1-stats').css('height', heightGame + 'px');
            $('#game-phase1-stats').css('width', contentContainerNode.offsetWidth + 'px');
            $('#game-phase1').css('height', heightGame + 'px');
            updateClock(PRITT_GAME.gameDuration);
            resize();
        });
    },
	loadGamePhase2: function() {
		    $('#btn-start-game-phase2').on('touch click', function(e) {
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
			initPuzzle(PRITT_GAME.imgPuzzleURL);
        });
	},
	clearScreenAndShow: function(pageIds, bgColor, bgUrl){
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
		$('.body-inner').css('background-color', bgColor);
		$('.body-inner').css('background-image', (bgUrl==null?'':(bgUrl=='none'?'none':'url('+bgUrl+')')));
		
		pageIds.forEach(function (pageId, index) {
		  $(pageId).css('display', 'block');
		});
		$('#page-menu-footer').css('display', 'block');
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
}

window.updateClock = function(time) {
    if (PRITT_GAME.gameRestarted) {
        PRITT_GAME.gameRestarted = false;
    } else {
        $('#pendingSeconds').html(time);
        if (time == 0) {
            gameOver();
        } else {
            time -= 1;
            setTimeout("updateClock(" + time + ")", 1000);
        }
    }
}