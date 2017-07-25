<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import '@/styles/font.sass'
  import '@/styles/main.sass'

  export default {
    name: 'app'
  }
</script>

<style lang="sass">
  body, html
    margin: 0px
    height: 100%
    overflow: hidden

  #app
    width: 100%
    height: 100%
</style>
