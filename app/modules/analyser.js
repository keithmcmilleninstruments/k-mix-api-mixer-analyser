import { convertRange } from './utilities'

let kmix

// Get the average frequency amplitudes
function getAverageVolume(array) {
  var values = 0;
  var average;

  var length = array.length;

  // get all the frequency amplitudes
  for (var i = 0; i < length; i++) {
      values += array[i];
  }

  average = values / length;
  return average;
}

function setDevice(device){
  kmix = device
}

// Get the average level
  //var average = Math.ceil(getAverageVolume(barsType) / 10) * 10;
let drawVisual

function analyser(context) {
  let analyser = context.createAnalyser(),
      bufferLength = analyser.frequencyBinCount,
      frequencyData = new Uint8Array(bufferLength),
      loopStep, faderCount = 8;

  analyser.fftSize = 32;
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0.85;

  loopStep = Math.floor(frequencyData.length / 8);

  function draw() {
    //drawVisual = requestAnimationFrame(draw);

    var barWidth = (8 / bufferLength) * 2.5;
    var barHeight;

    analyser.getByteFrequencyData(frequencyData);

    for(var i = 0; i < faderCount; i++) {
      barHeight = frequencyData[i * loopStep];
      // console.log('fader:' + (i + 1), 'frequencyData', frequencyData[i])
      kmix.send('fader:' + (i + 1), convertRange(frequencyData[i], [0,256],[0,127]))
    }
  }

  // draw();
  setInterval(draw, 40)

  return analyser;
}

export { analyser as default, drawVisual, setDevice }