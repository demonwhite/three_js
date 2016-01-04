var camer, scene, renderer, controls, stats;
var coreBall;
var particle, particles_geo, particle_met, pt_uniforms,
	particles_radius = 150, fftSizeTemp = 10;
var particle_positions, fakeFFT;
var start = Date.now();
init();
render();
// Sound


function init(){
	fakeFFT = new Array(fftSizeTemp);
	updateFFT();
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
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0x222222 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.id = "canvas";
	document.body.appendChild( renderer.domElement );

// Stats (Framerate)
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.right = '0px';
	info.appendChild( stats.domElement );

// Scene
	scene = new THREE.Scene();
// Camera
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 0, 500 );
// View Controller
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.minDistance = 200;
	controls.maxDistance = 500;

	// scene.add( new THREE.AmbientLight( 0x666666 ) );
// Lights
	var light = new THREE.PointLight( 0xffffff );
	light.position.copy( camera.position );
	scene.add( light );
// Core Mesh
	var geo = new THREE.IcosahedronGeometry(50, 0);
	var matt = new THREE.MeshLambertMaterial({
		color: 0x556678,
	})
	coreBall = new THREE.Mesh(geo, matt);
	scene.add(coreBall);
// Buffer Particles
	// particles
	var num_particle = fftSizeTemp;
	var PI2 = Math.PI * 2;
	particles_geo = new THREE.BufferGeometry();
	var positions = new Float32Array( num_particle * 3 );
	var colors = new Float32Array( num_particle * 3 );
	var sizes = new Float32Array( num_particle );
	particle_positions = [];
	for ( var i = 0; i < num_particle; i ++ ) {
		// position
		var x, y, z;
		x = Math.random() * 2 - 1;
		y = Math.random() * 2 - 1;
		z = Math.random() * 2 - 1;
		var p = new THREE.Vector3(x, y, z);
		p.normalize();
		p.multiplyScalar( Math.random() * 1.2 + particles_radius );
			// particle.scale.multiplyScalar( 2 );
		p.toArray(positions, i*3);
		particle_positions.push(p);
		// color
		var c = new THREE.Color();
		c.setHSL( 0.01 + 0.1 * ( i / num_particle ), 1.0, 0.5 )
		c.toArray(colors, i*3);
		// size
		sizes[i] = 100.0;
	}
	console.log(particle_positions);
	particles_geo.addAttribute('position', new THREE.BufferAttribute(positions, 3) );
	particles_geo.addAttribute('aColor', new THREE.BufferAttribute(colors, 3) );
	particles_geo.addAttribute('size', new THREE.BufferAttribute(sizes, 1) );

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
	// lines

	for (var i = 0; i < num_particle; i++) {

		var geometry = new THREE.Geometry();

		var vertex = new THREE.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
		vertex.normalize();
		vertex.multiplyScalar( particles_radius );

		geometry.vertices.push( vertex );

		var vertex2 = vertex.clone();
		vertex2.multiplyScalar( Math.random() * 0.3 + 1 );

		geometry.vertices.push( vertex2 );

		var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: Math.random() } ) );
		// scene.add( line );
	}
}

function render(){
	// coreBall.rotation.x += 0.005;
	// coreBall.rotation.y += 0.005;
	// if( dancer.isPlaying() ) console.log(dancer.getSpectrum()[10]);
	// updateAudioData();
	requestAnimationFrame( render );
	updateFFT();
	updatePosition();
	updateShader();
	controls.update();
	stats.update();
	renderer.render( scene, camera );
}

function updateFFT(){
	var t = Date.now();
	for (var i = 0; i < fakeFFT.length; i++) {
		var v =	noise.simplex2(i, t);
		fakeFFT[i] = v/2;
	}
	fakeFFT.reverse();
	// console.log("update fft: " + fakeFFT);
}

function updatePosition(){
	var attr = particle.geometry.attributes;
	// console.log(attr.position.count);
	for (var i = 0; i < attr.position.count; i+=3) {
		// var x = attr.position.array[i],
		// 	y = attr.position.array[i+1],
		// 	z = attr.position.array[i+2];
		// var vex = new THREE.Vector3(x, y, z);

	}
	for (var i = 0; i < attr.size.count; i++) {
		// attr.size.array[i] = (fakeFFT[i] >= 0.3) ? fakeFFT[i]*500 : 100.0;
		attr.size.array[i] = fakeFFT[i]*300;
	}
	attr.size.needsUpdate = true;

	


}

function updateAudioData(){
	// Grabbing the FFT array from dancer fo parsing/analysing, pull reference from my OF project
	var fftList = dancer.getSpectrum();
	console.log(fftList.length);
	// coreBallShape.verticesNeedUpdate = true;
}

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
// For debug
document.addEventListener('click', testClick, false);
function testClick() {
	console.log('Here is the FFT');
	var fftList = dancer.getSpectrum();
	console.log(fftList.length);

	debug();
}

function debug() {
	var attr = particle.geometry.attributes;
	var scalar = 1.1;
	particle_positions[9].multiplyScalar(scalar);
	attr.position.array[9*3] = particle_positions[9].x;
	attr.position.array[9*3 +1] = particle_positions[9].y;
	attr.position.array[9*3 +2] = particle_positions[9].z;
	attr.position.needsUpdate = true;
}
