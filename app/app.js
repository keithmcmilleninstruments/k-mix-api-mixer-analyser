 // vendor
import interact from "interact.js";

// styles
import './styles/screen.scss'

// svg
import './svg/kmix.svg'

// modules
import KMIX from 'k-mix-api'
import { allowed, webmidi } from './modules/browser'
import { convertRange } from './modules/utilities'
import request from './modules/midiRequest'
import { default as ac, playAll, stopAll, buildSounds, setKMIX } from './modules/audio'
import { controlSVGRotary, controlSVGFader, controlSVGButton, controlFader, controlRotary, faderDrag, rotaryDrag, buttonClick, resetfadersSVG, resetrotariesSVG } from './modules/svgControls'
	
// global kmix
let kmix;

let helpControl = document.querySelector('.help.control'),
		helpInput = document.querySelector('.help.input'),
		helpMain = document.querySelector('.help.main'),
		helpMisc = document.querySelector('.help.misc'),
		svg = document.querySelector('svg'),
		activeButtons = []


// MIDI & check browser
if(allowed() && webmidi){
	// request midi / sysex permission
	let MIDIRequest = request();

	MIDIRequest.then(function(data){
		let MIDIAccess = data;
		
		kmix = KMIX(MIDIAccess)

		// add listeners here
		// set up device event handlers
		kmix.on('diamond-up', function(data) {
			console.log('diamond-up', data);
			// record
		});

		kmix.on('diamond-right', function(data) {
			console.log('diamond-right', data);
			setKMIX(kmix)
			playAll()
			resetfadersSVG(svg)
			resetrotariesSVG(svg)
			resetFaders()
			resetRotaries()
		});

		kmix.on('diamond-down', function(data) {
			console.log('diamond-down', data);

			stopAll()
			buildSounds()
			resetfadersSVG(svg)
			resetrotariesSVG(svg)
			resetFaders()
			resetRotaries()
		});

		kmix.on('diamond-left', function(data) {
			console.log('diamond-left', data);

			stopAll()
			buildSounds()
			playAll()
			resetfadersSVG(svg)
			resetrotariesSVG(svg)
			resetFaders()
			resetRotaries()
		});

	})
	.catch(function(err){
		throw new Error(err);
	});

} else {
	console.log('Web MIDI Not Supported');
}


// send help message
helpControl.addEventListener('click', function(){
	kmix.help('control')
})
helpInput.addEventListener('click', function(){
	kmix.help('input')
})
helpMain.addEventListener('click', function(){
	kmix.help('main')
})
helpMisc.addEventListener('click', function(){
	kmix.help('misc')
})

// reset
function resetFaders(){
	let fader = ['fader-1', 'fader-2', 'fader-3', 'fader-4', 'fader-5', 'fader-6', 'fader-7', 'fader-8', 'fader-master']

	fader.forEach(function(fader){
		kmix.send('control:' + fader, 0)
	})
}

function resetRotaries(){
	let rotaries = ['rotary-1', 'rotary-2', 'rotary-3', 'rotary-4']

	rotaries.forEach(function(rotary){
		kmix.send('control:' + rotary, 64)
	})
}

// Listen
// kmix.on('fader-1', callback)
// kmix.on('button-vu', callback)
// kmix.on('button-vu:off', callback)
// kmix.on('any', callback)

// Send
// send to audio-control:
// send('preset', 2)
// send('fader:1', 127)
// send('fader:1', 127, 'input', time) // with time
// send('reverb-bypass', 11, 'misc') // auto channel
// send('mute', 11, 'main_out') // auto channel

// send to control-surface
// send('control:fader-3', 0, time, bank) // value, time, bank

// send raw
// send([176, 1, 127], time, 'control')
// enable audio-control sysex output [0xF0, 0x00, 0x01, 0x5F, 0x23, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xF7]

// Help
// help('control') // 'control', 'input', 'main', 'misc'