import * as THREE from 'three'
import * as m from 'mathjs'


export default class Surface {
  constructor(type) {
    let geometry = null
    
    switch(type) {
      case 'gaussian':
        geometry = new THREE.ParametricBufferGeometry( this.gaussian, 10, 10 );
        break

      case 'mobius':
        geometry = new THREE.ParametricBufferGeometry( this.mobius, 100, 100 );
        break

      default:
        geometry = new THREE.SphereBufferGeometry(1, 1, 1)
    }

    this.geometry = geometry
    this.scale = 3
  }

  gaussian(s, t, target) {
    var x = 500 * (t - 0.5)
    var y = (-15 * Math.exp(- Math.pow(5 * (s - 0.5), 2) - Math.pow(5 *(t - 0.5), 2)) + 7)
    var z = 500 * (s - 0.5)

    target.set(x, y, z)
  }
  
  mobius(s, t, target) {

    // flat mobius strip
    // http://www.wolframalpha.com/input/?i=M%C3%B6bius+strip+parametric+equations&lk=1&a=ClashPrefs_*Surface.MoebiusStrip.SurfaceProperty.ParametricEquations-
    var u = s - 0.5;
    //u = Math.abs(u)
    var v = 2 * Math.PI * t;

    var x, y, z;
    
    var a = 5;

    x = Math.cos( v ) * ( a + u * Math.cos( v / 2 ) );
    y = Math.sin( v ) * ( a + u * Math.cos( v / 2 ) );
    z = u * Math.sin( v / 2 );

    var dxu, dxv, dyu, dyv, dzu, dzv
    let sign = Math.ceil(t) % 2
    
    dxu = - Math.cos(v) * Math.sin(v / 2)
    dxv = -1 * (a * Math.sin(v) +  u * (Math.sin(v) * Math.cos(v / 2) +  Math.cos(v) * Math.sin(v / 2) / 2))

    dyu = Math.sin(v) * Math.cos(v / 2)
    dyv = a * Math.cos(v) +  u * (Math.cos(v) * Math.cos(v / 2) - Math.sin(v) * Math.sin(v / 2) / 2)

    dzu = Math.sin(v / 2)
    dzv =  u * Math.cos(v / 2) / 2

    


    target.set( x, y, z );

    let jacobian = m.matrix([
      [ dxu, dxv],
      [ dyu, dyv],
      [ dzu, dzv]
    ])

    
    jacobian = m.multiply(jacobian, [
      [1, 0],
      [0, 2 * Math.PI]
    ])

    return {
      position: target,
      jacobian: jacobian

    }
  }

  path(time) {
    let x = 0.4 // Math.sin(time / 1000)
    let y = time / 100
    let target = new THREE.Vector3(0, 0, 0)

    let dx = 0 //Math.cos(time) / 1000
    let dy = 1.0 / 100


    

    let mobius = this.mobius(x, y, target)
    let jacobian = mobius.jacobian
    let position = mobius.position
    let tangent = m.multiply(mobius.jacobian, [dx, dy])

    let basis = m.multiply(jacobian, [[1, 0], [0, 1]]).toArray()


    //debugger
    let normal = new THREE.Vector3(basis[0][1], basis[1][1], basis[2][1]).normalize().cross(
      new THREE.Vector3(basis[0][0], basis[1][0], basis[2][0])).normalize()

    position.multiplyScalar(this.scale).addScaledVector(normal, 0.5)
    
    let lookAt = m.add(m.multiply(100, tangent), [ position.x, position.y, position.z]).toArray()

    position.addScaledVector(normal, 1.5)
    return {
      tangent: tangent,
      position: position,
      lookAt: lookAt,
      normal: normal
    }
  }
}
