<template>

  <div class="nodeCanvas">
    <div class="nodeList" v-if="showList" :style="nodeListStyle">
      <div v-for="(node, index) of nodeList"
        class="nodeListItem"
        :actionId="index"
        @click="onClickNodeItem">
        {{node.name}}
      </div>
    </div>
    <NodeComponent
      v-for="(node, index) of nodes"
      :key="index"
      :value='node'
      ref="childrenNodes"
      @startConnection="onStartConnection"
      @endConnection="onEndConnection"
    />
    <svg id="connectionsSvg"
      @mousedown="onTouch"
      ref="nodeCanvas">
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
        tempConnection: null,
        lastTouchTime: 0,
        showList: false,
        nodeListStyle: {
          top: 0,
          left: 0
        },
        nodeList: [
          {
            name: 'gain',
            create: () => {
              this.addNode(this.context.createGain())
            }
          },
          {
            name: 'audioDestination',
            create: () => {
              this.addNode(this.context.destination)
            }
          },
          {
            name: 'oscillator',
            create: () => {
              let o = this.context.createOscillator()
              o.start()
              this.addNode(o)
            }
          },
          {
            name: 'biquad filter',
            create: () => {
              let filter = this.context.createBiquadFilter()
              this.addNode(filter)
            }
          }
        ]
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
          this.tempConnection.computeD()
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
      },

      onTouch: function (e) {
        if (e.touches) {
          e = e.touches[0]
        }
        if (e.target === this.$refs.nodeCanvas) {
          let time = new Date().getTime()
          if (time - this.lastTouchTime < 300) {
            let pos = {
              x: e.clientX,
              y: e.clientY
            }
            this.showNodes(pos)
          } else {
            this.lastTouchTime = time
            this.showList = false
          }
        }
      },

      showNodes: function (pos) {
        this.showList = true
        this.nodeListStyle.top = pos.y + 'px'
        this.nodeListStyle.left = pos.x + 'px'
      },

      onClickNodeItem: function (e) {
        let actionId = e.target.getAttribute('actionId')
        let action = this.nodeList[actionId]
        action.create()
        this.showList = false
      }
    },

    created () {
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
    background-color: #666
    display: block
    overflow: hidden
    position: relative
    user-drag: none
    user-select: none
    font-family: arial

  .nodeList
    position: absolute
    max-height: 300px
    overflow: auto

  .nodeListItem
    padding: 5px
    background-color: #bbb

  .cable
    stroke-width: 12
    fill: none
    stroke: white
    user-drag: none
    user-select: none
    cursor: pointer
    user-drag: none
    user-select: none
    -webkit-tap-highlight-color: rgba(0,0,0,0)
    -webkit-tap-highlight-color: transparent

  .cable:hover
    stroke-width: 12
    stroke: #f66

  #connectionsSvg
    width: 100%
    height: 100%
    user-drag: none
    user-select: none
    display: block

</style>
