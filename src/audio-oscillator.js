import AudioGenerator from './audio-generator';

const FullPI = Math.PI * 2;

export default class extends AudioGenerator {
    constructor(sampleRate, freq, ws) {
        super();

        this.phaseOffset       = 0;
        this.pulseWidth        = 0.5;
        this.fm                 = 0;
        this.waveShape          = ws || 'sine';
        this.mix                = 1;

        this.phase             = 0;

        this._p                 = 0;

        this.frequency = isNaN(freq) ? 440 : freq;
        this.waveTable = new Float32Array(1);
        this.sampleRate = sampleRate;

        this._shapeFunctions = {
            sine: this.sine,
            triangle: this.triange,
            sawtooth: this.sawtooth,
            sqauare: this.square,
            invSawtooth: this.invSawtooth,
            pulse: this.pulse
        };

    }

    generate() {
        /**
         * Moves the Oscillator's phase forward by one sample.
        */
        var	f	= +this.frequency,
            pw	= this.pulseWidth,
            p	= this.phase;
        f += f * this.fm;
        this.phase	= (p + f / this.sampleRate / 2) % 1;
        p		= (this.phase + this.phaseOffset) % 1;
        this._p		= p < pw ? p / pw : (p-pw) / (1-pw);
    }   
    
    getSample() {
        return (this._shapeFunctions[this.waveShape] ? this._shapeFunctions[this.waveShape].apply(this) : 0);
    }

	sine () {
		return Math.sin(this._p * FullPI);
    }

	triangle () {
		return this._p < 0.5 ? 4 * this._p - 1 : 3 - 4 * this._p;
    }

	square () {
		return this._p < 0.5 ? -1 : 1;
    }    

	sawtooth () {
		return 1 - this._p * 2;
    }    

	invSawtooth () {
		return this._p * 2 - 1;
    }    

	pulse () {
		return this._p < 0.5 ?
			this._p < 0.25 ?
				this._p * 8 - 1 :
				1 - (this._p - 0.25) * 8 :
			-1;
    }    

}