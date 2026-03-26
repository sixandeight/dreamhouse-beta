import * as THREE from 'three';

// Toon material helper
function toon(color, emissiveIntensity = 0) {
  return new THREE.MeshToonMaterial({
    color,
    emissive: color,
    emissiveIntensity,
  });
}

function basic(color) {
  return new THREE.MeshToonMaterial({ color });
}

// ── Furniture builders — each returns a THREE.Group ──

export function createFurniture(type, accentColor) {
  const builders = {
    vanity: buildVanity,
    perfume: buildPerfume,
    pouf: buildPouf,
    bathtub: buildBathtub,
    sink: buildSink,
    towelrack: buildTowelRack,
    desk: buildDesk,
    floorlamp: buildFloorLamp,
    moodboard: buildMoodboard,
    sofa: buildSofa,
    coffeetable: buildCoffeeTable,
    plant: buildPlant,
    computer: buildComputer,
    bookshelf: buildBookshelf,
    officechair: buildOfficeChair,
    bar: buildBar,
    loungechair: buildLoungeChair,
    speaker: buildSpeaker,
  };

  const builder = builders[type];
  if (!builder) {
    // Fallback: simple box
    const g = new THREE.Group();
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.15, 0.15),
      toon(accentColor)
    );
    mesh.position.y = 0.075;
    g.add(mesh);
    return g;
  }
  return builder(accentColor);
}

// ── Individual builders ──

function buildVanity(accent) {
  const g = new THREE.Group();
  // Table
  const table = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.02, 0.2),
    toon(0xFFB6C1)
  );
  table.position.y = 0.2;
  g.add(table);
  // Legs
  for (const x of [-0.17, 0.17]) {
    for (const z of [-0.07, 0.07]) {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.2, 8),
        toon(0xDDA0DD)
      );
      leg.position.set(x, 0.1, z);
      g.add(leg);
    }
  }
  // Mirror (oval)
  const mirror = new THREE.Mesh(
    new THREE.CircleGeometry(0.1, 16),
    new THREE.MeshToonMaterial({ color: 0xE0F7FA, side: THREE.DoubleSide })
  );
  mirror.position.set(0, 0.4, -0.09);
  g.add(mirror);
  // Mirror frame
  const frame = new THREE.Mesh(
    new THREE.TorusGeometry(0.105, 0.012, 8, 24),
    toon(accent)
  );
  frame.position.set(0, 0.4, -0.09);
  g.add(frame);
  // Makeup items on table
  const lipstick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.06, 8),
    toon(0xFF1493)
  );
  lipstick.position.set(0.1, 0.24, 0);
  g.add(lipstick);
  return g;
}

function buildPerfume(accent) {
  const g = new THREE.Group();
  // Shelf
  const shelf = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.015, 0.1),
    toon(0xFFE4E1)
  );
  shelf.position.y = 0.18;
  g.add(shelf);
  // Bottles
  const colors = [accent, 0xE040FB, 0x87CEEB];
  for (let i = 0; i < 3; i++) {
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.02, 0.08, 8),
      toon(colors[i])
    );
    bottle.position.set(-0.07 + i * 0.07, 0.23, 0);
    g.add(bottle);
    // Cap
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.012, 8, 8),
      toon(0xFFD700)
    );
    cap.position.set(-0.07 + i * 0.07, 0.275, 0);
    g.add(cap);
  }
  return g;
}

function buildPouf(accent) {
  const g = new THREE.Group();
  const pouf = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.09, 0.1, 16),
    toon(accent)
  );
  pouf.position.y = 0.05;
  g.add(pouf);
  // Tassel
  const tassel = new THREE.Mesh(
    new THREE.SphereGeometry(0.015, 8, 8),
    toon(0xFFD700)
  );
  tassel.position.y = 0.11;
  g.add(tassel);
  return g;
}

function buildBathtub(accent) {
  const g = new THREE.Group();
  // Tub body (elongated box with rounded feel)
  const tub = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.12, 0.22),
    toon(0xFFFFFF)
  );
  tub.position.y = 0.1;
  g.add(tub);
  // Inner (water)
  const water = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.04, 0.17),
    toon(accent, 0.1)
  );
  water.position.y = 0.15;
  g.add(water);
  // Faucet
  const faucet = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.08, 8),
    toon(0xC0C0C0)
  );
  faucet.position.set(0.18, 0.22, 0);
  g.add(faucet);
  // Faucet head
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.018, 8, 8),
    toon(0xC0C0C0)
  );
  head.position.set(0.18, 0.26, 0);
  g.add(head);
  // Feet
  for (const x of [-0.18, 0.18]) {
    for (const z of [-0.08, 0.08]) {
      const foot = new THREE.Mesh(
        new THREE.SphereGeometry(0.015, 8, 8),
        toon(0xFFD700)
      );
      foot.position.set(x, 0.02, z);
      g.add(foot);
    }
  }
  return g;
}

function buildSink(accent) {
  const g = new THREE.Group();
  // Pedestal
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.04, 0.25, 8),
    toon(0xFFFFFF)
  );
  pedestal.position.y = 0.125;
  g.add(pedestal);
  // Basin
  const basin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.08, 0.04, 16),
    toon(0xFFFFFF)
  );
  basin.position.y = 0.27;
  g.add(basin);
  // Faucet
  const faucet = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.008, 0.06, 8),
    toon(0xC0C0C0)
  );
  faucet.position.set(0, 0.32, -0.03);
  g.add(faucet);
  return g;
}

function buildTowelRack(accent) {
  const g = new THREE.Group();
  // Posts
  for (const x of [-0.06, 0.06]) {
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.35, 8),
      toon(0xC0C0C0)
    );
    post.position.set(x, 0.175, 0);
    g.add(post);
  }
  // Bars
  for (const y of [0.25, 0.15]) {
    const bar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.12, 8),
      toon(0xC0C0C0)
    );
    bar.rotation.z = Math.PI / 2;
    bar.position.y = y;
    g.add(bar);
  }
  // Towel (draped box)
  const towel = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.12, 0.02),
    toon(accent)
  );
  towel.position.set(0, 0.2, 0.015);
  g.add(towel);
  return g;
}

function buildDesk(accent) {
  const g = new THREE.Group();
  // Tabletop
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.02, 0.25),
    toon(0xF5F5DC)
  );
  top.position.y = 0.22;
  g.add(top);
  // Legs
  for (const x of [-0.2, 0.2]) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.22, 0.22),
      toon(0xDDA0DD)
    );
    leg.position.set(x, 0.11, 0);
    g.add(leg);
  }
  // Pencil holder
  const holder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.05, 8),
    toon(accent)
  );
  holder.position.set(0.15, 0.26, 0.05);
  g.add(holder);
  // Paper
  const paper = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.002, 0.15),
    toon(0xFFFFFF)
  );
  paper.position.set(-0.05, 0.235, 0);
  g.add(paper);
  return g;
}

function buildFloorLamp(accent) {
  const g = new THREE.Group();
  // Base
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.06, 0.015, 16),
    toon(0xDDA0DD)
  );
  base.position.y = 0.008;
  g.add(base);
  // Pole
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.008, 0.4, 8),
    toon(0xC0C0C0)
  );
  pole.position.y = 0.21;
  g.add(pole);
  // Shade
  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.07, 0.1, 16, 1, true),
    toon(accent)
  );
  shade.position.y = 0.44;
  shade.rotation.x = Math.PI;
  g.add(shade);
  return g;
}

function buildMoodboard(accent) {
  const g = new THREE.Group();
  // Board
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.35, 0.02),
    toon(0xFFF8DC)
  );
  board.position.y = 0.25;
  g.add(board);
  // Pinned cards
  const cardColors = [accent, 0xFF69B4, 0x87CEEB, 0xE6E6FA];
  for (let i = 0; i < 4; i++) {
    const card = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.06, 0.005),
      toon(cardColors[i])
    );
    card.position.set(
      (i % 2 === 0 ? -0.07 : 0.07),
      (i < 2 ? 0.32 : 0.18),
      0.015
    );
    card.rotation.z = (Math.random() - 0.5) * 0.15;
    g.add(card);
  }
  return g;
}

function buildSofa(accent) {
  const g = new THREE.Group();
  // Seat
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.08, 0.18),
    toon(accent)
  );
  seat.position.y = 0.08;
  g.add(seat);
  // Back
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.15, 0.04),
    toon(accent)
  );
  back.position.set(0, 0.19, -0.07);
  g.add(back);
  // Arms
  for (const x of [-0.2, 0.2]) {
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.1, 0.18),
      toon(accent)
    );
    arm.position.set(x, 0.13, 0);
    g.add(arm);
  }
  // Cushions
  for (const x of [-0.08, 0.08]) {
    const cushion = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.03, 0.14),
      toon(0xFFB6C1)
    );
    cushion.position.set(x, 0.14, 0.01);
    g.add(cushion);
  }
  // Legs
  for (const x of [-0.17, 0.17]) {
    for (const z of [-0.06, 0.06]) {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.04, 8),
        toon(0xDEB887)
      );
      leg.position.set(x, 0.02, z);
      g.add(leg);
    }
  }
  return g;
}

function buildCoffeeTable(accent) {
  const g = new THREE.Group();
  // Top
  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.015, 16),
    toon(0xFFE4E1)
  );
  top.position.y = 0.12;
  g.add(top);
  // Legs (3 legs)
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.01, 0.12, 8),
      toon(0xDEB887)
    );
    leg.position.set(Math.cos(angle) * 0.06, 0.06, Math.sin(angle) * 0.06);
    g.add(leg);
  }
  // Mug
  const mug = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.03, 8),
    toon(accent)
  );
  mug.position.set(0.03, 0.145, 0.02);
  g.add(mug);
  return g;
}

function buildPlant(accent) {
  const g = new THREE.Group();
  // Pot
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.03, 0.08, 8),
    toon(accent)
  );
  pot.position.y = 0.04;
  g.add(pot);
  // Dirt
  const dirt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.038, 0.038, 0.01, 8),
    toon(0x8B4513)
  );
  dirt.position.y = 0.085;
  g.add(dirt);
  // Leaves (spheres)
  const leafColors = [0x4CAF50, 0x66BB6A, 0x81C784];
  for (let i = 0; i < 3; i++) {
    const leaf = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 8, 8),
      toon(leafColors[i])
    );
    leaf.position.set(
      (Math.random() - 0.5) * 0.04,
      0.12 + i * 0.03,
      (Math.random() - 0.5) * 0.04
    );
    g.add(leaf);
  }
  return g;
}

function buildComputer(accent) {
  const g = new THREE.Group();
  // Desk surface
  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.02, 0.2),
    toon(0xF5F5DC)
  );
  desk.position.y = 0.2;
  g.add(desk);
  // Legs
  for (const x of [-0.15, 0.15]) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.2, 0.18),
      toon(0xFFE4E1)
    );
    leg.position.set(x, 0.1, 0);
    g.add(leg);
  }
  // Monitor
  const monitor = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.15, 0.01),
    toon(0x1a1a2e)
  );
  monitor.position.set(0, 0.33, -0.05);
  g.add(monitor);
  // Screen glow
  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(0.19, 0.12, 0.005),
    new THREE.MeshToonMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.3 })
  );
  screen.position.set(0, 0.33, -0.043);
  g.add(screen);
  // Stand
  const stand = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.06, 0.03),
    toon(0xC0C0C0)
  );
  stand.position.set(0, 0.24, -0.05);
  g.add(stand);
  // Keyboard
  const kb = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.008, 0.05),
    toon(0xE0E0E0)
  );
  kb.position.set(0, 0.215, 0.04);
  g.add(kb);
  return g;
}

function buildBookshelf(accent) {
  const g = new THREE.Group();
  // Frame
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.4, 0.08),
    toon(0xF5F5DC)
  );
  frame.position.y = 0.2;
  g.add(frame);
  // Shelves
  for (const y of [0.12, 0.24, 0.36]) {
    const shelf = new THREE.Mesh(
      new THREE.BoxGeometry(0.19, 0.008, 0.078),
      toon(0xDEB887)
    );
    shelf.position.y = y;
    g.add(shelf);
  }
  // Books
  const bookColors = [accent, 0xFF69B4, 0x87CEEB, 0xE6E6FA, 0xFF6F61, 0xFFD700];
  let bi = 0;
  for (const y of [0.07, 0.18, 0.3]) {
    for (let i = 0; i < 2; i++) {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.08, 0.06),
        toon(bookColors[bi % bookColors.length])
      );
      book.position.set(-0.04 + i * 0.06, y, 0);
      g.add(book);
      bi++;
    }
  }
  return g;
}

function buildOfficeChair(accent) {
  const g = new THREE.Group();
  // Seat
  const seat = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.03, 16),
    toon(accent)
  );
  seat.position.y = 0.14;
  g.add(seat);
  // Back
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.12, 0.02),
    toon(accent)
  );
  back.position.set(0, 0.24, -0.04);
  g.add(back);
  // Pole
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.12, 8),
    toon(0xC0C0C0)
  );
  pole.position.y = 0.07;
  g.add(pole);
  // Base star
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const arm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.06, 8),
      toon(0xC0C0C0)
    );
    arm.rotation.z = Math.PI / 2;
    arm.rotation.y = angle;
    arm.position.set(Math.cos(angle) * 0.025, 0.01, Math.sin(angle) * 0.025);
    g.add(arm);
  }
  return g;
}

function buildBar(accent) {
  const g = new THREE.Group();
  // Cart body
  const cart = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.02, 0.12),
    toon(0xFFD700)
  );
  cart.position.y = 0.22;
  g.add(cart);
  // Lower shelf
  const lower = new THREE.Mesh(
    new THREE.BoxGeometry(0.23, 0.015, 0.1),
    toon(0xFFD700)
  );
  lower.position.y = 0.1;
  g.add(lower);
  // Legs
  for (const x of [-0.1, 0.1]) {
    for (const z of [-0.04, 0.04]) {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.006, 0.22, 8),
        toon(0xFFD700)
      );
      leg.position.set(x, 0.11, z);
      g.add(leg);
    }
  }
  // Bottles
  const bottleColors = [accent, 0xFF6F61, 0x87CEEB];
  for (let i = 0; i < 3; i++) {
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.015, 0.08, 8),
      toon(bottleColors[i])
    );
    bottle.position.set(-0.07 + i * 0.07, 0.28, 0);
    g.add(bottle);
  }
  // Glasses on lower shelf
  for (let i = 0; i < 2; i++) {
    const glass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.008, 0.035, 8),
      new THREE.MeshToonMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.6 })
    );
    glass.position.set(-0.03 + i * 0.06, 0.13, 0);
    g.add(glass);
  }
  return g;
}

function buildLoungeChair(accent) {
  const g = new THREE.Group();
  // Seat (angled back)
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.06, 0.2),
    toon(accent)
  );
  seat.position.y = 0.08;
  g.add(seat);
  // Back (angled)
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.18, 0.03),
    toon(accent)
  );
  back.position.set(0, 0.18, -0.085);
  back.rotation.x = -0.15;
  g.add(back);
  // Legs
  for (const x of [-0.07, 0.07]) {
    for (const z of [-0.07, 0.07]) {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.05, 8),
        toon(0xDEB887)
      );
      leg.position.set(x, 0.025, z);
      g.add(leg);
    }
  }
  // Cushion
  const cushion = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.08, 0.03),
    toon(0xFFB6C1)
  );
  cushion.position.set(0, 0.2, -0.06);
  cushion.rotation.x = -0.15;
  g.add(cushion);
  return g;
}

function buildSpeaker(accent) {
  const g = new THREE.Group();
  // Body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.2, 0.08),
    toon(0x1a1a2e)
  );
  body.position.y = 0.1;
  g.add(body);
  // Woofer
  const woofer = new THREE.Mesh(
    new THREE.CircleGeometry(0.025, 16),
    toon(accent)
  );
  woofer.position.set(0, 0.12, 0.042);
  g.add(woofer);
  // Tweeter
  const tweeter = new THREE.Mesh(
    new THREE.CircleGeometry(0.012, 16),
    toon(0xC0C0C0)
  );
  tweeter.position.set(0, 0.17, 0.042);
  g.add(tweeter);
  return g;
}
