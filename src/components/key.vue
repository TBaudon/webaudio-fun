<template>

  <div :class="{
    key:true,
    black: isBlack(value),
    pressed: isPressed
  }"
  ref="key"
  @mousedown="press"
  @mouseup="release"
  @mousemove="move"
  @mouseleave="release"
  @touchstart="press"
  @touchmove="move"
  @touchleave="release"
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

      move (e) {
        if (e.touches) {
          let x = e.touches[0].clientX
          let y = e.touches[0].clientY

          let div = this.$refs.key
          let bound = div.getBoundingClientRect()
          if (x >= bound.left && x <= bound.right &&
            y >= bound.top && y <= bound.bottom) {
            this.press()
          } else {
            this.release()
          }
        }

        if (e.buttons === 1) {
          this.press()
        }
      },

      press () {
        this.isPressed = true
        this.$emit('pressed', this.value)
      },

      release () {
        this.isPressed = false
        this.$emit('released', this.value)
      }

    },

    created () {
      document.addEventListener('touchmove', this.move)
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
    background-color: white


  .black
    background-color: black

  .pressed
    background-color: #ddaa33
    border: solid 1px transparent


</style>
