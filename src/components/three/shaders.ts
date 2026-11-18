export const noise2D = /* glsl */ `
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

export const wavesVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// Brand gradient (yellow -> orange -> flame) with soft flowing swooshes that
// echo the curved bands in the TLT logo artwork.
export const wavesFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
varying vec2 vUv;
${noise2D}

float swoosh(vec2 uv, float base, float amp, float freq, float phase, float soft) {
  float curve = base + amp * sin(uv.x * freq + phase);
  return smoothstep(curve - soft, curve + soft, uv.y);
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv;
  p.x *= uRes.x / uRes.y;
  float t = uTime * 0.05;

  float n = snoise(p * 0.8 + vec2(t, -t * 0.7) + uMouse * 0.12);
  float n2 = snoise(p * 1.7 - vec2(t * 0.6, t) + n * 0.5);

  vec3 yellow = vec3(1.0, 0.86, 0.27);
  vec3 amber  = vec3(1.0, 0.67, 0.12);
  vec3 orange = vec3(1.0, 0.47, 0.09);
  vec3 flame  = vec3(0.93, 0.29, 0.05);

  float g = (1.0 - uv.x) * 0.55 + uv.y * 0.15 + 0.25 + n * 0.16 + n2 * 0.06;
  vec3 col = mix(yellow, amber, smoothstep(0.05, 0.4, g));
  col = mix(col, orange, smoothstep(0.35, 0.7, g));
  col = mix(col, flame, smoothstep(0.68, 1.05, g));

  float phase = uTime * 0.18;
  float s1 = swoosh(uv, 0.78 + n * 0.04, 0.09, 2.4, phase, 0.08);
  float s2 = 1.0 - swoosh(uv, 0.2 + n2 * 0.04, 0.08, 2.0, -phase * 0.8 + 1.3, 0.09);
  col = mix(col, col * 1.08 + vec3(0.04, 0.05, 0.0), s1 * 0.55);
  col = mix(col, col * 1.06 + vec3(0.05, 0.04, 0.0), s2 * 0.5);

  float ribbon = sin((uv.x * 1.3 - uv.y * 1.9 + n * 0.8) * 5.0 + uTime * 0.22) * 0.5 + 0.5;
  col += smoothstep(0.7, 1.0, ribbon) * 0.035;

  float vig = smoothstep(1.25, 0.35, length((uv - vec2(0.5, 0.55)) * vec2(1.1, 1.0)));
  col *= mix(0.86, 1.0, vig);

  float grain = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.03;

  gl_FragColor = vec4(col, 1.0);
}
`;
