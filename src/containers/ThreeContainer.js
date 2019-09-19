import React, { Component } from 'react'
import * as THREE from 'three'

import AudioShader from '../shaders/AudioShader.glsl'
import AudioVertexShader from '../shaders/AudioVertexShader.glsl'
import ThreeBase from '../objects/ThreeBase'
import Video from '../objects/Video'

export class ThreeContainer extends Component {
  constructor(props){
    super(props);
    this.frame = 0
    this.frames =[]
    // params that initiates world objects
    this.params = props.params
    this.capturer = window.ccapturer
  }
  
  componentDidMount(){
    const width = 1280
    const height = 720
    let base = new ThreeBase(window, width, height)

    //this.socket = socketIOClient("http://127.0.0.1:4001")

    console.log(base, this)
    base.camera.position.x  = 0
    base.camera.position.y  = 0
    base.camera.position.z  = 50

    // create video instance
    this.video = new Video(THREE, base)

    this.base = base
    this.debugMode = false
    // adds objects to scene
    this.addObjects()
    
    this.mount.appendChild(this.base.renderer.domElement)


  }

  //addObjects to scene
  addObjects() {
    this.video.audioObjects.forEach(element => {
      element.meshes.forEach(mesh => {
        this.base.scene.add(mesh)
      })
    })

    //this.video.surfaces.forEach(surface => {
    //  this.base.scene.add(surface.mesh)
    //})
  }

  componentWillUnmount(){
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  next = () => {
    this.video.trajectory.next()
    this.video.halfTime = this.video.time
    this.video.halfTimeLookAt = {
      x: this.video.lookAtTarget.x,
      y: this.video.lookAtTarget.y,
      z: this.video.lookAtTarget.z
    }
    
  }

  
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }

    let sounds = []
    this.video.world.audioObjects.forEach(element => { sounds.push(element) })
    this.video.audioObjects.forEach(element => { sounds.push(element) })
    sounds.push(this.video.world.cookie)

    sounds.forEach(element => { element.play() })

    this.video.audioObjects[0].mediaElement.onended = this.stop

    //this.capturer.start()


    let self = this
    //setInterval(function(){
    //  self.socket.emit('render-frame', {
//
//        frame: self.frame++,
//        file: self.mount.querySelector('canvas').toDataURL()
//      })
//
//    }, 1000 /24)
  }

  stop = () => {
    cancelAnimationFrame(this.frameId)
    //this.capturer.stop();
    //this.capturer.save();
  }

  debug = () => {
    this.debugMode = true
    this.start()
  }
  
  animate = () => {
    this.video.animate()
    this.base.animate(this.debugMode)
    this.frameId = window.requestAnimationFrame(this.animate)

    //this.capturer.capture(this.mount.querySelector('canvas'))

  }
  
  render(){
    return(
      <div>
        <button  onClick={this.debug}> Debug</button>
        <button  onClick={ this.start }> Start</button>
        <button  onClick={ this.stop }> stop</button>
        <button  onClick={ this.next }> next</button>
        <div
          style={{ width: window.innerWidth, height: window.innerHeight }}
          ref={(mount) => { this.mount = mount }}
        >
          
        </div>

      </div>
    )
  }
}


