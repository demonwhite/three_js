// New class Kvec3 will be from THREE.js Vector3
function KVec3(_r, _id){
	// this.SEED = Math.random() * 5;
	
	this.rangeMin = Math.PI/4 * Math.random();
	this.rangeMax = Math.PI/3 * Math.random() * 2 + Math.PI/3;
	this.velocity = .02 * ((Math.random()-0.5));
	(this.velocity <= 0) ? this.velocity - 0.01 : this.velocity + 0.01; 
	// this.phiNoise = ;
	this.numConnected = 0;
	this.radius = this.originalRadius = _r; //distance to the center (0,0)
	// this.theta = Math.random() * (this.rangeMax - this.rangeMin) + this.rangeMin;
	this.theta = Math.random() * Math.PI * 2;
	// this.pi = (Math.random()*2 - .5) * Math.PI;
	this.phi = Math.random() * (this.rangeMax-this.rangeMin) + this.rangeMin;
	this.SEED = Math.random()-0.5 / 1000;
	this.ID = _id;
	this.FIELD = 20 + ( Math.random() * 20 );  //a force field for keeping away from others
	this.onFFT = false;
	var _x, _y, _z;
	_x = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
	_y = this.radius * Math.cos(this.phi);
	_z = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
	// get the properties form THREE.Vector3
	// assigne the new x, y, z
	THREE.Vector3.call(this, _x, _y, _z);
	// console.log(this.ID + " velocity : " + this.velocity);
};
// inherite THREE.js Vector3 prototype
KVec3.prototype = THREE.Vector3.prototype;

KVec3.prototype.FFTin = function(_fftBin){
	// FFT value is 0-255
	// _fftBin *= 2;
	var max_dist = this.originalRadius + _fftBin;
	if (_fftBin >= 200) {
		this.radius -= (max_dist - this.radius)/5;
		this.onFFT = true;
	}else{
		// this.radius += (this.originalRadius - this.radius)/10;
		this.onFFT = false;
	}
};

KVec3.prototype.getPosition = function() {
	var position = THREE.Vector3(this._x, this._y, this._z);
	return position;
}

KVec3.prototype.movePos = function(){
	// var s = noise.simplex2(this.ID, Date.now()) * 0.005;
	// this.theta += (Math.sin(this.SEED) *2 -.5) * this.SEED/100;
	// this.speed = Math.sin(this.ID) * .01;
	if (this.phi < this.rangeMin || this.phi > this.rangeMax) {
		this.SEED *= -1;	
	}else{
		this.SEED += ( Math.random()-0.5 )/30;
	}

	// this.theta += this.velocity * this.SEED;
	// this.pi += ( 1 * Math.sin(this.theta) ) * .001;

	// ** theta 360 degree
	// ** phi 0 - 180 degree 0-PI



	this.theta += this.velocity/2;
	// this.phi = Math.sin(this.theta/10) * this.rangeMax;


	// this.theta = this.rangeMax;
	// this.pi = this.rangeMax;

	// this.pi += this.velocity;
	var force = new THREE.Vector3;
	// force.x = this.radius * Math.sin(this.theta) * Math.cos(this.pi);
	// force.y = this.radius * Math.sin(this.theta) * Math.sin(this.pi);
	// force.z = this.radius * Math.cos(this.theta);
	force.x = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
	force.y = this.radius * Math.cos(this.phi);
	force.z = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
	var dir = force.sub(this);
	// dir.normalize();
	// dir.multiplyScalar(13);
	this.add(dir);
};

KVec3.prototype.pushPos = function( target ){
	var dist = this.distanceTo(target);
	if( dist <= this.FIELD) {
		this.phi += this.velocity * (this.SEED);  //this line actually makes the dot slide!!!
		this.theta += this.velocity * (Math.random()-0.5);
		var temp = new THREE.Vector3(this.x, this.y, this.z);
		temp.sub(target);
		temp.normalize();
		this.sub(temp);
		
	}
}

//debug
KVec3.prototype.randomUpdate = function() {
	console.log('the theta is : ' + this.theta + "/ this x y z: " + this.x +"/" + this.y + "/" + this.z);
};
