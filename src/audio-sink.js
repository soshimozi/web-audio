class AudioSink {
    constructor(readFn, channelCount, bufferSize) {
        this.sampleRate = this.context.sampleRate;
        this.channelCount = 2;
        this.bufferSize = 4096;
    
        this.writePosition = 0;
        this.previousHit = 0;
        this.ringOffset = 0;
    
        this.channelMode = 'interleaved';
        this.isReady = false;
        
        this.channelCount	= isNaN(channelCount) || channelCount === null ? this.channelCount: channelCount;
        this.bufferSize		= isNaN(bufferSize) || bufferSize === null ? this.bufferSize : bufferSize;
        this.readFn		= readFn;
        this.activeRecordings	= [];
        this.previousHit	= +new Date();

        this._listeners = {};


		this.soundData	= null;
        this.outBuffer	= null;
        this.zeroBuffer	= null;


        this.node = this.context.createScriptProcessor(this.bufferSize, this.channelCount, this.channelCount);
        this.node.onaudioprocess = (e) => this.bufferFill(e);
        this.node.connect(this.context.destination);
    }

    ready() {

    }

    process(soundData, channelCount) {
        if(this.readFn && typeof this.readFn === 'function') {
            this.readFn.apply(this, arguments)
        }
    }

    bufferFill(e) {
        var	outputBuffer	= e.outputBuffer,
        channelCount	= outputBuffer.numberOfChannels,
        i, n, l		= outputBuffer.length,
        size		= outputBuffer.size,
        channels	= new Array(channelCount),
        tail;     
        
        this.soundData	= this.soundData && this.soundData.length === l * this.channelCount ? this.soundData : new Float32Array(l * this.channelCount);
        this.zeroBuffer	= this.zeroBuffer && this.zeroBuffer.length === this.soundData.length ? this.zeroBuffer : new Float32Array(l * this.channelCount);
        this.soundData.set(this.zeroBuffer);

        this.ready();

        for (i=0; i<channelCount; i++) {
            channels[i] = outputBuffer.getChannelData(i);
        }        

        this.process(this.soundData, this.channelCount);       
        
        for (i=0; i<l; i++) {
            for (n=0; n < channelCount; n++) {
                channels[n][i] = this.soundData[i * this.channelCount + n];
            }
        }        
    }


    get context() {
        return AudioSink.context;
    }

}

AudioSink.context = new AudioContext();

module.exports = AudioSink;