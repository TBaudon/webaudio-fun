import Instrument from './instrument'
import Note from '@/objects/note'

class PolyphonicA extends Instrument {
  constructor (context, maxChannels = 8) {
    super(context)
    this.channels = maxChannels

    for (let i = 0; i < this.channels; ++i) {
      let oscillator = context.createOscillator()
      oscillator.frequency.value = 0
      oscillator.start()
      this.audioNodes.push(oscillator)
    }
  }

  getAudioNode (note) {
    return this.audioNodes[this.nbPressedNotes]
  }

  playNode (node, note) {
    node.frequency.setValueAtTime(Note.getNote(note), this.context.currentTime)
  }

  stopNode (node, note) {
    node.frequency.setValueAtTime(0, this.context.currentTime)
  }
}

export default PolyphonicA
