export class AudioEditor {
  private audioCtx: AudioContext;
  private audioBuffer: AudioBuffer | null;

  constructor() {
    this.audioCtx = new AudioContext();
    this.audioBuffer = null;
  }

  async loadAudio(fileUrl: string): Promise<void> {
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    this.audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
  }

  playFull(): void {
    if (!this.audioBuffer) {
      console.error("No audio loaded");
      return;
    }
    const source = this.audioCtx.createBufferSource();
    source.buffer = this.audioBuffer;
    source.connect(this.audioCtx.destination);
    source.start();
  }
/** Add super strong scream */
async addScreamEffect(startTime: number, endTime: number): Promise<Blob> {
  return this.applyEffectFullTrack(startTime, endTime, (source, ctx) => {
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(1.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(10.0, ctx.currentTime + 0.05); // 🚀 10x louder
    gain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.3);
    source.connect(gain).connect(ctx.destination);
  });
}

async addNoise(startTime: number, endTime: number): Promise<Blob> {
  if (!this.audioBuffer) throw new Error("No audio loaded");

  const offlineCtx = new OfflineAudioContext(
    this.audioBuffer.numberOfChannels,
    this.audioBuffer.duration * this.audioBuffer.sampleRate,
    this.audioBuffer.sampleRate
  );

  // Play original buffer
  const source = offlineCtx.createBufferSource();
  source.buffer = this.audioBuffer;
  source.connect(offlineCtx.destination);
  source.start(0);

  // Create noise buffer for the selected range
  const noiseDuration = endTime - startTime;
  const noiseBuffer = offlineCtx.createBuffer(1, noiseDuration * offlineCtx.sampleRate, offlineCtx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);

  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = Math.random() * 2 - 1; // white noise
  }

  const noiseSource = offlineCtx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.connect(offlineCtx.destination);
  noiseSource.start(startTime);

  const rendered = await offlineCtx.startRendering();
  this.audioBuffer = rendered;
  return this.bufferToBlob(rendered);
}

  /** Apply pitch shifting */
  async changePitchSegment(startTime: number, endTime: number, pitchFactor: number = 1.5): Promise<Blob> {
    return this.applyEffectFullTrack(startTime, endTime, (source, context) => {
      source.playbackRate.value = pitchFactor;
      source.connect(context.destination);
    });
  }

  /** Add echo effect */
  async addEchoEffect(startTime: number, endTime: number): Promise<Blob> {
    return this.applyEffectFullTrack(startTime, endTime, (source, context) => {
      const delay = context.createDelay();
      delay.delayTime.value = 0.2; // 200ms

      const feedback = context.createGain();
      feedback.gain.value = 0.4;

      source.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(context.destination);
    });
  }

  /** Enhancement Effects **/

  async addReverb(startTime: number, endTime: number): Promise<Blob> {
    return this.applyEffectFullTrack(startTime, endTime, (source, ctx) => {
      const convolver = ctx.createConvolver();
      convolver.buffer = this.createSimpleReverbBuffer(ctx);
      source.connect(convolver).connect(ctx.destination);
    });
  }

  async addChorus(startTime: number, endTime: number): Promise<Blob> {
    return this.applyEffectFullTrack(startTime, endTime, (source, ctx) => {
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.015; // slight delay
      source.connect(delay).connect(ctx.destination);
      source.connect(ctx.destination); // dry + wet
    });
  }

  /** Deterioration Effects **/

  async addDistortion(startTime: number, endTime: number): Promise<Blob> {
    return this.applyEffectFullTrack(startTime, endTime, (source, ctx) => {
      const distortion = ctx.createWaveShaper();
      distortion.curve = this.makeDistortionCurve(400);
      distortion.oversample = '4x';
      source.connect(distortion).connect(ctx.destination);
    });
  }

  async addLowpass(startTime: number, endTime: number): Promise<Blob> {
    return this.applyEffectFullTrack(startTime, endTime, (source, ctx) => {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800; // muffle everything above 800 Hz
      source.connect(filter).connect(ctx.destination);
    });
  }

  /** Core: Apply effect on full track but modify only selected range */
  private async applyEffectFullTrack(
    startTime: number,
    endTime: number,
    effect: (source: AudioBufferSourceNode, ctx: BaseAudioContext) => void
  ): Promise<Blob> {
    if (!this.audioBuffer) throw new Error("No audio loaded");
  
    const sampleRate = this.audioBuffer.sampleRate;
  
    const startSample = Math.floor(startTime * sampleRate);
    const endSample = Math.floor(endTime * sampleRate);
  
    const totalSamples = this.audioBuffer.length;
    const channels = this.audioBuffer.numberOfChannels;
  
    // Create a new buffer for final result
    const offlineCtx = new OfflineAudioContext(channels, totalSamples, sampleRate);
    const finalBuffer = offlineCtx.createBuffer(channels, totalSamples, sampleRate);
  
    // 1. Copy "before" section
    for (let ch = 0; ch < channels; ch++) {
      const fromData = this.audioBuffer.getChannelData(ch);
      const toData = finalBuffer.getChannelData(ch);
      for (let i = 0; i < startSample; i++) {
        toData[i] = fromData[i];
      }
    }
  
    // 2. Create "effected" section
    const effectBuffer = offlineCtx.createBuffer(channels, endSample - startSample, sampleRate);
  
    for (let ch = 0; ch < channels; ch++) {
      const fromData = this.audioBuffer.getChannelData(ch);
      const effectData = effectBuffer.getChannelData(ch);
      for (let i = 0; i < (endSample - startSample); i++) {
        effectData[i] = fromData[startSample + i];
      }
    }
  
    const effectCtx = new OfflineAudioContext(
      channels,
      effectBuffer.length,
      sampleRate
    );
  
    const source = effectCtx.createBufferSource();
    source.buffer = effectBuffer;
    effect(source, effectCtx);
    source.start();
  
    const processedBuffer = await effectCtx.startRendering();
  
    // 3. Copy processed "effected" section
    for (let ch = 0; ch < channels; ch++) {
      const toData = finalBuffer.getChannelData(ch);
      const fromData = processedBuffer.getChannelData(ch);
      for (let i = 0; i < fromData.length; i++) {
        toData[startSample + i] = fromData[i];
      }
    }
  
    // 4. Copy "after" section
    for (let ch = 0; ch < channels; ch++) {
      const fromData = this.audioBuffer.getChannelData(ch);
      const toData = finalBuffer.getChannelData(ch);
      for (let i = endSample; i < totalSamples; i++) {
        toData[i] = fromData[i];
      }
    }
  
    const renderedBuffer = finalBuffer;
    this.audioBuffer = renderedBuffer;
  
    return this.bufferToBlob(renderedBuffer);
  }  
  

  /** Utilities **/

  private createSimpleReverbBuffer(context: BaseAudioContext): AudioBuffer {
    const length = context.sampleRate * 2.0; // 2 seconds
    const impulse = context.createBuffer(2, length, context.sampleRate);

    for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * (1 - i / length); // Noise decay
      }
    }
    return impulse;
  }

  private makeDistortionCurve(amount: number): Float32Array {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  private async bufferToBlob(buffer: AudioBuffer): Promise<Blob> {
    const numOfChan = buffer.numberOfChannels,
      length = buffer.length * numOfChan * 2 + 44,
      bufferArray = new ArrayBuffer(length),
      view = new DataView(bufferArray),
      channels = [],
      sampleRate = buffer.sampleRate,
      bitDepth = 16;

    let offset = 0;

    function setString(view: DataView, offset: number, str: string) {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    }

    setString(view, offset, 'RIFF'); offset += 4;
    view.setUint32(offset, 36 + buffer.length * numOfChan * 2, true); offset += 4;
    setString(view, offset, 'WAVE'); offset += 4;
    setString(view, offset, 'fmt '); offset += 4;
    view.setUint32(offset, 16, true); offset += 4;
    view.setUint16(offset, 1, true); offset += 2;
    view.setUint16(offset, numOfChan, true); offset += 2;
    view.setUint32(offset, sampleRate, true); offset += 4;
    view.setUint32(offset, sampleRate * numOfChan * 2, true); offset += 4;
    view.setUint16(offset, numOfChan * 2, true); offset += 2;
    view.setUint16(offset, bitDepth, true); offset += 2;
    setString(view, offset, 'data'); offset += 4;
    view.setUint32(offset, buffer.length * numOfChan * 2, true); offset += 4;

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    for (let i = 0; i < buffer.length; i++) {
      for (let chan = 0; chan < numOfChan; chan++) {
        let sample = Math.max(-1, Math.min(1, channels[chan][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([view], { type: 'audio/wav' });
  }
}
