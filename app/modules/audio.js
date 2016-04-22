import { default as AudioDrop } from "./AudioDrop"
import { default as analyser, setDevice } from "./analyser"

let ac, master, kmix;

ac = new AudioContext, master = ac.createGain();

master.gain.value = 0

master.connect(ac.destination);

let drop = document.querySelector('#drop'),
		trackList = document.querySelector('#track_list'),
		source;

if(location.hostname !== 'localhost'){
	loadDefaultSounds()
	window.setTimeout(buildSounds, 5000)	
}

window.kmix = {
	buffers: [],
	tracks: [],
	master: master
}

AudioDrop({
  context: ac,
  elements: drop,

  drop: function drop(buffer, file, fileCount) {
  	console.log('Added the buffer ' + file.name + ' to tracks.', 'fileCount', fileCount);
    
    if (window.kmix.buffers.length > 1) return;

    buildBuffers(buffer)

    trackList.insertAdjacentHTML('beforeend', '<p>Channel ' + window.kmix.buffers.length + ': ' + file.name + '<p>');

    this.elements[0].previousSibling.previousSibling.classList.remove('dragging')

    if(window.kmix.buffers.length === fileCount) {
    	buildSounds()
    }

  },
  dragEnter: function dragEnter(e){
  	this.elements[0].previousSibling.previousSibling.classList.add('dragging')

  	window.kmix.buffers = [];

  	console.log('dragEnter');
  }
})

function buildBuffers(buffer){
	window.kmix.buffers.push(buffer)
}

function buildSounds(){
	window.kmix.buffers.forEach(function(buffer){
		source = ac.createBufferSource()
		source.buffer = buffer
		
		window.kmix.tracks.push(source)
	})
}

function playAll(){
	window.kmix.tracks.forEach(function(track){
		track.start();
		source.connect(analyser(ac))
		console.log('start all tracks');
	})
}

function stopAll(){
	window.kmix.tracks.forEach(function(track){
		track.stop();
		console.log('stop all tracks');
	})

	// initTracks()
}

function loadDefaultSounds(){
	let defaultTracks = ['./music/eternity.mp3']

	defaultTracks.forEach(function(url){
		decodeBuffer(url)
	})
}

function decodeBuffer(url) {
  var request = new XMLHttpRequest();
  request.open( "GET", url, true );
  request.responseType = "arraybuffer";
  request.onload = function (){
    ac.decodeAudioData(request.response, function (buffer) {
      window.kmix.buffers.push(buffer);
    });
  };
  request.send();
};

function setKMIX(device){
	kmix = device
	setDevice(kmix)
}

export { ac as default, buildSounds, playAll, stopAll, setKMIX }