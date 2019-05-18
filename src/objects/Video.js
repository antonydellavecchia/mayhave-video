import AudioObject from './AudioObject'
import DrumsShader from '../shaders/DrumsShader.glsl'
import ArpsShader from '../shaders/ArpsShader.glsl'
import BassShader from '../shaders/BassShader.glsl'
import MobiusVertexShader from '../shaders/MobiusVertexShader.glsl'
import AudioVertexShader from '../shaders/AudioVertexShader.glsl'
import World from './World'
import Surface from './Surface'
import Ocean from './Ocean'
import * as THREE from 'three'

export default class Video {
  constructor(THREE, base) {
    let surfaces = [new Surface('mobius')]
    this.lastTarget = {
      x: 0,
      y: 0,
      z: 0
    }
    this.cameraPosition = new THREE.Vector3(0, 50, 0)
    this.audioObjects = [
      new AudioObject(
        [{geometry: new THREE.SphereBufferGeometry(150, 32, 32)}],
        'assets/drums.mp3',
        DrumsShader,
        AudioVertexShader,
        THREE
      ),

      new AudioObject(
        [{geometry: new THREE.SphereBufferGeometry(150, 32, 32)}],
        'assets/arps.mp3',
        ArpsShader,
        AudioVertexShader,
        THREE
      ),

      new AudioObject(
        [{geometry: new THREE.SphereBufferGeometry(175, 32, 32)}],
        'assets/arps.mp3',
        ArpsShader,
        AudioVertexShader,
        THREE
      ),

      //new AudioObject(
      //  surfaces[0].geometry,
      //  'assets/bass.mp3',
      //  BassShader,
      //  MobiusVertexShader,
      //  THREE
      //)
    ]

    this.rotations = [{
      x: 0.01,
      y: 0.0,
      z: 0.0
    },{
      x: 0.0,
      y: - 0.01,
      z: 0.01
    },{
      x:0,
      y:0,
      z:0
    }]



    // create ocean
    let renderer = base.renderer
    let camera = base.camera
    let scene = base.scene
    let gsize = 512;
    let res = 512;
    let gres = res / 2;
    let origx = 0 //- gsize / 2;
    let origz = 0 //- gsize;
    let origy = 3;
    let ocean = new Ocean(renderer, camera, scene, {
      USE_HALF_FLOAT: true,
      INITIAL_SIZE: 512.0,
      INITIAL_WIND: [ 1.0, 5.0 ],
      INITIAL_CHOPPINESS: 1.5,
      CLEAR_COLOR: [ 1.0, 1.0, 1.0, 0.0 ],
      GEOMETRY_ORIGIN: [ origx, origy, origz ],
      SUN_DIRECTION: [ - 1.0, 1.0, 1.0 ],
      OCEAN_COLOR: new THREE.Vector3( 0.004, 0.016, 0.047 ),
      SKY_COLOR: new THREE.Vector3( 4.2, 9.6, 12.8 ),
      EXPOSURE: 0.2,
      GEOMETRY_RESOLUTION: gres,
      GEOMETRY_SIZE: gsize,
      RESOLUTION: res
    }, THREE);
    ocean.materialOcean.uniforms.u_projectionMatrix = { value: camera.projectionMatrix };
    ocean.materialOcean.uniforms.u_viewMatrix = { value: camera.matrixWorldInverse };
    ocean.materialOcean.uniforms.u_cameraPosition = { value: camera.position };

    base.scene.add(ocean.oceanMesh)

    this.ocean = ocean
    this.surfaces = surfaces
    this.base = base
    this.world = new World(THREE, base)
    this.world.createObjects()
    this.time = 0
    this.step = 0.01

    this.world.audioObjects.forEach(element => { this.audioObjects.push(element)})
    console.log(this.audioObjects)
  }

  setCameraPos(target) {

    //let target = this.surfaces[0].path(this.time).position


    // set camera to follow path on geometry
    this.base.camera.position.set(
      target.x,
      target.y,
      target.z
    )

    //let lookAtTarget = {
    //  x: 2 * target.x - this.lastTarget.x,
    //  y: 2 * target.y - this.lastTarget.y,
    //  z: 2 * target.z - this.lastTarget.z
    //}
    //
    //this.base.camera.lookAt(
    //  lookAtTarget.x,
    //  lookAtTarget.y,
    //  lookAtTarget.z
    //)

    //let lookAtTarget = {
    //  x: 2 * target.x - this.lastTarget.x,
    //  y: 2 * target.y - this.lastTarget.y,
    //  z: 2 * target.z - this.lastTarget.z
    //}


    this.lastTarget = target

  }
  
  animate() {

    this.time += this.step
    let period = 100
    //this.base.camera.position.z = 50 * Math.sin(this.time / period)

    let path = this.surfaces[0].path(this.time)
    
    let prevPos = this.base.camera.position

    let currentTime = new Date().getTime();
    this.deltaTime = ( currentTime - this.lastTime ) / 1000 || 0.0;
    this.lastTime = currentTime;

    this.ocean.animate(this.base.camera, 1)

    //this.base.camera.lookAt(path.lookAt[0], path.lookAt[1], path.lookAt[2])
    //this.base.camera.up = path.normal

    //debugger
    

    //this.base.camera.lookAt( prevPos.x, prevPos.y, prevPos.z)
    //let quaternion = new THREE.Quaternion()
    //quaternion.setFromAxisAngle(path.normal, Math.PI / 2)
    //this.base.camera.applyQuaternion(quaternion)
    
    let radius = Math.exp(- this.time) + 10
    

    let target = {
      x: radius * 2 * Math.cos(this.time ) + 20 * Math.cos(this.time / 64),
      z: radius * 3 * Math.cos(32 /(1 +  this.time)) * Math.sin(this.time),
      y: radius * 5 * Math.exp(-this.time) + 2
    }

    target.y = 2 * Math.max(
      7,
      100 * Math.exp(-Math.pow(target.z, 2) - Math.pow(target.x, 2) / 1000)
    )
    
    this.audioObjects.forEach((element, index) => {
      let data = element.analyser.data
      
      if (index == 1 ) {
        data.forEach((frequency, index) => {
          if (frequency > 90 ) {
            target.x += 5 * Math.sin(this.time / 666) * Math.sin( this.time * index / 666)
            target.z += 5 * Math.sin(this.time / 666) * Math.cos( this.time * index / 666)
            //target.y = 2 * Math.max(Math.pow((Math.pow(target.x, 2) + Math.pow(target.z, 2)), 1 / 2), 10)
            
          }
          
          
          //else if (frequency > 60 && index % 8 == 5) {
          //  target.x += 1 + 5 * Math.sin(- this.time * index / 666)
          //  target.y += 1 + 5 * Math.cos( this.time * index / 666)
          //  target.z += 1 + 5 * Math.cos( this.time * index / 666)
          //}
        })
      }


      element.meshes.forEach(mesh => {
        if (index < 2){
          mesh.scale.set(
            1 + Math.sin(Math.pow(-1, index) * this.time) / 300 ,
            1 + Math.sin(Math.pow(-1, index) * this.time) / 300 ,
            1 + Math.sin(Math.pow(-1, index) * this.time) / 300
          )
        
          mesh.rotation.x += this.rotations[index].x
          mesh.rotation.y += this.rotations[index].y
          mesh.rotation.z += this.rotations[index].z
        }

        if (index == 2) {
          mesh.scale.set(3, 3, 3)
        }
      })
    })


    target = {
      x: 90 * Math.cos(this.time),
      y: 5,
      z: 90 * Math.sin(this.time)
    }

    let arr = this.world.chairs
    let chair = null

    if (arr.length > 0) {
      let index = (Math.floor(this.time / 2 * Math.PI) % arr.length) % arr.length
      chair = arr[(arr.length - index) % arr.length].mesh
    }

    this.setCameraPos(target)

    if (chair) {
      let lookAtTarget = {
	x: 2 * target.x,
	y: 2 * target.y,
	z: 2 * target.z
      }


      this.base.camera.lookAt(
	lookAtTarget.x,
	lookAtTarget.y,
	lookAtTarget.z
      )
    }
    
    this.world.animate(this.time, this.base.camera)
    this.audioObjects.forEach(element => { element.animate() })
    this.world.audioObjects.forEach(element => {
      element.animate()
    })
  }
}
