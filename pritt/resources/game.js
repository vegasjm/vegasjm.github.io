var PRITT_GAME = PRITT_GAME || {
	language: null,
	phase: 'world-selector',
	world:1,
	gameDuration:90,
	init: function(){
		this.loadLanguageSelector();
		this.loadHome();
		this.loadWorlds();
		this.loadGamePhase1();
		this.loadFooter();
	},
	loadLanguageSelector: function() {
		$('#btn-languageSelector').on('touch click', function(e){
			var language = $('#languageSelector').find(":selected").val();
			PRITT_GAME.language = language;
			//TODO: Load all texts function	
			PRITT_GAME.loadHome();			
		});
	},
	loadFooter: function() {
		$('#footer-item-settings').on('touch click', function(e){
			var canvas = document.getElementById('game');
			$(canvas).empty();
			$('#settings').css('display','block');
			$('#menu-home').css('display','none');
			$('#game-intro').css('display','none');
			$('#game-phase1').css('display','none');
			$('.body-inner').css('background-color','#DEBE82');
			$('.body-inner').css('background-image','url(./resources/img/bg-lang.png)');		
		});
	},
	loadHome: function(){
		if(PRITT_GAME.language == null){
			$('#settings').css('display','block');
			$('#menu-home').css('display','none');
			$('.body-inner').css('background-color','#DEBE82');
			$('.body-inner').css('background-image','url(./resources/img/bg-lang.png)');
		}else{
			$('#settings').css('display','none');
			$('.menu-home').css('display','block');
			$('#legal').css('display','block');
			$('#page-menu-footer').css('display','block');
			//TODO: $('.menu-home').css('background-image','url(./resources/img/bg.png)');
			$('.body-inner').css('background-color','#1578A7');
			$('.body-inner').css('background-image','');
		}
	},
	loadWorlds: function() {
		$('.btn-home-world').on('touch click', function(e){
			PRITT_GAME.phase = 'game-1';
			PRITT_GAME.world=$(this).attr('data-world');
			$('#legal').css('display','none');
			setTimeout(function() {
				$('.menu-home').css('display','none');
				$('#game-intro').css('display','flex');
				$('.game-character-img').attr("src",'./resources/img/world-'+PRITT_GAME.world+'/world-'+PRITT_GAME.world+'-character.png');
				$('#world-item').attr("src",'./resources/img/diamond-'+PRITT_GAME.world+'.png');
				if(PRITT_GAME.world == 2 || PRITT_GAME.world == 3) {
					$('.game-character-img').css('float','right');
						$('#game-wizard').css('transform','rotate(-28deg)');
						$('#game-wizard').css('margin-left','-5rem');
					if( PRITT_GAME.world == 2) {
						$('.body-inner').css('background-color','#F4E0B3');
						$('.game-character-img').css('max-width','26vh');
						$('#game-wizard-text').html('');
						showText('#game-wizard-text','Oh no! @The rainbow on my @beach is gone!',0,75);
					}
					if( PRITT_GAME.world == 3) {
						$('.body-inner').css('background-color','#8652A9');
						$('.game-character-img').css('max-width','28vh');
						$('#game-wizard-text').html('');
						showText('#game-wizard-text','I need your help to @make my cave @shine again!',0,75);
					}
				} else {
					if(PRITT_GAME.world == 1){
						$('.body-inner').css('background-color','#fbeda4');
						$('#game-wizard').css('transform','rotate(0deg)');
						$('#game-wizard').css('margin-left','-1rem');
						$('.game-character-img').css('float','left');
						$('.game-character-img').css('max-width','28vh');
						$('#game-wizard-text').html('');
						showText('#game-wizard-text','This forest is losing @its magic... @Will you help me?',0,75);
					}
				}
				$('.body-inner').css('background-image','url(./resources/img/world-'+PRITT_GAME.world+'/world-'+PRITT_GAME.world+'-bg1.png)');
			}, 500);
		});
	},
	loadGamePhase1: function() {
		$('#btn-start-game-phase1').on('touch click', function(e){
			setTimeout(() => { $(window).scrollTop(); }, 100);			
			var heightGame = window.innerHeight - $("#page-header").height() - ($("#menu-footer").height() * 2)
			if( PRITT_GAME.world == 1) $('.body-inner').css('background-color','#E1D48D');
			if( PRITT_GAME.world == 2) $('.body-inner').css('background-color','#B3E6DA');
			if( PRITT_GAME.world == 3) $('.body-inner').css('background-color','#57319D');
			$('.body-inner').css('background-image','url(./resources/img/world-'+PRITT_GAME.world+'/world-'+PRITT_GAME.world+'-bg2.png)');
			$('#game-intro').css('display','none');
			$('#game-phase1').css('display','block');
			$('#game-phase1-stats').css('display','flex');
			var canvas = document.getElementById('game');
			var contentContainerNode = document.getElementById('game-phase1');
			canvas.height = heightGame;
			canvas.width = contentContainerNode.offsetWidth;
			$('#game-phase1-stats').css('height',heightGame+'px');
			$('#game-phase1-stats').css('width',contentContainerNode.offsetWidth+'px');
			$('#game-phase1').css('height',heightGame+'px');
			updateClock(PRITT_GAME.gameDuration);
			resize();
		});
	}
}

window.onload = function () {
    PRITT_GAME.init();
};


var showText = function (target, message, index, interval) {   
  if (index < message.length) {
    $(target).html($(target).html()+message[index++].replace('@','<br/>'));
    setTimeout(function () { showText(target, message, index, interval); }, interval);
  }
}

window.updateClock = function(time) {
	$('#pendingSeconds').html(time);
	if(time==0){
		gameOver();
	}else{
		time-=1;
		setTimeout("updateClock("+time+")",1000);
	}
}