

// Web Audio end

var camera, scene, renderer, controls, stats, fftList;
var coreBall;
var particle, particles_geo, particle_met, pt_uniforms,
particles_radius = 150, fftSizeTemp = 256, fftBands = [], nFFTBands = 5;
var particle_positions, fakeFFT;
var line_position, line_color,line_geometry, line_material, line_mesh;
var isPlaying = false, initSound = false;
// var start = Date.now();

var sound_group;
// initGUI();
init();
render();
// Sound


function init(){
	// fakeFFT = new Array(fftSizeTemp);




// Scene
scene = new THREE.Scene();
// Camera
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set( 0, 0, 500 );
// Lights
	// var light = new THREE.PointLight( 0xffffff );
	// light.position.copy( camera.position );
	// scene.add( light );
// Core Mesh
var geo = new THREE.IcosahedronGeometry(50, 1);
var matt = new THREE.MeshLambertMaterial({
	color: 0x556678,
})
var normalTexture = new THREE.MeshNormalMaterial({wireframe: true});
coreBall = new THREE.Mesh(geo, normalTexture);
scene.add(coreBall);
// Buffer Particles
	// particles buffer
	var num_particle = fftSizeTemp;
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
		if (i == 15) {
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
	line_position = new Float32Array(fftSizeTemp * fftSizeTemp * 3);
	line_color = new Float32Array(fftSizeTemp * fftSizeTemp * 3);
	line_geometry = new THREE.BufferGeometry();
	line_geometry.addAttribute('position', new THREE.BufferAttribute(line_position, 3).setDynamic(true));
	line_geometry.addAttribute('color', new THREE.BufferAttribute(line_color, 3).setDynamic(true));

	//shaders
	pt_uniforms = {
		color:     { type: "c", value: new THREE.Color( 0xffffff ) },
		texture:   { type: "t", value: new THREE.TextureLoader().load( "images/spark1.png" ) }
	};
	particle_met = new THREE.ShaderMaterial ({
		uniforms: pt_uniforms,
		vertexShader: document.getElementById( 'pv' ).textContent,
		fragmentShader: document.getElementById( 'pf' ).textContent,

		alphaTest: 0.9,
	})


	var pointMaterial = new THREE.PointsMaterial({color: 0xffffff, size: 3});
	particle = new THREE.Points(particles_geo, pointMaterial);
	scene.add(particle);

	// line geometry

	line_material = new THREE.LineBasicMaterial( {
						// color: 0xFFFFFF,
						// linewidth: 1,
						vertexColors: THREE.VertexColors,
						blending: THREE.AdditiveBlending,
						transparent: true
					} );
	line_mesh = new THREE.LineSegments(line_geometry, line_material);
	line_mesh.geometry.setDrawRange(0, 0);
	scene.add(line_mesh);

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
renderer.setClearColor( 0x222222 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.gammaInput = true;
renderer.gammaOutput = true;

renderer.domElement.id = "canvas";
document.body.appendChild( renderer.domElement );


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
var nSoundObj = nFFTBands;
sound_group = new THREE.Object3D();

for (var i=0; i < nSoundObj; i++){
	var sound_geo = new THREE.BoxGeometry(5, 5, 5);
	var color = new THREE.Color();
	color.g = i;
	var sound_mat = new THREE.MeshBasicMaterial( color.getHex() );
	var sound_mesh = new THREE.Mesh(sound_geo, sound_mat);
	sound_mesh.position.x = 20 * i;
	sound_group.add(sound_mesh);
}
scene.add(sound_group);

}
// ***************************************
// *************** RENDER ****************
function render(){
	// coreBall.rotation.x += 0.005;
	// coreBall.rotation.y += 0.005;
	// if( dancer.isPlaying() ) console.log(dancer.getSpectrum()[10]);
	scene.rotation.y += 0.003;
	scene.rotation.x += 0.002;
	// update position when fft is ready
	if (isPlaying) {

		updateFFT();
		parseFFT();
		updatePosition();

	}
	checkDistance();
	controls.update();
	stats.update();
	renderer.render( scene, camera );
	requestAnimationFrame( render );

}
// ************ END RENDER ***************
// ***************************************
function updateFFT(){
	if (isPlaying) {
		var array =  new Uint8Array(fft.frequencyBinCount);
		fft.getByteFrequencyData(array);
		fftList = array;
		var nFFT = Math.floor(fftList.length / nFFTBands);
		// console.log(nFFT);
		var threshold = [50, 100, 150, 200, 250];
		for (var i = 0; i < nFFTBands; i++) {
			var total = 0;
			for (var t = i; t < i*nFFT; t++) {
				total += fftList[t];
				
			}
			total = total / nFFT;
			(total >= threshold[i]) ? fftBands[i] = total : fftBands[i] = threshold[i];

		}	
    // console.log(fftList);
}else{
	for (i in fftList) {
		fftList[i] = 0;
	}
}


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

	for (i in sound_group.children) {
		var value = fftList[i*5]/100 ;
		var obj = sound_group.children[i];
		// console.log(value);
		obj.geometry.scale(1, 1, 1);
		obj.verticesNeedUpdate = true;
	}
}

function checkDistance() {
	var target, search;
	var max_dist = 30.0, max_connections = 3;
	var vertexpos = 0;
	var colorpos = 0;
	var numConnected = 0;
	for (var p = 0; p < fftSizeTemp; p++) particle_positions[p].numConnected = 0;

		for ( var i = 0; i < fftSizeTemp; i++ ) {
			target = particle_positions[i];
			if ( target.numConnected >= max_connections) continue;

			for ( var j = i+1; j < fftSizeTemp; j++ ){
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
	var attr = particle.geometry.attributes;
	for (p in particle_positions) {
		// particle_positions[p].randomUpdate();
		particle_positions[p].FFTin(fftList[p]);
		particle_positions[p].movePos();
		attr.position.array[p*3] = particle_positions[p].x;
		attr.position.array[p*3 +1] = particle_positions[p].y;
		attr.position.array[p*3 +2] = particle_positions[p].z;
	}

	// Move the camera in a circle with the pivot point in the centre of this circle...
  // ...so that the pivot point, and focus of the camera is on the centre of our scene.

  attr.position.needsUpdate = true;

	// var timer = new Date().getTime() * 0.0005;
  // camera.position.x = particle_positions[100].x;
  // camera.position.y = particle_positions[100].y;
  // camera.position.z = particle_positions[100].z;
  // camera.lookAt(particle_positions[10]);
  // camera.updateProjectionMatrix();


	// var zoomMax = 1.3, zoom = 0.8;
	// if (dancer.isKick == true) {
	// 	camera.zoom += (zoomMax - camera.zoom)/5;
	// 	camera.updateProjectionMatrix();
	// 	console.log("dancer kicked");
	// }else{
	// 	camera.zoom += (zoom - camera.zoom)/50;
	// 	camera.updateProjectionMatrix();

	// }

	// scalling the bars
	for (var i = 0; i < nFFTBands; i++) {
		// console.log(sound_group);
		sound_group.children[i].scale.y = fftBands[i]/100;
	}
	// testing camera zoom
	// camera.zoom = fftBands[4]/255;
	// console.log(fftBands[4]);
	// camera.updateProjectionMatrix();

}

function updateAudioData(){
	// Grabbing the FFT array from dancer fo parsing/analysing, pull reference from my OF project
	// fftList = dancer.getSpectrum();
	// male voice: 1 ~ 12 khz
	// female voice: 2 ~ 12 khz
}

// MUSIC CONTROL
function musicControl() {
	if (isPlaying == true) {
		ctx.suspend();
		isPlaying = false;
	}else{
		if (!initSound) {
			play();
			initSound = true;
		}else{
			ctx.resume();
		}

		isPlaying = true;
	}
}
document.getElementById('audio-control').addEventListener('click', musicControl, false);


// *********** For debug ***********
document.addEventListener('click', debug, false);
function testClick() {
	console.log('Here is the FFT');
	// var fftList = dancer.getSpectrum();
	// console.log(fftList.length);

	debug();
}

function debug() {
	// console.log(audioFFT);

	var array =  new Uint8Array(fft.frequencyBinCount);
	fft.getByteFrequencyData(array);


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

