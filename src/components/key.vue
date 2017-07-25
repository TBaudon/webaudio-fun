<template>

  <div :class="{
    key:true,
    black: isBlack(value),
    pressed: isPressed
  }"
  @mousedown="press"
  @mouseup="release"
  @touchstart="press"
  @touchend="release"
  >
  </div>

</template>

<script>
  import Note from '@/objects/note'

  export default {
    name: 'key',

    props: {
      value: 0
    },

    data () {
      return {
        isPressed: false
      }
    },

    methods: {

      isBlack (note) {
        return Note.isBlack(note)
      },

      press () {
        this.isPressed = true
        this.$emit('pressed', this.value)
      },

      release () {
        this.isPressed = false
        this.$emit('released', this.value)
      }

    }
  }
</script>

<style lang="sass">

  .key
    border: solid 0.5px #bbb
    flex: 1
    cursor: pointer
    user-select: none
    -webkit-tap-highlight-color: rgba(0,0,0,0)
    -webkit-tap-highlight-color: transparent

  .black
    background-color: black

  .pressed
    background-color: #ddaa33
    border: solid 1px transparent


</style>
