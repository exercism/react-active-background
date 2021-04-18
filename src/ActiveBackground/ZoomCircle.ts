export class ZoomCircle {
  private readonly canvas: HTMLCanvasElement
  private readonly context: CanvasRenderingContext2D | null

  private readonly ratio: number
  private readonly width: number
  private readonly height: number

  private time: number

  private animationFrameRequestId: number | null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')

    this.ratio = window.devicePixelRatio
    this.width = canvas.offsetWidth
    this.height = canvas.offsetHeight

    this.time = 0

    this.animationFrameRequestId = null
  }

  public start(): void {
    this.animationFrameRequestId = requestAnimationFrame(this.render.bind(this))
  }

  public stop(): void {
    if (this.animationFrameRequestId) {
      cancelAnimationFrame(this.animationFrameRequestId)
    }
  }

  public render(): void {
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
