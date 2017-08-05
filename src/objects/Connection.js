class Connection {

  constructor (nodeA, pos) {
    this.nodeA = nodeA

    this.connectionStartOffset = {
      x: 0,
      y: 0
    }

    this.d = ''
    this.startX = pos.x
    this.startY = pos.y

    this.connectionStartOffset.x = this.sx - this.nodeA.position.x
    this.connectionStartOffset.y = this.sy - this.nodeA.position.y

    this.ex = 0
    this.ey = 0

    nodeA.registerConnection(this)
  }

  set startX (val) {
    this.sx = val
    this.connectionStartOffset.x = this.sx - this.nodeA.position.x
    this.ax = this.sx + (this.ex - this.sx) * 0.33
    this.bx = this.ex + (this.sx - this.ex) * 0.33
    this.computeD()
  }

  set startY (val) {
    this.sy = val
    this.connectionStartOffset.y = this.sy - this.nodeA.position.y
    this.ay = val
    this.computeD()
  }

  set endX (val) {
    this.ex = val
    this.ax = this.sx + (this.ex - this.sx) * 0.33
    this.bx = this.ex + (this.sx - this.ex) * 0.33
    this.computeD()
  }

  set endY (val) {
    this.ey = val
    this.by = val
    this.computeD()
  }

  computeD (val) {
    let x = this.nodeA.position.x + this.connectionStartOffset.x
    let y = this.nodeA.position.y + this.connectionStartOffset.y

    let ex = this.ex
    let ey = this.ey

    if (this.nodeB) {
      ex = this.nodeB.position.x + this.connectionEndOffset.x
      ey = this.nodeB.position.y + this.connectionEndOffset.y
    }

    let ax = x + Math.max(10, (this.ex - x) * 0.33)
    let ay = y

    let bx = ex + Math.min(-10, (x - ex) * 0.33)
    let by = ey

    this.d = 'M' + x + ' ' + y + ' '
    this.d += 'C ' + ax + ' ' + ay + ','
    this.d += bx + ' ' + by + ','
    this.d += ex + ' ' + ey
  }

  connect (nodeB, pos, param) {
    this.nodeB = nodeB
    this.param = param

    if (param == null) {
      this.nodeA.audioNode.connect(nodeB.audioNode)
    } else {
      this.nodeA.audioNode.connect(param.param)
    }

    this.ex = pos.x
    this.ey = pos.y

    this.connectionEndOffset = {
      y: this.ey - this.nodeB.position.y,
      x: this.ex - this.nodeB.position.x
    }

    nodeB.registerConnection(this)
  }

  destroy () {
    if (this.param == null) {
      this.nodeA.audioNode.disconnect(this.nodeB.audioNode)
    } else {
      this.nodeA.audioNode.disconnect(this.param.param)
    }
    this.nodeB.removeConnection(this)
    this.nodeA.removeConnection(this)
  }

}

export default Connection
