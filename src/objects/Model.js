import * as THREE from  'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const modelDir = 'assets/models/glb/'
const audioDir = 'assets/'



export default class Model {
  constructor(model) {
    this.name = model.name
    this.rotation =  model.position
    this.scale = model.scale
    this.frequencies = model.frequencies
    this.geometry = null
    this.mesh = null
    this.audio = null
    this.position ={
      x: model.position[0],
      y: model.position[1],
      z: model.position[2],
    }
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

          gltfObject.traverse(object => {
            if (object.isMesh) {
              object.geometry.computeFaceNormals();
              object.geometry.computeVertexNormals();
              object.material = new THREE.MeshLambertMaterial({
                map: object.material.map,
                side: THREE.DoubleSide,
                emissive: 0x2a2a2a,
                emmissiveIntensity: 0.5
              });
            }

            //else if (object.isMesh) {
            //  object.
            //}
          });

          this.mesh.rotation.set(this.rotation[0], this.rotation[1], this.rotation[2]);
          this.mesh.position.set(this.position.x, this.position.y, this.position.z);
          this.mesh.scale.set(this.scale, this.scale, this.scale);
          

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

export class MovingModel extends Model {
  constructor(model, trajectory) {
    super(model)
    this.trajectory = trajectory
  }

  animate(time) {
    let position = this.trajectory.getTarget(time, this.position)
    this.mesh.position.set(position.x, position.y, position.z)
    this.position = position
  }
}
