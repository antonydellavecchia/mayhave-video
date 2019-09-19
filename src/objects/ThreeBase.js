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

    let renderer = new THREE.WebGLRenderer({ antialias: true });

    // settings
    renderer.setClearColor('rgb(247,111,173)')
    renderer.setPixelRatio( window.devicePixelRatio );
    
    
    // extensions for water
    renderer.context.getExtension( 'OES_texture_float' );
    renderer.context.getExtension( 'OES_texture_float_linear' );

    // set sizefr
    renderer.setSize(width, height);
    this.time = 0
    this.renderer = renderer    
    this.scene = scene
    this.camera = camera
    
    // add light
    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );

    this.light = new THREE.DirectionalLight( 0xffffff, 1.2 )
    this.scene.add(new THREE.AmbientLight(0x404040))
    //this.scene.add(this.light)
    this.scene.add(light)

    // timing

    //this.playbackRate = 1.0
    this.playbackRate = 1.0
    //this.playbackRate = 0.3775
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }



  animate (debug) {

    this.renderScene()
  }
}

