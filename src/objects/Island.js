import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import TreeShader from '../shaders/TreeShader.glsl'
import AudioVertexShader from '../shaders/AudioVertexShader.glsl'
import AudioObject from './AudioObject'
var vector = new THREE.Vector3()
var quaternion = new THREE.Quaternion()

export default class Island {
  constructor(radius, position) {
    this.radius = radius
    this.position = position
    this.meshes = []
    this.audioObjects = []
  }

  async load() {
    let island = await this.createIsland(this.radius, this.position)
    island.forEach(mesh => {
      this.meshes.push(mesh)
    })

    let trees = await this.createTrees()
    trees.forEach(tree => {
      this.meshes.push(tree)
    })

    return this
  }

  
  rotate(axis, angle) {
    let grass = this.meshes.find(mesh => mesh.name == 'grass')
    let trees = this.meshes.filter(mesh => mesh.name == 'tree')

    //let tree = this.base.scene.getObjectByName('tree')

    vector.set(this.position[0], this.position[1], this.position[2])
    quaternion.setFromAxisAngle(axis, - angle)
    
    let position = grass.position.addScaledVector(vector, -1)
    position.applyQuaternion(quaternion)
    grass.position.copy(position.addScaledVector(vector, 1))
    
    trees.forEach(tree => {
      position = tree.position.addScaledVector(vector, -1)
      position.applyQuaternion(quaternion)
      tree.applyQuaternion(quaternion)
      tree.position.copy(position.addScaledVector(vector, 1))

      
    })

  }

  translate(vec) {
    this.meshes.forEach(mesh => {
      
      let position = mesh.position.clone()
      vector.set(vec.x, vec.y, vec.z).add(position)

      mesh.position.copy(vector)
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

          if (shape.name == 'grass') {
            mesh.position.set(
              position[0],
              position[1] + radius * 5 / 8,
              position[2]
            )
          }
          
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

  createTrees() {
    // return promises of loaded objects
    return new Promise((resolve, reject) => {
      let loader = new GLTFLoader();
      let trees = []
      let positions = [
        {
          origin: [0, 0, 0],
          rotation: [- Math.PI / 2, 0, 0]
        },
        {
          origin: [0, 0, 0],
          rotation: [- Math.PI / 2, 0, 0] // Math.PI * 5 / 6, Math.PI * 17 / 6, - Math.PI * 11 / 6]
        },
        {
          origin: [0, 0, 0],
          rotation: [- Math.PI / 2, 0, 0]
        },
        {
          origin: [0, 0, 0],
          rotation: [- Math.PI / 2, 0, 0]
        }
      ]

      // load model from file
      loader.load(
        'assets/models/glb/palm-tree2.glb',
        (gltf) => {
          positions.forEach((pos, index, arr) => {
            // get mesh
            let tree = gltf.scene.clone().children[0];
            let newOrigin = pos.origin.map((p, index) => p + this.position[index])
            let position = {
              origin: newOrigin,
              rotation: pos.rotation
            }

            let material = new THREE.ShaderMaterial( {
              vertexShader: AudioVertexShader,
              fragmentShader: TreeShader
            } );

            material.side = THREE.DoubleSide;
            
            let mesh = new THREE.Mesh(tree.geometry, material)


            //let angle = 2 * Math.PI * index / parseFloat(arr.length) - Math.PI
            let angle = 2 * Math.PI * index / arr.length
            let axis = vector.set(0, 1, 0)

            quaternion.setFromAxisAngle(axis, angle)
            mesh.rotation.set(position.rotation[0], position.rotation[1], position.rotation[2]);
            mesh.applyQuaternion(quaternion)
            axis = vector.set(- Math.cos(angle), 0, Math.sin(angle))
            quaternion.setFromAxisAngle(axis, Math.PI / 4)
            
            let posVec = new THREE.Vector3(
              position.origin[0],
              position.origin[1],
              position.origin[2]
            ).addScaledVector(vector.set(- Math.cos(angle), 5, Math.sin(angle)).normalize(), 5)

            mesh.position.set(posVec.x, posVec.y, posVec.z);
            mesh.scale.set(0.75, 0.75, 0.75);
            mesh.name = 'tree'


            //tree.play()
            // add to to list
            trees.push(mesh);

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
}
