var audioContext; //audio context 
var buf; //audio buffer 
var fft; //fft audio node 
var samples = 512; 
var setup = false; //indicate if audio is set up yet 


//init the sound system 
function soundInit() { 
    console.log("sound in init"); 
    try { 
        audioContext = new (window.AudioContext || window.webkitAudioContext); //is there a better API for this? 
        // setupCanvas(); 
        loadFile(); 
    } catch(e) { 
        alert('you need webaudio support' + e); 
    } 
} 
window.addEventListener('load', soundInit, false); 

//load the mp3 file 
function loadFile() { 
    var req = new XMLHttpRequest(); 
    req.open("GET","sounds/day.mp3",true); 
    //we can't use jquery because we need the arraybuffer type 
    req.responseType = "arraybuffer"; 
    req.onload = function() { 
        //decode the loaded data 
        audioContext.decodeAudioData(req.response, function(buffer) { 
            buf = buffer; 
            initBuffer(); 
        }); 
    }; 
    req.send(); 
} 

function initBuffer() { 
    //create a source node from the buffer 
    var src = audioContext.createBufferSource();  
    src.buffer = buf; 
    
    //create fft 
    fft = audioContext.createAnalyser();
    fft.smoothingTimeConstant = 0.3;
    fft.fftSize = samples; 
    
    //connect them up into a chain 
    src.connect(fft); 
    fft.connect(audioContext.destination); 
    
    //play immediately 
    src.start(0); 
    setup = true; 
    // audioContext.suspend();
} 

function soundUpdate() { 
    var data = new Uint8Array(samples); 
    fft.getByteFrequencyData(data); 
    console.log(data); 
} 