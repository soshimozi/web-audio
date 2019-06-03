import AudioNode from './audio-node';

export default class extends AudioNode {
    constructor() {
        super();
        
        this.type               = 'generator';
        this.source             = true;
        this.mix                = 1;
        this.channelCount = 1;
    }

    append (buffer, channelCount, out) {
        var	l	= buffer.length,
            i, n;
        out		= out || buffer;
        channelCount	= channelCount || this.channelCount;
        for (i=0; i<l; i+=channelCount) {
            this.generate();
            for (n=0; n<channelCount; n++) {
                out[i + n] = this.getSample(n) * this.mix + buffer[i + n];
            }
        }
        return out;
    }

    getSample() {
        throw new Error("Error Not Implemented");
    }

    reset() {
        throw new Error("Error Not Implemented");
    }

}