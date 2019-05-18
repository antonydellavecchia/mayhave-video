import React, { Component } from 'react'
import * as THREE from 'three'

import AudioShader from '../shaders/AudioShader.glsl'
import AudioVertexShader from '../shaders/AudioVertexShader.glsl'
import ThreeBase from '../objects/ThreeBase'
import Video from '../objects/Video'


export class ThreeContainer extends Component {
  constructor(props){
    super(props);

    
    // params that initiates world objects
    this.params = props.params
  }
  
  componentDidMount(){
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    let base = new ThreeBase(window, width, height, THREE)

    base.camera.position.x  = 0
    base.camera.position.y  = 0
    base.camera.position.z  = 50

    // create video instance
    this.video = new Video(THREE, base)

    this.base = base
    
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
  
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
    
    this.video.world.audioObjects.forEach(element => { element.play() })
    this.video.audioObjects.forEach(element => { element.play() })
    this.video.world.cookie.play()
  }

  stop = () => {
    cancelAnimationFrame(this.frameId)
  }

  animate = () => {
    this.video.animate()
    this.base.animate()
    this.frameId = window.requestAnimationFrame(this.animate)
  }
  
  render(){
    return(
      <div>
        <div
          style={{ width: window.innerWidth, height: window.innerHeight }}
          ref={(mount) => { this.mount = mount }}
        >
          
        </div>
        <button onClick={ this.start }> Start</button>
      </div>
    )
  }
}

