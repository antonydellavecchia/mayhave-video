export default class Trajectory {
  constructor(dynamics) {
    this.step = 0
    this.dynamics = dynamics
    this.lastTime = -0.01
  }

  getTarget(time, position) {
    let dynamic = this.dynamics[this.step]
    let deltaTime = time - this.lastTime
    this.lastTime = time
    
    return dynamic(deltaTime, position)
  }

  next() {

    this.step = (this.step + 1) % this.dynamics.length
  }

  setStep(step) {
    this.step = step % this.dynamics.length
  }
}
