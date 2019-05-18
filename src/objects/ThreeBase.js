import * as THREE from  'three'

export default class ThreeBase {
  constructor(window, width, height) {
    let scene = new THREE.Scene()
    let camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )

    let renderer = new THREE.WebGLRenderer({ antialias: true })

    // settings
    renderer.setClearColor('rgb(247,111,173)')
    renderer.setPixelRatio( window.devicePixelRatio );

    // extensions for water
    renderer.context.getExtension( 'OES_texture_float' );
    renderer.context.getExtension( 'OES_texture_float_linear' );

    // set size
    renderer.setSize(width, height);

    this.renderer = renderer    
    this.scene = scene
    this.camera = camera
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }



  animate () {
    this.renderScene()
  }
}

