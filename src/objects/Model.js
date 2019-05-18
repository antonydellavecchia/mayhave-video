import * as THREE from  'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const modelDir = 'assets/models/glb/'
const audioDir = 'assets/'



export default class Model {
  constructor(model) {
    this.name = model.name
    this.position = model.position
    this.rotation =  model.position
    this.scale = model.scale
    this.frequencies = model.frequencies
    this.geometry = null
    this.mesh = null
    this.audio = null
  }

  load() {
    let loader = new GLTFLoader();
    // return promises of loaded objects
    return new Promise((resolve, reject) => {

      // load model from file
      loader.load(
        `${modelDir}${this.name}.glb`,
        (gltf) => {
          // get mesh
          let gltfObject = gltf.scene.clone().children[0];

          this.geometry = gltfObject.geometry
          this.mesh = gltfObject
          this.mesh.rotation.set(this.rotation[0], this.rotation[1], this.rotation[2]);
          this.mesh.position.set(this.position[0], this.position[1], this.position[2]);
          this.mesh.scale.set(this.scale, this.scale, this.scale);
          gltfObject.traverse(object => {
            if (object.isMesh) {
              object.material = new THREE.MeshBasicMaterial({map: object.material.map});
            }
          });
          
          resolve(this)

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

