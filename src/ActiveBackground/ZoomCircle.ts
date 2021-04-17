class ZoomCircle {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D | null

  ratio: number
  width: number
  height: number

  time: number

  animationFrameRequestId: number | null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')

    this.ratio = window.devicePixelRatio
    this.width = canvas.offsetWidth
    this.height = canvas.offsetHeight

    this.time = 0

    this.animationFrameRequestId = null
  }

  start() {
    this.animationFrameRequestId = requestAnimationFrame(this.render.bind(this))
  }

  stop() {
    if (this.animationFrameRequestId) {
      cancelAnimationFrame(this.animationFrameRequestId)
    }
  }

  render() {
    if (!this.context) {
      return
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.beginPath()
    this.context.arc(
      this.canvas.width / 2,
      this.canvas.height / 2,
      (this.canvas.width / 2) * Math.abs(Math.cos(this.time)),
      0,
      2 * Math.PI
    )
    this.context.fill()
    this.time += 0.05

    this.animationFrameRequestId = requestAnimationFrame(this.render.bind(this))
  }
}

export { ZoomCircle }
