

// Web Audio end
var sc = new SoundObject(1024);
var fileLoader = new FileLoader();
var files = [  // an Array with file objects
	// Music main file
	{
		name: "music",
		path: "sounds/day.mp3",
		type: "arraybuffer",
		time: 400
	}
];
fileLoader.start(files);
// Create a custom event to fire when loading is compeleted
var allFilesLoaded = new Event('fire');
document.addEventListener('fire', function(e){
	console.log("FIRRRRRRRRRRE!!!!!!");
	document.getElementById('audio-play').classList.add('avl');
	sc.init(fileLoader.content.music);
});
document.getElementById('audio-play').addEventListener('click', function(){
	sc.play();
});
document.getElementById('audio-pause').addEventListener('click', function(){
	sc.pause();
});
// document.getElementById('event-fft').addEventListener('click', function(){
// 	soundobj2.updateFFT();
// });

var camera, actionCam, scene, renderer, controls, stats, fftList, light, hsLight;
var cameraHelper;
var core, earth, dummy;
var FFT_SIZE = 256;
var fftList = new Array(FFT_SIZE);
var particle, particles_geo, particle_met, pt_uniforms,
	particles_radius = 250, fftBands = [], nFFTBands = 5;
var particle_positions, fakeFFT;
var line_position, line_color,line_geometry, line_material, line_mesh;
// var start = Date.now();
var ballGroup;
var gui;
var information = true, popCloud = false, runningCamera = false;
var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
// var cameraControls = {
// 	perspective: 1
// };
var cameraControls = {
	fov: 65, //this is where we can make fisheye lens happen
	near: 1,
	far: 1000,
	zoom: 2.0,
	rotateSpeed: 0.001,
	x: 0,
	y: 0,
	z: 500
};
var soundChannel = {
	vocal: {
		position: 0,
		max: 255,
		min: 0,
		value: 100 // best: 8
	},
	bass: {
		position: 20,
		max: 255,
		min: 0,
		value: 100
	},
	high: {
		position: 40,
		max: 255,
		min: 0,
		value: 100
	},
	low: {
		position: 60,
		max: 255,
		min: 0,
		value: 100
	}
};

var sound_group;
initGUI();
init();
render();
// Sound

function initGUI(){
	// initial GUI
	gui = new dat.GUI({autoPlace: false});
	var customContainer = document.getElementById('my-gui-container');
	customContainer.appendChild(gui.domElement);
	// Vocal panel
	var gui_vocal = gui.addFolder("Vocal");
	gui_vocal.add(soundChannel.vocal, 'position', 0, FFT_SIZE);
	gui_vocal.add(soundChannel.vocal, 'min', 0, 150).name("Max Value");
	gui_vocal.add(soundChannel.vocal, 'max', 151, 255).name("Min Value");
	gui_vocal.add(soundChannel.vocal, 'value', 0, 255);
	// gui_vocal.open();
	// Bass panel
	var gui_bass = gui.addFolder("Bass");
	gui_bass.add(soundChannel.bass, 'position', 0, FFT_SIZE);
	gui_bass.add(soundChannel.bass, 'min', 0, 150);
	gui_bass.add(soundChannel.bass, 'max', 151, 255);
	gui_bass.add(soundChannel.bass, 'value', 0, 255);
	// gui_bass.open();
	// High panel
	var gui_high = gui.addFolder("High");
	gui_high.add(soundChannel.high, 'position', 0, FFT_SIZE);
	gui_high.add(soundChannel.high, 'min', 0, 150);
	gui_high.add(soundChannel.high, 'max', 151, 255);
	gui_high.add(soundChannel.high, 'value', 0, 255);
	// gui_high.open();
	// Low panel
	var gui_low = gui.addFolder("Low");
	gui_low.add(soundChannel.low, 'position', 0, FFT_SIZE);
	gui_low.add(soundChannel.low, 'min', 0, 150);
	gui_low.add(soundChannel.low, 'max', 151, 255);
	gui_low.add(soundChannel.low, 'value', 0, 255);
	// gui_low.open();
	// Camera
	var gui_camera = gui.addFolder("Camera");
	gui_camera.add(cameraControls, 'fov', 30, 120).name("FOV");
	gui_camera.add(cameraControls, 'zoom', 2.0, 5.0).name("Zoom");
	gui_camera.add(cameraControls, 'near', 1, 50).name("Near");
	gui_camera.add(cameraControls, 'far', 500, 3000).name("Far");
	gui_camera.add(cameraControls, 'rotateSpeed', 0.0, 0.1).name("Rotation");
	gui_camera.open();

	console.log("GUI initialized");
}

function init(){

	// Scene
	scene = new THREE.Scene();

	// Action Camera
	actionCam = new THREE.PerspectiveCamera( 150, window.innerWidth / window.innerHeight, 0.0001, 500 );
	actionCam.position.set(0,0,0);
	cameraHelper = new THREE.CameraHelper( actionCam );
	// scene.add( cameraHelper );
	
	// Camera
	camera = new THREE.PerspectiveCamera( cameraControls.fov, window.innerWidth / window.innerHeight, cameraControls.near, cameraControls.far );
	camera.position.set( cameraControls.x, cameraControls.y, cameraControls.z );
	
	// Lights
	light = new THREE.SpotLight( 0xffffff, .3 );
	light.position.copy( camera.position );
	light.target.position.set(0,0,0);
	// light.shadow = new THREE.LightShadow( camera );
	// light.shadow.bias = 0;
	light.castShadow = true;
	scene.add( light );
	hsLight = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
	// hsLight.castShadow = true;
	scene.add(hsLight);


	// Core Mesh
	var geo = new THREE.DodecahedronGeometry(particles_radius * 0.33, 0);
	// var geo = new THREE.TorusKnotGeometry( 100, 10, 100, 6, 5 );
	var matt = new THREE.MeshPhongMaterial({
		// color: 0x9f9f9f,
		color: 0xff2f2f,
		shading: THREE.FlatShading,
		// emissive: 0xff0000,
		shininess: 0

	})
	core = new THREE.Mesh(geo, matt);
	scene.add(core);

	var geo2 = new THREE.IcosahedronGeometry(particles_radius * 0.97, 1);
	// var geo = new THREE.TorusKnotGeometry( 100, 10, 100, 6, 5 );
	var matt = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: .9,
		shading: THREE.FlatShading,
		shininess: 0
	})
	// var normalTexture = new THREE.MeshNormalMaterial({wireframe: false});
	// var depthTexture = new THREE.MeshDepthMaterial({wireframe: false});
	// var standerTexture = new THREE.MeshBasicMaterial();
	earth = new THREE.Mesh(geo2, matt);
	earth.receiveShadow = true;
	earth.castShadow = true;
	scene.add(earth);

	// Buffer Particles

	var num_particle = FFT_SIZE;
	var PI2 = Math.PI * 2;
	particles_geo = new THREE.BufferGeometry();
	var positions = new Float32Array( num_particle * 3 );
	var colors = new Float32Array( num_particle * 3 );
	var sizes = new Float32Array( num_particle );
	particle_positions = [];

	for ( var i = 0; i < num_particle; i ++ ) {

		var o = new KVec3(particles_radius, i);
		o.toArray(positions, i *3);
		particle_positions.push(o);

		// color
		var c = new THREE.Color();
		if (i % 15 == 0) {
			c.setHSL( 0.9, 0.1, 0.3);
		}else{
			c.setHSL( 0.01 + 0.1 * ( i / num_particle ), 1.0, 0.5 );
		}
		c.toArray(colors, i*3);
		// size
		sizes[i] = 100.0;
	}
	// console.log(particle_positions);
	particles_geo.addAttribute('position', new THREE.BufferAttribute(positions, 3) );
	particles_geo.addAttribute('aColor', new THREE.BufferAttribute(colors, 3) );
	particles_geo.addAttribute('size', new THREE.BufferAttribute(sizes, 1) );
	// line buffer
	line_position = new Float32Array(FFT_SIZE * FFT_SIZE * 3);
	line_color = new Float32Array(FFT_SIZE * FFT_SIZE * 3);
	line_geometry = new THREE.BufferGeometry();
	line_geometry.addAttribute('position', new THREE.BufferAttribute(line_position, 3).setDynamic(true));
	line_geometry.addAttribute('color', new THREE.BufferAttribute(line_color, 3).setDynamic(true));

	//shaders
	// *** disable for now ***
	// pt_uniforms = {
	// 	color:     { type: "c", value: new THREE.Color( 0x000000 ) },
	// 	texture:   { type: "t", value: new THREE.TextureLoader().load( "images/spark1.png" ) }
	// };
	// particle_met = new THREE.ShaderMaterial ({
	// 	uniforms: pt_uniforms,
	// 	vertexShader: document.getElementById( 'pv' ).textContent,
	// 	fragmentShader: document.getElementById( 'pf' ).textContent,

	// 	alphaTest: 0.9,
	// })


	var pointMaterial = new THREE.PointsMaterial({color: 0x000000, size: 0});
	particle = new THREE.Points(particles_geo, pointMaterial);
	// particle.receiveShadow = true;
	// particle.castShadow = true;
	core.add(particle);

	// line geometry

	line_material = new THREE.LineBasicMaterial( {
						// color: 0xffffff,
						// linewidth: 1,
						vertexColors: THREE.VertexColors,
						blending: THREE.SubtractiveBlending,
						transparent: true
					} );
	line_mesh = new THREE.LineSegments(line_geometry, line_material);
	line_mesh.geometry.setDrawRange(0, 0);
	core.add(line_mesh);

	// basis info
	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.style.color = '#fff';
	info.style.link = '#f80';
	info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> kent&rsquo;s test';
	document.body.appendChild( info );
	// Renderer
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0xDDDDDD );
	renderer.autoClear = true;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.domElement.id = "canvas";
	document.body.appendChild( renderer.domElement );
	// renderer.shadowMap.enabled = true;
	// renderer.shadowMap.type = THREE.BasicShadowMap;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;


	// Stats (Framerate)
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.right = '0px';
	info.appendChild( stats.domElement );

	// View Controller
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.minDistance = 200;
	controls.maxDistance = 500;

	// Sound visual test objects
	// var nSoundObj = nFFTBands;
	// sound_group = new THREE.Object3D();

	// for (var i=0; i < nSoundObj; i++){
	// 	var sound_geo = new THREE.BoxGeometry(5, 5, 5);
	// 	var color = new THREE.Color();
	// 	color.g = i / 5;
	// 	color.r = i / 3;
	// 	// console.log(color.getHex());
	// 	var sound_mat = new THREE.MeshBasicMaterial( {color: color.getHex()} );
	// 	var sound_mesh = new THREE.Mesh(sound_geo, sound_mat);
	// 	sound_mesh.position.x = 20 * i + 50;
	// 	sound_group.add(sound_mesh);
	// }
	// scene.add(sound_group);

	// Dummy : follow a point, for action camera to follow
	dummy = new THREE.Vector3( 1, 1, 1 );
	dummy.x = particle_positions[3].x;
	dummy.y = particle_positions[3].y;
	dummy.z = particle_positions[3].z;

	ballGroup = new THREE.Object3D();
	var ballGeo = new THREE.SphereBufferGeometry(1, 25, 25);
	var ballMat = new THREE.MeshPhongMaterial({color: 0x040404,
												shininess: 2,
												specular: 0xffffff});
	var ballMesh = new THREE.Mesh(ballGeo, ballMat);
	for (var i = 0; i < FFT_SIZE; i++) {
		var ballMesh = new THREE.Mesh(ballGeo, ballMat);
		ballMesh.position.x = particle_positions[i].x;
		ballMesh.position.y = particle_positions[i].y;
		ballMesh.position.z = particle_positions[i].z;
		ballMesh.castShadow = true;
		ballMesh.receiveShadow = true;
		ballGroup.add(ballMesh);
	}
	particle.add(ballGroup);
	// particle.castShadow = true;
	// particle.receiveShadow = true;

	window.addEventListener( 'resize', onWindowResize, false );
}

function all_rotation(speed){
	earth.rotation.y += speed*3;
	earth.rotation.x += speed*3;
	earth.rotation.z -= speed*3;
	particle.rotation.y += speed;
	particle.rotation.x += speed;
	line_mesh.rotation.y += speed;
	line_mesh.rotation.x += speed;
	core.rotation.y -= speed*2;
	core.rotation.x += speed*3;
}

// ***************************************
// *************** RENDER ****************
function render(){
	// core.rotation.x += 0.005;
	// core.rotation.y += 0.005;
	// if( dancer.isPlaying() ) console.log(dancer.getSpectrum()[10]);
	all_rotation(cameraControls.rotateSpeed);
	checkZoom();
	// update position when fft is ready
	updateGUI();

	if (sc.isPlaying) {

		updateFFT();
		parseFFT();

	}
	updatePosition(); 
	checkDistance();
	updateBalls();
	updateDummy(particle_positions[3]);
	// cameraHelper.update();
	// cameraHelper.visible = true;

	controls.update();
	stats.update();
	// k
	light.position.copy( camera.position );
	light.position.y += 100;
	light.position.x += 50;
	(runningCamera)? renderer.render( scene, actionCam ) : renderer.render( scene, camera );
	requestAnimationFrame( render );

}
// ************ END RENDER ***************
// ***************************************
function updateFFT(){

	// normalize FFT between 1 - 100
	sc.updateFFT();
	fftList = [];
	fftList = sc.fft;
	for ( i in fftList ){
		var original = fftList[i];
		fftList[i] = map_range(original, 0, 255, 0, 100);
	}


}


// *** need some more test ***
function updateDummy(target_vec) {
	// if dummy is still tracing (out of the field)
	if (target_vec.distanceTo(dummy) > target_vec.FIELD*2) {

		// var direction = target_vec.sub(dummy);
		// direction.multiplyScalar(0.1);
		dummy.lerp(target_vec, 0.01);

		// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		// var material = new THREE.MeshBasicMaterial( {color: 0x00ff00, shading: THREE.FlatShading} );
		// var cube = new THREE.Mesh( geometry, material );
		// cube.position.x = dummy.x;	
		// cube.position.y = dummy.y;
		// cube.position.z = dummy.z;
		// if (runningCamera) {
		// 	scene.add( cube );
		// }
	} 
	// console.log(dummy);
	actionCam.position.set(dummy.x, dummy.y, dummy.z);
	actionCam.lookAt(target_vec);
	actionCam.updateProjectionMatrix();
}

function updateBalls(){
	var target = ballGroup.children;
	for (var i = 0; i < target.length; i++) {
		var child = target[i];
		var match = particle_positions[i];
		child.position.set(match.x, match.y, match.z);

		//FFT > 255*4 /2?
		var fftValue = fftList[i];
		var scale = child.scale.x;
		var threshold = 90;
		(fftValue >= threshold)? scale += (fftValue/3 - scale)*0.1 : scale += (1 - scale)*0.1;
		child.scale.set(scale, scale, scale);

	}
}

function updateGUI(){
	// GUI update
	//  
	// console.log(gui.__folders.Vocal.__controllers);
	for (var t in gui.__folders) {
		var target = gui.__folders[t];
		for (var i in target.__controllers) {
			target.__controllers[i].updateDisplay();
		}
	}
	if (fftList) {
		soundChannel.vocal.value = fftList[Math.floor(soundChannel.vocal.position)];
	}
	//GUI camera
	// camera.position.z = cameraControls.zoom * 100;
	// cameraControls.fov = 150 - 100 * cameraControls.zoom * 0.2;
	camera.fov = cameraControls.fov;
	camera.near = cameraControls.near;
	camera.far = cameraControls.far;
	

	camera.updateProjectionMatrix();
}

function updateFakeFFT(){
	var t = Date.now();
	for (var i = 0; i < fakeFFT.length; i++) {
		var v =	noise.simplex2(i, t);
		fakeFFT[i] = v/2;
	}
	fakeFFT.reverse();
	// console.log("update fft: " + fakeFFT);
}

function parseFFT(){

	for (var i = 0; i < fftList.length; i++) {
		// fftList[i] *= 4;
	}
}

function checkZoom() {
	// var zoomlevel = camera.
}

function checkDistance() {
	var target, search;

	//Line operations
	var max_dist = 40.0, max_connections = 3;
	var vertexpos = 0;
	var colorpos = 0;
	var numConnected = 0;
	for (var p = 0; p < FFT_SIZE; p++) particle_positions[p].numConnected = 0;

		for ( var i = 0; i < FFT_SIZE; i++ ) {
			target = particle_positions[i];
			if ( target.numConnected >= max_connections) continue;

			for ( var j = i+1; j < FFT_SIZE; j++ ){
				search = particle_positions[j];
				var dx = target.x - search.x;
				var dy = target.y - search.y;
				var dz = target.z - search.z;
				var dist = Math.sqrt( dx * dx + dy * dy + dz * dz );	
				if (search.numConnected >= max_connections) continue;
				if ( dist < max_dist ){
					target.numConnected ++;
					search.numConnected ++;
				// ADD IT TO THE LINE BUFFER
				line_position[ vertexpos++ ] = target.x;
				line_position[ vertexpos++ ] = target.y;
				line_position[ vertexpos++ ] = target.z;

				line_position[ vertexpos++ ] = search.x;
				line_position[ vertexpos++ ] = search.y;
				line_position[ vertexpos++ ] = search.z;

				var alpha = 1.0 - dist / max_dist;

				line_color[ colorpos++ ] = alpha;
				line_color[ colorpos++ ] = alpha;
				line_color[ colorpos++ ] = alpha;

				line_color[ colorpos++ ] = alpha;
				line_color[ colorpos++ ] = alpha;
				line_color[ colorpos++ ] = alpha;
				numConnected ++;
			}
		}
	}
	line_mesh.geometry.setDrawRange(0, numConnected *2);
	line_mesh.geometry.attributes.position.needsUpdate = true;
	line_mesh.geometry.attributes.color.needsUpdate = true;

}

function updatePosition(){
	var vocal = soundChannel.vocal.value;
	var bass = soundChannel.bass.value;
	var nPick = particle_positions.length / nFFTBands;
	for (var i = 0; i < nPick; i++) {
		var n = Math.floor(Math.random() * particle_positions.length);
		particle_positions[n].FFTin(vocal);
	}

	var attr = particle.geometry.attributes;
	for (p in particle_positions) {
		// particle_positions[p].randomUpdate();
		// particle_positions[p].FFTin(fftList[p]);
		particle_positions[p].movePos();
		//Distance push 
		var target, search;
		target = particle_positions[p];
		for (s in particle_positions){
			search = particle_positions[s];
			if (target.ID != search.ID) {
				target.pushPos(search);
			}
		}
		attr.position.array[p*3] = particle_positions[p].x;
		attr.position.array[p*3 +1] = particle_positions[p].y;
		attr.position.array[p*3 +2] = particle_positions[p].z;
		if (fftList[p] === 255 && popCloud === true) {
			_createBox(particle_positions[p].x, particle_positions[p].y, particle_positions[p].z);
		}
	}

	// Move the camera in a circle with the pivot point in the centre of this circle...
  // ...so that the pivot point, and focus of the camera is on the centre of our scene.

  attr.position.needsUpdate = true;


// scalling the bars
	// for (var i = 0; i < nFFTBands; i++) {
	// 	// console.log(sound_group);
	// 	sound_group.children[i].scale.y = fftBands[i]/100;
	// }


}
function _createBox(x, y, z) {

	var boxSize = 10;
	var geo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
	geo.translate(x, y, z);
	var depthTexture = new THREE.MeshDepthMaterial({wireframe: false});
	var boxMesh = new THREE.Mesh(geo, depthTexture);
	scene.add(boxMesh);
}

function updateAudioData(){
	// Grabbing the FFT array from dancer fo parsing/analysing, pull reference from my OF project
	// fftList = dancer.getSpectrum();
	// male voice: 1 ~ 12 khz
	// female voice: 2 ~ 12 khz
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	actionCam.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	actionCam.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

// *********** For debug ***********
window.addEventListener("keyup", dealWithKeyboard, false);
function dealWithKeyboard(e) {
	console.log(e.keyCode);
	// I - key code 73
	switch(e.keyCode) {
		// KEY: 'I'
		case 73:
			console.log("key I pressed");
			(information)? information = false : information = true;

			break;
		// KEY: 'Space bar'
		case 32:
			(runningCamera) ? runningCamera = false : runningCamera = true;
			console.log("switch camera: " + runningCamera);
			break;
		// KEY" '[' backward music
		case 219:
			sc.fastBackward(1);
			break;
		// KEY" '[' backward music
		case 221:
			sc.fastForward(1);
			break;
		// KEY" '\' reset playback rate
		case 220:
			sc.resetPlaybackRate();
			break;

		// Default
		default:
			console.log("no key action taken, pressed: " + e.keyCode);
			break;
	}
	if (information) {
		gui.domElement.hidden = false;
		stats.domElement.hidden = false;
		document.getElementById('progressBar').style.display = "block";
		document.getElementById('progressBar-indivisual').style.display = "block";
	} else {
		gui.domElement.hidden = true;
		stats.domElement.hidden = true;
		document.getElementById('progressBar').style.display = "none";
		document.getElementById('progressBar-indivisual').style.display = "none";
	}
}

document.addEventListener('click', debug, false);
function testClick() {
	console.log('Document Clicked');
	// var fftList = dancer.getSpectrum();
	// console.log(fftList.length);

	// debug();
}

function debug() {
	// console.log(audioFFT);
	// if(isPlaying){
	// 	var array =  new Uint8Array(fft.frequencyBinCount);
	// 	fft.getByteFrequencyData(array);
	// }

    // console.log(array);
}
// ********** temparary trash area ***********

function updateShader() {
	var time = Date.now() * 0.01;

	// for ( var i = 0; i < spike.length; i ++ ) {

	// 	spike[ i ] = Math.sin( 0.1 * i + time );

	// 	noise[ i ] += 0.5 * ( 0.5 - Math.random() );
	// 	noise[ i ] = THREE.Math.clamp( noise[ i ], -5, 5 );

	// 	spike[ i ] += noise[ i ];

	// }

	// particle.geometry.attributes.position.needsUpdate = true;

	// shaderTest.uniforms[ 'time' ].value = .00025 * ( Date.now() - start );
}

