// New class Kvec3 will be from THREE.js Vector3
function KVec3(_r, _id){
	// this.SEED = Math.random() * 5;
	this.numConnected = 0;
	this.radius = _r; //distance to the center (0,0)
	this.theta = (Math.random()*2 - 1) * Math.PI *2;
	this.pi = (Math.random()*2 -1) * Math.PI;
	this.SEED = Math.random();
	this.ID = _id;
	var _x, _y, _z;
	_x = this.radius * Math.sin(this.theta) * Math.cos(this.pi);
	_y = this.radius * Math.sin(this.theta) * Math.sin(this.pi);
	_z = this.radius * Math.cos(this.theta);

	// get the properties form THREE.Vector3
	// assigne the new x, y, z
	THREE.Vector3.call(this, _x, _y, _z);

}
// inherite THREE.js Vector3 prototype
KVec3.prototype = THREE.Vector3.prototype;
KVec3.prototype.updatePos = function(){
	var scale = noise.simplex2(this.SEED, Date.now()) * 2;
	this.addScalar(scale);
}
KVec3.prototype.movePos = function(){
	var s = (noise.perlin2(this.ID, Date.now()) - 1 + .5);
	this.theta += Math.sin(this.SEED) *0.001;
	this.pi += Math.cos(s) * 0.001;
	this.x = this.radius * Math.sin(this.theta) * Math.cos(this.pi);
	this.y = this.radius * Math.sin(this.theta) * Math.sin(this.pi);
	this.z = this.radius * Math.cos(this.theta);
}
//debug
KVec3.prototype.randomUpdate = function() {
	console.log('the theta is : ' + this.theta + "/ this x y z: " + this.x +"/" + this.y + "/" + this.z);
}
