const app = angular.module('audio-app', []);

import AudioSink from './audio-sink';
import AudioOscillator from './audio-oscillator';

app.controller('HomeController', ['$scope', ($scope) => {
    $scope.message = "Hello World";


    let sink = new AudioSink( (buffer, channelCount) => {
        // fill buffer for each sample
        for(let i=0; i<buffer.length; i+=channelCount) {
            lfo.generate();
            osc.fm = lfo.getSample();

            osc.generate();
            for(let n=0; n<channelCount; n++) {
                buffer[i + n] += osc.getSample();
            }
        }
    });


    let lfo = new AudioOscillator(sink.sampleRate, 5, 'invSawtooth');

    let osc = new AudioOscillator(sink.sampleRate);


}]);