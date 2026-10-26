import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Play, Pause, RotateCw, ZoomIn, ZoomOut, Layers, Info, 
  Sparkles, CheckCircle2, ChevronUp, ChevronDown, Maximize2 
} from 'lucide-react';

interface ThreeDVisualizerProps {
  initialModelId?: string;
  onClose?: () => void;
}

export interface MOAModelConfig {
  id: string;
  course: string;
  name: string;
  subtitle: string;
  description: string;
  keyMolecules: string[];
  steps: {
    title: string;
    description: string;
    cameraPos: [number, number, number];
  }[];
}

export const MOA_MODELS: MOAModelConfig[] = [
  {
    id: "gpcr_beta_blocker",
    course: "Pharmacology (PHARM-301)",
    name: "GPCR & Beta-Adrenergic Antagonist Docking",
    subtitle: "7-Transmembrane Receptor Helices, G-Protein Heterotrimer & Competitive Beta-Blockade",
    description: "Visualizes the 7-alpha helical transmembrane domain spanning the cellular lipid bilayer. Demonstrates competitive inhibition where Beta-blockers (e.g. Propranolol, Metoprolol) occupy the catecholamine pocket, blocking Epinephrine-mediated Gs activation and halting adenylyl cyclase cAMP synthesis.",
    keyMolecules: ["Beta-1 Receptor (7-TM)", "Propranolol Ligand (Antagonist)", "Epinephrine (Endogenous Agonist)", "Gs Alpha/Beta/Gamma Subunits", "Adenylyl Cyclase"],
    steps: [
      {
        title: "1. Resting Inactive Receptor State",
        description: "The 7-transmembrane bundle sits in the lipid bilayer, coupled loosely to the inactive G-alpha/beta/gamma heterotrimeric complex with bound GDP.",
        cameraPos: [0, 2, 9]
      },
      {
        title: "2. Beta-Blocker Ligand Binding",
        description: "Lipophilic antagonist (Propranolol) penetrates the extracellular pocket, forming high-affinity hydrogen and electrostatic bonds with Asp113 and Ser203.",
        cameraPos: [0, 1.2, 5.5]
      },
      {
        title: "3. Conformational Lock & Signal Blockade",
        description: "Unlike agonists, the antagonist prevents outward displacement of transmembrane helix 6, locking the receptor in an inactive conformation and preventing cAMP-mediated tachycardia.",
        cameraPos: [2.5, 0.8, 6.5]
      }
    ]
  },
  {
    id: "ace_inhibitor_raas",
    course: "Pharmacotherapy (PHARM-401)",
    name: "Angiotensin-Converting Enzyme (ACE) Inhibition",
    subtitle: "Catalytic Zinc (Zn2+) Active Site Cleft & Lisinopril Molecular Chelation",
    description: "Depicts the deep catalytic groove of somatic ACE containing the catalytic zinc ion (Zn2+) coordinated by His383, His387, and Glu411. Lisinopril binds with picomolar affinity, its carboxylate group chelating Zn2+ to halt the conversion of Angiotensin I to the potent vasoconstrictor Angiotensin II.",
    keyMolecules: ["ACE Zinc Metalloprotease Cleft", "Catalytic Zn2+ Ion", "Lisinopril Molecule", "Angiotensin I Substrate", "Bradykinin Degradation Site"],
    steps: [
      {
        title: "1. Catalytic Active Site Architecture",
        description: "The deep cleft of ACE features a central Zn2+ ion essential for polarizing the carbonyl of Angiotensin I during peptide bond hydrolysis.",
        cameraPos: [0, 1.5, 8]
      },
      {
        title: "2. Lisinopril Active Site Docking",
        description: "Lisinopril enters the catalytic channel, positioning its carboxyl group directly over the Zn2+ ion, mimicking the tetrahedral transition state of peptide cleavage.",
        cameraPos: [0.5, 0.5, 5]
      },
      {
        title: "3. Vasodilatory & Bradykinin Effects",
        description: "Enzyme turnover is halted (Ki ~ 0.1 nM). Circulating Angiotensin II falls while vasodilator Bradykinin accumulates, producing therapeutic blood pressure reduction.",
        cameraPos: [-2, 1, 6]
      }
    ]
  },
  {
    id: "bacterial_cell_wall_penicillin",
    course: "Medicinal Chemistry & Toxicology",
    name: "Penicillin Inhibition of Transpeptidase (PBP)",
    subtitle: "D-Ala-D-Ala Transition State Mimicry & Covalent Suicide Acylation",
    description: "Visualizes the bacterial cell wall peptidoglycan crosslinking enzyme (Transpeptidase / PBP). The strained 4-membered beta-lactam ring of Penicillin mimics D-alanyl-D-alanine, tricking active-site Serine into covalent acylation that irreversibly paralyzes wall crosslinking, resulting in bactericidal osmotic lysis.",
    keyMolecules: ["Penicillin-Binding Protein (PBP)", "Beta-Lactam Ring Core", "Active Site Ser403", "Peptidoglycan Glycan Chains", "Crosslink Peptide Bridge"],
    steps: [
      {
        title: "1. Transpeptidase Active Serine Pocket",
        description: "The active-site serine hydroxyl (Ser403) typically attacks the terminal D-Ala-D-Ala dipeptide to catalyze pentaglycine crosslinking in Gram-positive cell walls.",
        cameraPos: [0, 2, 8.5]
      },
      {
        title: "2. Nucleophilic Attack on Beta-Lactam Carbonyl",
        description: "Due to high ring strain, the beta-lactam carbonyl is hyper-reactive. Serine attacks the carbonyl, forming an acyl-enzyme intermediate and opening the 4-membered ring.",
        cameraPos: [0, 0.8, 5.2]
      },
      {
        title: "3. Irreversible Penicilloyl Enzyme Complex",
        description: "The bulky penicilloyl group shields the catalytic site, preventing water hydrolysis. Wall synthesis stops while autolysins continue, causing cell rupture.",
        cameraPos: [2, 1.5, 6]
      }
    ]
  },
  {
    id: "neuromuscular_ache_organophosphate",
    course: "Toxicology (TOX-402)",
    name: "Acetylcholinesterase & Organophosphate Poisoning",
    subtitle: "Synaptic Esteratic Site Phosphorylation, Aging & Pralidoxime (2-PAM) Rescue",
    description: "Visualizes the catalytic gorge of Acetylcholinesterase (AChE). Organophosphates covalently phosphorylate the catalytic Serine-200. Demonstrates both the lethal 'aging' process and how Pralidoxime (2-PAM) acts as an oxime nucleophile to regenerate active AChE.",
    keyMolecules: ["AChE Catalytic Gorge", "Catalytic Ser200", "Organophosphate (Diisopropyl fluorophosphate)", "Pralidoxime (2-PAM)", "Acetylcholine Neurotransmitter"],
    steps: [
      {
        title: "1. Normal Acetylcholine Hydrolysis",
        description: "ACh enters the deep catalytic gorge, where the Ser-His-Glu catalytic triad cleaves it into choline and acetate within 80 microseconds.",
        cameraPos: [0, 2, 8]
      },
      {
        title: "2. Organophosphate Phosphorylation",
        description: "Organophosphate insecticide forms a stable phosphate ester with Ser200, creating an enzymatic blockage that floods synapses with toxic ACh.",
        cameraPos: [0, 0.5, 4.8]
      },
      {
        title: "3. Antidote Pralidoxime (2-PAM) Reactivation",
        description: "Pralidoxime's positively charged quaternary nitrogen anchors to the peripheral site, directing its nucleophilic oxime moiety to pluck away the phosphate group.",
        cameraPos: [-1.8, 1.2, 5.8]
      }
    ]
  },
  {
    id: "liposome_nanocarrier",
    course: "Biopharmaceutics & Physical Pharmaceutics",
    name: "PEGylated Liposomal Nanocarrier Drug Delivery",
    subtitle: "Phospholipid Bilayer Vesicle, Doxorubicin Loading & Receptor-Mediated Endocytosis",
    description: "Interactive cross-section of a 100 nm unilamellar liposome. Demonstrates the hydrophobic phospholipid bilayer housing hydrophobic moieties, an internal aqueous core encapsulating cytotoxic agents, a stealth PEG corona preventing reticuloendothelial clearance, and target ligand binding.",
    keyMolecules: ["Phosphatidylcholine Bilayer", "PEG Polymer Brush Layer", "Encapsulated Drug Nanocrystals", "Targeting Transferrin Ligands", "Tumor Endothelial Fenestrations"],
    steps: [
      {
        title: "1. Bilayer Architecture & Stealth Corona",
        description: "Outer PEGylation creates a steric hydration barrier that repels plasma opsonins, prolonging circulation half-life from 15 minutes to 55 hours.",
        cameraPos: [0, 2, 9]
      },
      {
        title: "2. Cross-Section & High-Capacity Drug Core",
        description: "Transmembrane ammonium sulfate gradient creates a pH trap, driving doxorubicin precipitation into crystalline rods inside the aqueous core.",
        cameraPos: [0, 0.5, 5.5]
      },
      {
        title: "3. EPR Effect & Endosomal Drug Release",
        description: "Enhanced Permeability and Retention (EPR) allows extravasation through leaky tumor vasculature, followed by receptor-mediated endocytosis.",
        cameraPos: [2.2, 1, 6.2]
      }
    ]
  }
];

export const ThreeDVisualizer: React.FC<ThreeDVisualizerProps> = ({ 
  initialModelId = "gpcr_beta_blocker",
  onClose 
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(initialModelId);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [hudCollapsed, setHudCollapsed] = useState<boolean>(false);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.005);
  
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const dynamicSubpartsRef = useRef<THREE.Object3D[]>([]);
  const animFrameIdRef = useRef<number>(0);

  const activeConfig = MOA_MODELS.find(m => m.id === selectedModelId) || MOA_MODELS[0];

  useEffect(() => {
    setSelectedModelId(initialModelId);
    setCurrentStep(0);
  }, [initialModelId]);

  // Software WebGL Detection per Three.js guidelines
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // Setup Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050b14);
    scene.fog = new THREE.FogExp2(0x050b14, 0.04);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2, 8.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // Studio Lighting Rig (Key, Fill, Rim)
    const keyLight = new THREE.DirectionalLight(0x7ee7ff, 2.2);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x10b981, 1.4);
    fillLight.position.set(-6, -4, -5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xf59e0b, 1.8, 25);
    rimLight.position.set(0, -6, 4);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
    scene.add(ambientLight);

    // Soft Ground Contact Plane
    const groundGeo = new THREE.PlaneGeometry(16, 16);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      transparent: true,
      opacity: 0.8
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.8;
    scene.add(ground);

    // Particles in background
    const particleCount = isSoftwareGl ? 60 : 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 18;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.45
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Interactive pointer drag
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !modelGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      modelGroupRef.current.rotation.y += deltaX * 0.008;
      modelGroupRef.current.rotation.x += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Wheel zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z = THREE.MathUtils.clamp(
        cameraRef.current.position.z + e.deltaY * 0.005,
        3,
        14
      );
    };
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let clock = new THREE.Clock();
    const tick = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (modelGroupRef.current) {
        if (isPlaying && !isDragging) {
          modelGroupRef.current.rotation.y += rotationSpeed;
        }
        // Floating respiration effect
        modelGroupRef.current.position.y = Math.sin(elapsed * 1.2) * 0.12;

        // Animate subparts (e.g. ligand docking or pulsating conformational changes)
        dynamicSubpartsRef.current.forEach((obj, idx) => {
          if (obj.userData.type === 'ligand') {
            const offset = Math.sin(elapsed * 2 + idx) * 0.25;
            obj.position.y = (obj.userData.baseY || 0) + offset;
            obj.rotation.z += 0.02;
          } else if (obj.userData.type === 'g_protein') {
            obj.position.x = (obj.userData.baseX || 0) + Math.cos(elapsed * 1.5) * 0.15;
          } else if (obj.userData.type === 'pulsing_enzyme') {
            const scale = 1 + Math.sin(elapsed * 3) * 0.04;
            obj.scale.set(scale, scale, scale);
          }
        });
      }

      particles.rotation.y = elapsed * 0.02;

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(tick);
    };
    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      particleGeo.dispose();
      particleMat.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Build Procedural 3D Composite Models whenever selectedModelId or isExploded changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (modelGroupRef.current) {
      scene.remove(modelGroupRef.current);
      modelGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    const group = new THREE.Group();
    dynamicSubpartsRef.current = [];

    // Helper Materials
    const helixMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Sky blue
      roughness: 0.25,
      metalness: 0.35
    });
    const pocketMat = new THREE.MeshStandardMaterial({
      color: 0x0d9488, // Teal
      roughness: 0.3,
      metalness: 0.4
    });
    const ligandMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber Gold
      roughness: 0.15,
      metalness: 0.7,
      emissive: 0x78350f,
      emissiveIntensity: 0.3
    });
    const subAlphaMat = new THREE.MeshStandardMaterial({
      color: 0xec4899, // Pink
      roughness: 0.4,
      metalness: 0.2
    });
    const subBetaMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6, // Violet
      roughness: 0.4,
      metalness: 0.2
    });
    const lipidMembraneMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.4,
      roughness: 0.7
    });

    const explodeMult = isExploded ? 1.8 : 1.0;

    if (selectedModelId === 'gpcr_beta_blocker') {
      // 1. GPCR: 7 Transmembrane Helices arranged in a cylinder bundle
      const helixRadius = 1.3 * explodeMult;
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        const x = Math.cos(angle) * helixRadius;
        const z = Math.sin(angle) * helixRadius;
        const helixGeo = new THREE.CylinderGeometry(0.22, 0.24, 3.8, 16);
        const helixMesh = new THREE.Mesh(helixGeo, helixMat);
        helixMesh.position.set(x, 0, z);
        helixMesh.rotation.z = Math.sin(angle) * 0.08;
        group.add(helixMesh);
      }

      // Upper & Lower extracellular loops connecting helices (Toruses)
      const loopGeo = new THREE.TorusGeometry(1.4 * explodeMult, 0.12, 12, 32);
      const loopMesh = new THREE.Mesh(loopGeo, pocketMat);
      loopMesh.rotation.x = Math.PI / 2;
      loopMesh.position.y = 1.8;
      group.add(loopMesh);

      // Lipid Bilayer representation
      const membraneGeo = new THREE.CylinderGeometry(2.8 * explodeMult, 2.8 * explodeMult, 1.4, 24, 1, true);
      const membrane = new THREE.Mesh(membraneGeo, lipidMembraneMat);
      membrane.position.y = 0;
      group.add(membrane);

      // Ligand molecule (Propranolol blocker) hovering/docking into central pocket
      const ligandCore = new THREE.Group();
      ligandCore.userData = { type: 'ligand', baseY: 1.4 };
      const benzene1 = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.1, 8, 6), ligandMat);
      const benzene2 = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.1, 8, 6), ligandMat);
      benzene2.position.x = 0.5;
      const sideChain = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8), ligandMat);
      sideChain.position.set(0.9, 0.2, 0);
      sideChain.rotation.z = Math.PI / 3;
      ligandCore.add(benzene1, benzene2, sideChain);
      ligandCore.position.set(0, 1.4, 0);
      group.add(ligandCore);
      dynamicSubpartsRef.current.push(ligandCore);

      // Intracellular G-protein heterotrimer (Alpha, Beta, Gamma)
      const gAlpha = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7), subAlphaMat);
      gAlpha.position.set(-0.6 * explodeMult, -2.4 * explodeMult, 0.4);
      gAlpha.userData = { type: 'g_protein', baseX: -0.6 * explodeMult };
      const gBeta = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55), subBetaMat);
      gBeta.position.set(0.5 * explodeMult, -2.4 * explodeMult, 0.5);
      const gGamma = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), pocketMat);
      gGamma.position.set(0.8 * explodeMult, -2.9 * explodeMult, 0.3);

      group.add(gAlpha, gBeta, gGamma);
      dynamicSubpartsRef.current.push(gAlpha);
    } 
    else if (selectedModelId === 'ace_inhibitor_raas') {
      // 2. Angiotensin-Converting Enzyme (ACE) Active Zinc Cleft
      const enzymeBodyGeo = new THREE.TorusGeometry(2.2 * explodeMult, 0.8, 16, 32, Math.PI * 1.6);
      const enzymeMat = new THREE.MeshStandardMaterial({
        color: 0x0f766e, // Deep emerald
        roughness: 0.35,
        metalness: 0.25
      });
      const enzymeBody = new THREE.Mesh(enzymeBodyGeo, enzymeMat);
      enzymeBody.rotation.z = Math.PI / 4;
      group.add(enzymeBody);

      // Catalytic Zn2+ Ion sphere inside cleft
      const znGeo = new THREE.SphereGeometry(0.45, 32, 32);
      const znMat = new THREE.MeshStandardMaterial({
        color: 0xe0e7ff,
        roughness: 0.1,
        metalness: 0.9,
        emissive: 0x6366f1,
        emissiveIntensity: 0.4
      });
      const znMesh = new THREE.Mesh(znGeo, znMat);
      znMesh.position.set(0, 0, 0);
      znMesh.userData = { type: 'pulsing_enzyme' };
      group.add(znMesh);
      dynamicSubpartsRef.current.push(znMesh);

      // Coordinating Histidine Residues (Cylinders pointing at Zn2+)
      for (let i = 0; i < 3; i++) {
        const rad = (i * Math.PI * 2) / 3;
        const resMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.2, 12), pocketMat);
        resMesh.position.set(Math.cos(rad) * 1.0, Math.sin(rad) * 1.0, 0);
        resMesh.rotation.z = rad + Math.PI / 2;
        group.add(resMesh);
      }

      // Lisinopril Drug Molecule docking right above Zn2+
      const lisinoprilGroup = new THREE.Group();
      lisinoprilGroup.userData = { type: 'ligand', baseY: 0.6 };
      const chelateRing = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.12, 12, 24), ligandMat);
      const prolineRing = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 8, 5), ligandMat);
      prolineRing.position.set(0.65, 0.3, 0);
      lisinoprilGroup.add(chelateRing, prolineRing);
      lisinoprilGroup.position.set(0, 0.6, 0.4);
      group.add(lisinoprilGroup);
      dynamicSubpartsRef.current.push(lisinoprilGroup);
    }
    else if (selectedModelId === 'bacterial_cell_wall_penicillin') {
      // 3. Bacterial PBP & Beta-Lactam Ring
      // Peptidoglycan mesh grid in background
      for (let x = -2; x <= 2; x += 1) {
        const rodX = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5, 8), lipidMembraneMat);
        rodX.rotation.z = Math.PI / 2;
        rodX.position.set(0, x * 1.1, -1.2);
        group.add(rodX);

        const rodY = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5, 8), lipidMembraneMat);
        rodY.position.set(x * 1.1, 0, -1.2);
        group.add(rodY);
      }

      // Transpeptidase enzyme lobes (PBP dimer)
      const lobe1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4), helixMat);
      lobe1.position.set(-1.1 * explodeMult, 0, 0);
      const lobe2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2), pocketMat);
      lobe2.position.set(1.1 * explodeMult, 0, 0);
      group.add(lobe1, lobe2);

      // Active Serine hydroxyl (represented by a bright catalytic sphere)
      const serHydroxyl = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 24), new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0x991b1b,
        emissiveIntensity: 0.5
      }));
      serHydroxyl.position.set(0, 0.2, 0.3);
      group.add(serHydroxyl);

      // Strained 4-Membered Beta-Lactam Ring (Penicillin)
      const penicillin = new THREE.Group();
      penicillin.userData = { type: 'ligand', baseY: 0.8 };
      // Square box representing strained 4-membered ring
      const betaLactamRing = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.2), ligandMat);
      // Fused 5-membered thiazolidine ring
      const thiazolidineRing = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 5), subAlphaMat);
      thiazolidineRing.position.set(0.6, 0, 0);
      penicillin.add(betaLactamRing, thiazolidineRing);
      penicillin.position.set(0, 0.8, 0.8);
      group.add(penicillin);
      dynamicSubpartsRef.current.push(penicillin);
    }
    else if (selectedModelId === 'neuromuscular_ache_organophosphate') {
      // 4. Acetylcholinesterase Gorged Active Chamber
      const chamberGeo = new THREE.ConeGeometry(2.2 * explodeMult, 3.4, 24, 1, true);
      const chamberMat = new THREE.MeshStandardMaterial({
        color: 0x4338ca,
        roughness: 0.35,
        metalness: 0.3,
        side: THREE.DoubleSide
      });
      const chamber = new THREE.Mesh(chamberGeo, chamberMat);
      chamber.rotation.x = Math.PI;
      group.add(chamber);

      // Esteratic site Serine sphere at bottom of gorge
      const esteraticSite = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 24), new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x065f46
      }));
      esteraticSite.position.set(0, 1.2, 0);
      group.add(esteraticSite);

      // Organophosphate molecule blocking the site
      const opMolecule = new THREE.Group();
      opMolecule.userData = { type: 'ligand', baseY: 0.4 };
      const phosphorus = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
      const oxygen1 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      oxygen1.position.set(0.4, 0.3, 0);
      const alkyl1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.2), ligandMat);
      alkyl1.position.set(-0.4, 0.3, 0);
      opMolecule.add(phosphorus, oxygen1, alkyl1);
      opMolecule.position.set(0, 0.4, 0.2);
      group.add(opMolecule);
      dynamicSubpartsRef.current.push(opMolecule);

      // Pralidoxime (2-PAM) incoming nucleophilic antidote
      const pralidoxime = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.8, 6), new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0369a1
      }));
      pralidoxime.position.set(1.5 * explodeMult, 0.8, 0.5);
      group.add(pralidoxime);
    }
    else {
      // 5. Liposomal Nanocarrier Cross-Section (Biopharmaceutics)
      const outerRadius = 2.4 * explodeMult;
      const innerRadius = 1.6 * explodeMult;

      // Outer Phospholipid bilayer
      const outerLipidGeo = new THREE.SphereGeometry(outerRadius, 32, 16, 0, Math.PI * 1.5);
      const outerMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.3,
        side: THREE.DoubleSide
      });
      const outerVesicle = new THREE.Mesh(outerLipidGeo, outerMat);
      group.add(outerVesicle);

      // Inner hydrophilic core loaded with drug crystals (Doxorubicin rods)
      for (let i = 0; i < 18; i++) {
        const drugRod = new THREE.Mesh(
          new THREE.BoxGeometry(0.25, 0.5, 0.25),
          new THREE.MeshStandardMaterial({
            color: 0xef4444,
            roughness: 0.2,
            metalness: 0.6
          })
        );
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = Math.random() * (innerRadius * 0.7);
        drugRod.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        );
        group.add(drugRod);
      }

      // Surface PEG polymer chains (small wavy toruses or spheres on exterior)
      for (let j = 0; j < 24; j++) {
        const pegBrush = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 8, 16), subAlphaMat);
        const theta = (j / 24) * Math.PI * 2;
        pegBrush.position.set(
          Math.cos(theta) * (outerRadius + 0.3),
          Math.sin(theta) * (outerRadius + 0.3),
          0
        );
        group.add(pegBrush);
      }
    }

    modelGroupRef.current = group;
    scene.add(group);
  }, [selectedModelId, isExploded]);

  // Smooth camera transitions when switching steps
  const handleStepChange = (index: number) => {
    setCurrentStep(index);
    const camera = cameraRef.current;
    if (!camera) return;
    const step = activeConfig.steps[index];
    if (step) {
      // Smooth camera position update
      const [tx, ty, tz] = step.cameraPos;
      camera.position.set(tx, ty, tz);
      camera.lookAt(0, 0, 0);
    }
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !modelGroupRef.current) return;
    cameraRef.current.position.set(0, 2, 8.5);
    cameraRef.current.lookAt(0, 0, 0);
    modelGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col">
      {/* Top Header / Spec HUD */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-xl px-4 py-2 pointer-events-auto max-w-lg shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
              {activeConfig.course}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Interactive 3D MOA Auto-Visualizer
            </span>
          </div>
          <h3 className="text-base font-bold text-white leading-tight">
            {activeConfig.name}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
            {activeConfig.subtitle}
          </p>
        </div>

        {/* Model Selector Dropdown & Close */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <select
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            className="bg-slate-900/90 text-xs font-semibold text-slate-200 border border-slate-700 rounded-xl px-3 py-2 outline-none hover:border-teal-500 focus:border-teal-500 transition-colors shadow-lg cursor-pointer"
          >
            {MOA_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {onClose && (
            <button
              onClick={onClose}
              className="bg-slate-900/90 text-slate-400 hover:text-white border border-slate-700 rounded-xl p-2 transition-colors shadow-lg cursor-pointer"
              title="Close 3D View"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Primary 3D WebGL Canvas Container */}
      <div 
        ref={canvasMountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Central Viewport Tip */}
      <div className="absolute top-20 right-4 z-10 pointer-events-none">
        <div className="bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <RotateCw className="w-3.5 h-3.5 text-teal-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Click & drag to rotate | Scroll to zoom</span>
        </div>
      </div>

      {/* Collapsible Bottom Control Dock (Zero Viewport Occlusion Discipline) */}
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-4xl transition-all duration-300 ${hudCollapsed ? 'translate-y-[calc(100%-24px)]' : 'translate-y-0'}`}>
        {/* Collapse / Expand Tab */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setHudCollapsed(!hudCollapsed)}
            className="bg-slate-900 border-t border-x border-slate-700/80 hover:bg-slate-800 text-slate-300 text-xs font-medium px-4 py-1 rounded-t-xl flex items-center gap-1 shadow-md cursor-pointer transition-colors"
          >
            {hudCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-teal-400" />
                <span>Show Mechanism Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Hide Controls (Full 3D Mode)</span>
              </>
            )}
          </button>
        </div>

        {/* Dock Body */}
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl space-y-3">
          {/* Active Step Progress & Text */}
          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {activeConfig.steps[currentStep]?.title}
              </span>
              <div className="flex gap-1.5">
                {activeConfig.steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleStepChange(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === currentStep ? 'w-6 bg-teal-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                    title={`Go to step ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeConfig.steps[currentStep]?.description}
            </p>
          </div>

          {/* Action Row: Play/Pause, Explode, Step Buttons, Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow transition cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Auto Rotate'}</span>
              </button>

              <button
                onClick={() => setIsExploded(!isExploded)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  isExploded 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isExploded ? 'Exploded Layer' : 'Assemble Model'}</span>
              </button>

              <button
                onClick={handleResetCamera}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs border border-slate-700 transition cursor-pointer"
                title="Reset Camera & Angle"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Reset Angle</span>
              </button>
            </div>

            {/* Key Molecules Chips */}
            <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-400">
              <span className="font-semibold text-slate-500">Molecules:</span>
              {activeConfig.keyMolecules.slice(0, 3).map((mol, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 whitespace-nowrap">
                  {mol}
                </span>
              ))}
            </div>

            {/* Step Navigation */}
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentStep === 0}
                onClick={() => handleStepChange(Math.max(0, currentStep - 1))}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-200 border border-slate-700 cursor-pointer disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="text-xs font-semibold text-slate-400 px-1">
                {currentStep + 1} / {activeConfig.steps.length}
              </span>
              <button
                disabled={currentStep === activeConfig.steps.length - 1}
                onClick={() => handleStepChange(Math.min(activeConfig.steps.length - 1, currentStep + 1))}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-200 border border-slate-700 cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
