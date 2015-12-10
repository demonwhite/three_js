(function () {

	var AUDIO_FILE = 'sounds/baby',
		dancer, kick;

	// Dancer.js 
	Dancer.setOptions({
		flashSWF : 'dancer_js/lib/soundmanager2.swf',
		flashJS  : 'dancer_js/lib/soundmanager2.js'
	})
	dancer = new Dancer();
	dancer.isKick = false;
	kick = dancer.createKick({
		onKick: function (){
			// console.log('on kick');
			dancer.isKick = true;
		},
		offKick: function (){
			// console.log('off kick');
			dancer.isKick = false;
		},
		threshold: 0.25
	});
	kick.on();

  dancer
    .fft( document.getElementById('fft') )
    .load({ src: AUDIO_FILE, codecs: [ 'mp3' ]}); //add "ogg" or any other files if needed

  Dancer.isSupported() || loaded();
  !dancer.isLoaded() ? dancer.bind( 'loaded', loaded ) : loaded();

  function loaded () {
    var
      loading = document.getElementById( 'loading' ),
      anchor  = document.createElement('A'),
      supported = Dancer.isSupported(),
      p;
    
    console.log(loading);
    anchor.appendChild( document.createTextNode( supported ? 'Play!' : 'Close' ) );
    anchor.setAttribute( 'href', '#' );
    loading.innerHTML = '';
    loading.appendChild( anchor );

    if ( !supported ) {
      p = document.createElement('P');
      p.appendChild( document.createTextNode( 'Your browser does not currently support either Web Audio API or Audio Data API. The audio may play, but the visualizers will not move to the music; check out the latest Chrome or Firefox browsers!' ) );
      loading.appendChild( p );
    }

    anchor.addEventListener( 'click', function () {
      if (!dancer.isPlaying()) {
      	dancer.play();
      }else{
      	dancer.pause();
      }
      // dancer.play();
      // document.getElementById('loading').style.display = 'none';
    }, false );

  }

  // For debugging
  window.dancer = dancer;
  // dancer.play();
})();