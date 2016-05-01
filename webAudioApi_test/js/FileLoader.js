//This is a File loader class
//start function will include a File Lis Object
function FileLoader() {
	this.fileList = [];
	this.content = {};
}

FileLoader.prototype.start = function(_files) {
	this.fileList = _files;
	var fl = this.fileList;
	var fo = this.content;
	console.log(this.fileList);
	var _loadStart = function(e){
		console.log("load started");
	}
	var _loadProgress = function(e){
		var progress = e.loaded / e.total *100;
		console.log(e.loaded + " / " + e.total + " / " + e.target.fileID);
	}
	var _loadFinished = function(e){
		flag ++;
		var bar = flag / total * 100;
		document.getElementById('progressBar').value = bar;
		console.log(fo);
		fo[e.target.fileID] = e.target.response;
		if (flag === fl.length) {
			// when all the files are loaded
			document.dispatchEvent(allFilesLoaded);
		}
	}

	var total = this.fileList.length;
	var flag = 0;
	var loaded = 0;
	for (object in this.fileList) {
		var filerequest = new XMLHttpRequest();
		
		filerequest.open('GET', this.fileList[object].path, true);
		filerequest.responseType = this.fileList[object].type;
		filerequest.fileID = this.fileList[object].name;
		filerequest.addEventListener('loadstart', _loadStart, true);
		filerequest.addEventListener('progress', _loadProgress, true);
		filerequest.addEventListener('loadend', _loadFinished, true);
		filerequest.send();
	}

}