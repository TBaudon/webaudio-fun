import Instrument from './instrument'

import Oscillator from './Oscillator'

class PolyphonicB extends Instrument {
  constructor (context) {
    super(context)

    this.oscillatorMap = new Map()
  }

  getAudioNode (note) {
    let oscillator = this.oscillatorMap[note]
    if (oscillator == null) {
      oscillator = new Oscillator(this.context, note)
      this.oscillatorMap[note] = oscillator
      this.addAudioNode(oscillator)

      // let a = this.context.createOscillator()
      // a.frequency.value = 5
      // a.start()

      // a.connect(oscillator.gain)
    }

    return oscillator
  }

  playNode (node, note) {
    node.gain.value = 1
  }

  stopNode (node, note) {
    node.gain.value = 0
  }
}

export default PolyphonicB
