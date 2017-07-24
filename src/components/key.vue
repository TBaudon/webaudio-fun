<template>

  <div :class="{
    key:true,
    black: isBlack(value),
    pressed: isPressed
  }"
  @mousedown="press"
  @mouseup="release"
  >
  </div>

</template>

<script>
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

      isBlack (index) {
        let blackNotes = [1, 3, 6, 8, 10]
        let n = index % 12
        if (blackNotes.indexOf(n) !== -1) {
          return true
        }
        return false
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
    width: 30px
    height: 100px
    border: solid 0.5px #bbb
    display: inline-block
    cursor: pointer

  .black
    position: absolute
    background-color: black
    width: 20px
    height: 60px
    vertical-align: top
    margin-left: -10px
    margin-right: -10px
    z-index: 100

  .pressed
    background-color: #ddaa33
    border: solid 1px transparent


</style>
