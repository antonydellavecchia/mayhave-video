import Ocean from './Ocean'
import Model, { MovingModel }from './Model'
import Surface from './Surface'
import Character from './Character'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import ArpsShader from '../shaders/ArpsShader.glsl'
import CloudShader from '../shaders/CloudShader.glsl'
import DrumsShader from '../shaders/DrumsShader.glsl'
import EqualizerShader from '../shaders/EqualizerShader.glsl'
import DolphinShader from '../shaders/DolphinShader.glsl'
import AudioVertexShader from '../shaders/AudioVertexShader.glsl'
import AudioObject from './AudioObject'
import Trajectory from './Trajectory'
import Island from './Island'

var vector = new THREE.Vector3()
var quaternion = new THREE.Quaternion()

export default class World {
  constructor(THREE, base) {
    this.base = base
    this.islands =[]
    this.dolphinCenter = {
      x: 0,
      y: 0,
      z: 0
    }
    
    this.clouds = [
      new MovingModel({
        name: 'cloud',
        position: [ 0, 45, 45],
        rotation: [ 0, Math.PI, 0],
        scale: 1,
        frequencies: [3]
      }, new Trajectory([
        (deltaTime, position) => {
          let ode = {
            x: position.z - position.x * 0.1,
            y: - position.x * position.z / 11,
            z: -1 * position.x - position.z * 0.1
          }

          return {
            x: position.x + ode.x * deltaTime,
            y: position.y + ode.y * deltaTime,
            z: position.z + ode.z * deltaTime
          }
        }
      ])
      ), new MovingModel({
        name: 'cloud',
        position: [ 50, 75, 45],
        rotation: [ Math.PI * 5 /  4, Math.PI / 2, Math.PI],
        scale: 1,
        frequencies: [6]
      }, new Trajectory([
        (deltaTime, position) => {
          let ode = {
            x: position.z - position.x * 0.1,
            y: - position.x * position.z / 11,
            z: -1 * position.x - position.z * 0.1
          }

          return {
            x: position.x + ode.x * deltaTime,
            y: position.y + ode.y * deltaTime,
            z: position.z + ode.z * deltaTime
          }
        }
      ])
      ), new MovingModel({
        name: 'cloud',
        position: [ 0, 100, -20],
        rotation: [ 0, 0, 0],
        scale: 1,
        frequencies: [6]
      }, new Trajectory([
        (deltaTime, position) => {
          let ode = {
            x: position.z - position.x * 0.1,
            y: - position.x * position.z / 11,
            z: -1 * position.x - position.z * 0.1
          }

          return {
            x: position.x + ode.x * deltaTime,
            y: position.y + ode.y * deltaTime,
            z: position.z + ode.z * deltaTime
          }
        }
      ])
      ), new MovingModel({
        name: 'cloud',
        position: [ 25, 60, -25],
        rotation: [ 0, 0, 0],
        scale: 1,
        frequencies: [6]
      }, new Trajectory([
        (deltaTime, position) => {
          let ode = {
            x: position.z - position.x * 0.1,
            y: - position.x * position.z / 11,
            z: -1 * position.x - position.z * 0.1
          }

          return {
            x: position.x + ode.x * deltaTime,
            y: position.y + ode.y * deltaTime,
            z: position.z + ode.z * deltaTime
          }
        }
      ])
      ), new MovingModel({
        name: 'cloud',
        position: [ -25, 20, 50],
        rotation: [ 0, 0, 0],
        scale: 1,
        frequencies: [6]
      }, new Trajectory([
        (deltaTime, position) => {
          let ode = {
            x: position.z - position.x * 0.1,
            y: - position.x * position.z / 11,
            z: -1 * position.x - position.z * 0.1
          }

          return {
            x: position.x + ode.x * deltaTime,
            y: position.y + ode.y * deltaTime,
            z: position.z + ode.z * deltaTime
          }
        }
      ])
      )
    ]
    
    this.dolphins = [
      new Model({
        name: 'dolphin',
        position: [10, 10, 0],
        rotation:  [0, Math.PI * 5 / 4, - Math.PI / 6],
        scale: 1,
        frequencies: [ 2.0]
      }),
      new Model({
        name: 'dolphin',
        position: [10, 10, 0],
        rotation:  [0, Math.PI * 5 / 4, - Math.PI / 6],
        scale: 1,
        frequencies: [ 2.0]
      }),
      new Model({
        name: 'dolphin',
        position: [20, 10, 0],
        rotation:  [0, Math.PI * 5 / 4, - Math.PI / 6],
        scale: 1,
        frequencies: [5.0]
      }),
      new Model({
        name: 'dolphin',
        position: [0, 10, 80],
        rotation:  [0, 0, 0],
        scale: 1,
        frequencies: [8.0]
      }),
      new Model({
        name: 'dolphin',
        position: [-20, 10, 0],
        rotation:  [0, 0, 0],
        scale: 1,
        frequencies: [12.0]
      })
    ]

    this.umbrellas = []
    let numberOfUmbrellas = 10

    for(let i = 0; i < numberOfUmbrellas; i++) {
      this.umbrellas.push(
        new Model({
          name: 'umbrella',
          position: [110 * Math.sin(2 * Math.PI * i / numberOfUmbrellas), 2, 110 * Math.cos(2 * Math.PI * i / numberOfUmbrellas)],
          rotation: [0, 0, 0],
          scale: 0.15
        })
      )
    }

    this.chairs = []
    this.cookies = []
    
    for(let i = 0; i < numberOfUmbrellas; i++) {
      this.chairs.push(
        new Model({
          name: 'chair',
          position: [111 * Math.sin(2 * Math.PI * i / numberOfUmbrellas), 3, 111 * Math.cos(2 * Math.PI * i / numberOfUmbrellas)],
          rotation: [0, 0, 0],
          scale: 0.06
        })
      )

      this.cookies.push(new Character({
        playbackRate: this.base.playbackRate,
        name: 'mayhave-cookie',
        position: [112 * Math.sin(2 * Math.PI * i / numberOfUmbrellas), 4.5, 112 * Math.cos(2 * Math.PI * i / numberOfUmbrellas)],
        rotation: [0, Math.PI, 0],
        scale: 2,
        url: 'vocals.mp3'
      }))
    }
    
    this.cookie = new Character({
      playbackRate: this.base.playbackRate,
      name: 'mayhave-cookie',
      position: [50, 50, 50],
      rotation: [0, Math.PI, 0],
      scale: 3,
      url: 'vocals.mp3'
    })
    
    this.meshes = {
      dolphins: [],
      clouds: []
    }
    this.audioObjects = []    
  }

  projectPointPlane =  (point, unitNormal) => {
    let distance = point.dot(unitNormal)

    return vector.copy(point).addScaledVector(unitNormal, - distance)

  }

  animate = (time, camera) => {
    this.islands.forEach((island, index) => {
      let axis = vector.set(Math.pow(-1, index), - Math.pow(-1, index), index /2).normalize()
      island.rotate(axis, 0.01)
    })
    
    this.meshes.dolphins.forEach((dolphin, index, arr) => {
      // dolphin.position.x = 5 * Math.sin(time * index) + camera.position.x
      let radius = 5 * Math.sin(time) + 15
      vector.set(1, 0, 0)
      let direction = camera.getWorldDirection(vector)
      let cameraAxis = vector.copy(camera.position).normalize()
      let angle = Math.acos(cameraAxis.y / 2)
      let rotationAxis = cameraAxis.cross(vector.clone().set(0, 1, 0)).normalize()

      quaternion.setFromAxisAngle(rotationAxis, - angle)
      
      //let dolphinPosition = vector.addVectors(
      //  camera.position ,
      //  direction.multiplyScalar(camera.position.length() / 2)
      //)
      

      vector.set(
        radius * Math.sin(- Math.PI * 2 *(time +  index / arr.length)),
        0,
        radius * Math.cos(- Math.PI * 2 *(time +  index / arr.length))
      )


      vector.applyQuaternion(quaternion)
      dolphin.position.copy(vector)
      
      vector.set(this.dolphinCenter.x, this.dolphinCenter.y, this.dolphinCenter.z)
      dolphin.position.copy(vector.add(dolphin.position))

      if (this.dolphinCenter.y == 0) {
        quaternion.setFromAxisAngle(vector.set(1, 0, 0), 0.1)
        dolphin.applyQuaternion(quaternion)
      }

      else {
        dolphin.lookAt(this.base.camera.position)
        quaternion.setFromAxisAngle(vector.set(1, 0, 0), Math.PI)
        dolphin.applyQuaternion(quaternion)

        quaternion.setFromAxisAngle(vector.set(0, 0, 1), -Math.PI / 2)
        dolphin.applyQuaternion(quaternion)
      }
    })


    return this.cookie.animate()
  }

  createOcean(THREE) {
    let camera = this.base.camera
    // create ocean
    let gsize = 64;
    let res = 54;
    let gres = res / 2;
    let origx = 0 //- gsize / 2;
    let origz = 0 //- gsize; 
    let origy = 3;
    let ocean = new Ocean(THREE, this.base.renderer, this.base.camera, this.base.scene, {
      USE_HALF_FLOAT: true,
      INITIAL_SIZE: 128.0,
      INITIAL_WIND: [ 13.0, 15.0 ],
      INITIAL_CHOPPINESS: 10.5,
      CLEAR_COLOR: [ 1.0, 1.0, 1.0, 0.0 ],
      GEOMETRY_ORIGIN: [ origx, origy, origz ],
      SUN_DIRECTION: [ - 1.0, 1.0, 1.0 ],
      OCEAN_COLOR: new THREE.Vector3( 0.004, 0.016, 0.047 ),
      SKY_COLOR: new THREE.Vector3( 3.2, 9.6, 12.8 ),
      EXPOSURE: 0.05,
      GEOMETRY_RESOLUTION: gres,
      GEOMETRY_SIZE: gsize,
      RESOLUTION: res
    });
    ocean.materialOcean.uniforms.u_projectionMatrix = { value: camera.projectionMatrix };
    ocean.materialOcean.uniforms.u_viewMatrix = { value: camera.matrixWorldInverse };
    ocean.materialOcean.uniforms.u_cameraPosition = { value: camera.position };


    this.ocean = ocean;
  }
  
  animateOcean = (camera, deltaTime) => {
    this.ocean.deltaTime = deltaTime;
    this.ocean.render( this.ocean.deltaTime );
    this.ocean.overrideMaterial = this.ocean.materialOcean;
    
    if ( this.ocean.changed ) {
      this.ocean.materialOcean.uniforms.u_size.value = this.ocean.size;
      this.ocean.materialOcean.uniforms.u_sunDirection.value.set(this.ocean.sunDirectionX, this.ocean.sunDirectionY, this.ocean.sunDirectionZ );
      this.ocean.materialOcean.uniforms.u_exposure.value = this.ocean.exposure;
      this.ocean.changed = false;
    }
    this.ocean.materialOcean.uniforms.u_normalMap.value = this.ocean.normalMapFramebuffer.texture;
    this.ocean.materialOcean.uniforms.u_displacementMap.value = this.ocean.displacementMapFramebuffer.texture;
    this.ocean.materialOcean.uniforms.u_projectionMatrix.value = camera.projectionMatrix;
    this.ocean.materialOcean.uniforms.u_viewMatrix.value = camera.matrixWorldInverse;
    this.ocean.materialOcean.uniforms.u_cameraPosition.value = camera.position;
    this.ocean.materialOcean.depthTest = true;
  }

  async createObjects(scene) {
    let beach = await this.createBeach()

    let island = new Island(5, [0, 0, 0])
    
    await island.load()
    island.meshes.forEach(mesh => {this.base.scene.add(mesh)})

    this.island = island

    beach.name = 'beach'
    this.beach = beach
    this.base.scene.add(beach)    

    for (let i = 0; i < 10; i++) {
      this.islands.push(new Island(5, [
        25 * Math.cos(2 * Math.PI * i / 10),
        175 + Math.random() * 100,
        25 * Math.sin(2 * Math.PI * i /10)
      ]))
    }

    await Promise.all(this.islands.map(model => {return model.load()}))
    this.islands.forEach(island => {
      island.meshes.forEach(mesh => { this.base.scene.add(mesh)})
    })
        
    //this.meshes.push(island)


    // load and add cloud meshes to scene
    await Promise.all(this.clouds.map(model => {return model.load()}))
    let audioObject = new AudioObject(
      this.base.playbackRate,
      this.clouds,
      'assets/twinkle_city.mp3',
      CloudShader,
      AudioVertexShader,
      THREE
    )
//
//
    audioObject.meshes.forEach(mesh => {
      this.meshes.clouds.push(mesh)
      console.log(this.base.scene)
    })
    
    this.audioObjects.push(audioObject)

    this.clouds.forEach(cloud => { this.base.scene.add(cloud.mesh) })
    

    // add load and add models meshes to scene
    await Promise.all(this.dolphins.map(model => {return model.load()}))
    console.log(this.dolphins)
    this.dolphins.forEach(dolphin => {
      dolphin.mesh.material.color = new THREE.Color("rgb(247,111,173)");     
      this.meshes.dolphins.push(dolphin.mesh)
      this.base.scene.add(dolphin.mesh)
    })


    await this.cookie.load()
    this.cookie.mesh.name = "mayhave-cookie"
    this.base.scene.add(this.cookie.mesh)

      
    await Promise.all(this.umbrellas.map(model => {return model.load()}))
    this.umbrellas.forEach((umbrella, index, arr) => {
      umbrella.mesh.rotation.set(Math.PI / 2, 0 , -Math.PI / 2)
      let axis = vector.set(- Math.cos(2 * Math.PI * index / arr.length), 0, Math.sin(2 * Math.PI * index / arr.length))
      quaternion.setFromAxisAngle(axis, 11 * Math.PI / 12)
      umbrella.mesh.applyQuaternion(quaternion)
      this.base.scene.add(umbrella.mesh)
    })

    await Promise.all(this.cookies.map(model => {return model.load()}))
    this.cookies.forEach((cookie, index, arr) => {
      cookie.mesh.rotation.set(Math.PI / 2, 0 , -Math.PI / 2)
      
      let axis = vector.set(0, 1, 0)
      quaternion.setFromAxisAngle(axis, 2 * Math.PI * index / arr.length + Math.PI / 2)
      cookie.mesh.applyQuaternion(quaternion)
      
      axis = vector.set(- Math.cos(2 * Math.PI * index / arr.length), 0, Math.sin(2 * Math.PI * index / arr.length))
      quaternion.setFromAxisAngle(axis, -Math.PI / 4)
      cookie.mesh.applyQuaternion(quaternion)

      cookie.mesh.position.set(
	cookie.position[0] + 5 * axis.x,
	cookie.position[1] + 5 * axis.y + 2,
	cookie.position[2] + 5 * axis.z
      )

      
      cookie.mesh.scale.set(cookie.scale, cookie.scale, cookie.scale);
      this.base.scene.add(cookie.mesh)
    })
    
    await Promise.all(this.chairs.map(model => {return model.load()}))
    this.chairs.forEach((chair, index, arr) => {
      chair.mesh.rotation.set(Math.PI / 2, 0 , -Math.PI / 2)
      
      let axis = vector.set(0, 1, 0)
      quaternion.setFromAxisAngle(axis, 2 * Math.PI * index / arr.length + Math.PI / 2)
      chair.mesh.applyQuaternion(quaternion)
      
      axis = vector.set(- Math.cos(2 * Math.PI * index / arr.length), 0, Math.sin(2 * Math.PI * index / arr.length))
      quaternion.setFromAxisAngle(axis, -Math.PI / 2)
      chair.mesh.applyQuaternion(quaternion)

      chair.mesh.position.set(
	chair.position.x + 5 * axis.x,
	chair.position.y + 5 * axis.y,
	chair.position.z + 5 * axis.z
      )

      this.base.scene.add(chair.mesh)
    })


  }

  createTrees() {
    // return promises of loaded objects
    return new Promise((resolve, reject) => {
      let loader = new GLTFLoader();
      let trees = []
      let positions = [
        {
          origin: [2, 6, 0],
          rotation: [0, Math.PI * 5 / 4, - Math.PI / 6]
        },
        {
          origin: [ -2, 5, 2],
          rotation: [0, Math.PI / 4, 0] // Math.PI * 5 / 6, Math.PI * 17 / 6, - Math.PI * 11 / 6]
        },
        {
          origin: [ 1.5, 5, -2],
          rotation: [-Math.PI / 4, - Math.PI / 2, - Math.PI / 4]
        },
        {
          origin: [ -2.5, 4.5, -2],
          rotation: [ - Math.PI /  16, 0,  0]
        }
      ]

      // load model from file
      loader.load(
        'assets/models/glb/palm-tree.glb',
        (gltf) => {
          positions.forEach((position, index, arr) => {
            // get mesh
            let tree = gltf.scene.clone().children[0];

            tree = new AudioObject(
              [tree],
              'assets/bass.mp3',
              EqualizerShader,
              AudioVertexShader,
              THREE
            )

            tree.meshes.forEach(mesh => {
              mesh.rotation.set(position.rotation[0], position.rotation[1], position.rotation[2]);
              mesh.position.set(position.origin[0], position.origin[1], position.origin[2]);
              mesh.scale.set(0.005, 0.005, 0.005);
              mesh.name = 'tree'
              this.base.scene.add(mesh)
            })


            //tree.play()
            // add to to list
            trees.push(tree);

            // assert all tree are loaded
            if (trees.length === arr.length) {
              console.log('resolve trees');
              resolve(trees);
            }
          });
        },
        ( xhr ) => {
          // called while loading is progressing
          //`${( xhr.loaded / xhr.total * 100 )}% loaded` );
        },
        ( error ) => {
          // called when loading has errors
          console.error( 'An error happened', error );
        }
      );
    });
  }

  createBeach() {
    let surface = new Surface('gaussian')
    let beachGeometry = surface.geometry
    console.log(surface)

    return new Promise ((resolve, reject) => {
      let loader = new THREE.TextureLoader();
      loader.load('assets/textures/sand-texture.jpg', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 5, 5 );

        let material = new THREE.MeshBasicMaterial( {
          map: texture
        });

        material.side = THREE.DoubleSide;
        
        resolve(new THREE.Mesh(
          beachGeometry,
          material
        ))
      }, undefined, function ( err ) {
        console.error( 'error loading beach'  );
      });
    })
  }

  createIsland(radius, position) {
    // return a promise for the meshes
    return new Promise((resolve, reject) => {
      // create geometries
      let spheres = {
        sand: new THREE.SphereGeometry(radius, 32, 32),
        grass: new THREE.SphereGeometry(radius / 2, 32, 32)
      }
      
      // position geometries
      spheres['sand'].translate(position[0], position[1], position[2]);
      spheres['grass'].translate(
        position[0],
        position[1] + radius * 5 / 8,
        position[2]
      )

      // load textures
      let loader = new THREE.TextureLoader();
      let meshes = [];
      let shapes = [
        {
          name: 'sand',
          texture:'assets/textures/sand-texture.jpg',
        },
        {
          name: 'grass',
          texture: 'assets/textures/grass-texture.jpg'
        }
      ]

      shapes.forEach((shape, index, arr) => {
        loader.load(shape.texture, (texture) => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set( 5, 5 );

          let material = new THREE.MeshBasicMaterial( {
            map: texture
          });

          let mesh = new THREE.Mesh(spheres[`${shape.name}`], material)
          mesh.name = shape.name
          
          meshes.push(mesh);
          if (meshes.length === arr.length) {
            console.log('resolve');
            resolve(meshes);
          }

        }, undefined, function ( err ) {
          console.error( `error loading ${shape.name}` );
        });
      });
    });
  }
}
