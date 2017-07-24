<template>

  <div>
    <div class="canvasContainer">
      <NodeCanvas />
    </div>
    <Keyboard :nbKey='84' :octave='0' ref="keyboard"/>
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

<style lang="sass">
  .canvasContainer
    width: 100%
    height: 500px
</style>
