const root = Math.pow(2, 1 / 12)
const aFreq = 440

function generateNotes () {
  let notes = []

  for (let i = 0; i < 102; ++i) {
    notes.push(Math.pow(root, i - 49) * aFreq)
  }

  return notes
}

export default {
  notes: generateNotes(),
  getNote (note) {
    return Math.pow(root, note - 49) * aFreq
  },
  keyboard: {
    '<': 0,
    'q': 1,
    'w': 2,
    's': 3,
    'x': 4,
    'c': 5,
    'f': 6,
    'v': 7,
    'g': 8,
    'b': 9,
    'h': 10,
    'n': 11,
    ',': 12,
    'k': 13,
    ';': 14,
    'l': 15,
    ':': 16,
    '!': 17,

    'a': 12,
    'é': 13,
    'z': 14,
    '"': 15,
    'e': 16,
    'r': 17,
    '(': 18,
    't': 19,
    '-': 20,
    'y': 21,
    'è': 22,
    'u': 23,
    'i': 24,
    'ç': 25,
    'o': 26,
    'à': 27,
    'p': 28,
    '^': 29

  }
}
