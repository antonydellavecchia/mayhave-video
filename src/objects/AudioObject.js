export default class AudioObject {
  constructor(models, url, fragmentShader, VertexShader, THREE) {
    let fftSize = 128;
    let listener = new THREE.AudioListener();
    let audio = new THREE.Audio( listener );
    this.mediaElement = new Audio(url);
    this.meshes = []
    
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

    models.forEach(model => {
      
      let uniforms = {...this.uniforms}

      if (model.frequencies) {
        uniforms.frequencies ={
          value: model.frequencies[0]
        }
      }

      let material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: VertexShader,
        fragmentShader: fragmentShader
      } );

      material.side = THREE.DoubleSide;

      let mesh = new THREE.Mesh( model.geometry, material )

      if (model.position) {
        mesh.position.set(
          model.position[0],
          model.position[1],
          model.position[2]
        )

      }

      if (model.rotation ) {
        mesh.rotation.set(
          model.rotation[0],
          model.rotation[1],
          model.rotation[2]
        )
      }

      if (model.rotation) {
        mesh.scale.set(
          model.scale,
          model.scale,
          model.scale
        )
      }
      
      this.meshes.push(mesh);
    })
  }

  play = () => {
    this.mediaElement.play();
  }

  animate = () => {
    this.analyser.getFrequencyData();
    this.uniforms.tAudioData.value.needsUpdate = true
  }
}
