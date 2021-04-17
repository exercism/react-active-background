import { Vector2D } from './Vector'

class EulerMass {
  position: Vector2D
  mass: number
  drag: number
  force: Vector2D
  velocity: Vector2D

  constructor(x: number, y: number, mass: number, drag: number) {
    this.position = new Vector2D(x, y)
    this.mass = mass
    this.drag = drag
    this.force = new Vector2D(0, 0)
    this.velocity = new Vector2D(0, 0)
  }

  addForce(v: Vector2D) {
    this.force = this.force.add(v)
  }

  currentForce() {
    const speed = this.velocity.length
    const dragVelocity = this.velocity.multiply(this.drag * this.mass * speed)
    return this.force.subtract(dragVelocity)
  }

  integrate(dt: number) {
    const acceleration = this.currentForce().divide(this.mass).multiply(dt)
    const deltaPosition = this.velocity.multiply(dt)
    this.position = this.position.add(deltaPosition)
    this.velocity = this.velocity.add(acceleration)
    this.force = new Vector2D(0, 0)
  }
}

export { EulerMass }
