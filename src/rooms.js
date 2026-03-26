// ── Room definitions: themes, colors, furniture, and project links ──

export const ROOM_DEFS = [
  // ── TOP ROW (floor 2) ──
  {
    id: 'beauty-room',
    label: 'Beauty Room',
    floor: 1, col: 0,
    wallColor: 0xFFB6C1, // light pink
    floorColor: 0xFFC0CB,
    accentColor: 0xFF69B4,
    furniture: [
      {
        id: 'vanity',
        type: 'vanity',
        label: 'Vanity Mirror',
        hint: 'Kerastase Campaign',
        projectId: 'kerastase',
        position: [0, 0, -0.3],
      },
      {
        id: 'perfume',
        type: 'perfume',
        label: 'Perfume Collection',
        hint: 'Fragrance Brief',
        projectId: 'fragrance',
        position: [-0.6, 0, 0.2],
      },
      {
        id: 'chair-beauty',
        type: 'pouf',
        label: 'Beauty Chair',
        hint: null,
        projectId: null,
        position: [0.3, 0, 0.3],
      },
    ],
  },
  {
    id: 'bathroom',
    label: 'Bathroom',
    floor: 1, col: 1,
    wallColor: 0x87CEEB, // baby blue
    floorColor: 0xB0E0E6,
    accentColor: 0x4FC3F7,
    furniture: [
      {
        id: 'bathtub',
        type: 'bathtub',
        label: 'Bathtub',
        hint: 'Gillette Campaign',
        projectId: 'gillette',
        position: [0, 0, -0.2],
      },
      {
        id: 'sink',
        type: 'sink',
        label: 'Sink',
        hint: null,
        projectId: null,
        position: [-0.55, 0, 0.25],
      },
      {
        id: 'towel-rack',
        type: 'towelrack',
        label: 'Towel Rack',
        hint: null,
        projectId: null,
        position: [0.6, 0, -0.35],
      },
    ],
  },
  {
    id: 'studio',
    label: 'Creative Studio',
    floor: 1, col: 2,
    wallColor: 0xE6E6FA, // lavender
    floorColor: 0xD8BFD8,
    accentColor: 0xBA68C8,
    furniture: [
      {
        id: 'desk',
        type: 'desk',
        label: 'Creative Desk',
        hint: 'Nike Campaign',
        projectId: 'nike',
        position: [0, 0, -0.3],
      },
      {
        id: 'lamp',
        type: 'floorlamp',
        label: 'Floor Lamp',
        hint: null,
        projectId: null,
        position: [-0.55, 0, -0.3],
      },
      {
        id: 'moodboard',
        type: 'moodboard',
        label: 'Mood Board',
        hint: 'Art Direction',
        projectId: 'artdirection',
        position: [0.5, 0, 0.1],
      },
    ],
  },

  // ── BOTTOM ROW (floor 1) ──
  {
    id: 'living-room',
    label: 'Living Room',
    floor: 0, col: 0,
    wallColor: 0xFF6F61, // coral
    floorColor: 0xE8967D,
    accentColor: 0xFF4444,
    furniture: [
      {
        id: 'sofa',
        type: 'sofa',
        label: 'Sofa',
        hint: 'Coca-Cola Campaign',
        projectId: 'cocacola',
        position: [0, 0, -0.25],
      },
      {
        id: 'coffee-table',
        type: 'coffeetable',
        label: 'Coffee Table',
        hint: null,
        projectId: null,
        position: [0, 0, 0.25],
      },
      {
        id: 'plant',
        type: 'plant',
        label: 'Plant',
        hint: null,
        projectId: null,
        position: [0.6, 0, -0.35],
      },
    ],
  },
  {
    id: 'office',
    label: 'Office',
    floor: 0, col: 1,
    wallColor: 0xFFD700, // gold-ish
    floorColor: 0xF5DEB3,
    accentColor: 0xFFA000,
    furniture: [
      {
        id: 'computer',
        type: 'computer',
        label: 'Computer',
        hint: 'About Us',
        projectId: 'about',
        position: [0, 0, -0.3],
      },
      {
        id: 'bookshelf',
        type: 'bookshelf',
        label: 'Bookshelf',
        hint: 'Our CV',
        projectId: 'cv',
        position: [0.6, 0, -0.1],
      },
      {
        id: 'office-chair',
        type: 'officechair',
        label: 'Chair',
        hint: null,
        projectId: null,
        position: [0, 0, 0.15],
      },
    ],
  },
  {
    id: 'lounge',
    label: 'Lounge',
    floor: 0, col: 2,
    wallColor: 0xFF00FF, // magenta
    floorColor: 0xDA70D6,
    accentColor: 0xE040FB,
    furniture: [
      {
        id: 'bar',
        type: 'bar',
        label: 'Bar Cart',
        hint: 'Aperol Campaign',
        projectId: 'aperol',
        position: [-0.4, 0, -0.25],
      },
      {
        id: 'lounge-chair',
        type: 'loungechair',
        label: 'Lounge Chair',
        hint: null,
        projectId: null,
        position: [0.3, 0, 0.1],
      },
      {
        id: 'speaker',
        type: 'speaker',
        label: 'Speaker',
        hint: null,
        projectId: null,
        position: [0.6, 0, -0.35],
      },
    ],
  },
];
