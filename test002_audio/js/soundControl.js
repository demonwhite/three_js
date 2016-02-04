var ctx; //audio context 
var buf; //audio buffer 
var fft; //fft audio node 
var samples = 256; 
var setup = false; //indicate if audio is set up yet 
 
 
//init the sound system 
function soundInit() { 
    console.log("in init"); 
    try { 
        ctx = new AudioContext(); //is there a better API for this? 
        // setupCanvas(); 
        loadFile(); 
    } catch(e) { 
        alert('you need webaudio support' + e); 
    } 
} 
window.addEventListener('load',soundInit,false); 
 
//load the mp3 file 
function loadFile() { 
    var req = new XMLHttpRequest(); 
    req.open("GET","sounds/changes.mp3",true); 
    //we can't use jquery because we need the arraybuffer type 
    req.responseType = "arraybuffer"; 
    req.onload = function() { 
        //decode the loaded data 
        ctx.decodeAudioData(req.response, function(buffer) { 
            buf = buffer; 
            play(); 
        }); 
    }; 
    req.send(); 
} 

function play() { 
    //create a source node from the buffer 
    var src = ctx.createBufferSource();  
    src.buffer = buf; 
     
    //create fft 
    fft = ctx.createAnalyser();
    fft.smoothingTimeConstant = 0.3;
    fft.fftSize = samples; 
     
    //connect them up into a chain 
    src.connect(fft); 
    fft.connect(ctx.destination); 
     
    //play immediately 
    src.start(0); 
    setup = true; 

} 

function soundUpdate() { 
    var data = new Uint8Array(samples); 
    fft.getByteFrequencyData(data); 
    console.log(data); 
} 