"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Image as DreiImage, Sparkles, Trail } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { wavesFragment, wavesVertex } from "./shaders";
import { media } from "@/data/media";

// Mouse on desktop; on touch devices a blend of idle drift, finger position and device tilt.
const input = {
  fine: true,
  look: new THREE.Vector2(),
  touch: new THREE.Vector2(),
  tilt: new THREE.Vector2(),
};

function InputRig() {
  const target = useMemo(() => new THREE.Vector2(), []);
  useFrame((state) => {
    if (input.fine) {
      input.look.copy(state.pointer);
      return;
    }
    const t = state.clock.elapsedTime;
    input.touch.multiplyScalar(0.985);
    target
      .set(Math.sin(t * 0.45) * 0.45, Math.cos(t * 0.3) * 0.3)
      .add(input.tilt)
      .add(input.touch)
      .clampScalar(-1.2, 1.2);
    input.look.lerp(target, 0.06);
  });
  return null;
}

function GradientWaves() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += delta;
    mat.current.uniforms.uRes.value.set(size.width, size.height);
    const m = mat.current.uniforms.uMouse.value as THREE.Vector2;
    m.lerp(input.look, 0.03);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={wavesVertex}
        fragmentShader={wavesFragment}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

function usePaperPlaneGeometry() {
  return useMemo(() => {
    const nose = [0, 0, 1.2];
    const tail = [0, 0, -0.8];
    const left = [0.78, 0.1, -0.95];
    const right = [-0.78, 0.1, -0.95];
    const keel = [0, -0.28, -0.75];
    const verts = new Float32Array([
      ...nose, ...left, ...tail,
      ...nose, ...tail, ...right,
      ...nose, ...keel, ...tail,
    ]);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    g.computeVertexNormals();
    return g;
  }, []);
}

function PaperPlane({ compact }: { compact: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const geometry = usePaperPlaneGeometry();
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        compact
          ? [
              new THREE.Vector3(-2.2, 2.2, -1),
              new THREE.Vector3(1.6, 1.6, 0),
              new THREE.Vector3(2.2, -0.4, -1.5),
              new THREE.Vector3(-0.5, -0.2, 0.5),
              new THREE.Vector3(-2.4, 0.8, -1),
            ]
          : [
              new THREE.Vector3(-5.5, 1.4, -2),
              new THREE.Vector3(-1.5, 2.2, 0),
              new THREE.Vector3(2.5, 1.6, 0.8),
              new THREE.Vector3(5.2, -0.2, -1.5),
              new THREE.Vector3(2.2, -1.9, 0.6),
              new THREE.Vector3(-1.8, -1.2, -0.6),
              new THREE.Vector3(-4.8, -0.4, -1.8),
            ],
        true,
        "catmullrom",
        0.5,
      ),
    [compact],
  );
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = (state.clock.elapsedTime * 0.035) % 1;
    const pos = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    g.position.copy(pos);
    tmp.copy(pos).add(tangent);
    g.lookAt(tmp);
    g.rotateZ(Math.sin(state.clock.elapsedTime * 1.4) * 0.35 - tangent.x * 0.4);
  });

  return (
    <Trail width={compact ? 1.4 : 2.2} length={10} color="#fff8e8" attenuation={(w) => w * w} decay={1.2}>
      <group ref={ref} scale={compact ? 0.22 : 0.3}>
        <mesh geometry={geometry}>
          <meshStandardMaterial
            color="#ffffff"
            emissive="#fff4e0"
            emissiveIntensity={0.45}
            side={THREE.DoubleSide}
            flatShading
            roughness={0.45}
            metalness={0.05}
          />
        </mesh>
      </group>
    </Trail>
  );
}

function PhotoCards({ compact }: { compact: boolean }) {
  const group = useRef<THREE.Group>(null);
  const cards = compact
    ? [
        { url: media.goa.palms, pos: [1.25, 1.9, -1.5], scale: [1.3, 1.7], rot: 0.12 },
        { url: media.hampi.chariot, pos: [-1.2, 2.4, -2.2], scale: [1.2, 1.5], rot: -0.1 },
      ]
    : [
        { url: media.goa.palms, pos: [3.4, 1.05, -0.6], scale: [1.75, 2.3], rot: 0.08 },
        { url: media.hampi.chariot, pos: [5.0, -0.95, -1.6], scale: [1.6, 2.1], rot: -0.1 },
        { url: media.goa.dusk, pos: [1.7, -1.45, -1.2], scale: [1.5, 1.05], rot: 0.05 },
        { url: media.hampi.pushkarani, pos: [5.6, 2.2, -3], scale: [1.4, 1.0], rot: -0.06 },
      ];

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, input.look.x * 0.12, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -input.look.y * 0.08, 0.04);
  });

  return (
    <group ref={group}>
      {cards.map((c, i) => (
        <Float key={c.url} speed={1.2 + i * 0.25} rotationIntensity={0.35} floatIntensity={0.6}>
          <DreiImage
            url={c.url}
            position={c.pos as [number, number, number]}
            scale={c.scale as [number, number]}
            rotation={[0, -0.18, c.rot]}
            radius={0.08}
            transparent
            toneMapped={false}
          />
        </Float>
      ))}
    </group>
  );
}

function CameraRig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, input.look.x * 0.35, 0.03);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, input.look.y * 0.2, 0.03);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    if (wrap.current) io.observe(wrap.current);

    input.fine = window.matchMedia("(pointer: fine)").matches;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) input.touch.set((t.clientX / window.innerWidth) * 2 - 1, -(t.clientY / window.innerHeight) * 2 + 1);
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      input.tilt.set(clamp(e.gamma / 35), clamp((45 - e.beta) / 35));
    };
    if (!input.fine) {
      window.addEventListener("touchstart", onTouch, { passive: true });
      window.addEventListener("touchmove", onTouch, { passive: true });
      window.addEventListener("deviceorientation", onOrient);
    }
    return () => {
      mq.removeEventListener("change", update);
      io.disconnect();
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} />
        <InputRig />
        <GradientWaves />
        <Suspense fallback={null}>
          <PhotoCards compact={compact} />
        </Suspense>
        <PaperPlane compact={compact} />
        <Sparkles count={compact ? 40 : 90} scale={[14, 7, 4]} size={2.2} speed={0.35} opacity={0.7} color="#fffbe6" />
        <CameraRig />
      </Canvas>
    </div>
  );
}
