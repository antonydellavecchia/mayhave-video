uniform sampler2D tAudioData;
uniform int frequency;
varying vec4 vUv;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  //float random1 = vUv.x * vUv.y;
  //float random2 = rand(vec2(vUv.x, vUv.z));
  //float f =  texture2D( tAudioData, vec2( frequency , 0.0) ).g;
  //float radius = 0.5;
  //vec3 backgroundColor = vec3( min(vUv.y, f), min(radius, f), min((f / 10.0), 0.1) );
  //vec3 backgroundColor = vec3( min(abs(vUv.y), 1.0), f, min((f / 10.0), 0.1) );
  //float i = step(vUv.y,  600.0 * f) * step(600.0 * f - 100.0, vUv.y);
  //float j = step(vUv.z, 100.0);
  //float wave = 4.2 * sin(2.0 * 3.1415926535897932384626433832795 * (f - 0.5));
  //float compare = step(wave, vUv.x);
  
  vec3 backgroundColor = vec3(1.0, 0.0, 0.0);

  

  gl_FragColor = vec4(backgroundColor, 0.5);
}
