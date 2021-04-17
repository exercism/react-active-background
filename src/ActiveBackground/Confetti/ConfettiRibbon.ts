import { Confetti } from '../Confetti'
import { EulerMass } from './EulerMass'
import { Vector2D } from './Vector'

type ConfettiRibbonConfig = {
  particleCount?: number
  particleMass?: number
  particleDrag?: number
  particleDistance?: number
  thickness?: number
  angle?: number
  parent: Confetti
  fetchColors: () => string[]
}

const VELOCITY_INHERIT_INITIAL_MAX = 2
const TIME_INITIAL_MAX = 10
const OSCILLATION_SPEED_VARIANCE = 2
const OSCILLATION_SPEED_MINIMUM = 1.5
const OSCILLATION_DISTANCE_VARIANCE = 40
const OSCILLATION_DISTANCE_MINIMUM = 40
const Y_VELOCITY_VARIANCE = 40
const Y_VELOCITY_MINIMUM = 80

class ConfettiRibbon {
  parent: Confetti
  fetchColors: () => string[]

  currPosition!: Vector2D
  prevPosition!: Vector2D

  particleCount: number
  particleMass: number
  particleDrag: number
  particleDistance: number
  thickness: number
  angle: number

  xOff: number
  yOff: number

  frontColor!: string
  backColor!: string

  time!: number
  velocityInherit!: number
  oscillationSpeed!: number
  oscillationDistance!: number
  yVelocity!: number

  particles!: EulerMass[]

  constructor({
    particleCount = 30,
    particleMass = 1,
    particleDrag = 0.05,
    particleDistance = 8.0,
    thickness = 8.0,
    angle = Math.PI / 4,
    parent,
    fetchColors,
  }: ConfettiRibbonConfig) {
    this.parent = parent
    this.fetchColors = fetchColors

    this.particleCount = particleCount
    this.particleMass = particleMass
    this.particleDrag = particleDrag
    this.particleDistance = particleDistance
    this.thickness = thickness
    this.angle = angle

    this.xOff = Math.cos(this.angle) * this.thickness
    this.yOff = Math.sin(this.angle) * this.thickness

    this.reset()
  }

  reset() {
    const x = Math.random() * this.parent.width
    const y = -1 * Math.random() * this.parent.height * 2

    this.currPosition = new Vector2D(x, y)
    this.prevPosition = this.currPosition.clone()

    const [frontColor, backColor] = this.fetchColors()
    this.frontColor = frontColor
    this.backColor = backColor

    this.time = Math.random() * TIME_INITIAL_MAX

    this.oscillationSpeed =
      Math.random() * OSCILLATION_SPEED_VARIANCE + OSCILLATION_SPEED_MINIMUM
    this.oscillationDistance =
      Math.random() * OSCILLATION_DISTANCE_VARIANCE +
      OSCILLATION_DISTANCE_MINIMUM

    this.velocityInherit = Math.random() * VELOCITY_INHERIT_INITIAL_MAX
    this.yVelocity = Math.random() * Y_VELOCITY_VARIANCE + Y_VELOCITY_MINIMUM

    this.particles = [...new Array(this.particleCount)].map(
      (_, i) =>
        new EulerMass(
          x,
          y - i * this.particleDistance,
          this.particleMass,
          this.particleDrag
        )
    )
  }

  update(dt: number) {
    this.time += dt * this.oscillationSpeed
    this.currPosition.x += Math.cos(this.time) * this.oscillationDistance * dt
    this.currPosition.y += this.yVelocity * dt

    const dx = this.prevPosition.x - this.currPosition.x
    const dy = this.prevPosition.y - this.currPosition.y
    const dDistance = Math.sqrt(dx * dx + dy * dy)

    this.prevPosition = this.currPosition.clone()

    // Update each particle's position
    this.particles[0].position = this.currPosition
    for (let index = 1; index < this.particles.length; index += 1) {
      const directionForce = Vector2D.sub(
        this.particles[index - 1].position,
        this.particles[index].position
      )
        .normalize()
        .multiply((dDistance / dt) * this.velocityInherit)

      this.particles[index].addForce(directionForce)
    }

    // integrate the forces
    for (let index = 1; index < this.particles.length; index += 1) {
      this.particles[index].integrate(dt)
    }

    // calculate final position
    for (let index = 1; index < this.particles.length; index += 1) {
      const rp2 = this.particles[index].position
        .subtract(this.particles[index - 1].position)
        .normalize()
        .multiply(this.particleDistance)
        .add(this.particles[index - 1].position)
      this.particles[index].position = rp2
    }

    if (
      this.currPosition.y >
      this.parent.height + this.particleDistance * this.particleCount
    ) {
      this.reset()
    }
  }

  draw(context: CanvasRenderingContext2D) {
    for (let index = 0; index < this.particles.length - 1; index += 1) {
      const particle = this.particles[index]
      const nextParticle = this.particles[index + 1]

      const offsetVector = new Vector2D(this.xOff, this.yOff)
      const p0 = particle.position.add(offsetVector)
      const p1 = nextParticle.position.add(offsetVector)

      if (sideFacing(particle, nextParticle, p1) < 0) {
        context.fillStyle = this.frontColor
        context.strokeStyle = this.frontColor
      } else {
        context.fillStyle = this.backColor
        context.strokeStyle = this.backColor
      }

      if (index === 0) {
        this.drawFirstParticle(context, particle, nextParticle, p0, p1)
      } else if (index === this.particles.length - 2) {
        this.drawMiddleParticle(context, particle, nextParticle, p0, p1)
      } else {
        this.drawLastParticle(context, particle, nextParticle, p0, p1)
      }
    }
  }

  drawFirstParticle(
    context: CanvasRenderingContext2D,
    particle: EulerMass,
    nextParticle: EulerMass,
    p0: Vector2D,
    p1: Vector2D
  ) {
    context.beginPath()
    context.moveTo(particle.position.x, particle.position.y)
    context.lineTo(nextParticle.position.x, nextParticle.position.y)
    context.lineTo(
      (nextParticle.position.x + p1.x) * 0.5,
      (nextParticle.position.y + p1.y) * 0.5
    )
    context.closePath()
    context.stroke()
    context.fill()
    context.beginPath()
    context.moveTo(p1.x, p1.y)
    context.lineTo(p0.x, p0.y)
    context.lineTo(
      (nextParticle.position.x + p1.x) * 0.5,
      (nextParticle.position.y + p1.y) * 0.5
    )
    context.closePath()
    context.stroke()
    context.fill()
  }

  drawMiddleParticle(
    context: CanvasRenderingContext2D,
    particle: EulerMass,
    nextParticle: EulerMass,
    p0: Vector2D,
    p1: Vector2D
  ) {
    context.beginPath()
    context.moveTo(particle.position.x, particle.position.y)
    context.lineTo(nextParticle.position.x, nextParticle.position.y)
    context.lineTo(
      (particle.position.x + p0.x) * 0.5,
      (particle.position.y + p0.y) * 0.5
    )
    context.closePath()
    context.stroke()
    context.fill()
    context.beginPath()
    context.moveTo(p1.x, p1.y)
    context.lineTo(p0.x, p0.y)
    context.lineTo(
      (particle.position.x + p0.x) * 0.5,
      (particle.position.y + p0.y) * 0.5
    )
    context.closePath()
    context.stroke()
    context.fill()
  }

  drawLastParticle(
    context: CanvasRenderingContext2D,
    particle: EulerMass,
    nextParticle: EulerMass,
    p0: Vector2D,
    p1: Vector2D
  ) {
    context.beginPath()
    context.moveTo(particle.position.x, particle.position.y)
    context.lineTo(nextParticle.position.x, nextParticle.position.y)
    context.lineTo(p1.x, p1.y)
    context.lineTo(p0.x, p0.y)
    context.closePath()
    context.stroke()
    context.fill()
  }
}

function sideFacing(
  { position: { x: x1, y: y1 } }: EulerMass,
  { position: { x: x2, y: y2 } }: EulerMass,
  { x: x3, y: y3 }: Vector2D
) {
  return (x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2)
}

export { ConfettiRibbon }
