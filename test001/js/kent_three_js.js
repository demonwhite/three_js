var camer, scene, renderer, controls;
var stats;
var coreBall, coreBallShape, coreBallMaterial;
init();
render();

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
	document.body.appendChild( renderer.domElement );
// Shaders
	var shaderTest = {
		uniforms: {
			color_uni: {
				type: "v4",
				value: new THREE.Vector4(0.34, 0.87, 0.6, 1.0)
			}
		},
		vertexShader: document.getElementById("vs").textContent,
		fragmentShader: document.getElementById("fs").textContent
	}
// Stats (Framerate)
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	info.appendChild( stats.domElement );

// Scene
	scene = new THREE.Scene();
// Camera
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 0, 500 );
// View Controller
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.minDistance = 200;
	controls.maxDistance = 500;

	scene.add( new THREE.AmbientLight( 0x222222 ) );
// Lights
	var light = new THREE.PointLight( 0xffffff );
	light.position.copy( camera.position );
	scene.add( light );

// create the core ball here
	coreBallShape = new THREE.IcosahedronGeometry(100, 1);
	coreBallMaterial = new THREE.MeshBasicMaterial({color: 0x928852, wireframe: true})
	coreBallShader = new THREE.ShaderMaterial(shaderTest);
	coreBall = new THREE.Mesh(coreBallShape, coreBallShader);
	scene.add(coreBall);
	
}

function render(){
	coreBall.rotation.x += 0.005;
	coreBall.rotation.y += 0.005;
	requestAnimationFrame( render );

	controls.update();

	renderer.render( scene, camera );
	stats.update();
}