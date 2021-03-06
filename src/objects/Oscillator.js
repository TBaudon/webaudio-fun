import Note from '@/objects/note'

class Oscillator {
  constructor (context, note) {
    this.context = context

    this.vco = context.createOscillator()
    this.vco.start()

    this.vca = context.createGain()
    this.vca.gain.value = 0

    this.vco.connect(this.vca)

    this.setNote(note)
  }

  connect (output) {
    this.vca.connect(output)
  }

  disconnect (output) {
    this.vca.disconnect(output)
  }

  get gain () {
    return this.vca.gain
  }

  get frequency () {
    return this.vco.frequency
  }

  setNote (note) {
    this.vco.frequency.setValueAtTime(Note.getNote(note), this.context.currentTime)
  }
}

export default Oscillator
