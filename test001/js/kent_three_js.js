var camer, scene, renderer, controls;
var stats, textureLoader;
var coreBall, coreBallShape, coreBallMaterial, refBall, shaderTest;
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
	refBall = new THREE.BufferGeometry();
	refBall.fromGeometry(coreBallShape);
	spike = new Float32Array( refBall.attributes.position.count );
	noise = new Float32Array( refBall.attributes.position.count );

	// console.log(verts.count + " / " + verts.length);
	for (var i = 0; i < spike.length; i++) {
	  noise[ i ] = Math.random() * 5;
	}
	refBall.addAttribute('spike', new THREE.BufferAttribute(spike, 1));

	console.log(refBall);

// Mesh
	coreBallShader = new THREE.ShaderMaterial(shaderTest);
	coreBall = new THREE.Mesh(refBall, coreBallShader);

	scene.add(coreBall);
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

	for ( var i = 0; i < spike.length; i ++ ) {

		spike[ i ] = Math.sin( 0.1 * i + time );

		noise[ i ] += 0.5 * ( 0.5 - Math.random() );
		noise[ i ] = THREE.Math.clamp( noise[ i ], -5, 5 );

		spike[ i ] += noise[ i ];

	}

	coreBall.geometry.attributes.spike.needsUpdate = true;

	shaderTest.uniforms[ 'time' ].value = .00025 * ( Date.now() - start );
}
// For debug
document.addEventListener('click', testClick, false);
function testClick() {
	console.log('Here is the FFT');
	var fftList = dancer.getSpectrum();
	console.log(fftList.length);
}
