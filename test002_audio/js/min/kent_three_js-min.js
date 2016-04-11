function soundInit(){console.log("in init");try{ctx=new(window.AudioContext||window.webkitAudioContext),loadFile()}catch(e){alert("you need webaudio support"+e)}}function loadFile(){var e=new XMLHttpRequest;e.open("GET","sounds/day.mp3",!0),e.responseType="arraybuffer",e.onload=function(){ctx.decodeAudioData(e.response,function(e){buf=e})},e.send()}function play(){var e=ctx.createBufferSource();e.buffer=buf,fft=ctx.createAnalyser(),fft.smoothingTimeConstant=.3,fft.fftSize=samples,e.connect(fft),fft.connect(ctx.destination),e.start(0),setup=!0}function soundUpdate(){var e=new Uint8Array(samples);fft.getByteFrequencyData(e),console.log(e)}function KVec3(e,t){this.rangeMax=Math.PI/2*Math.random()+Math.PI/2,this.rangeMin=Math.PI/2*Math.random(),this.velocity=.01*(2*(Math.random()-.5)),this.numConnected=0,this.radius=this.originalRadius=e,this.theta=Math.random()*(this.rangeMax-this.rangeMin)+this.rangeMin,this.pi=(2*Math.random()-.5)*Math.PI,this.SEED=Math.random(),this.ID=t,this.onFFT=!1;var i,n,o;i=this.radius*Math.sin(this.theta)*Math.cos(this.pi),n=this.radius*Math.sin(this.theta)*Math.sin(this.pi),o=this.radius*Math.cos(this.theta),THREE.Vector3.call(this,i,n,o)}function initGUI(){var e=new dat.GUI({autoPlace:!1}),t=document.getElementById("my-gui-container");t.appendChild(e.domElement),e.add(valueShell,"value01",50,1e4),e.add(valueShell,"value02",50,2e4)}function init(){scene=new THREE.Scene,camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,1e3),camera.position.set(0,0,500);var e=new THREE.PointLight(16711935);e.position.copy(camera.position),scene.add(e);var t=new THREE.TorusKnotGeometry(100,10,100,6,5),i=new THREE.MeshLambertMaterial({color:5596792}),n=new THREE.MeshDepthMaterial({wireframe:!1});coreBall=new THREE.Mesh(t,n),scene.add(coreBall);var o=fftSizeTemp,a=2*Math.PI;particles_geo=new THREE.BufferGeometry;var r=new Float32Array(3*o),s=new Float32Array(3*o),l=new Float32Array(o);particle_positions=[];for(var d=0;o>d;d++){var c=new KVec3(particles_radius,d);c.toArray(r,3*d),particle_positions.push(c);var p=new THREE.Color;15==d?p.setHSL(.9,.1,.3):p.setHSL(.01+.1*(d/o),1,.5),p.toArray(s,3*d),l[d]=100}particles_geo.addAttribute("position",new THREE.BufferAttribute(r,3)),particles_geo.addAttribute("aColor",new THREE.BufferAttribute(s,3)),particles_geo.addAttribute("size",new THREE.BufferAttribute(l,1)),line_position=new Float32Array(fftSizeTemp*fftSizeTemp*3),line_color=new Float32Array(fftSizeTemp*fftSizeTemp*3),line_geometry=new THREE.BufferGeometry,line_geometry.addAttribute("position",new THREE.BufferAttribute(line_position,3).setDynamic(!0)),line_geometry.addAttribute("color",new THREE.BufferAttribute(line_color,3).setDynamic(!0)),pt_uniforms={color:{type:"c",value:new THREE.Color(16777215)},texture:{type:"t",value:(new THREE.TextureLoader).load("images/spark1.png")}},particle_met=new THREE.ShaderMaterial({uniforms:pt_uniforms,vertexShader:document.getElementById("pv").textContent,fragmentShader:document.getElementById("pf").textContent,alphaTest:.9});var u=new THREE.PointsMaterial({color:16777215,size:3});particle=new THREE.Points(particles_geo,u),scene.add(particle),line_material=new THREE.LineBasicMaterial({vertexColors:THREE.VertexColors,blending:THREE.AdditiveBlending,transparent:!0}),line_mesh=new THREE.LineSegments(line_geometry,line_material),line_mesh.geometry.setDrawRange(0,0),scene.add(line_mesh);var f=document.createElement("div");f.style.position="absolute",f.style.top="10px",f.style.width="100%",f.style.textAlign="center",f.style.color="#fff",f.style.link="#f80",f.innerHTML='<a href="http://threejs.org" target="_blank">three.js</a> kent&rsquo;s test',document.body.appendChild(f),renderer=new THREE.WebGLRenderer({antialias:!0}),renderer.setClearColor(2236962),renderer.setPixelRatio(window.devicePixelRatio),renderer.setSize(window.innerWidth,window.innerHeight),renderer.gammaInput=!0,renderer.gammaOutput=!0,renderer.domElement.id="canvas",document.body.appendChild(renderer.domElement),stats=new Stats,stats.domElement.style.position="absolute",stats.domElement.style.top="0px",stats.domElement.style.right="0px",f.appendChild(stats.domElement),controls=new THREE.TrackballControls(camera,renderer.domElement),controls.minDistance=200,controls.maxDistance=500;var h=nFFTBands;sound_group=new THREE.Object3D;for(var d=0;h>d;d++){var m=new THREE.BoxGeometry(5,5,5),y=new THREE.Color;y.g=d/5,y.r=d/3,console.log(y.getHex());var E=new THREE.MeshBasicMaterial({color:y.getHex()}),g=new THREE.Mesh(m,E);g.position.x=20*d+50,sound_group.add(g)}scene.add(sound_group)}function render(){scene.rotation.y+=.003,scene.rotation.x+=.002,isPlaying&&(updateFFT(),parseFFT(),updatePosition()),checkDistance(),controls.update(),stats.update(),renderer.render(scene,camera),requestAnimationFrame(render)}function updateFFT(){if(isPlaying){var e=new Uint8Array(fft.frequencyBinCount);fft.getByteFrequencyData(e),fftList=e;for(var t=Math.floor(fftList.length/nFFTBands),i=[50,100,150,200,250],n=0;nFFTBands>n;n++){for(var o=0,a=n;n*t>a;a++)o+=fftList[a];o/=t,o>=i[n]?fftBands[n]=o:fftBands[n]=i[n]}}else for(n in fftList)fftList[n]=0}function updateFakeFFT(){for(var e=Date.now(),t=0;t<fakeFFT.length;t++){var i=noise.simplex2(t,e);fakeFFT[t]=i/2}fakeFFT.reverse()}function parseFFT(){for(i in sound_group.children){var e=fftList[5*i]/100,t=sound_group.children[i];t.geometry.scale(1,1,1),t.verticesNeedUpdate=!0}}function checkDistance(){for(var e,t,i=30,n=3,o=0,a=0,r=0,s=0;fftSizeTemp>s;s++)particle_positions[s].numConnected=0;for(var l=0;fftSizeTemp>l;l++)if(e=particle_positions[l],!(e.numConnected>=n))for(var d=l+1;fftSizeTemp>d;d++){t=particle_positions[d];var c=e.x-t.x,p=e.y-t.y,u=e.z-t.z,f=Math.sqrt(c*c+p*p+u*u);if(!(t.numConnected>=n)&&i>f){e.numConnected++,t.numConnected++,line_position[o++]=e.x,line_position[o++]=e.y,line_position[o++]=e.z,line_position[o++]=t.x,line_position[o++]=t.y,line_position[o++]=t.z;var h=1-f/i;line_color[a++]=h,line_color[a++]=h,line_color[a++]=h,line_color[a++]=h,line_color[a++]=h,line_color[a++]=h,r++}}line_mesh.geometry.setDrawRange(0,2*r),line_mesh.geometry.attributes.position.needsUpdate=!0,line_mesh.geometry.attributes.color.needsUpdate=!0}function updatePosition(){var e=particle.geometry.attributes;for(p in particle_positions)particle_positions[p].FFTin(fftList[p]),particle_positions[p].movePos(),e.position.array[3*p]=particle_positions[p].x,e.position.array[3*p+1]=particle_positions[p].y,e.position.array[3*p+2]=particle_positions[p].z;e.position.needsUpdate=!0;for(var t=0;nFFTBands>t;t++)sound_group.children[t].scale.y=fftBands[t]/100}function updateAudioData(){}function musicControl(){1==isPlaying?(ctx.suspend(),isPlaying=!1):(initSound?ctx.resume():(play(),initSound=!0),isPlaying=!0)}function testClick(){console.log("Here is the FFT"),debug()}function debug(){if(isPlaying){var e=new Uint8Array(fft.frequencyBinCount);fft.getByteFrequencyData(e)}}function updateShader(){var e=.01*Date.now()}var ctx,buf,fft,samples=256,setup=!1;window.addEventListener("load",soundInit,!1),KVec3.prototype=THREE.Vector3.prototype,KVec3.prototype.FFTin=function(e){var t=1.1*this.originalRadius;e>=100?(this.radius+=(t-this.radius)/5,this.onFFT=!0):(this.radius+=(this.originalRadius-this.radius)/10,this.onFFT=!1)},KVec3.prototype.movePos=function(){var e=5*noise.simplex2(this.ID,Date.now());(this.theta<=this.rangeMin||this.theta>=this.rangeMax)&&(this.velocity*=-1),this.theta+=this.velocity,this.pi+=1*Math.sin(this.theta)*.001,this.x=this.radius*Math.sin(this.theta)*Math.cos(this.pi),this.y=this.radius*Math.sin(this.theta)*Math.sin(this.pi),this.z=this.radius*Math.cos(this.theta)},KVec3.prototype.randomUpdate=function(){console.log("the theta is : "+this.theta+"/ this x y z: "+this.x+"/"+this.y+"/"+this.z)};var camera,scene,renderer,controls,stats,fftList,coreBall,particle,particles_geo,particle_met,pt_uniforms,particles_radius=150,fftSizeTemp=256,fftBands=[],nFFTBands=5,particle_positions,fakeFFT,line_position,line_color,line_geometry,line_material,line_mesh,isPlaying=!1,initSound=!1,valueShell={value01:1e3,value02:2e3},sound_group;initGUI(),init(),render(),document.getElementById("audio-control").addEventListener("click",musicControl,!1),document.addEventListener("click",debug,!1);