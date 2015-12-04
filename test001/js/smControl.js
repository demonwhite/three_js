var audioCtx,

audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var osc = audioCtx.createOscillator();
osc.frequency.value = 240;
osc.connect(audioCtx.destination);
// osc.start();

var audio = new Audio();
audio.src = "sounds/sample.wav";
audio.controls = true;
audio.loop = false;
audio.autoplay = true;

// establish all the variables needed
var actx, canvas, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;
// initialize player after page loaded
window.addEventListener("load", initPlayer, false); 
function initPlayer(){
  document.getElementById('audio').appendChild(audio);
  context = new AudioContext();
  analyser = context.createAnalyser();
  canvas = document.getElementById('bar');
  actx = canvas.getContext('2d');
  // reroute audio playback
  source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);
  frameLooper();
}

// Frame Loop is where all the graphic goes
function frameLooper(){
  window.requestAnimationFrame(frameLooper);
  fbc_array = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(fbc_array);
  actx.clearRect(0,0,canvas.width, canvas.height);
  actx.fillStyle = '#00CCFF';
  bars = 100;
  for (var i = 0; i < bars; i++) {
    bar_x = i*3;
    bar_width = 2;
    bar_height = -( fbc_array[i] / 2 );
    actx.fillRect(bar_x, canvas.height, bar_width, bar_height);
  }
}