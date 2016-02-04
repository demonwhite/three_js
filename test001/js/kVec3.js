// New class Kvec3 will be from THREE.js Vector3
function KVec3(_r, _id){
	// this.SEED = Math.random() * 5;
	this.rangeMax = Math.PI/2 * Math.random() + Math.PI/2;
	this.rangeMin = Math.PI/2 * Math.random();
	this.velocity = .005 * ((Math.random()-0.5)*2);
	this.numConnected = 0;
	this.radius = this.originalRadius = _r; //distance to the center (0,0)
	this.theta = Math.random() * (this.rangeMax - this.rangeMin) + this.rangeMin;
	this.pi = (Math.random()*2 - .5) * Math.PI;
	this.SEED = Math.random();
	this.ID = _id;
	this.onFFT = false;
	var _x, _y, _z;
	_x = this.radius * Math.sin(this.theta) * Math.cos(this.pi);
	_y = this.radius * Math.sin(this.theta) * Math.sin(this.pi);
	_z = this.radius * Math.cos(this.theta);
	// get the properties form THREE.Vector3
	// assigne the new x, y, z
	THREE.Vector3.call(this, _x, _y, _z);
	// console.log(this.ID + " velocity : " + this.velocity);
}
// inherite THREE.js Vector3 prototype
KVec3.prototype = THREE.Vector3.prototype;

KVec3.prototype.FFTin = function(_fftBin){
	// _fftBin *= 2;
	var max_dist = this.originalRadius * 1.2;
	if (_fftBin >= 0.1) {
		this.radius += (max_dist - this.radius)/5;
		this.onFFT = true;
	}else{
		this.radius += (this.originalRadius - this.radius)/10;
		this.onFFT = false;
	}
}

KVec3.prototype.movePos = function(){
	var s = noise.simplex2(this.ID, Date.now()) * 5;
	// this.theta += (Math.sin(this.SEED) *2 -.5) * this.SEED/100;
	// this.speed = Math.sin(this.ID) * .01;
	if (this.theta <= this.rangeMin || this.theta >= this.rangeMax) {
		this.velocity *= -1;		
	}
	this.theta += this.velocity;
	this.pi += ( 1 * Math.sin(this.theta) ) * .001;
	// this.pi += this.velocity;
	this.x = this.radius * Math.sin(this.theta) * Math.cos(this.pi);
	this.y = this.radius * Math.sin(this.theta) * Math.sin(this.pi);
	this.z = this.radius * Math.cos(this.theta);
}
//debug
KVec3.prototype.randomUpdate = function() {
	console.log('the theta is : ' + this.theta + "/ this x y z: " + this.x +"/" + this.y + "/" + this.z);
}
