function KVec3(t,i){this.rangeMax=Math.PI/2*Math.random()+Math.PI/2,this.rangeMin=Math.PI/2*Math.random(),this.velocity=.01*(2*(Math.random()-.5)),this.numConnected=0,this.radius=this.originalRadius=t,this.theta=Math.random()*(this.rangeMax-this.rangeMin)+this.rangeMin,this.pi=(2*Math.random()-.5)*Math.PI,this.SEED=Math.random(),this.ID=i,this.onFFT=!1;var h,s,a;h=this.radius*Math.sin(this.theta)*Math.cos(this.pi),s=this.radius*Math.sin(this.theta)*Math.sin(this.pi),a=this.radius*Math.cos(this.theta),THREE.Vector3.call(this,h,s,a)}KVec3.prototype=THREE.Vector3.prototype,KVec3.prototype.FFTin=function(t){var i=1.1*this.originalRadius;t>=100?(this.radius+=(i-this.radius)/5,this.onFFT=!0):(this.radius+=(this.originalRadius-this.radius)/10,this.onFFT=!1)},KVec3.prototype.movePos=function(){var t=5*noise.simplex2(this.ID,Date.now());(this.theta<=this.rangeMin||this.theta>=this.rangeMax)&&(this.velocity*=-1),this.theta+=this.velocity,this.pi+=1*Math.sin(this.theta)*.001,this.x=this.radius*Math.sin(this.theta)*Math.cos(this.pi),this.y=this.radius*Math.sin(this.theta)*Math.sin(this.pi),this.z=this.radius*Math.cos(this.theta)},KVec3.prototype.randomUpdate=function(){console.log("the theta is : "+this.theta+"/ this x y z: "+this.x+"/"+this.y+"/"+this.z)};