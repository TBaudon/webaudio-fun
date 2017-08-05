<template>

  <div class="indexContainer">

    <NodeCanvas :context="audioContext"/>

    <div class="keyboardContainer">
      <Keyboard :nbKey='36' :octave='3' :startKey='5' ref="keyboard"/>
    </div>
  </div>

</template>

<script>
  import Note from '@/objects/note'
  import PolyphonicB from '@/objects/polyphonicB'
  import Keyboard from '@/components/keyboard'
  import NodeCanvas from '@/components/nodeCanvas'

  export default {
    name: 'index',

    components: {
      Keyboard,
      NodeCanvas
    },

    data () {
      return {
        audioContext: null,
        notes: Note.notes,
        oscillator: null,
        instru: null
      }
    },

    methods: {

    },

    created () {
      this.audioContext = new AudioContext()

      this.instru = new PolyphonicB(this.audioContext, 4)
      this.instru.connect(this.audioContext.destination)
    },

    mounted () {
      this.$refs.keyboard.connect(this.instru)
    }
  }
</script>

<style lang="sass" >
  .indexContainer
    width: 100%
    height: 100%

  .keyboardContainer
    height: 25%
    width: 100%
    position: absolute
    bottom: 0px
</style>
