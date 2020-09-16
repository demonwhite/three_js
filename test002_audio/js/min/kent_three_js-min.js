function soundInit(){console.log("sound in init");try{audioContext=new(window.AudioContext||window.webkitAudioContext),loadFile()}catch(e){alert("you need webaudio support"+e)}}function loadFile(){var e=new XMLHttpRequest;e.open("GET","sounds/day.mp3",!0),e.responseType="arraybuffer",e.onload=function(){audioContext.decodeAudioData(e.response,function(e){buf=e,initBuffer()})},e.send()}function initBuffer(){var e=audioContext.createBufferSource();e.buffer=buf,fft=audioContext.createAnalyser(),fft.smoothingTimeConstant=.3,fft.fftSize=samples,e.connect(fft),fft.connect(audioContext.destination),e.start(0),setup=!0}function soundUpdate(){var e=new Uint8Array(samples);fft.getByteFrequencyData(e),console.log(e)}function FileLoader(){this.fileList=[],this.content={},this.totalBar=!1,this.indivisualBar=!1,this.totalBar=document.getElementById("progressBar"),this.indivisualBar=document.getElementById("progressBar-indivisual")}function KVec3(e,t){this.rangeMax=Math.PI/3*Math.random()*2+Math.PI/3,this.rangeMin=Math.PI/3*Math.random(),this.velocity=.02*(Math.random()-.5),this.velocity<=0?this.velocity-.01:this.velocity+.01,this.numConnected=0,this.radius=this.originalRadius=e,this.theta=Math.random()*Math.PI*2,this.phi=Math.random()*(this.rangeMax-this.rangeMin)+this.rangeMin,this.SEED=Math.random(),this.ID=t,this.FIELD=10+10*Math.random(),this.onFFT=!1;var n,i,o;n=this.radius*Math.sin(this.theta)*Math.cos(this.pi),i=this.radius*Math.sin(this.theta)*Math.sin(this.pi),o=this.radius*Math.cos(this.theta),THREE.Vector3.call(this,n,i,o)}function initGUI(){gui=new dat.GUI({autoPlace:!1});var e=document.getElementById("my-gui-container");e.appendChild(gui.domElement);var t=gui.addFolder("Vocal");t.add(soundChannel.vocal,"position",0,FFT_SIZE),t.add(soundChannel.vocal,"min",0,150).name("Max Value"),t.add(soundChannel.vocal,"max",151,255).name("Min Value"),t.add(soundChannel.vocal,"value",0,255);var n=gui.addFolder("Bass");n.add(soundChannel.bass,"position",0,FFT_SIZE),n.add(soundChannel.bass,"min",0,150),n.add(soundChannel.bass,"max",151,255),n.add(soundChannel.bass,"value",0,255);var i=gui.addFolder("High");i.add(soundChannel.high,"position",0,FFT_SIZE),i.add(soundChannel.high,"min",0,150),i.add(soundChannel.high,"max",151,255),i.add(soundChannel.high,"value",0,255);var o=gui.addFolder("Low");o.add(soundChannel.low,"position",0,FFT_SIZE),o.add(soundChannel.low,"min",0,150),o.add(soundChannel.low,"max",151,255),o.add(soundChannel.low,"value",0,255);var a=gui.addFolder("Camera");a.add(cameraControls,"fov",30,120).name("FOV"),a.add(cameraControls,"zoom",2,5).name("Zoom"),a.add(cameraControls,"near",1,50).name("Near"),a.add(cameraControls,"far",500,3e3).name("Far"),a.add(cameraControls,"rotateSpeed",0,.1).name("Rotation"),a.open(),console.log("GUI initialized")}function init(){scene=new THREE.Scene,camera=new THREE.PerspectiveCamera(cameraControls.fov,window.innerWidth/window.innerHeight,cameraControls.near,cameraControls.far),camera.position.set(cameraControls.x,cameraControls.y,cameraControls.z);var e=new THREE.PointLight(16711935);e.position.copy(camera.position);var t=new THREE.HemisphereLight(16777215,526368,1);scene.add(t);var n=new THREE.DodecahedronGeometry(particles_radius-150,0),i=new THREE.MeshPhongMaterial({color:10461087,shading:THREE.FlatShading});core=new THREE.Mesh(n,i),scene.add(core);var o=new THREE.IcosahedronGeometry(particles_radius-10,1),i=new THREE.MeshPhongMaterial({color:16777215,transparent:!0,opacity:.7,shading:THREE.FlatShading,shininess:0});earth=new THREE.Mesh(o,i),scene.add(earth);var a=FFT_SIZE,s=2*Math.PI;particles_geo=new THREE.BufferGeometry;var r=new Float32Array(3*a),d=new Float32Array(3*a),l=new Float32Array(a);particle_positions=[];for(var c=0;a>c;c++){var u=new KVec3(particles_radius,c);u.toArray(r,3*c),particle_positions.push(u);var h=new THREE.Color;c%15==0?h.setHSL(.9,.1,.3):h.setHSL(.01+.1*(c/a),1,.5),h.toArray(d,3*c),l[c]=100}particles_geo.addAttribute("position",new THREE.BufferAttribute(r,3)),particles_geo.addAttribute("aColor",new THREE.BufferAttribute(d,3)),particles_geo.addAttribute("size",new THREE.BufferAttribute(l,1)),line_position=new Float32Array(FFT_SIZE*FFT_SIZE*3),line_color=new Float32Array(FFT_SIZE*FFT_SIZE*3),line_geometry=new THREE.BufferGeometry,line_geometry.addAttribute("position",new THREE.BufferAttribute(line_position,3).setDynamic(!0)),line_geometry.addAttribute("color",new THREE.BufferAttribute(line_color,3).setDynamic(!0));var p=new THREE.PointsMaterial({color:0,size:3});particle=new THREE.Points(particles_geo,p),scene.add(particle),line_material=new THREE.LineBasicMaterial({vertexColors:THREE.VertexColors,blending:THREE.SubtractiveBlending,transparent:!0}),line_mesh=new THREE.LineSegments(line_geometry,line_material),line_mesh.geometry.setDrawRange(0,0),scene.add(line_mesh);var f=document.createElement("div");f.style.position="absolute",f.style.top="10px",f.style.width="100%",f.style.textAlign="center",f.style.color="#fff",f.style.link="#f80",f.innerHTML='<a href="http://threejs.org" target="_blank">three.js</a> kent&rsquo;s test',document.body.appendChild(f),renderer=new THREE.WebGLRenderer({antialias:!0}),renderer.setClearColor(14540253),renderer.setPixelRatio(window.devicePixelRatio),renderer.setSize(window.innerWidth,window.innerHeight),renderer.gammaInput=!0,renderer.gammaOutput=!0,renderer.domElement.id="canvas",document.body.appendChild(renderer.domElement),stats=new Stats,stats.domElement.style.position="absolute",stats.domElement.style.top="0px",stats.domElement.style.right="0px",f.appendChild(stats.domElement),controls=new THREE.TrackballControls(camera,renderer.domElement),controls.minDistance=200,controls.maxDistance=500}function render(){scene.rotation.y+=cameraControls.rotateSpeed,scene.rotation.x+=cameraControls.rotateSpeed,checkZoom(),updateGUI(),sc.isPlaying&&(updateFFT(),parseFFT()),updatePosition(),checkDistance(),controls.update(),stats.update(),renderer.render(scene,camera),requestAnimationFrame(render)}function updateFFT(){if(sc.isPlaying){sc.updateFFT(),fftList=sc.fft;for(var e=Math.floor(fftList.length/nFFTBands),t=[50,100,150,200,250],n=0;nFFTBands>n;n++){for(var i=0,o=n;n*e>o;o++)i+=fftList[o];i/=e,i>=t[n]?fftBands[n]=i:fftBands[n]=t[n]}}else for(n in fftList)fftList[n]=0}function updateGUI(){for(var e in gui.__folders){var t=gui.__folders[e];for(var n in t.__controllers)t.__controllers[n].updateDisplay()}fftList&&(soundChannel.vocal.value=fftList[Math.floor(soundChannel.vocal.position)]),camera.fov=cameraControls.fov,camera.near=cameraControls.near,camera.far=cameraControls.far,camera.updateProjectionMatrix()}function updateFakeFFT(){for(var e=Date.now(),t=0;t<fakeFFT.length;t++){var n=noise.simplex2(t,e);fakeFFT[t]=n/2}fakeFFT.reverse()}function parseFFT(){}function checkZoom(){}function checkDistance(){for(var e,t,n=40,i=3,o=0,a=0,s=0,r=0;FFT_SIZE>r;r++)particle_positions[r].numConnected=0;for(var d=0;FFT_SIZE>d;d++)if(e=particle_positions[d],!(e.numConnected>=i))for(var l=d+1;FFT_SIZE>l;l++){t=particle_positions[l];var c=e.x-t.x,u=e.y-t.y,h=e.z-t.z,p=Math.sqrt(c*c+u*u+h*h);if(!(t.numConnected>=i)&&n>p){e.numConnected++,t.numConnected++,line_position[o++]=e.x,line_position[o++]=e.y,line_position[o++]=e.z,line_position[o++]=t.x,line_position[o++]=t.y,line_position[o++]=t.z;var f=1-p/n;line_color[a++]=f,line_color[a++]=f,line_color[a++]=f,line_color[a++]=f,line_color[a++]=f,line_color[a++]=f,s++}}line_mesh.geometry.setDrawRange(0,2*s),line_mesh.geometry.attributes.position.needsUpdate=!0,line_mesh.geometry.attributes.color.needsUpdate=!0}function updatePosition(){for(var e=soundChannel.vocal.value,t=soundChannel.bass.value,n=particle_positions.length/nFFTBands,i=0;n>i;i++){var o=Math.floor(Math.random()*particle_positions.length);particle_positions[o].FFTin(e)}var a=particle.geometry.attributes;for(p in particle_positions){particle_positions[p].movePos();var r,d;r=particle_positions[p];for(s in particle_positions)d=particle_positions[s],r.ID!=d.ID&&r.pushPos(d);a.position.array[3*p]=particle_positions[p].x,a.position.array[3*p+1]=particle_positions[p].y,a.position.array[3*p+2]=particle_positions[p].z,255===fftList[p]&&popCloud===!0&&_createBox(particle_positions[p].x,particle_positions[p].y,particle_positions[p].z)}a.position.needsUpdate=!0}function _createBox(e,t,n){var i=10,o=new THREE.BoxGeometry(i,i,i);o.translate(e,t,n);var a=new THREE.MeshDepthMaterial({wireframe:!1}),s=new THREE.Mesh(o,a);scene.add(s)}function updateAudioData(){}function dealWithKeyboard(e){switch(console.log(e.keyCode),e.keyCode){case 73:console.log("key I pressed"),information=!information;break;case 32:runningCamera=!runningCamera,console.log("switch camera: "+runningCamera);break;default:console.log("no key action taken, pressed: "+e.keyCode)}information?(gui.domElement.hidden=!1,stats.domElement.hidden=!1,document.getElementById("progressBar").style.display="block",document.getElementById("progressBar-indivisual").style.display="block"):(gui.domElement.hidden=!0,stats.domElement.hidden=!0,document.getElementById("progressBar").style.display="none",document.getElementById("progressBar-indivisual").style.display="none")}function testClick(){console.log("Document Clicked")}function debug(){}function updateShader(){var e=.01*Date.now()}var audioContext,buf,fft,samples=512,setup=!1;window.addEventListener("load",soundInit,!1);var SoundObject=function(e){console.log("creating Sound Object Class"),this.isPlaying=!1,this.isReady=!1,this.debugMode=!1,this.time="no available value";var t=window.AudioContext||window.webkitAudioContext||window.mozAudioContext||window.oAudioContext||window.msAudioContext;t?(this.context=new t,console.log("here is our context")):console.log("there is an issue with creating Audio Context"),this.sourceBuffer=this.context.createBufferSource(),this.analyser=this.context.createAnalyser(),this.analyser.smoothingTimeConstant=.3,this.analyser.fftSize=e,this.bufferLength=this.analyser.frequencyBinCount,this.fft=new Uint8Array(this.bufferLength),this.debugMode&&console.log(this.fft),this.loadedPercentage=0,this.fileIsReady=!1};SoundObject.prototype.init=function(e){console.log("Class initiated: "),this._decodeAudioData(e),e.time?this.time=e.time:console.log("no time available"),this.isReady=!0},SoundObject.prototype.play=function(){this.debugMode&&console.log("play the sound"),"suspended"!=this.context.state?this.sourceBuffer.start(0):this.context.resume(),this.isPlaying=!0},SoundObject.prototype.pause=function(){this.debugMode&&console.log("pause the sound"),this.context.suspend(),this.isPlaying=!1},SoundObject.prototype.updateFFT=function(){this.analyser.getByteFrequencyData(this.fft),this.debugMode&&console.log("updateFFT: "+this.fft)},SoundObject.prototype._decodeAudioData=function(e){e.parent=this,this.context.decodeAudioData(e,function(t){e.parent.analyser.getByteTimeDomainData(e.parent.fft),e.parent.sourceBuffer.buffer=t,e.parent.sourceBuffer.connect(e.parent.analyser),e.parent.analyser.connect(e.parent.context.destination)})},FileLoader.prototype.start=function(e){this.fileList=e;var t=this.fileList,n=this.content;console.log(this.fileList);var i=function(e){console.log("load started")},o=function(e){var t=e.loaded/e.total*100;this.indivisualBar.value=t,console.log(e.loaded+" / "+e.total+" / "+e.target.fileID)},a=function(e){r++;var i=r/s*100;this.totalBar.value=i,console.log("log finished"),n[e.target.fileID]=e.target.response,n[e.target.fileID].time=e.target.time,r===t.length&&document.dispatchEvent(allFilesLoaded)},s=this.fileList.length,r=0,d=0;for(object in this.fileList){var l=new XMLHttpRequest;l.open("GET",this.fileList[object].path,!0),l.responseType=this.fileList[object].type,l.time=this.fileList[object].time,l.fileID=this.fileList[object].name,l.totalBar=this.totalBar,l.indivisualBar=this.indivisualBar,l.addEventListener("loadstart",i,!0),l.addEventListener("progress",o,!0),l.addEventListener("loadend",a,!0),l.send()}},KVec3.prototype=THREE.Vector3.prototype,KVec3.prototype.FFTin=function(e){var t=this.originalRadius+e/10;e>=200?(this.radius+=(t-this.radius)/5,this.onFFT=!0):(this.radius+=(this.originalRadius-this.radius)/10,this.onFFT=!1)},KVec3.prototype.movePos=function(){this.phi<this.rangeMin||this.phi>this.rangeMax?this.SEED*=-1:this.SEED+=.001,this.phi+=this.SEED/500,this.theta+=this.velocity;var e=new THREE.Vector3;e.x=this.radius*Math.sin(this.phi)*Math.cos(this.theta),e.y=this.radius*Math.cos(this.phi),e.z=this.radius*Math.sin(this.phi)*Math.sin(this.theta);var t=e.sub(this);this.add(t)},KVec3.prototype.pushPos=function(e){var t=this.distanceTo(e);if(t<=this.FIELD){this.phi+=this.velocity*this.SEED,this.theta+=this.velocity*(Math.random()-.5);var n=new THREE.Vector3(this.x,this.y,this.z);n.sub(e),n.normalize(),this.add(n)}},KVec3.prototype.randomUpdate=function(){console.log("the theta is : "+this.theta+"/ this x y z: "+this.x+"/"+this.y+"/"+this.z)};var sc=new SoundObject(1024),fileLoader=new FileLoader,files=[{name:"music",path:"sounds/day.mp3",type:"arraybuffer",time:400}];fileLoader.start(files);var allFilesLoaded=new Event("fire");document.addEventListener("fire",function(e){console.log("FIRRRRRRRRRRE!!!!!!"),document.getElementById("audio-play").classList.add("avl"),sc.init(fileLoader.content.music)}),document.getElementById("audio-play").addEventListener("click",function(){sc.play()}),document.getElementById("audio-pause").addEventListener("click",function(){sc.pause()});var camera,scene,renderer,controls,stats,fftList,core,earth,FFT_SIZE=256,fftList=new Array(FFT_SIZE),particle,particles_geo,particle_met,pt_uniforms,particles_radius=250,fftBands=[],nFFTBands=5,particle_positions,fakeFFT,line_position,line_color,line_geometry,line_material,line_mesh,gui,information=!0,popCloud=!1,runningCamera=!1,cameraControls={fov:65,near:1,far:1e3,zoom:2,rotateSpeed:.001,x:0,y:0,z:300},soundChannel={vocal:{position:0,max:255,min:0,value:100},bass:{position:20,max:255,min:0,value:100},high:{position:40,max:255,min:0,value:100},low:{position:60,max:255,min:0,value:100}},sound_group;initGUI(),init(),render(),window.addEventListener("keyup",dealWithKeyboard,!1),document.addEventListener("click",debug,!1);