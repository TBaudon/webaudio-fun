<template>

  <div class="node" :style="style">
    <div class="nodeHeader">

      <div class="inputContainer">
        <div class="input connection"
          v-for="(input, index) in inputs"
          @mouseup="endConnection"
          ref="inputConnections"
          :inputId="index"
          >
        </div>
      </div>

      <div class="nodeName dragHandle" @mousedown="startDrag" @touchstart="startDrag">
        {{name}}
      </div>

      <div class="outputContainer">
        <div class="output connection"
          v-for="(output, index) in outputs"
          @mousedown="startConnection"
          @touchstart="startConnection"
          >
        </div>
      </div>

    </div>

    <div class="inputContainer">
      <div class="parameterContainer"
        v-for="(parameter, index) in parameters"
        :key='index'
        :paramId='index'
        ref="inputConnections"
        @mouseup="endConnection"
        @touchstart="endConnection">
        <div class="connection input parameter" :paramId='index'>
        </div>
        {{parameter.name}}
      </div>
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

        let connectionRect = e.target.getBoundingClientRect()

        let pos = {
          x: connectionRect.left + connectionRect.width / 2,
          y: connectionRect.top + connectionRect.height / 2
        }

        this.$emit('startConnection', this, pos)
      },

      endConnection: function (e) {
        let param = this.parameters[e.target.getAttribute('paramId')]

        if (e.touches) {
          e = e.touches[0]
        }

        let connectionRect = e.target.getBoundingClientRect()

        let pos = {
          x: connectionRect.left + connectionRect.width / 2,
          y: connectionRect.top + connectionRect.height / 2
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

        if (this.$refs.inputConnections != null) {
          let pos = {
            x: e.clientX,
            y: e.clientY
          }

          for (let inputConnection of this.$refs.inputConnections) {
            let rect = inputConnection.getBoundingClientRect()
            if (pos.x >= rect.left && pos.x <= rect.right &&
              pos.y >= rect.top && pos.y <= rect.bottom) {
              let paramId = inputConnection.getAttribute('paramId')
              let param = this.parameters[paramId]
              let anchorPos = {
                x: rect.left + rect.width / 2 - (paramId ? 25 : 0),
                y: rect.top + rect.height / 2
              }
              this.$emit('endConnection', this, anchorPos, param)
            }
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
    font-family: arial
    color: #fff
    font-size: 0.9em
    user-drag: none
    user-select: none

  .nodeHeader
    display: flex
    flex-flow: horizontal
    user-drag: none
    user-select: none
    align-items: center

  .inputContainer
    min-width: 20px
    user-drag: none
    user-select: none
    margin-left: -20px
    margin-top: 5px
    margin-bottom: 5px

  .outputContainer
    margin-right: -20px
    min-width: 20px
    user-drag: none
    user-select: none
    margin-top: 5px
    margin-bottom: 5px

  .nodeName
    flex: 1
    text-align: center

  .parameterContainer
    display: flex
    font-size: 0.9em
    align-items: center
    color: #963

  .connection
    width: 20px
    height: 30px
    background-color: #fff
    user-drag: none
    user-select: none
    margin-top: 3px
    margin-bottom: 3px
    user-drag: none
    user-select: none

  .input
    border-radius: 20px 0px 0px 20px
    user-drag: none
    user-select: none

  .output
    border-radius: 0px 20px 20px 0px
    cursor: pointer
    user-drag: none
    user-select: none

  .parameter
    background-color: #fc7
    margin-right: 5px

  .dragHandle
    height: 1em
    cursor: move
    user-drag: none
    user-select: none
    padding: 10px

</style>
