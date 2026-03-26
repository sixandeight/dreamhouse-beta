import * as THREE from 'three';
import { gsap } from 'gsap';
import { ROOM_DEFS } from './rooms.js';
import { PROJECTS } from './projects.js';
import { createFurniture } from './furniture.js';

// ── Constants ──
const ROOM_W = 1.4;
const ROOM_H = 1.0;
const ROOM_D = 1.0;
const WALL_THICK = 0.04;
const COLS = 3;
const ROWS = 2;
const GRID_W = COLS * ROOM_W;
const GRID_H = ROWS * ROOM_H;

// ── State ──
let currentView = 'house'; // 'house' | 'room'
let activeRoom = null;
let hoveredObject = null;
let isAnimating = false;

// ── DOM refs ──
const canvas = document.getElementById('dreamhouse-canvas');
const loader = document.getElementById('loader');
const loaderFill = loader.querySelector('.loader-fill');
const roomLabel = document.getElementById('room-label');
const backBtn = document.getElementById('back-btn');
const objectTooltip = document.getElementById('object-tooltip');
const projectOverlay = document.getElementById('project-overlay');
const projectInner = document.getElementById('project-inner');
const projectClose = document.getElementById('project-close');
const titleBar = document.getElementById('title-bar');

// ── Three.js setup ──
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x1a1a2e);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x1a1a2e, 0.15);

// ── Camera (isometric-ish perspective) ──
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
// Starting position: looking at the house from a high-angle front view
const houseCenter = new THREE.Vector3(
  (COLS - 1) * ROOM_W / 2,
  (ROWS - 1) * ROOM_H / 2 + 0.1,
  0
);
const houseCamPos = new THREE.Vector3(
  houseCenter.x,
  houseCenter.y + 2.0,
  houseCenter.z + 4.5
);
camera.position.copy(houseCamPos);
camera.lookAt(houseCenter);

// ── Lighting ──
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(3, 5, 4);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(1024, 1024);
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 20;
dirLight.shadow.camera.left = -5;
dirLight.shadow.camera.right = 5;
dirLight.shadow.camera.top = 5;
dirLight.shadow.camera.bottom = -5;
scene.add(dirLight);

// Warm fill light from below
const fillLight = new THREE.DirectionalLight(0xFFB6C1, 0.3);
fillLight.position.set(-2, -1, 2);
scene.add(fillLight);

// ── Raycaster ──
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ── Data structures ──
const roomGroups = [];     // { group, def, boundingBox, center }
const interactiveObjects = []; // { mesh, def (furniture def), roomDef }
const idleAnimations = []; // { mesh, type, seed }

// ── Build the dollhouse ──
function buildDollhouse() {
  // Outer frame / shell of the house
  buildHouseFrame();

  // Build each room
  ROOM_DEFS.forEach((roomDef) => {
    const roomGroup = new THREE.Group();
    const x = roomDef.col * ROOM_W;
    const y = roomDef.floor * ROOM_H;
    roomGroup.position.set(x, y, 0);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM_W, WALL_THICK, ROOM_D),
      new THREE.MeshToonMaterial({ color: roomDef.floorColor })
    );
    floor.position.y = -WALL_THICK / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM_W, ROOM_H, WALL_THICK),
      new THREE.MeshToonMaterial({ color: roomDef.wallColor })
    );
    backWall.position.set(0, ROOM_H / 2, -ROOM_D / 2 + WALL_THICK / 2);
    backWall.receiveShadow = true;
    roomGroup.add(backWall);

    // Left wall (only for leftmost rooms)
    if (roomDef.col === 0) {
      const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(WALL_THICK, ROOM_H, ROOM_D),
        new THREE.MeshToonMaterial({ color: roomDef.wallColor, transparent: true, opacity: 0.6 })
      );
      leftWall.position.set(-ROOM_W / 2 + WALL_THICK / 2, ROOM_H / 2, 0);
      roomGroup.add(leftWall);
    }

    // Right wall (only for rightmost rooms)
    if (roomDef.col === COLS - 1) {
      const rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(WALL_THICK, ROOM_H, ROOM_D),
        new THREE.MeshToonMaterial({ color: roomDef.wallColor, transparent: true, opacity: 0.6 })
      );
      rightWall.position.set(ROOM_W / 2 - WALL_THICK / 2, ROOM_H / 2, 0);
      roomGroup.add(rightWall);
    }

    // Ceiling (top row only)
    if (roomDef.floor === ROWS - 1) {
      const ceiling = new THREE.Mesh(
        new THREE.BoxGeometry(ROOM_W, WALL_THICK, ROOM_D),
        new THREE.MeshToonMaterial({ color: 0xFFF0F5 })
      );
      ceiling.position.y = ROOM_H + WALL_THICK / 2;
      roomGroup.add(ceiling);
    }

    // Divider walls between columns
    if (roomDef.col > 0) {
      const divider = new THREE.Mesh(
        new THREE.BoxGeometry(WALL_THICK, ROOM_H, ROOM_D),
        new THREE.MeshToonMaterial({ color: mixColors(roomDef.wallColor, 0xFFFFFF, 0.3) })
      );
      divider.position.set(-ROOM_W / 2 + WALL_THICK / 2, ROOM_H / 2, 0);
      roomGroup.add(divider);
    }

    // Room light (point light inside each room)
    const roomLight = new THREE.PointLight(roomDef.accentColor, 0.4, 2.5);
    roomLight.position.set(0, ROOM_H * 0.8, 0);
    roomGroup.add(roomLight);

    // Ceiling light fixture
    const fixture = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 16, 16),
      new THREE.MeshToonMaterial({
        color: 0xFFFFFF,
        emissive: roomDef.accentColor,
        emissiveIntensity: 0.5,
      })
    );
    fixture.position.set(0, ROOM_H - 0.02, 0);
    roomGroup.add(fixture);

    // Furniture
    roomDef.furniture.forEach((fDef) => {
      const furnitureGroup = createFurniture(fDef.type, roomDef.accentColor);
      furnitureGroup.position.set(fDef.position[0], fDef.position[1], fDef.position[2]);
      furnitureGroup.scale.setScalar(0.85);
      roomGroup.add(furnitureGroup);

      // Make all meshes in this furniture group interactive
      furnitureGroup.traverse((child) => {
        if (child.isMesh) {
          child.userData.furnitureDef = fDef;
          child.userData.roomDef = roomDef;
          child.userData.furnitureGroup = furnitureGroup;
          if (fDef.projectId) {
            interactiveObjects.push({ mesh: child, def: fDef, roomDef });
          }
        }
      });

      // Add idle animation
      if (fDef.projectId) {
        idleAnimations.push({
          group: furnitureGroup,
          type: 'bob',
          seed: Math.random() * Math.PI * 2,
          baseY: fDef.position[1],
        });
      }
    });

    scene.add(roomGroup);

    // Store room data
    const center = new THREE.Vector3(x, y + ROOM_H / 2, 0);
    roomGroups.push({
      group: roomGroup,
      def: roomDef,
      center,
      camTarget: center.clone(),
      camPos: new THREE.Vector3(x, y + ROOM_H / 2, ROOM_D * 1.6),
    });
  });
}

function buildHouseFrame() {
  // Roof
  const roofGroup = new THREE.Group();

  // Roof ridge (triangular shape)
  const roofGeom = new THREE.BufferGeometry();
  const hw = GRID_W / 2 + 0.15;
  const roofH = 0.5;
  const roofY = ROWS * ROOM_H + WALL_THICK;
  const roofD = ROOM_D / 2 + 0.15;

  // Left slope
  const leftRoof = new THREE.Mesh(
    new THREE.BoxGeometry(GRID_W + 0.3, 0.04, ROOM_D * 0.7),
    new THREE.MeshToonMaterial({ color: 0xFF69B4 })
  );
  leftRoof.position.set(
    (COLS - 1) * ROOM_W / 2,
    roofY + roofH / 2,
    -ROOM_D * 0.15
  );
  leftRoof.rotation.x = 0.3;
  scene.add(leftRoof);

  // Right slope
  const rightRoof = new THREE.Mesh(
    new THREE.BoxGeometry(GRID_W + 0.3, 0.04, ROOM_D * 0.7),
    new THREE.MeshToonMaterial({ color: 0xFF69B4 })
  );
  rightRoof.position.set(
    (COLS - 1) * ROOM_W / 2,
    roofY + roofH / 2,
    ROOM_D * 0.15
  );
  rightRoof.rotation.x = -0.3;
  scene.add(rightRoof);

  // Roof cap
  const roofCap = new THREE.Mesh(
    new THREE.BoxGeometry(GRID_W + 0.4, 0.06, 0.06),
    new THREE.MeshToonMaterial({ color: 0xFF1493 })
  );
  roofCap.position.set(
    (COLS - 1) * ROOM_W / 2,
    roofY + roofH * 0.72,
    0
  );
  scene.add(roofCap);

  // Base platform
  const basePlatform = new THREE.Mesh(
    new THREE.BoxGeometry(GRID_W + 0.6, 0.06, ROOM_D + 0.6),
    new THREE.MeshToonMaterial({ color: 0xFF69B4 })
  );
  basePlatform.position.set(
    (COLS - 1) * ROOM_W / 2,
    -0.05,
    0
  );
  basePlatform.receiveShadow = true;
  scene.add(basePlatform);

  // "DREAMHOUSE" sign on roof
  // (We'll use a simple pink box as a placeholder sign)
  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.15, 0.02),
    new THREE.MeshToonMaterial({
      color: 0xFF69B4,
      emissive: 0xFF69B4,
      emissiveIntensity: 0.3,
    })
  );
  sign.position.set(
    (COLS - 1) * ROOM_W / 2,
    roofY + roofH * 0.85,
    ROOM_D * 0.35
  );
  sign.rotation.x = -0.3;
  scene.add(sign);
}

function mixColors(c1, c2, t) {
  const color1 = new THREE.Color(c1);
  const color2 = new THREE.Color(c2);
  return color1.lerp(color2, t).getHex();
}

// ── Sparkle particles ──
let sparkleParticles;
function createSparkles() {
  const count = 120;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * (GRID_W + 2);
    positions[i * 3 + 1] = Math.random() * (GRID_H + 1.5);
    positions[i * 3 + 2] = (Math.random() - 0.5) * (ROOM_D + 2);
    sizes[i] = Math.random() * 3 + 1;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.03,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  sparkleParticles = new THREE.Points(geom, mat);
  scene.add(sparkleParticles);
}

// ── Interaction ──
function onMouseMove(e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  // Update tooltips
  if (currentView === 'house') {
    updateRoomHover(e);
  } else if (currentView === 'room') {
    updateObjectHover(e);
  }
}

function updateRoomHover(e) {
  raycaster.setFromCamera(mouse, camera);

  // Check room floor/wall hits
  let hitRoom = null;
  let hitPoint = null;

  for (const room of roomGroups) {
    const intersects = raycaster.intersectObjects(room.group.children, true);
    if (intersects.length > 0) {
      hitRoom = room;
      hitPoint = intersects[0].point;
      break;
    }
  }

  if (hitRoom) {
    roomLabel.textContent = hitRoom.def.label;
    roomLabel.style.left = e.clientX + 'px';
    roomLabel.style.top = e.clientY + 'px';
    roomLabel.classList.remove('hidden');
    document.body.classList.add('pointer');
  } else {
    roomLabel.classList.add('hidden');
    document.body.classList.remove('pointer');
  }
}

function updateObjectHover(e) {
  raycaster.setFromCamera(mouse, camera);

  const interactiveMeshes = interactiveObjects
    .filter(o => o.roomDef.id === activeRoom?.def.id)
    .map(o => o.mesh);

  const intersects = raycaster.intersectObjects(interactiveMeshes, false);

  // Reset previous hover
  if (hoveredObject) {
    const group = hoveredObject.mesh.userData.furnitureGroup;
    gsap.to(group.scale, { x: 0.85, y: 0.85, z: 0.85, duration: 0.3 });
    hoveredObject = null;
  }

  objectTooltip.classList.add('hidden');
  document.body.classList.remove('pointer');

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    const fDef = hit.userData.furnitureDef;
    if (fDef && fDef.projectId) {
      hoveredObject = { mesh: hit, def: fDef };

      // Scale up the furniture group
      const group = hit.userData.furnitureGroup;
      gsap.to(group.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.3, ease: 'back.out(1.7)' });

      // Show tooltip
      objectTooltip.innerHTML = `
        <div>${fDef.label}</div>
        ${fDef.hint ? `<div class="tooltip-hint">click to view → ${fDef.hint}</div>` : ''}
      `;
      objectTooltip.style.left = e.clientX + 'px';
      objectTooltip.style.top = e.clientY + 'px';
      objectTooltip.classList.remove('hidden');
      document.body.classList.add('pointer');
    }
  }
}

function onClick(e) {
  if (isAnimating) return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  if (currentView === 'house') {
    // Check which room was clicked
    for (const room of roomGroups) {
      const intersects = raycaster.intersectObjects(room.group.children, true);
      if (intersects.length > 0) {
        zoomToRoom(room);
        return;
      }
    }
  } else if (currentView === 'room') {
    // Check which object was clicked
    const interactiveMeshes = interactiveObjects
      .filter(o => o.roomDef.id === activeRoom?.def.id)
      .map(o => o.mesh);

    const intersects = raycaster.intersectObjects(interactiveMeshes, false);
    if (intersects.length > 0) {
      const fDef = intersects[0].object.userData.furnitureDef;
      if (fDef && fDef.projectId) {
        openProject(fDef.projectId);
      }
    }
  }
}

// ── Camera animations ──
function zoomToRoom(room) {
  if (isAnimating) return;
  isAnimating = true;
  currentView = 'room';
  activeRoom = room;

  // Hide room label
  roomLabel.classList.add('hidden');

  // Animate camera
  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
      backBtn.classList.remove('hidden');
      titleBar.classList.remove('visible');
    }
  });

  tl.to(camera.position, {
    x: room.camPos.x,
    y: room.camPos.y,
    z: room.camPos.z,
    duration: 1.2,
    ease: 'power3.inOut',
    onUpdate: () => camera.lookAt(room.camTarget),
  });

  // Fade out other rooms
  roomGroups.forEach((r) => {
    if (r !== room) {
      r.group.traverse((child) => {
        if (child.isMesh && child.material) {
          gsap.to(child.material, { opacity: 0.08, duration: 0.8 });
          child.material.transparent = true;
        }
      });
    }
  });
}

function zoomToHouse() {
  if (isAnimating) return;
  isAnimating = true;
  currentView = 'house';

  backBtn.classList.add('hidden');
  objectTooltip.classList.add('hidden');

  // Reset hover
  if (hoveredObject) {
    const group = hoveredObject.mesh.userData.furnitureGroup;
    gsap.to(group.scale, { x: 0.85, y: 0.85, z: 0.85, duration: 0.3 });
    hoveredObject = null;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
      activeRoom = null;
      titleBar.classList.add('visible');
    }
  });

  tl.to(camera.position, {
    x: houseCamPos.x,
    y: houseCamPos.y,
    z: houseCamPos.z,
    duration: 1.2,
    ease: 'power3.inOut',
    onUpdate: () => camera.lookAt(houseCenter),
  });

  // Fade rooms back in
  roomGroups.forEach((r) => {
    r.group.traverse((child) => {
      if (child.isMesh && child.material && child.material.transparent) {
        gsap.to(child.material, {
          opacity: 1,
          duration: 0.8,
          onComplete: () => { child.material.transparent = false; },
        });
      }
    });
  });
}

// ── Project overlay ──
function openProject(projectId) {
  const project = PROJECTS[projectId];
  if (!project) return;

  currentView = 'project';

  let creditsHtml = '';
  if (project.credits) {
    creditsHtml = Object.entries(project.credits)
      .map(([k, v]) => `<strong>${k}:</strong> ${v}`)
      .join(' &nbsp;·&nbsp; ');
  }

  projectInner.innerHTML = `
    <h2>${project.title}</h2>
    <span class="project-tag">${project.tag}</span>
    ${project.hero ? `<div class="project-hero">${project.hero}</div>` : ''}
    <p>${project.description}</p>
    <p>${project.details}</p>
    <div class="project-credits">${creditsHtml}</div>
  `;

  projectOverlay.classList.remove('hidden');
}

function closeProject() {
  projectOverlay.classList.add('hidden');
  currentView = 'room';
}

// ── Animation loop ──
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Idle animations — gentle bob for interactive objects
  idleAnimations.forEach((anim) => {
    const bobAmount = Math.sin(t * 1.5 + anim.seed) * 0.008;
    anim.group.position.y = anim.baseY + bobAmount;
  });

  // Sparkle animation
  if (sparkleParticles) {
    const positions = sparkleParticles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(t * 0.5 + i) * 0.0003;
      // Wrap around
      if (positions[i + 1] > GRID_H + 2) positions[i + 1] = -0.5;
    }
    sparkleParticles.geometry.attributes.position.needsUpdate = true;
    sparkleParticles.material.opacity = 0.3 + Math.sin(t * 0.8) * 0.15;
  }

  // Camera behavior per view
  if (currentView === 'house' && !isAnimating) {
    camera.position.x = houseCamPos.x + Math.sin(t * 0.3) * 0.05;
    camera.position.y = houseCamPos.y + Math.sin(t * 0.2) * 0.03;
    camera.lookAt(houseCenter);
  } else if ((currentView === 'room' || currentView === 'project') && activeRoom && !isAnimating) {
    camera.position.x = activeRoom.camPos.x + Math.sin(t * 0.4) * 0.02;
    camera.position.y = activeRoom.camPos.y + Math.sin(t * 0.25) * 0.015;
    camera.lookAt(activeRoom.camTarget);
  }

  renderer.render(scene, camera);
}

// ── Resize ──
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ── Loading ──
function simulateLoading() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      loaderFill.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('fade-out');
        titleBar.classList.add('visible');
      }, 400);
    }
    loaderFill.style.width = progress + '%';
  }, 150);
}

// ── Init ──
function init() {
  buildDollhouse();
  createSparkles();
  simulateLoading();

  // Events
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onClick);
  window.addEventListener('resize', onResize);
  backBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    zoomToHouse();
  });
  projectClose.addEventListener('click', closeProject);
  projectOverlay.addEventListener('click', (e) => {
    if (e.target === projectOverlay) closeProject();
  });

  // Keyboard
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (currentView === 'project') {
        closeProject();
      } else if (currentView === 'room' && !isAnimating) {
        zoomToHouse();
      }
    }
  });

  animate();
}

init();
