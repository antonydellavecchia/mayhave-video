import * as THREE from  'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const modelDir = 'assets/models/glb/'
const audioDir = 'assets/'


export default class Character {
  constructor(params) {
    this.name = params.name
    this.position = params.position
    this.scale = params.scale
    this.mediaElement = new Audio(`${audioDir}${params.url}`);
    this.mesh = null

    let fftSize = 128;
    let listener = new THREE.AudioListener();
    let audio = new THREE.Audio( listener );
    
    audio.setMediaElementSource( this.mediaElement );

    this.analyser = new THREE.AudioAnalyser( audio, fftSize );
    this.uniforms = {
      tAudioData: {
        value: new THREE.DataTexture(
          this.analyser.data,
          fftSize / 2,
          1,
          THREE.LuminanceFormat
        )
      }
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

          let gltfObject = gltf.scene.clone()
          gltfObject.traverse(object => {
            if (object.isMesh) {
              object.material = new THREE.MeshBasicMaterial({map: object.material.map});
            }
          });

          this.mesh = gltfObject
          this.mesh.position.set(this.position[0], this.position[1], this.position[2]);
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
      )
    })
  }

  play = () => {
    this.mediaElement.play();
  }

  animate = () => {
    let mouth = this.mesh.children[0];
    let frequencyArr = this.analyser.getFrequencyData();
    let sum = 0;
    
    frequencyArr.forEach(frequency => {
      sum += frequency;
    });
    
    let average = sum / frequencyArr.length;
    let input = average / 7;
    //let input = frequencyArr[4] / 100;
    let mouthAngle = Math.PI * Math.exp(0.5 * input) / (1 + Math.exp(0.5 * input));
    
    mouth.rotation.x = mouthAngle;
    
    this.analyser.getFrequencyData();
    this.uniforms.tAudioData.value.needsUpdate = true
  }
}
