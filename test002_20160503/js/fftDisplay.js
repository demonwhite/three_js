(function () {
	var fft = document.getElementById( 'fft' ),
		toggle = document.getElementById( 'togglefft' );
	toggle.addEventListener( 'click', function ( e ) {
		e.preventDefault();
		fft.style.display = fft.style.display == 'block' ? 'none' : 'block';
	}, true );

	// Due to requiring loading message to float above the rest (absolute)
	// But still wanting it centered;
	// var loading = document.getElementById('loading');
	// loading.style.marginLeft = (( window.outerWidth - 500 ) / 2) + 'px';
})();