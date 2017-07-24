class Instrument {
  constructor (context) {
    this.context = context
    this.audioNodes = []
    this.connections = []
    this.pressedNotes = new Map()
    this.nbPressedNotes = 0
  }

  getAudioNode (note) {
    console.warn('you have to extend this to create or get the audio node')
  }

  playNode (node, note) {
    console.warn('you have to extend this to play the node')
  }

  stopNode (node, note) {
    console.warn('you have to extend this to stop the node')
  }

  pressNote (note) {
    if (this.pressedNotes[note] == null) {
      let node = this.getAudioNode(note)
      if (node != null) {
        this.playNode(node, note)
        this.pressedNotes[note] = node
        this.nbPressedNotes ++
      }
    }
  }

  releaseNote (note) {
    let node = this.pressedNotes[note]
    if (node) {
      this.nbPressedNotes --
      delete this.pressedNotes[note]
      this.stopNode(node, note)
    }
  }

  addAudioNode (node) {
    this.audioNodes.push(node)
    for (let output of this.connections) {
      node.connect(output)
    }
  }

  removeAudioNode (node) {
    let index = this.audioNodes.indexOf(node)
    if (index !== -1) {
      for (let output of this.connections) {
        node.disconnect(output)
      }
      this.audioNodes.splice(index, 1)
    }
  }

  connect (output) {
    if (this.connections.indexOf(output) === -1) {
      this.connections.push(output)
    }
    for (let node of this.audioNodes) {
      node.connect(output)
    }
  }

  disconnect (output) {
    let index = this.connections.indexOf(output)
    if (index !== -1) {
      this.connections.splice(index, 1)
    }
    for (let node of this.audioNodes) {
      node.disconnect(output)
    }
  }
}

export default Instrument
