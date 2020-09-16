function FileLoader(){this.fileList=[],this.content={},this.totalBar=!1,this.indivisualBar=!1,this.totalBar=document.getElementById("progressBar"),this.indivisualBar=document.getElementById("progressBar-indivisual")}function KVec3(e,t){this.rangeMax=Math.PI/2*Math.random()+Math.PI/2,this.rangeMin=Math.PI/2*Math.random(),this.velocity=.01*(2*(Math.random()-.5)),this.numConnected=0,this.radius=this.originalRadius=e,this.theta=Math.random()*(this.rangeMax-this.rangeMin)+this.rangeMin,this.pi=(2*Math.random()-.5)*Math.PI,this.SEED=Math.random(),this.ID=t,this.onFFT=!1;var n,i,a;n=this.radius*Math.sin(this.theta)*Math.cos(this.pi),i=this.radius*Math.sin(this.theta)*Math.sin(this.pi),a=this.radius*Math.cos(this.theta),THREE.Vector3.call(this,n,i,a)}function initGUI(){gui=new dat.GUI({autoPlace:!1});var e=document.getElementById("my-gui-container");e.appendChild(gui.domElement);var t=gui.addFolder("Vocal");t.add(soundChannel.vocal,"position",0,fftSizeTemp),t.add(soundChannel.vocal,"min",0,150).name("Max Value"),t.add(soundChannel.vocal,"max",151,255).name("Min Value"),t.add(soundChannel.vocal,"value",0,255),t.open();var n=gui.addFolder("Bass");n.add(soundChannel.bass,"position",0,fftSizeTemp),n.add(soundChannel.bass,"min",0,150),n.add(soundChannel.bass,"max",151,255),n.add(soundChannel.bass,"value",0,255),n.open();var i=gui.addFolder("High");i.add(soundChannel.high,"position",0,fftSizeTemp),i.add(soundChannel.high,"min",0,150),i.add(soundChannel.high,"max",151,255),i.add(soundChannel.high,"value",0,255),i.open();var a=gui.addFolder("Low");a.add(soundChannel.low,"position",0,fftSizeTemp),a.add(soundChannel.low,"min",0,150),a.add(soundChannel.low,"max",151,255),a.add(soundChannel.low,"value",0,255),a.open();var o=gui.addFolder("Camera");o.add(cameraControls,"fov",30,120).name("FOV"),o.add(cameraControls,"near",1,50).name("Near"),o.add(cameraControls,"far",500,3e3).name("Far"),o.open(),console.log("GUI initialized")}function init(){scene=new THREE.Scene,camera=new THREE.PerspectiveCamera(cameraControls.fov,window.innerWidth/window.innerHeight,cameraControls.near,cameraControls.far),camera.position.set(cameraControls.x,cameraControls.y,cameraControls.z);var e=new THREE.PointLight(16711935);e.position.copy(camera.position),scene.add(e);var t=new THREE.IcosahedronGeometry(50,1),n=new THREE.MeshDepthMaterial({wireframe:!1});coreBall=new THREE.Mesh(t,n);var i=fftSizeTemp,a=2*Math.PI;particles_geo=new THREE.BufferGeometry;var o=new Float32Array(3*i),s=new Float32Array(3*i),r=new Float32Array(i);particle_positions=[];for(var l=0;i>l;l++){var d=new KVec3(particles_radius,l);d.toArray(o,3*l),particle_positions.push(d);var c=new THREE.Color;15==l?c.setHSL(.9,.1,.3):c.setHSL(.01+.1*(l/i),1,.5),c.toArray(s,3*l),r[l]=100}particles_geo.addAttribute("position",new THREE.BufferAttribute(o,3)),particles_geo.addAttribute("aColor",new THREE.BufferAttribute(s,3)),particles_geo.addAttribute("size",new THREE.BufferAttribute(r,1)),line_position=new Float32Array(fftSizeTemp*fftSizeTemp*3),line_color=new Float32Array(fftSizeTemp*fftSizeTemp*3),line_geometry=new THREE.BufferGeometry,line_geometry.addAttribute("position",new THREE.BufferAttribute(line_position,3).setDynamic(!0)),line_geometry.addAttribute("color",new THREE.BufferAttribute(line_color,3).setDynamic(!0)),pt_uniforms={color:{type:"c",value:new THREE.Color(16777215)},texture:{type:"t",value:(new THREE.TextureLoader).load("images/spark1.png")}},particle_met=new THREE.ShaderMaterial({uniforms:pt_uniforms,vertexShader:document.getElementById("pv").textContent,fragmentShader:document.getElementById("pf").textContent,alphaTest:.9});var u=new THREE.PointsMaterial({color:16777215,size:3});particle=new THREE.Points(particles_geo,u),scene.add(particle),line_material=new THREE.LineBasicMaterial({vertexColors:THREE.VertexColors,blending:THREE.AdditiveBlending,transparent:!0}),line_mesh=new THREE.LineSegments(line_geometry,line_material),line_mesh.geometry.setDrawRange(0,0),scene.add(line_mesh);var h=document.createElement("div");h.style.position="absolute",h.style.top="10px",h.style.width="100%",h.style.textAlign="center",h.style.color="#fff",h.style.link="#f80",h.innerHTML='<a href="http://threejs.org" target="_blank">three.js</a> kent&rsquo;s test',document.body.appendChild(h),renderer=new THREE.WebGLRenderer({antialias:!0}),renderer.setClearColor(2236962),renderer.setPixelRatio(window.devicePixelRatio),renderer.setSize(window.innerWidth,window.innerHeight),renderer.gammaInput=!0,renderer.gammaOutput=!0,renderer.domElement.id="canvas",document.body.appendChild(renderer.domElement),stats=new Stats,stats.domElement.style.position="absolute",stats.domElement.style.top="0px",stats.domElement.style.right="0px",h.appendChild(stats.domElement),controls=new THREE.TrackballControls(camera,renderer.domElement),controls.minDistance=200,controls.maxDistance=500;var p=nFFTBands;sound_group=new THREE.Object3D;for(var l=0;p>l;l++){var f=new THREE.BoxGeometry(5,5,5),m=new THREE.Color;m.g=l/5,m.r=l/3;var g=new THREE.MeshBasicMaterial({color:m.getHex()}),y=new THREE.Mesh(f,g);y.position.x=20*l+50,sound_group.add(y)}}function render(){scene.rotation.y+=.003,scene.rotation.x+=.002,updateGUI(),sc.isPlaying&&(updateFFT(),parseFFT(),updatePosition()),checkDistance(),controls.update(),stats.update(),renderer.render(scene,camera),requestAnimationFrame(render)}function updateFFT(){if(sc.isPlaying){sc.updateFFT(),fftList=sc.fft;for(var e=Math.floor(fftList.length/nFFTBands),t=[50,100,150,200,250],n=0;nFFTBands>n;n++){for(var i=0,a=n;n*e>a;a++)i+=fftList[a];i/=e,i>=t[n]?fftBands[n]=i:fftBands[n]=t[n]}}else for(n in fftList)fftList[n]=0}function updateGUI(){for(var e in gui.__folders){var t=gui.__folders[e];for(var n in t.__controllers)t.__controllers[n].updateDisplay()}fftList&&(soundChannel.vocal.value=fftList[Math.floor(soundChannel.vocal.position)]),camera.fov=cameraControls.fov,camera.near=cameraControls.near,camera.far=cameraControls.far,camera.updateProjectionMatrix()}function updateFakeFFT(){for(var e=Date.now(),t=0;t<fakeFFT.length;t++){var n=noise.simplex2(t,e);fakeFFT[t]=n/2}fakeFFT.reverse()}function parseFFT(){for(i in sound_group.children){var e=fftList[5*i]/100,t=sound_group.children[i];t.geometry.scale(1,1,1),t.verticesNeedUpdate=!0}}function checkDistance(){for(var e,t,n=40,i=3,a=0,o=0,s=0,r=0;fftSizeTemp>r;r++)particle_positions[r].numConnected=0;for(var l=0;fftSizeTemp>l;l++)if(e=particle_positions[l],!(e.numConnected>=i))for(var d=l+1;fftSizeTemp>d;d++){t=particle_positions[d];var c=e.x-t.x,u=e.y-t.y,h=e.z-t.z,p=Math.sqrt(c*c+u*u+h*h);if(!(t.numConnected>=i)&&n>p){e.numConnected++,t.numConnected++,line_position[a++]=e.x,line_position[a++]=e.y,line_position[a++]=e.z,line_position[a++]=t.x,line_position[a++]=t.y,line_position[a++]=t.z;var f=1-p/n;line_color[o++]=f,line_color[o++]=f,line_color[o++]=f,line_color[o++]=f,line_color[o++]=f,line_color[o++]=f,s++}}line_mesh.geometry.setDrawRange(0,2*s),line_mesh.geometry.attributes.position.needsUpdate=!0,line_mesh.geometry.attributes.color.needsUpdate=!0}function updatePosition(){for(var e=soundChannel.vocal.value,t=soundChannel.bass.value,n=particle_positions.length/nFFTBands,i=0;n>i;i++){var a=Math.floor(Math.random()*particle_positions.length);particle_positions[a].FFTin(e)}var o=particle.geometry.attributes;for(p in particle_positions)particle_positions[p].movePos(),o.position.array[3*p]=particle_positions[p].x,o.position.array[3*p+1]=particle_positions[p].y,o.position.array[3*p+2]=particle_positions[p].z,255===fftList[p]&&_createBox(particle_positions[p].x,particle_positions[p].y,particle_positions[p].z);o.position.needsUpdate=!0;for(var i=0;nFFTBands>i;i++)sound_group.children[i].scale.y=fftBands[i]/100}function _createBox(e,t,n){var i=10,a=new THREE.BoxGeometry(i,i,i);a.translate(e,t,n);var o=new THREE.MeshDepthMaterial({wireframe:!1}),s=new THREE.Mesh(a,o);scene.add(s)}function updateAudioData(){}function dealWithKeyboard(e){switch(console.log(e.keyCode),e.keyCode){case 73:console.log("key I pressed"),information=information?!1:!0;break;default:console.log("no key action taken")}information?(gui.domElement.hidden=!1,stats.domElement.hidden=!1,document.getElementById("progressBar").style.display="block",document.getElementById("progressBar-indivisual").style.display="block"):(gui.domElement.hidden=!0,stats.domElement.hidden=!0,document.getElementById("progressBar").style.display="none",document.getElementById("progressBar-indivisual").style.display="none")}function testClick(){console.log("Document Clicked")}function debug(){}function updateShader(){var e=.01*Date.now()}FileLoader.prototype.start=function(e){this.fileList=e;var t=this.fileList,n=this.content;console.log(this.fileList);var i=function(e){console.log("load started")},a=function(e){var t=e.loaded/e.total*100;this.indivisualBar.value=t,console.log(e.loaded+" / "+e.total+" / "+e.target.fileID)},o=function(e){r++;var i=r/s*100;this.totalBar.value=i,console.log("log finished"),n[e.target.fileID]=e.target.response,n[e.target.fileID].time=e.target.time,r===t.length&&document.dispatchEvent(allFilesLoaded)},s=this.fileList.length,r=0,l=0;for(object in this.fileList){var d=new XMLHttpRequest;d.open("GET",this.fileList[object].path,!0),d.responseType=this.fileList[object].type,d.time=this.fileList[object].time,d.fileID=this.fileList[object].name,d.totalBar=this.totalBar,d.indivisualBar=this.indivisualBar,d.addEventListener("loadstart",i,!0),d.addEventListener("progress",a,!0),d.addEventListener("loadend",o,!0),d.send()}};var SoundObject=function(e){console.log("creating Sound Object Class"),this.isPlaying=!1,this.isReady=!1,this.debugMode=!1,this.time="no available value";var t=window.AudioContext||window.webkitAudioContext||window.mozAudioContext||window.oAudioContext||window.msAudioContext;t?(this.context=new t,console.log("here is our context")):console.log("there is an issue with creating Audio Context"),this.sourceBuffer=this.context.createBufferSource(),this.analyser=this.context.createAnalyser(),this.analyser.smoothingTimeConstant=.3,this.analyser.fftSize=e,this.bufferLength=this.analyser.frequencyBinCount,this.fft=new Uint8Array(this.bufferLength),this.debugMode&&console.log(this.fft),this.loadedPercentage=0,this.fileIsReady=!1};SoundObject.prototype.init=function(e){console.log("Class initiated: "),this._decodeAudioData(e),e.time?this.time=e.time:console.log("no time available"),this.isReady=!0},SoundObject.prototype.play=function(){this.debugMode&&console.log("play the sound"),"suspended"!=this.context.state?this.sourceBuffer.start(0):this.context.resume(),this.isPlaying=!0},SoundObject.prototype.pause=function(){this.debugMode&&console.log("pause the sound"),this.context.suspend(),this.isPlaying=!1},SoundObject.prototype.updateFFT=function(){this.analyser.getByteFrequencyData(this.fft),this.debugMode&&console.log("updateFFT: "+this.fft)},SoundObject.prototype._decodeAudioData=function(e){e.parent=this,this.context.decodeAudioData(e,function(t){e.parent.analyser.getByteTimeDomainData(e.parent.fft),e.parent.sourceBuffer.buffer=t,e.parent.sourceBuffer.connect(e.parent.analyser),e.parent.analyser.connect(e.parent.context.destination)})},KVec3.prototype=THREE.Vector3.prototype,KVec3.prototype.FFTin=function(e){var t=1.1*this.originalRadius;e>=200?(this.radius+=(t-this.radius)/5,this.onFFT=!0):(this.radius+=(this.originalRadius-this.radius)/10,this.onFFT=!1)},KVec3.prototype.movePos=function(){var e=5*noise.simplex2(this.ID,Date.now());(this.theta<=this.rangeMin||this.theta>=this.rangeMax)&&(this.velocity*=-1),this.theta+=this.velocity*this.SEED,this.pi+=1*Math.sin(this.theta)*.001,this.x=this.radius*Math.sin(this.theta)*Math.cos(this.pi),this.y=this.radius*Math.sin(this.theta)*Math.sin(this.pi),this.z=this.radius*Math.cos(this.theta)},KVec3.prototype.randomUpdate=function(){console.log("the theta is : "+this.theta+"/ this x y z: "+this.x+"/"+this.y+"/"+this.z)};var sc=new SoundObject(1024),fileLoader=new FileLoader,files=[{name:"music",path:"sounds/day.mp3",type:"arraybuffer",time:400}];fileLoader.start(files);var allFilesLoaded=new Event("fire");document.addEventListener("fire",function(e){console.log("FIRRRRRRRRRRE!!!!!!"),document.getElementById("audio-play").classList.add("avl"),sc.init(fileLoader.content.music)}),document.getElementById("audio-play").addEventListener("click",function(){sc.play()}),document.getElementById("audio-pause").addEventListener("click",function(){sc.pause()});var camera,scene,renderer,controls,stats,fftList,coreBall,particle,particles_geo,particle_met,pt_uniforms,particles_radius=250,fftSizeTemp=512,fftBands=[],nFFTBands=5,particle_positions,fakeFFT,line_position,line_color,line_geometry,line_material,line_mesh,gui,information=!0,cameraControls={fov:65,near:1,far:1e3,x:0,y:0,z:300},soundChannel={vocal:{position:0,max:255,min:0,value:100},bass:{position:20,max:255,min:0,value:100},high:{position:40,max:255,min:0,value:100},low:{position:60,max:255,min:0,value:100}},sound_group;initGUI(),init(),render(),window.addEventListener("keyup",dealWithKeyboard,!1),document.addEventListener("click",debug,!1);