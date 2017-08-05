<template>

  <div class="node" :style="style">
    <div class="dragHandle" @mousedown="startDrag" @touchstart="startDrag">
    </div>
    <div class="nodeHeader">

      <div class="inputContainer">
        <div class="input connection"
          v-for="(input, index) in inputs"
          @mouseup="endConnection"
          @touchend="endConnection">
        </div>
      </div>

      <div class="nodeName">
        {{name}}
      </div>

      <div class="outputContainer">
        <div class="output connection"
          v-for="(output, index) in outputs"
          @mousedown="startConnection"
          @touchstart="startConnection">
        </div>
      </div>

    </div>
    <div class="parameterContainer"
      v-for="(parameter, index) in parameters"
      :key='index'
      :paramId='index'
      @mouseup="endConnection"
      @touchend="endConnection">
      <div class="connection input parameter" :paramId='index'>
      </div>
      {{parameter.name}}
    </div>
  </div>

</template>

<script>
  export default {
    name: 'nodeComponent',

    props: {
      value: null
    },

    data () {
      return {
        name: '',
        audioNode: null,
        outputTo: [],
        dragging: false,
        parameters: [],
        connections: [],
        dragOffset: {
          x: 0,
          y: 0
        },
        position: {
          x: 0,
          y: 0
        },
        style: {
          left: 0 + 'px',
          top: 0 + 'px'
        }
      }
    },

    computed: {
      inputs: function () {
        let tab = []
        for (let i = 0; i < this.audioNode.numberOfInputs; ++i) {
          tab.push(i)
        }
        return tab
      },

      outputs: function () {
        let tab = []
        for (let i = 0; i < this.audioNode.numberOfOutputs; ++i) {
          tab.push(i)
        }
        return tab
      }

    },

    methods: {
      startDrag: function (e) {
        if (e.touches) {
          e = e.touches[0]
        }

        this.dragOffset.x = this.position.x - e.clientX
        this.dragOffset.y = this.position.y - e.clientY
        this.dragging = true
      },

      startConnection: function (e) {
        if (e.touches) {
          e = e.touches[0]
        }

        let pos = {
          x: e.clientX,
          y: e.clientY
        }

        this.$emit('startConnection', this, pos)
      },

      endConnection: function (e) {
        let param = this.parameters[e.target.getAttribute('paramId')]

        if (e.touches) {
          e = e.touches[0]
        }

        let pos = {
          x: e.clientX,
          y: e.clientY
        }

        this.$emit('endConnection', this, pos, param)
      },

      connect: function (node) {
        this.connections.push(node)
      },

      disconnect: function (node) {
        let index = this.connections.indexOf(node)
        this.connections.splice(index, 1)
      },

      drag: function (e) {
        if (e.touches) {
          e = e.touches[0]
        }

        if (this.dragging) {
          if (e.clientX && e.clientY) {
            let newX = e.clientX + this.dragOffset.x
            let newY = e.clientY + this.dragOffset.y

            this.position.x = newX
            this.position.y = newY

            this.style.left = this.position.x + 'px'
            this.style.top = this.position.y + 'px'
          }

          for (let c of this.connections) {
            c.computeD()
          }
        }
      },

      endDrag: function (e) {
        this.dragging = false
      },

      registerConnection: function (connection) {
        this.connections.push(connection)
      },

      removeConnection: function (connection) {
        let i = this.connections.indexOf(connection)
        this.connections.splice(i, 1)
      }
    },

    created () {
      document.addEventListener('mousemove', this.drag)
      document.addEventListener('mouseup', this.endDrag)

      document.addEventListener('touchmove', this.drag)
      document.addEventListener('touchend', this.endDrag)

      this.audioNode = this.value
      console.log(this.audioNode)

      for (let field in this.audioNode) {
        if (this.audioNode[field] instanceof AudioParam) {
          this.parameters.push({
            param: this.audioNode[field],
            name: field
          })
        }
      }

      let name = this.audioNode.constructor.name
      if (name.substr(name.length - 4, name.length) === 'Node') {
        name = name.substr(0, name.length - 4)
      }

      this.name = name
    },

    destroyed () {
      document.removeEventListener('mousemove', this.drag)
      document.removeEventListener('mouseup', this.endDrag)

      document.removeEventListener('touchmove', this.drag)
      document.removeEventListener('touchend', this.endDrag)
    }
  }
</script>

<style lang="sass">
  .node
    background-color: #bbb
    position: absolute
    border-radius: 10px
    border: solid 3px #999
    font-family: arial
    color: #fff
    font-size: 0.9em
    user-drag: none
    user-select: none

  .nodeHeader
    margin-top: 3px
    display: flex
    flex-flow: horizontal
    user-drag: none
    user-select: none

  .inputContainer
    margin-left: -10px
    margin-right: 10px
    min-width: 12px
    user-drag: none
    user-select: none

  .outputContainer
    margin-right: -10px
    margin-left: 10px
    min-width: 12px
    user-drag: none
    user-select: none

  .nodeName
    flex: 1
    text-align: center

  .parameterContainer
    display: flex
    margin-left: -10px
    font-size: 0.9em
    align-items: center
    color: #ddd
    padding-right: 10px

  .connection
    width: 12px
    height: 12px
    background-color: white
    border: solid 2px #999
    margin: 3px 0px 3px 0px
    user-drag: none
    user-select: none

  .input
    border-radius: 10px 0px 0px 10px
    user-drag: none
    user-select: none

  .output
    border-radius: 0px 10px 10px 0px
    cursor: pointer
    user-drag: none
    user-select: none

  .parameter
    margin-right: 5px
    background-color: #fc7
    border: solid 2px #da6

  .dragHandle
    height: 1em
    background-color: #999
    cursor: move
    user-drag: none
    user-select: none

</style>
