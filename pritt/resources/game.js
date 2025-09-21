var PRITT_GAME = PRITT_GAME || {
	phase: 'world-selector',
	world:1,
	init: function(){
		this.loadHome();
		this.loadWorlds();
		this.loadGamePhase1();
	},
	loadHome: function(){
		$('.btn-home-world').on('touchstart mouseover', function(e){
			if(PRITT_GAME.phase == 'world-selector'){
				var world=$(this).attr('data-world');
				$('.body-inner').css('background-image','url(./resources/img/bg.png)');
				$('#body-overlay').css('background-image','url(./resources/img/bg-world/bg-world-'+world+'.png)');
			}
		});
		$('.btn-home-world').on('touchend mouseout', function(e){
			if(PRITT_GAME.phase == 'world-selector'){
				$('#body-overlay').css('background-image','url(./resources/img/bg.png)');
				$('.body-inner').css('background-image','url(./resources/img/bg.png)');
			}
		});
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
				$('#body-overlay').css('background-image','url(./resources/img/world-'+PRITT_GAME.world+'/world-'+PRITT_GAME.world+'-bg1.png)');
			}, 500);
		});
	},
	loadGamePhase1: function() {
		$('#btn-start-game-phase1').on('touch click', function(e){
			if( PRITT_GAME.world == 1) $('.body-inner').css('background-color','#E1D48D');
			if( PRITT_GAME.world == 2) $('.body-inner').css('background-color','#B3E6DA');
			if( PRITT_GAME.world == 3) $('.body-inner').css('background-color','#57319D');
			$('.body-inner').css('background-image','url(./resources/img/world-'+PRITT_GAME.world+'/world-'+PRITT_GAME.world+'-bg2.png)');
			$('#body-overlay').css('background-image','url(./resources/img/world-'+PRITT_GAME.world+'/world-'+PRITT_GAME.world+'-bg2.png)');
			$('#game-intro').css('display','none');
			$('#game-phase1').css('display','block');
			$('#game-phase1-stats').css('display','flex');
			var canvas = document.getElementById('game');
			var contentContainerNode = document.getElementById('game-phase1');
			canvas.height = contentContainerNode.offsetHeight;
			canvas.width = contentContainerNode.offsetWidth;
			$('#game-phase1-stats').css('height',contentContainerNode.offsetHeight+'px');
			$('#game-phase1-stats').css('width',contentContainerNode.offsetWidth+'px');
			$('#game-phase1').css('height','auto');
			updateClock(90);
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

var updateClock = function(time) {
	$('#pendingSeconds').html(time);
	if(time==0){

	}else{
		time-=1;
		setTimeout("updateClock("+time+")",1000);
	}
}