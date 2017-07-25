<template>

  <div class="keyboard">

    <div class="controlContainer">
      <div class="lcdScreen">
        {{octave}}
      </div>
    </div>

    <div class="keyContainer">

      <div class="whiteKeys">
        <Key v-for="(key, index) in keys.whites"
        :key="index"
        :value="key"
        @pressed="onKeyPressed"
        @released="onKeyReleased"/>
      </div>

      <div class="blackKeys">

        <Key v-for="(key, index) in keys.blacks"
        :key="index"
        :value="key"
        @pressed="onKeyPressed"
        @released="onKeyReleased"
        :style="{
          'margin-left': marginLeft(key),
          'margin-right': marginRight(key)
        }"
        />

      </div>

    </div>

  </div>

</template>

<script>
  import Key from '@/components/key'
  import Note from '@/objects/note'

  export default {
    name: 'keyboard',

    components: {
      Key
    },

    props: {
      nbKey: {
        default: 85,
        type: Number
      },
      octave: {
        default: 2,
        type: Number
      },
      startKey: {
        default: 0,
        type: Number
      }
    },

    data () {
      return {
        instruments: []
      }
    },

    computed: {
      keys: function () {
        let whites = []
        let blacks = []
        for (let i = 0; i < this.nbKey; ++i) {
          let note = i + this.startKey + 12 * this.octave
          if (Note.isBlack(note)) {
            blacks.push(note)
          } else {
            whites.push(note)
          }
        }

        return {
          whites,
          blacks
        }
      },

      blackSideMargin: function () {
        return this.keys.whites.length / 100 * 25 + '%'
      },

      blackWidth: function () {
        let margin = this.keys.whites.length / 100 * 25
        return 100 - margin * 2 + '%'
      }
    },

    methods: {
      getNoteFromKey (e) {
        let keys = this.$root.$children[0].$children[0].$children[1].$children

        let note = Note.keyboard[e.key]
        if (note != null) {
          let key = keys[note]
          return key
        } else {
          return null
        }
      },

      marginRight (key) {
        let margin = 100 / this.keys.whites.length / 2
        if (key % 12 === 3) {
          return margin + '%'
        }

        if (key % 12 === 10) {
          return margin + '%'
        }
      },

      marginLeft (key) {
        let margin = 100 / this.keys.whites.length / 2
        if (key % 12 === 1) {
          return margin + '%'
        }

        if (key % 12 === 6) {
          return margin + '%'
        }
      },

      onKeyDown (e) {
        let key = this.getNoteFromKey(e)
        if (key) key.press()
        else return
      },

      onKeyUp (e) {
        let key = this.getNoteFromKey(e)
        if (key) key.release()
        else return
      },

      onKeyPressed (note) {
        for (let instru of this.instruments) {
          instru.pressNote(note)
        }
      },

      onKeyReleased (note) {
        for (let instru of this.instruments) {
          instru.releaseNote(note)
        }
      },

      connect (instrument) {
        this.instruments.push(instrument)
      },

      disconnect (instrument) {
        let index = this.instruments.index(instrument)
        this.instruments.splice(index, 1)
      }

    },

    created () {
      window.onkeydown = this.onKeyDown
      window.onkeyup = this.onKeyUp
    }
  }
</script>

<style lang="sass">

  .keyboard
    user-select: none
    width: 100%
    height: 100%
    display: flex
    flex-flow: horizontal

  .controlContainer
    height: 100%
    display: flex
    flex-flow: horizontal

  .keyContainer
    flex: 1
    height: 100%
    display: flex

  .whiteKeys
    user-select: none
    width: 100%
    height: 100%
    display: flex

  .blackKeys
    position: absolute
    user-select: none
    height: 50%
    width: 100%
    display: flex

</style>
