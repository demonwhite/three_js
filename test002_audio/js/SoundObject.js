// Creating a sound controller class
// This class should obtain:
// WebAudioContext / XMLHttpRequest / Playback controls / FFT gets
var SoundObject = function(sampleSize) {
	console.log("creating Sound Object Class");
	this.isPlaying = false;
	this.isReady = false;
	this.debugMode = false;
	var contextClass = (window.AudioContext || 
		window.webkitAudioContext || 
		window.mozAudioContext || 
		window.oAudioContext || 
		window.msAudioContext);
	if (contextClass) {
		// Web Audio API is available.
		this.context = new contextClass();
		console.log("here is our context");
	} else {
	  // Web Audio API is not available. Ask the user to use a supported browser.
		console.log("there is an issue with creating Audio Context");
	}
	this.sourceBuffer = this.context.createBufferSource();
	this.analyser = this.context.createAnalyser();
	this.analyser.smoothingTimeConstant = 0.3;
	this.analyser.fftSize = sampleSize;
	this.bufferLength = this.analyser.frequencyBinCount;
	this.fft = new Uint8Array(this.bufferLength);  // the fft array
	if(this.debugMode) console.log(this.fft);
	this.loadedPercentage = 0;
	this.fileIsReady = false;
}
SoundObject.prototype.init = function(arrayBufferObject) {
	console.log("Class initiated: ");
	this._decodeAudioData(arrayBufferObject);
	this.isReady = true;
}
SoundObject.prototype.play = function() {
	//
	if (this.debugMode) console.log("play the sound");
	//
	if (this.context.state != "suspended") {
		this.sourceBuffer.start(0);
	}else{
		this.context.resume();
	}
	this.isPlaying = true;
}
SoundObject.prototype.pause = function() {
	//
	if(this.debugMode) console.log("pause the sound");
	//
	this.context.suspend();	
	this.isPlaying = false;
}
SoundObject.prototype.updateFFT = function() {
	// get the frequency from 0 ~ 255
	this.analyser.getByteFrequencyData(this.fft);
	if(this.debugMode) console.log("updateFFT: " + this.fft);
}


SoundObject.prototype._decodeAudioData = function(arrayBuffer) {
	arrayBuffer.parent = this;
	this.context.decodeAudioData(arrayBuffer, function (buffer) {
		// console.log(arrayBuffer.parent);
		arrayBuffer.parent.analyser.getByteTimeDomainData(arrayBuffer.parent.fft);
        arrayBuffer.parent.sourceBuffer.buffer = buffer;
        arrayBuffer.parent.sourceBuffer.connect( arrayBuffer.parent.analyser );
        arrayBuffer.parent.analyser.connect(arrayBuffer.parent.context.destination);
	});
}