<template>

  <div class="nodeCanvas">
    <NodeComponent
      v-for="(node, index) of nodes"
      :key="index"
      :value='node'
      ref="childrenNodes"
      @startConnection="onStartConnection"
      @endConnection="onEndConnection"
    />
    <svg id="connectionsSvg">
      <path v-for="(connection, index) in connections" :d='connection.d' class="cable" :connectionId="index" @click="destroyConnection"></path>
    </svg>
  </div>

</template>

<script>
  import NodeComponent from '@/components/NodeComponent'
  import Connection from '@/objects/Connection'

  export default {
    name: 'nodeCanvas',

    props: {
      context: null
    },

    components: {
      NodeComponent
    },

    data () {
      return {
        nodes: [],
        childrenNodes: [],
        connections: [],
        tempConnection: null
      }
    },

    methods: {
      addNode: function (node) {
        this.nodes.push(node)
      },

      onStartConnection: function (node, pos) {
        if (this.tempConnection == null) {
          this.tempConnection = new Connection(node, pos)
          this.connections.push(this.tempConnection)
        }
      },

      onEndConnection: function (node, pos, param) {
        if (this.tempConnection != null) {
          this.tempConnection.connect(node, pos, param)
          this.tempConnection = null
        }
      },

      dragConnection: function (e) {
        if (this.tempConnection != null) {
          if (e.touches) {
            e = e.touches[0]
          }

          let pos = {
            x: e.clientX,
            y: e.clientY
          }

          this.tempConnection.endX = pos.x
          this.tempConnection.endY = pos.y
        }
      },

      endDragConnection: function (e) {
        if (this.tempConnection != null) {
          let index = this.connections.indexOf(this.tempConnection)
          this.connections.splice(index, 1)
          this.tempConnection = null
        }
      },

      destroyConnection: function (e) {
        let index = e.target.getAttribute('connectionId')
        let connection = this.connections[index]
        connection.destroy()
        this.connections.splice(index, 1)
      }
    },

    created () {
      let a = this.context.createOscillator()
      let b = this.context.createGain()
      let c = this.context.createOscillator()

      a.start()
      a.frequency.value = 100
      c.start()
      c.frequency.value = 2
      this.addNode(b)
      this.addNode(a)
      this.addNode(c)
      this.addNode(this.context.destination)

      setTimeout(() => {
        this.childrenNodes = this.$refs.childrenNodes
      }, 1)

      document.addEventListener('mousemove', this.dragConnection)
      document.addEventListener('mouseup', this.endDragConnection)

      document.addEventListener('touchmove', this.dragConnection)
      document.addEventListener('touchend', this.endDragConnection)
    }
  }
</script>

<style lang="sass">

  .nodeCanvas
    width: 100%
    height: 100%
    max-width: 100%
    max-height: 100%
    background-color: #eee
    border: solid 1px #ddd
    display: block
    overflow: auto
    position: relative
    user-drag: none
    user-select: none

  .cable
    stroke-width: 4
    fill: none
    stroke: #999
    user-drag: none
    user-select: none
    cursor: pointer

  .cable:hover
    stroke-width: 6
    stroke: #f66

  #connectionsSvg
    width: 100%
    height: 100%
    user-drag: none
    user-select: none

</style>
