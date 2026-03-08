import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════
   HUMAN BODY MESH — procedural realistic humanoid
   ═══════════════════════════════════════════════════ */

// Skin material with warm tones
const useSkinMaterial = (tone: "light" | "medium" = "medium") => {
  return useMemo(() => {
    const base = tone === "light" ? "#e8b89d" : "#c8956c";
    return new THREE.MeshStandardMaterial({
      color: base,
      roughness: 0.65,
      metalness: 0.02,
    });
  }, [tone]);
};

const useClothMaterial = (color: string) => {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.8,
        metalness: 0.05,
      }),
    [color]
  );
};

// ── Head component ──
function Head({
  isSpeaking,
  isListening,
  blinkState,
}: {
  isSpeaking: boolean;
  isListening: boolean;
  blinkState: number;
}) {
  const headRef = useRef<THREE.Group>(null!);
  const jawRef = useRef<THREE.Mesh>(null!);
  const leftBrowRef = useRef<THREE.Mesh>(null!);
  const rightBrowRef = useRef<THREE.Mesh>(null!);
  const skinMat = useSkinMaterial("medium");
  const hairMat = useClothMaterial("#1a1a2e");
  const lipMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#b06060",
        roughness: 0.5,
        metalness: 0,
      }),
    []
  );
  const eyeWhiteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f5f5f0",
        roughness: 0.3,
        metalness: 0,
      }),
    []
  );
  const irisMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#3a6b4f",
        roughness: 0.2,
        metalness: 0.1,
      }),
    []
  );
  const pupilMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0a0a0a",
        roughness: 0.1,
        metalness: 0,
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (headRef.current) {
      if (isSpeaking) {
        headRef.current.rotation.y = Math.sin(t * 1.2) * 0.06;
        headRef.current.rotation.x = Math.sin(t * 0.8) * 0.03 - 0.02;
        headRef.current.rotation.z = Math.sin(t * 0.6) * 0.02;
      } else if (isListening) {
        headRef.current.rotation.y = Math.sin(t * 0.4) * 0.03;
        headRef.current.rotation.x = -0.05 + Math.sin(t * 0.3) * 0.02;
      } else {
        headRef.current.rotation.y = Math.sin(t * 0.3) * 0.04;
        headRef.current.rotation.x = Math.sin(t * 0.2) * 0.015;
      }
    }
    // Jaw for speaking
    if (jawRef.current) {
      if (isSpeaking) {
        jawRef.current.position.y =
          -0.02 - Math.abs(Math.sin(t * 8)) * 0.035;
        jawRef.current.scale.y = 1 + Math.abs(Math.sin(t * 8)) * 0.15;
      } else {
        jawRef.current.position.y = -0.02;
        jawRef.current.scale.y = 1;
      }
    }
    // Eyebrow expressions
    if (leftBrowRef.current && rightBrowRef.current) {
      if (isSpeaking) {
        leftBrowRef.current.position.y =
          0.32 + Math.sin(t * 1.5) * 0.01;
        rightBrowRef.current.position.y =
          0.32 + Math.sin(t * 1.5 + 0.5) * 0.01;
      } else if (isListening) {
        leftBrowRef.current.position.y = 0.335;
        rightBrowRef.current.position.y = 0.335;
      } else {
        leftBrowRef.current.position.y = 0.32;
        rightBrowRef.current.position.y = 0.32;
      }
    }
  });

  const eyeScaleY = blinkState < 0.1 ? 0.05 : 1;

  return (
    <group ref={headRef} position={[0, 1.55, 0]}>
      {/* Cranium */}
      <mesh material={skinMat}>
        <sphereGeometry args={[0.22, 32, 32]} />
      </mesh>

      {/* Hair — swept back */}
      <mesh position={[0, 0.06, -0.02]} material={hairMat}>
        <sphereGeometry args={[0.225, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
      </mesh>
      {/* Hair sides */}
      <mesh position={[-0.18, 0.02, 0]} material={hairMat} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.06, 0.12, 0.16]} />
      </mesh>
      <mesh position={[0.18, 0.02, 0]} material={hairMat} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.06, 0.12, 0.16]} />
      </mesh>

      {/* Face shape — slight jaw */}
      <mesh position={[0, -0.08, 0.04]} material={skinMat}>
        <boxGeometry args={[0.28, 0.18, 0.2]} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, -0.02, 0.2]} material={skinMat}>
        <boxGeometry args={[0.04, 0.06, 0.04]} />
      </mesh>
      <mesh position={[0, -0.05, 0.2]} material={skinMat}>
        <sphereGeometry args={[0.025, 12, 12]} />
      </mesh>

      {/* Eyes */}
      <group position={[-0.075, 0.02, 0.17]}>
        <mesh material={eyeWhiteMat} scale={[1, eyeScaleY, 1]}>
          <sphereGeometry args={[0.035, 16, 16]} />
        </mesh>
        <mesh position={[0, 0, 0.025]} material={irisMat} scale={[1, eyeScaleY, 1]}>
          <sphereGeometry args={[0.018, 12, 12]} />
        </mesh>
        <mesh position={[0, 0, 0.033]} material={pupilMat} scale={[1, eyeScaleY, 1]}>
          <sphereGeometry args={[0.009, 8, 8]} />
        </mesh>
      </group>
      <group position={[0.075, 0.02, 0.17]}>
        <mesh material={eyeWhiteMat} scale={[1, eyeScaleY, 1]}>
          <sphereGeometry args={[0.035, 16, 16]} />
        </mesh>
        <mesh position={[0, 0, 0.025]} material={irisMat} scale={[1, eyeScaleY, 1]}>
          <sphereGeometry args={[0.018, 12, 12]} />
        </mesh>
        <mesh position={[0, 0, 0.033]} material={pupilMat} scale={[1, eyeScaleY, 1]}>
          <sphereGeometry args={[0.009, 8, 8]} />
        </mesh>
      </group>

      {/* Eyebrows */}
      <mesh ref={leftBrowRef} position={[-0.075, 0.32, 0.17]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.06, 0.012, 0.02]} />
        <meshStandardMaterial color="#2a1a0e" roughness={0.9} />
      </mesh>
      <mesh ref={rightBrowRef} position={[0.075, 0.32, 0.17]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.06, 0.012, 0.02]} />
        <meshStandardMaterial color="#2a1a0e" roughness={0.9} />
      </mesh>

      {/* Mouth / Lips */}
      <mesh ref={jawRef} position={[0, -0.1, 0.17]} material={lipMat}>
        <boxGeometry args={[0.08, 0.02, 0.025]} />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.22, 0, 0]} material={skinMat}>
        <boxGeometry args={[0.03, 0.06, 0.04]} />
      </mesh>
      <mesh position={[0.22, 0, 0]} material={skinMat}>
        <boxGeometry args={[0.03, 0.06, 0.04]} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, -0.22, 0]} material={skinMat}>
        <cylinderGeometry args={[0.06, 0.07, 0.1, 16]} />
      </mesh>
    </group>
  );
}

// ── Torso ──
function Torso({ isSpeaking }: { isSpeaking: boolean }) {
  const torsoRef = useRef<THREE.Group>(null!);
  const shirtMat = useClothMaterial("#1e3a5f"); // Navy blue shirt
  const collarMat = useClothMaterial("#f0f0f0"); // White collar

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (torsoRef.current) {
      // Breathing
      const breathe = Math.sin(t * 1.5) * 0.003;
      torsoRef.current.scale.x = 1 + breathe;
      torsoRef.current.scale.z = 1 + breathe * 0.5;
      if (isSpeaking) {
        torsoRef.current.rotation.y = Math.sin(t * 0.8) * 0.03;
      } else {
        torsoRef.current.rotation.y = Math.sin(t * 0.2) * 0.01;
      }
    }
  });

  return (
    <group ref={torsoRef} position={[0, 1.1, 0]}>
      {/* Upper body */}
      <mesh material={shirtMat}>
        <boxGeometry args={[0.4, 0.45, 0.22]} />
      </mesh>
      {/* Collar */}
      <mesh position={[0, 0.2, 0.06]} material={collarMat}>
        <boxGeometry args={[0.18, 0.06, 0.12]} />
      </mesh>
      {/* Button line */}
      {[0.12, 0.04, -0.04, -0.12].map((y, i) => (
        <mesh key={i} position={[0, y, 0.115]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshStandardMaterial color="#b0b0b0" />
        </mesh>
      ))}
    </group>
  );
}

// ── Arm ──
function Arm({
  side,
  isSpeaking,
  isListening,
}: {
  side: "left" | "right";
  isSpeaking: boolean;
  isListening: boolean;
}) {
  const armRef = useRef<THREE.Group>(null!);
  const forearmRef = useRef<THREE.Group>(null!);
  const handRef = useRef<THREE.Mesh>(null!);
  const shirtMat = useClothMaterial("#1e3a5f");
  const skinMat = useSkinMaterial("medium");
  const x = side === "left" ? -0.28 : 0.28;
  const sign = side === "left" ? 1 : -1;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (armRef.current) {
      if (isSpeaking) {
        // Expressive gestures
        const gesturePhase = side === "left" ? t * 1.3 : t * 1.3 + 1.5;
        armRef.current.rotation.z =
          sign * (0.1 + Math.sin(gesturePhase) * 0.15);
        armRef.current.rotation.x = Math.sin(gesturePhase * 0.7) * 0.1;
      } else if (isListening) {
        armRef.current.rotation.z = sign * 0.05;
        armRef.current.rotation.x = 0;
      } else {
        // Idle sway
        armRef.current.rotation.z =
          sign * (0.05 + Math.sin(t * 0.5 + (side === "left" ? 0 : Math.PI)) * 0.02);
        armRef.current.rotation.x = 0;
      }
    }
    if (forearmRef.current) {
      if (isSpeaking) {
        const ft = side === "left" ? t * 1.8 : t * 1.8 + 1;
        forearmRef.current.rotation.x =
          -0.3 - Math.abs(Math.sin(ft)) * 0.4;
      } else {
        forearmRef.current.rotation.x = -0.1;
      }
    }
    if (handRef.current && isSpeaking) {
      const ht = side === "left" ? t * 2 : t * 2 + 0.8;
      handRef.current.rotation.z = Math.sin(ht) * 0.2 * sign;
      handRef.current.rotation.x = Math.sin(ht * 0.6) * 0.15;
    }
  });

  return (
    <group ref={armRef} position={[x, 1.25, 0]}>
      {/* Shoulder */}
      <mesh material={shirtMat}>
        <sphereGeometry args={[0.06, 12, 12]} />
      </mesh>
      {/* Upper arm */}
      <mesh position={[0, -0.12, 0]} material={shirtMat}>
        <boxGeometry args={[0.09, 0.2, 0.09]} />
      </mesh>
      {/* Forearm */}
      <group ref={forearmRef} position={[0, -0.24, 0]}>
        <mesh position={[0, -0.1, 0]} material={skinMat}>
          <boxGeometry args={[0.075, 0.2, 0.075]} />
        </mesh>
        {/* Hand */}
        <mesh ref={handRef} position={[0, -0.22, 0]} material={skinMat}>
          <boxGeometry args={[0.06, 0.08, 0.04]} />
        </mesh>
        {/* Fingers suggestion */}
        {[-0.015, 0.005, 0.025].map((fx, i) => (
          <mesh key={i} position={[fx, -0.28, 0]} material={skinMat}>
            <boxGeometry args={[0.012, 0.04, 0.012]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ── Legs ──
function Legs() {
  const pantsMat = useClothMaterial("#2a2a3a"); // Dark pants
  const shoeMat = useClothMaterial("#1a1a1a"); // Black shoes

  return (
    <group position={[0, 0.45, 0]}>
      {/* Hips */}
      <mesh material={pantsMat}>
        <boxGeometry args={[0.34, 0.12, 0.2]} />
      </mesh>
      {/* Left leg */}
      <group position={[-0.1, -0.22, 0]}>
        <mesh material={pantsMat}>
          <boxGeometry args={[0.12, 0.35, 0.12]} />
        </mesh>
        {/* Knee */}
        <mesh position={[0, -0.2, 0]} material={pantsMat}>
          <sphereGeometry args={[0.06, 8, 8]} />
        </mesh>
        {/* Lower leg */}
        <mesh position={[0, -0.38, 0]} material={pantsMat}>
          <boxGeometry args={[0.11, 0.3, 0.11]} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.55, 0.02]} material={shoeMat}>
          <boxGeometry args={[0.1, 0.05, 0.16]} />
        </mesh>
      </group>
      {/* Right leg */}
      <group position={[0.1, -0.22, 0]}>
        <mesh material={pantsMat}>
          <boxGeometry args={[0.12, 0.35, 0.12]} />
        </mesh>
        <mesh position={[0, -0.2, 0]} material={pantsMat}>
          <sphereGeometry args={[0.06, 8, 8]} />
        </mesh>
        <mesh position={[0, -0.38, 0]} material={pantsMat}>
          <boxGeometry args={[0.11, 0.3, 0.11]} />
        </mesh>
        <mesh position={[0, -0.55, 0.02]} material={shoeMat}>
          <boxGeometry args={[0.1, 0.05, 0.16]} />
        </mesh>
      </group>
    </group>
  );
}

// ── Full Human Body Scene ──
function HumanBody({
  isSpeaking,
  isListening,
}: {
  isSpeaking: boolean;
  isListening: boolean;
}) {
  const bodyRef = useRef<THREE.Group>(null!);
  const [blinkState, setBlinkState] = useState(1);

  // Blink cycle
  const blinkTimer = useRef(0);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (t - blinkTimer.current > 3 + Math.random() * 2) {
      blinkTimer.current = t;
      setBlinkState(0);
      setTimeout(() => setBlinkState(1), 150);
    }
    // Subtle idle body sway
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(t * 1.2) * 0.005;
    }
  });

  return (
    <group ref={bodyRef} position={[0, -0.6, 0]}>
      <Head
        isSpeaking={isSpeaking}
        isListening={isListening}
        blinkState={blinkState}
      />
      <Torso isSpeaking={isSpeaking} />
      <Arm side="left" isSpeaking={isSpeaking} isListening={isListening} />
      <Arm side="right" isSpeaking={isSpeaking} isListening={isListening} />
      <Legs />
    </group>
  );
}


/* ═══════════════════════════════════════════════════
   EXPORTED CANVAS COMPONENT
   ═══════════════════════════════════════════════════ */
interface HumanAvatar3DProps {
  isSpeaking: boolean;
  isListening: boolean;
  isThinking?: boolean;
}

const HumanAvatar3D = ({
  isSpeaking,
  isListening,
  isThinking = false,
}: HumanAvatar3DProps) => {
  return (
    <div className="relative w-full h-full" style={{ minHeight: "300px" }}>
      <Canvas
        camera={{ position: [0, 0.8, 2.4], fov: 35 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent", width: "100%", height: "100%" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 2]} intensity={1.2} />
        <directionalLight position={[-1, 2, -1]} intensity={0.4} />
        <pointLight
          position={[0, 1, 2]}
          intensity={0.6}
          color={isSpeaking ? "#50e090" : isListening ? "#60b0f0" : "#ffffff"}
        />
        <hemisphereLight args={["#b1e1ff", "#b97a20", 0.4]} />

        <HumanBody isSpeaking={isSpeaking} isListening={isListening} />

        {/* Floor plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]}>
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial color="#111118" transparent opacity={0.3} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default HumanAvatar3D;
