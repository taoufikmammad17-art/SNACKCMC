import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';

interface Slot {
  group: THREE.Group;
  card: THREE.Mesh;
  cardBack: null;
  mirror: THREE.Mesh;
  basePos: THREE.Vector3;
  baseRot: THREE.Euler;
  angle: number;
  isEmpty: boolean;
  isClicked: boolean;
  speed: number;
  id: number;
}

const helixCount = 2;
const cardsPerHelix = 12;
const helixSpacing = 6;
const radius = 4;
const heightStep = 1.2;

const foodItems = products.slice(0, 8);

function createFoodTexture(index: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(0, 0, 512, 768);

  // Food image area
  ctx.fillStyle = '#E8E2D9';
  ctx.fillRect(20, 20, 472, 380);

  // Try to load actual image
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = foodItems[index % foodItems.length].image;

  // Name
  ctx.fillStyle = '#1A1A1A';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(foodItems[index % foodItems.length].name, 40, 460);

  // Price
  ctx.fillStyle = '#C41E1E';
  ctx.font = 'bold 32px Arial';
  ctx.fillText(`${foodItems[index % foodItems.length].price} MAD`, 40, 510);

  // Hint
  ctx.fillStyle = '#7A7A7A';
  ctx.font = '24px Arial';
  ctx.fillText('Clic pour voir', 40, 560);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  // When image loads, redraw
  img.onload = () => {
    ctx.drawImage(img, 20, 20, 472, 380);
    texture.needsUpdate = true;
  };

  return texture;
}

export default function Hero() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    slots: Slot[];
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    targetScrollPos: number;
    currentScrollPos: number;
    animId: number;
    time: number;
  } | null>(null);

  const [detailProduct, setDetailProduct] = useState<typeof products[0] | null>(null);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const clickedSlotRef = useRef<Slot | null>(null);
  const { addToCart } = useCart();

  const createSlot = useCallback((helixIndex: number, cardIndex: number, scene: THREE.Scene): Slot => {
    const angle = (cardIndex / cardsPerHelix) * Math.PI * 2;
    const y = (cardIndex - cardsPerHelix / 2) * heightStep;
    const xOffset = (helixIndex - (helixCount - 1) / 2) * helixSpacing;
    const x = Math.cos(angle) * radius + xOffset;
    const z = Math.sin(angle) * radius;

    const group = new THREE.Group();
    scene.add(group);

    const cardGeometry = new THREE.BoxGeometry(2.2, 3.2, 0.15, 10, 10, 1);

    const frontTexture = createFoodTexture(helixIndex * cardsPerHelix + cardIndex);

    const cardMat = new THREE.MeshPhysicalMaterial({
      color: 0xFAF8F5,
      metalness: 0.1,
      roughness: 0.6,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      map: frontTexture,
    });

    const backMat = new THREE.MeshPhysicalMaterial({
      color: 0xFAF8F5,
      metalness: 0.1,
      roughness: 0.6,
    });

    const card = new THREE.Mesh(cardGeometry, [cardMat, cardMat, cardMat, cardMat, cardMat, backMat]);
    card.castShadow = true;
    group.add(card);

    const mirrorGeom = new THREE.BoxGeometry(2.2, 3.2, 0.15);
    const mirrorMat = new THREE.MeshPhysicalMaterial({
      color: 0xFAF8F5,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const mirror = new THREE.Mesh(mirrorGeom, mirrorMat);
    mirror.scale.set(1, 1, 1);
    group.add(mirror);

    return {
      group,
      card,
      cardBack: null,
      mirror,
      basePos: new THREE.Vector3(x, y, z),
      baseRot: new THREE.Euler(-0.2, angle, 0),
      angle,
      isEmpty: false,
      isClicked: false,
      speed: 0.9 + Math.random() * 0.2,
      id: helixIndex * 100 + cardIndex,
    };
  }, []);

  const initCards = useCallback((scene: THREE.Scene, slots: Slot[]) => {
    slots.length = 0;
    for (let h = 0; h < helixCount; h++) {
      for (let c = 0; c < cardsPerHelix; c++) {
        const s = createSlot(h, c, scene);
        slots.push(s);
        s.group.position.set(0, -20, 0);
        s.group.rotation.set(0, 0, 0);

        gsap.to(s.group.position, {
          x: s.basePos.x,
          y: s.basePos.y,
          z: s.basePos.z,
          duration: 2.5,
          ease: 'power3.out',
          delay: (h * cardsPerHelix + c) * 0.05,
        });
        gsap.to(s.group.rotation, {
          x: s.baseRot.x,
          y: s.baseRot.y,
          z: s.baseRot.z,
          duration: 2.5,
          ease: 'power3.out',
          delay: (h * cardsPerHelix + c) * 0.05,
        });
      }
    }
  }, [createSlot]);

  const returnToHelix = useCallback((slot: Slot) => {
    slot.isClicked = false;
    setDetailProduct(null);
    setDetailQuantity(1);

    const sRef = sceneRef.current;
    if (!sRef) return;

    gsap.to(slot.group.position, {
      x: slot.basePos.x,
      y: slot.basePos.y + sRef.targetScrollPos,
      z: slot.basePos.z,
      duration: 1.0,
      ease: 'power3.inOut',
    });
    gsap.to(slot.group.rotation, {
      x: slot.baseRot.x,
      y: slot.baseRot.y + (slot.angle + (performance.now() / 1000 * 0.3) * slot.speed) + Math.PI / 2,
      z: slot.baseRot.z,
      duration: 1.0,
      ease: 'power3.inOut',
      onComplete: () => {
        slot.isEmpty = false;
      },
    });
  }, []);

  const onCardClick = useCallback((slot: Slot) => {
    if (slot.isClicked || slot.isEmpty) return;

    slot.isClicked = true;
    slot.isEmpty = true;
    clickedSlotRef.current = slot;

    const sRef = sceneRef.current;
    if (!sRef) return;

    const productIndex = slot.id % foodItems.length;
    setDetailProduct(foodItems[productIndex]);
    setDetailQuantity(1);

    gsap.to(slot.group.position, {
      x: 0,
      y: 0,
      z: sRef.camera.position.z - 2,
      duration: 1.2,
      ease: 'expo.out',
    });
    gsap.to(slot.group.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.2,
      ease: 'expo.out',
    });
  }, []);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF5EFE6);
    scene.fog = new THREE.Fog(0xF5EFE6, 10, 30);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 22);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Slots
    const slots: Slot[] = [];

    sceneRef.current = {
      scene,
      camera,
      renderer,
      slots,
      raycaster,
      mouse,
      targetScrollPos: 0,
      currentScrollPos: 0,
      animId: 0,
      time: 0,
    };

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    keyLight.position.set(10, 15, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xFFE8D0, 0.3);
    fillLight.position.set(-8, 5, -5);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xE8E0F0, 0.2);
    backLight.position.set(0, -5, -10);
    scene.add(backLight);

    // Initialize cards
    initCards(scene, slots);

    // Wheel handler
    const onWheel = (e: WheelEvent) => {
      const sRef = sceneRef.current;
      if (!sRef) return;
      sRef.targetScrollPos += e.deltaY * 0.01;
      sRef.targetScrollPos = Math.max(-12, Math.min(12, sRef.targetScrollPos));
    };

    // Click handler
    const onPointerDown = (e: PointerEvent) => {
      const sRef = sceneRef.current;
      if (!sRef) return;

      sRef.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      sRef.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      sRef.raycaster.setFromCamera(sRef.mouse, sRef.camera);
      const cardMeshes = sRef.slots.map((s) => s.card);
      const intersects = sRef.raycaster.intersectObjects(cardMeshes);

      if (intersects.length > 0) {
        const hitCard = intersects[0].object as THREE.Mesh;
        const slot = sRef.slots.find((s) => s.card === hitCard);
        if (slot && !slot.isClicked) {
          onCardClick(slot);
        }
      }
    };

    // Hover handler
    const onPointerMove = (e: PointerEvent) => {
      const sRef = sceneRef.current;
      if (!sRef) return;

      sRef.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      sRef.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      sRef.raycaster.setFromCamera(sRef.mouse, sRef.camera);
      const cardMeshes = sRef.slots.map((s) => s.card);
      const intersects = sRef.raycaster.intersectObjects(cardMeshes);

      if (intersects.length > 0) {
        container.style.cursor = 'pointer';
        const hitCard = intersects[0].object as THREE.Mesh;
        const slot = sRef.slots.find((s) => s.card === hitCard);
        if (slot && !slot.isClicked) {
          gsap.to(slot.group.scale, { x: 1.02, y: 1.02, z: 1.02, duration: 0.1 });
        }
      } else {
        container.style.cursor = 'default';
        sRef.slots.forEach((s) => {
          if (!s.isClicked) {
            gsap.to(s.group.scale, { x: 1, y: 1, z: 1, duration: 0.1 });
          }
        });
      }
    };

    container.addEventListener('wheel', onWheel, { passive: true });
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation loop
    const animate = () => {
      const sRef = sceneRef.current;
      if (!sRef) return;

      sRef.animId = requestAnimationFrame(animate);
      sRef.time += 0.016;

      // Lerp scroll
      sRef.currentScrollPos += (sRef.targetScrollPos - sRef.currentScrollPos) * 0.1;

      const globalRot = sRef.time * 0.3;

      sRef.slots.forEach((s, i) => {
        if (s.isClicked) return;

        const currentAngle = s.angle + globalRot * s.speed;
        const hx = s.basePos.x;

        if (s.isEmpty) {
          const ny = s.basePos.y + Math.sin(sRef.time * 2 + i) * 0.5;
          s.group.position.set(hx, ny, s.basePos.z);
          s.group.rotation.set(s.baseRot.x, s.baseRot.y + globalRot * s.speed, s.baseRot.z);
          return;
        }

        const newY = s.basePos.y + sRef.currentScrollPos;
        s.group.position.x = hx;
        s.group.position.y = newY;
        s.group.position.z = s.basePos.z;
        s.group.rotation.x = s.baseRot.x;
        s.group.rotation.y = currentAngle + Math.PI / 2;
        s.group.rotation.z = s.baseRot.z;

        if (s.mirror) {
          s.mirror.position.z = -0.5;
          s.mirror.rotation.y = Math.PI;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(sceneRef.current?.animId || 0);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [initCards, onCardClick, returnToHelix]);

  const handleAddToCart = () => {
    if (detailProduct) {
      for (let i = 0; i < detailQuantity; i++) {
        addToCart(detailProduct);
      }
      if (clickedSlotRef.current) {
        returnToHelix(clickedSlotRef.current);
        clickedSlotRef.current = null;
      }
    }
  };

  const handleCloseDetail = () => {
    if (clickedSlotRef.current) {
      returnToHelix(clickedSlotRef.current);
      clickedSlotRef.current = null;
    }
  };

  return (
    <section id="accueil" className="relative h-screen overflow-hidden">
      {/* Three.js Canvas Container */}
      <div
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse at center, #FAF8F5 0%, #EDE6D6 100%)' }}
      />

      {/* Text Overlay */}
      <div className="absolute bottom-0 left-0 z-10 pb-20 px-[5vw] max-w-[600px]">
        <span className="text-[12px] font-medium uppercase tracking-[0.03em] text-[#7A7A7A] font-body">
          COMMANDEZ EN LIGNE
        </span>
        <h1 className="font-display text-[clamp(48px,6vw,84px)] font-bold leading-[1.05] tracking-[-0.02em] text-[#1A1A1A] mt-2">
          Snack <span className="text-[#C41E1E]">CMC</span> Casa-Settat
        </h1>
        <p className="font-body text-lg text-[#4A4A4A] mt-4 max-w-[420px]">
          Des repas rapides et savoureux pour les stagiaires
        </p>
        <button
          onClick={() => {
            const el = document.getElementById('menu');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="mt-8 px-8 py-4 bg-[#C41E1E] text-white font-body text-[15px] font-semibold rounded-xl hover:bg-[#A31818] hover:-translate-y-0.5 transition-all duration-200"
          style={{ boxShadow: '0 4px 16px rgba(196,30,30,0.3)' }}
        >
          Commander maintenant
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce-gentle">
        <ChevronDown size={24} className="text-[#7A7A7A]" />
      </div>

      {/* Detail Overlay */}
      {detailProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-[rgba(26,26,26,0.6)] backdrop-blur-sm"
            onClick={handleCloseDetail}
          />
          <div className="relative bg-white rounded-3xl p-8 max-w-[480px] w-[90%] z-[201] shadow-2xl">
            <button
              onClick={handleCloseDetail}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5EFE6] transition-colors"
            >
              <span className="text-[#7A7A7A] text-xl">&times;</span>
            </button>
            <img
              src={detailProduct.image}
              alt={detailProduct.name}
              className="w-full h-48 object-cover rounded-2xl mb-4"
            />
            <h3 className="font-display text-[28px] font-semibold text-[#1A1A1A]">
              {detailProduct.name}
            </h3>
            <p className="font-body text-sm text-[#7A7A7A] mt-2">{detailProduct.description}</p>
            <p className="font-body text-xl font-bold text-[#C41E1E] mt-3">
              {detailProduct.price} MAD
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mt-4">
              <span className="font-body text-sm text-[#4A4A4A]">Quantité:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetailQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg border border-[#E8E2D9] flex items-center justify-center hover:bg-[#F5EFE6] transition-colors"
                >
                  -
                </button>
                <span className="font-body font-semibold w-6 text-center">{detailQuantity}</span>
                <button
                  onClick={() => setDetailQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-lg border border-[#E8E2D9] flex items-center justify-center hover:bg-[#F5EFE6] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full mt-6 py-3 bg-[#C41E1E] text-white font-body font-semibold rounded-xl hover:bg-[#A31818] transition-colors duration-200"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
