var camer, scene, renderer, controls;
var stats, textureLoader;
var coreBall, coreBallShape, coreBallMaterial, refBall, shaderTest;
var particle, particles_geo, particles_radius = 100;
var uniforms, attributes, spike, noise;
var start = Date.now();
init();
render();
// Sound


function init(){
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

// create the core ball here
	coreBallShape = new THREE.IcosahedronGeometry(100, 1);
	console.log(coreBallShape);
	// numVertex = coreBallShape.vertices;
	coreBallMaterial = new THREE.MeshBasicMaterial({color: 0x928852, wireframe: true})
	

// Shaders
	textureLoader = new THREE.TextureLoader();
	uniforms = {
		tExplosion: {
            type: "t", 
            value: textureLoader.load( 'images/explosion.png' )
        },
        time: { // float initialized to 0
            type: "f", 
            value: 0.0 
        },
        spike: {
        	type: "f",
        	value: 0.0
        }
	};
	attributes = {
		spike: {
			type: 'f', // a float
		 	value: [] // an empty array
		}
	};
	shaderTest = {
		uniforms: uniforms,
		// attributes: attributes,
		vertexShader: document.getElementById("vs").textContent,
		fragmentShader: document.getElementById("fs").textContent,
		wireframe: true
	};	

// buffer geometry
	// refBall = new THREE.BufferGeometry();
	// refBall.fromGeometry(coreBallShape);
	// spike = new Float32Array( refBall.attributes.position.count );
	// noise = new Float32Array( refBall.attributes.position.count );

	// // console.log(verts.count + " / " + verts.length);
	// for (var i = 0; i < spike.length; i++) {
	//   noise[ i ] = Math.random() * 5;
	// }
	// refBall.addAttribute('spike', new THREE.BufferAttribute(spike, 1));

	// console.log(refBall);

// Mesh
	// coreBallShader = new THREE.ShaderMaterial(shaderTest);
	// coreBall = new THREE.Mesh(refBall, coreBallShader);

	// scene.add(coreBall);

// Buffer Particles
	// particles
	var num_particle = 200;
	var PI2 = Math.PI * 2;
	particles_geo = new THREE.BufferGeometry();
	var positions = new Float32Array( num_particle * 3 );
	var colors = new Float32Array( num_particle * 3 );
	var sizes = new Float32Array( num_particle );

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

		// color
		var c = new THREE.Vector3(0.6, 1.0, 1.0);
		c.toArray(colors, i*3);
		// size
		sizes[i] = 10.0;
	}

	particles_geo.addAttribute('position', new THREE.BufferAttribute(positions, 3) );
	particles_geo.addAttribute('color', new THREE.BufferAttribute(colors, 3) );
	particles_geo.addAttribute('size', new THREE.BufferAttribute(sizes, 1) );

	var pointMaterial = new THREE.PointsMaterial(0xffffff);
	particle = new THREE.Points(particles_geo, pointMaterial);
	scene.add(particle);
	// lines

	for (var i = 0; i < 300; i++) {

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
	updateShader();
	controls.update();
	stats.update();
	renderer.render( scene, camera );
}

function updateAudioData(){
	// Grabbing the FFT array from dancer fo parsing/analysing, pull reference from my OF project
	var fftList = dancer.getSpectrum();
	console.log(fftList.length);
	var ballVertices = coreBallShape.vertices,
		numBallVertices = ballVertices.length,
		refVertices = refBall.vertices;
	for (var i = 0; i < numBallVertices; i++) {
		var input = fftList[i]*100 || 0;
		if (input <= 0.5) {
			// console.log(input);
		}else{
			// ballVertices[i].multiply(new THREE.Vector3(input, input, input));
		}
	}
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
}
