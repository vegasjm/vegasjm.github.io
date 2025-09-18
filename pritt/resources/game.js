var PRITT_GAME = PRITT_GAME || {
	phase: 'world-selector',
	init: function(){
		this.loadTitleButtonBehaviours();
		this.loadWorldSelectorsButtonBehaviours();
	},
	loadTitleButtonBehaviours: function(){
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
	loadWorldSelectorsButtonBehaviours: function() {
		$('.btn-home-world').on('touch click', function(e){
			PRITT_GAME.phase = 'game-1';
			var world=$(this).attr('data-world');
			$('#legal').css('display','none');
			setTimeout(function() {
				$('.menu-home').css('display','none');
				$('#game').css('display','flex');
				$('.game-character-img').attr("src",'./resources/img/world-'+world+'/world-'+world+'-character.png');
				$('.body-inner').css('background-image','url(./resources/img/world-'+world+'/world-'+world+'-bg'+world+'.png)');
				$('#body-overlay').css('background-image','url(./resources/img/world-'+world+'/world-'+world+'-bg'+world+'.png)');
			}, 500);
		});
	}
}

window.onload = function () {
    PRITT_GAME.init();
};