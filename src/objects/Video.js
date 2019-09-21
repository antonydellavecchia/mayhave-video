import * as THREE from 'three'
import AudioObject from './AudioObject'
import DrumsShader from '../shaders/DrumsShader.glsl'
import ArpsShader from '../shaders/ArpsShader.glsl'
import BassShader from '../shaders/BassShader.glsl'
import GuitarShader from '../shaders/GuitarShader.glsl'
import MobiusVertexShader from '../shaders/MobiusVertexShader.glsl'
import AudioVertexShader from '../shaders/AudioVertexShader.glsl'
import World from './World'
import Trajectory from './Trajectory'
import Surface from './Surface'
import Ocean from './Ocean'

var vector = new THREE.Vector3()
var quaternion = new THREE.Quaternion()

export default class Video {
  constructor(THREE, base) {
    this.playbackRate = base.playbackRate
    let surfaces = [new Surface('mobius')]
    this.end = false
    // starting position
    this.lastTarget = {
      x: 20,
      y: 70,
      z: -20
    }

    this.trajectory = new Trajectory([
      // path 0
      (deltaTime, position) => {
        let ode = {
          x: position.z - position.x * 0.2,
          y: - position.x * position.z / 15,
          z: -1 * position.x - position.z * 0.2
        }

        return {
          x: position.x + ode.x * deltaTime,
          y: position.y + ode.y * deltaTime,
          z: position.z + ode.z * deltaTime
        }
      },

      // path 1 
      (deltaTime, pos) => {
        // rossler
        let origin = {
          x: 0,
          y: -20,
          z: 0
        }

        let scale = 0.05
        let position = {
          x: scale *  (pos.x - origin.x),
          y: scale *  (pos.y - origin.y),
          z: scale *  (pos.z - origin.z)
        }

        let a =  3.2
        let b =  1.2
        let c = 2.7
        
        let ode = {
          x: -1 * (position.y + position.z),
          y: b + position.x * position.y - c * position.y,
          z: position.x + a * position.z
        }

        return {
          x: pos.x + ode.x * deltaTime,
          y: pos.y + ode.y * deltaTime,
          z: pos.z + ode.z * deltaTime
        }
      },

      // path 2
      (deltaTime, pos) => {
        
        // lorenz
        let sigma = 10
        let beta = 8 / 3
        let rho = 1.25

        let origin = {
          x: 0,
          y: - 10,
          z: 0
        }

        let scale = 1
        let position = {
          x: scale *  (pos.x - origin.x),
          y: scale *  (pos.y - origin.y),
          z: scale *  (pos.z - origin.z)
        }
        
        let ode = {
          x: sigma * (position.y - position.x),
          y: (position.x *  position.z - beta * position.y),
          z: position.x * (rho - position.y) - position.z
        }

        return {
          x: pos.x - ode.x * 0.05 * deltaTime,
          y: pos.y - ode.y * 0.05 * deltaTime,
          z: pos.z - ode.z * 0.05 * deltaTime
        }
      },

      // path 3
      (deltaTime, pos) => {
        let a = 1
        let b = 1
        let c = 1

        let origin = {
          x: 0,
          y: 25,
          z: 0
        }

        let position = {
          x: (pos.x - origin.x),
          y: (pos.y - origin.y),
          z: (pos.z - origin.z)
        }
        
        let ode = {
          x: position.z ,
          y: - position.y,
          z: - 0.95 * position.x
        }

        return {
          x: pos.x + ode.x * deltaTime ,
          y: pos.y + ode.y * deltaTime ,
          z: pos.z + ode.z * deltaTime
        }
      },

      // path 4
      (deltaTime, pos) => {
        let a =  0.2
        let b =  1.2
        let c = 5.7

        
        let origin = {
          x: 0,
          y: -50,
          z: 0
        }

        let scale = 1
        let position = {
          x: scale *  (pos.x - origin.x),
          y: scale *  (pos.y - origin.y),
          z: scale *  (pos.z - origin.z)
        }

        let ode = {
          x: position.z,
          y: position.y * (1 - position.y / 1000),
          z: - position.x - 1.3 * position.z
        }

        return {
          x: pos.x + ode.x * deltaTime ,
          y: pos.y - ode.y * deltaTime ,
          z: pos.z + ode.z * deltaTime
        }
      },

      //path 5
      (deltaTime, pos) => {
        let origin = {
          x: 0,
          y: 200,
          z: 0
        }

        
        let scale = 1
        let position = {
          x: scale *  (pos.x - origin.x),
          y: scale *  (pos.y - origin.y),
          z: scale *  (pos.z - origin.z)
        }

        let ode = {
          x: 0,
          y: -position.y / 3,
          z: 0
        }

        return {
          x: pos.x + ode.x * deltaTime ,
          y: pos.y + ode.y * deltaTime ,
          z: pos.z + ode.z * deltaTime
        }
      }
    ])

    
    this.cameraPosition = new THREE.Vector3(0, 50, 0)
    this.audioObjects = [
      new AudioObject(
        this.playbackRate,
        [{geometry: new THREE.SphereBufferGeometry(150, 32, 32), name: 'drums'}],
        'assets/drums.mp3',
        DrumsShader,
        AudioVertexShader,
        THREE
      ),

      new AudioObject(
        this.playbackRate,
        [{geometry: new THREE.SphereBufferGeometry(150, 32, 32), name: 'arps'}],
        'assets/arps.mp3',
        ArpsShader,
        AudioVertexShader,
        THREE
      ),

      new AudioObject(
        this.playbackRate,
        [{geometry: new THREE.SphereBufferGeometry(175, 32, 32)}],
        'assets/arps.mp3',
        ArpsShader,
        AudioVertexShader,
        THREE
      ),

      new AudioObject(
        this.playbackRate,
        [{geometry: new THREE.SphereBufferGeometry(120, 32, 32), name: 'twinkle'}],
        'assets/twinkle_city.mp3',
        BassShader,
        AudioVertexShader,
        THREE
      ),
//      new AudioObject(
//        this.playbackRate,
//        [{geometry: new THREE.SphereBufferGeometry(125, 32, 32), name: 'twinkle'}],
//        'assets/guitar.mp3',
//        GuitarShader,
//        AudioVertexShader,
//        THREE
//      ),

      new AudioObject(
        this.playbackRate,
        [{geometry: new THREE.SphereBufferGeometry(270, 32, 32), name: 'twinkle'}],
        'assets/guitar.mp3',
        GuitarShader,
        AudioVertexShader,
        THREE
      )
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
      INITIAL_CHOPPINESS: 3.5,
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
    this.step = 0.01 * this.playbackRate
    
    this.world.audioObjects.forEach(element => { this.audioObjects.push(element)})
  }

  setCameraPos(target) {
    target = this.trajectory.getTarget(this.time, this.lastTarget)

    //let target = this.surfaces[0].path(this.time).position
    // set camera to follow path on geometry
    this.base.camera.position.set(
      target.x,
      target.y,
      target.z
    )

    this.lookAtTarget = {
      x: 2 * target.x - this.lastTarget.x,
      y: 2 * target.y - this.lastTarget.y,
      z: 2 * target.z - this.lastTarget.z
    }

    let beach = this.base.scene.getObjectByName('beach')
    
    if (beach && target.y < beach.position.y + 2) {
      this.base.scene.remove(beach)
    }

    else if (!beach && target.y > 7) {
      this.base.scene.add(this.world.beach)
    }
    
    if (this.trajectory.step === 1) {   
      let initial = {...this.halfTimeLookAt}

      //let initial = {
      //  x: this.halfTimeLookAt.x * Math.exp(- 0.5 * Math.pow((this.time - this.halfTime), 2)),
      //  y: this.halfTimeLookAt.y * Math.exp(- 0.05 * Math.pow((this.time - this.halfTime), 2)),
      //  z: this.halfTimeLookAt.z * Math.exp(- 0.05 * Math.pow((this.time - this.halfTime), 2))
      //}

      let end = {
        x: this.lookAtTarget.x * Math.exp(- 0.5 * Math.pow((this.time - this.halfTime), 2)),
        y: this.lookAtTarget.y * Math.exp(- 0.5 * Math.pow((this.time - this.halfTime), 2)),
        z: this.lookAtTarget.z * Math.exp(- 0.5 * Math.pow((this.time - this.halfTime), 2))
      }
      

      this.lookAtTarget = {
        x: initial.x * Math.exp(- 0.1 * Math.pow((this.time - this.halfTime), 2)) + (1 - Math.exp(- 0.5 * Math.pow((this.time - this.halfTime), 2))) * end.x,
        y: initial.y * Math.exp(- 0.1 * Math.pow((this.time - this.halfTime), 2)) + (1 - Math.exp(- 0.5 * Math.pow((this.time - this.halfTime), 2))) * end.y,
        z: initial.z * Math.exp(- 0.1 * Math.pow((this.time - this.halfTime), 2)) + (1 - Math.exp(- 0.5 * Math.pow((this.time - this.halfTime), 2))) * end.z
      }

      this.world.cookie.mesh.position.set(
        this.base.camera.position.x + 0.5 * (this.lookAtTarget.x -  this.base.camera.position.x),
        this.base.camera.position.y + 0.5 * (this.lookAtTarget.y -  this.base.camera.position.y),
        this.base.camera.position.z + 0.5 * (this.lookAtTarget.z -  this.base.camera.position.z)
      )
      //this.world.cookie.mesh.position.set(
      //  - 0.5 * (this.lookAtTarget.x - this.lookAtTarget.x ),
      //)
    }

    if (this.trajectory.step == 2) {
      let initial = {...this.halfTimeLookAt}
      let end = {
        x: 0,
        y: 0,
        z: 0
      }
      
      this.lookAtTarget = {
        x: initial.x * Math.exp(- 1 * Math.pow((this.time - this.halfTime), 2)) + (1 - Math.exp(- 0.5 * Math.pow((this.time - this.halfTime), 2))) * end.x,
        y: initial.y * Math.exp(- 1 * Math.pow((this.time - this.halfTime), 2)) + (1 - Math.exp(- 0.5 * Math.pow((this.time - this.halfTime), 2))) * end.y,
        z: initial.z * Math.exp(- 1 * Math.pow((this.time - this.halfTime), 2)) + (1 - Math.exp(- 0.5 * Math.pow((this.time - this.halfTime), 2))) * end.z
      }
    }
    
    if (this.trajectory.step == 3) {
      let initial = {
        x: -1 * this.base.camera.position.x,
        y: -1 * this.base.camera.position.y,
        z: -1 * this.base.camera.position.z
      }

      this.lookAtTarget = {
        x: Math.exp(- 0.5 * Math.pow((this.time - this.halfTime), 2)) * initial.x + (1 - Math.exp(- 1 * Math.pow((this.time - this.halfTime), 2))) * this.lookAtTarget.x,
        y: Math.exp(- 0.5 * Math.pow((this.time - this.halfTime), 2)) * initial.y + (1 - Math.exp(- 1 * Math.pow((this.time - this.halfTime), 2))) * this.lookAtTarget.y,
        z: Math.exp(- 0.5 * Math.pow((this.time - this.halfTime), 2)) * initial.z + (1 - Math.exp(- 1 * Math.pow((this.time - this.halfTime), 2))) * this.lookAtTarget.z
      }
      
      let end = {
        x: 10 * (this.lookAtTarget.x - this.base.camera.position.x) + this.base.camera.position.x,
        y: 10 * (this.lookAtTarget.y - this.base.camera.position.y) + this.base.camera.position.y,
        z: 10 * (this.lookAtTarget.z - this.base.camera.position.z) + this.base.camera.position.z
      }

      let cookieTarget = {
        x: Math.exp(- 2 * Math.pow((this.time - this.halfTime), 2)) * this.world.cookie.mesh.position.x + (1 - Math.exp(- 2 * Math.pow((this.time - this.halfTime), 2))) * end.x,
        y: Math.exp(- 2 * Math.pow((this.time - this.halfTime), 2)) * this.world.cookie.mesh.position.y + (1 - Math.exp(- 2 * Math.pow((this.time - this.halfTime), 2))) * end.y,
        z: Math.exp(- 2 * Math.pow((this.time - this.halfTime), 2)) * this.world.cookie.mesh.position.z + (1 - Math.exp(- 2 * Math.pow((this.time - this.halfTime), 2))) * end.z
      }

      this.world.cookie.mesh.position.set(
        cookieTarget.x,
        cookieTarget.y,
        cookieTarget.z
      )

    }

    if (this.trajectory.step == 4) {
      // rotate island
      let camera = this.base.camera
      vector.set(1, 0, 0)
      let direction = camera.getWorldDirection(vector)
      let cameraAxis = vector.copy(camera.position).normalize()
      let angle = Math.acos(cameraAxis.y / 2)
      let rotationAxis = cameraAxis.cross(vector.clone().set(0, 1, 0)).normalize()
      this.world.island.rotate(cameraAxis, angle / 100)
      

      let end = {...this.lookAtTarget}
      
      this.lookAtTarget = {
        x: Math.exp(- 0.5 * Math.pow((this.time - this.halfTime), 2)) * this.world.cookie.mesh.position.x,
        y: Math.exp(- 0.5 * Math.pow((this.time - this.halfTime), 2)) * this.world.cookie.mesh.position.y,
        z: Math.exp(- 0.5 * Math.pow((this.time - this.halfTime), 2)) * this.world.cookie.mesh.position.z
      }

      if (this.world.dolphinCenter.y > -50) {
        this.world.dolphinCenter.y -= 0.1
      }

    }

    if (this.trajectory.step == 5) {
      let initial = {...this.lookAtTarget}
      let end = {
        x: 0,
        y: 1000,
        z: 0
      }
      
      this.lookAtTarget = {
        x: (1 - Math.exp(- 0.05 * Math.pow((this.time - this.halfTime), 2))) * end.x,
        y: (1 - Math.exp(- 0.05 * Math.pow((this.time - this.halfTime), 2))) * end.y,
        z: (1 - Math.exp(- 0.05 * Math.pow((this.time - this.halfTime), 2))) * end.z
      }


      if ( target.y > - 15) {
        //this.world.cookie.mesh.position.set(target.x, target.y + 20, target.z)

        let end = {
          x: this.base.camera.position.x,
          y: 20 + this.base.camera.position.y,
          z: this.base.camera.position.z
        }

        let cookieTarget = {
          x: Math.exp(- 2 * Math.pow((this.time - this.halfTime), 2)) * this.world.cookie.mesh.position.x + (1 - Math.exp(- 2 * Math.pow((this.time - this.halfTime), 2))) * end.x,
          y: Math.exp(- 2 * Math.pow((this.time - this.halfTime), 2)) * this.world.cookie.mesh.position.y + (1 - Math.exp(- 2 * Math.pow((this.time - this.halfTime), 2))) * end.y,
          z: Math.exp(- 2 * Math.pow((this.time - this.halfTime), 2)) * this.world.cookie.mesh.position.z + (1 - Math.exp(- 2 * Math.pow((this.time - this.halfTime), 2))) * end.z
        }

        this.world.cookie.mesh.position.set(
          cookieTarget.x,
          cookieTarget.y,
          cookieTarget.z
        )

        
      }

      if (Math.abs(target.y - this.world.dolphinCenter.y) < 0.1) {
        this.world.dolphinCenter = {
          x: target.x,
          y: target.y + 1.5 * (this.time - this.halfTime),
          z: target.z
        }
      }

      vector.set(
        this.base.camera.position.x,
        this.base.camera.position.y,
        this.base.camera.position.z
      )

      this.world.cookie.mesh.lookAt(vector)
    }


    this.base.camera.lookAt(
      this.lookAtTarget.x,
      this.lookAtTarget.y,
      this.lookAtTarget.z
    )


    //this.lookAtTarget = {
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

        else if (index == 4) {
          //mesh.scale.set(3, 3, 3)
          mesh.rotation.x += this.rotations[0].x
          mesh.rotation.y += 0.01
          mesh.rotation.z += -0.01

        }
      })
    })


    target = {
      x: Math.cos(this.time / 128) * 112 * Math.cos(this.time) + 10 * Math.sin(5 * this.time) ,
      y: Math.cos(this.time / 128) * 5  + 10,
      z: Math.cos(this.time / 128) * 112 * Math.sin(this.time) + 10 * Math.sin(5 * this.time) 
    }

    let arr = this.world.cookies

    //if (arr.length > 0) {
    //  let index = (Math.floor(this.time / 2 * Math.PI) % arr.length) % arr.length
    //  cookie = arr[(arr.length - index) % arr.length].mesh
    //}

    this.setCameraPos(target)

    arr.forEach(cookie => {
      let distanceToCamera = cookie.mesh.position.distanceTo(this.base.camera.position)

      vector.set(
        this.base.camera.position.x,
        this.base.camera.position.y,
        this.base.camera.position.z
      )

      cookie.mesh.lookAt(vector)

    })

    vector.set(
      this.base.camera.position.x,
      this.base.camera.position.y,
      this.base.camera.position.z
    )

    this.world.cookie.mesh.lookAt(vector)

    
    //if (chair) {
    //let lookAtTarget = {
    //	x: 2 * target.x,
    //	y: 2 * target.y,
    //	z: 2 * target.z
    //      }
    //
    //
    //      this.base.camera.lookAt(
    //	lookAtTarget.x,
    //	lookAtTarget.y,
    //	lookAtTarget.z
    //      )
    //}


    // change step on actiation and animates world
    let vocalActivation = this.world.animate(this.time, this.base.camera)
    let twinkleActivation = null
    let arpsActivation = null
    let drumsActivation = null
    
    this.audioObjects.forEach(element => {
      switch(element.name) {
        case 'twinkle':
          twinkleActivation = element.animate(this.time)


        case 'arps':
          arpsActivation = element.animate(this.time)


        case 'drums':
          drumsActivation = element.animate(this.time)

          
        default:
          element.animate(this.time)
      }
    })

    if (this.base.camera.position.y > 5) {

    }

    if ( vocalActivation > 10  && this.trajectory.step == 0  ) {
      //this.halfTime = this.time
      //this.halfTimeLookAt = {
      //  x: this.lookAtTarget.x,
      //  y: this.lookAtTarget.y,
      //  z: this.lookAtTarget.z
      //}
      
      //      this.cookiePosition = {
      //        x: this.cookie.mesh.position.x,
      //        y: this.cookie.mesh.position.y,
      //        z: this.cookie.mesh.position.z
      //      }
      //      this.trajectory.next()
    }

    else if (arpsActivation > 15  && this.trajectory.step == 1) {
      
      //this.halfTime = this.time
      //this.halfTimeLookAt = {
      //  x: this.lookAtTarget.x,
      //  y: this.lookAtTarget.y,
      //  z: this.lookAtTarget.z
      //}
//      this.trajectory.next()
      
    }


    if (this.base.camera.position.distanceTo(vector.set(0,0,0)) > 101 && this.trajectory.step == 2) {
      
      //this.halfTime = this.time
      //this.halfTimeLookAt = {
      //  x: 0,
      //  y: 0,
      //  z: 0
      //}
      
//      this.trajectory.next()
    }

    if (twinkleActivation > 10 && this.base.camera.position.y > 3) {
      //this.halfTime = this.time
      this.beachPosition = {
        x: this.lookAtTarget.x,
        y: this.lookAtTarget.y,
        z: this.lookAtTarget.z
      }
//      this.trajectory.next()

    }

    vector.set(0, 50, 0)
    if (drumsActivation > 26 && this.trajectory.step == 4) {
      //this.halfTime = this.time
      
//      this.trajectory.next()
      this.end = true
    }
  }
}
