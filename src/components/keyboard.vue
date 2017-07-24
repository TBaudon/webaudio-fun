<template>

  <div class="keyboard" ref="keyContainer">
    <Key v-for="(key, index) in keys"
    :key="index"
    :value="getKeyValue(index)"
    @pressed="onKeyPressed"
    @released="onKeyReleased"/>
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
      }
    },

    data () {
      return {
        keys: [],
        instruments: []
      }
    },

    methods: {
      getKeyValue (index) {
        return index + 12 * this.octave
      },

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
      for (let i = 0; i < this.nbKey; ++i) {
        this.keys.push(i + 12 * this.octave)
      }

      window.onkeydown = this.onKeyDown
      window.onkeyup = this.onKeyUp
    }
  }
</script>

<style lang="sass">

  .keyboard
    user-select: none
    text-align: center

</style>
