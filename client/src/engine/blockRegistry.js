/* ============================================
   Block Registry — Extensible voxel block types
   New blocks can be added without touching
   the meshing or rendering code.
   ============================================ */

const blocks = new Map();

/**
 * @typedef {object} BlockDef
 * @property {number} id - Unique numeric ID (1-255, 0 = air)
 * @property {string} name - Human-readable name
 * @property {[number,number,number]} color - RGB 0-1 range
 * @property {boolean} [transparent=false] - Whether faces behind are visible
 * @property {boolean} [emissive=false] - Self-lit (neon signs, etc.)
 * @property {number} [emissiveIntensity=0] - Glow strength
 * @property {string} [category='natural'] - 'natural', 'urban', 'neon', 'interior'
 */

export const blockRegistry = {
    /**
     * Register a block type.
     * @param {BlockDef} def
     */
    register(def) {
        if (!def.id || def.id < 1 || def.id > 255) {
            throw new Error(`Block ID must be 1-255, got ${def.id}`);
        }
        blocks.set(def.id, {
            transparent: false,
            emissive: false,
            emissiveIntensity: 0,
            category: 'natural',
            ...def,
        });
    },

    get(id) {
        return blocks.get(id) || null;
    },

    getAll() {
        return [...blocks.values()];
    },

    getByCategory(category) {
        return [...blocks.values()].filter(b => b.category === category);
    },

    /**
     * Get color as a CSS string for UI display.
     */
    getCSSColor(id) {
        const b = blocks.get(id);
        if (!b) return '#000';
        return `rgb(${Math.round(b.color[0] * 255)}, ${Math.round(b.color[1] * 255)}, ${Math.round(b.color[2] * 255)})`;
    },
};

/* ---- Register default block types ---- */
const defaults = [
    { id: 1, name: 'Stone', color: [0.5, 0.5, 0.5], category: 'natural' },
    { id: 2, name: 'Dirt', color: [0.45, 0.3, 0.15], category: 'natural' },
    { id: 3, name: 'Grass', color: [0.2, 0.55, 0.15], category: 'natural' },
    { id: 4, name: 'Concrete', color: [0.6, 0.58, 0.55], category: 'urban' },
    { id: 5, name: 'Brick', color: [0.6, 0.25, 0.2], category: 'urban' },
    { id: 6, name: 'Glass', color: [0.7, 0.85, 0.95], category: 'urban', transparent: true },
    { id: 7, name: 'Neon', color: [0.9, 0.2, 0.8], category: 'neon', emissive: true, emissiveIntensity: 0.8 },
    { id: 8, name: 'Asphalt', color: [0.2, 0.2, 0.22], category: 'urban' },
    { id: 9, name: 'Wood', color: [0.55, 0.35, 0.2], category: 'interior' },
    { id: 10, name: 'Metal', color: [0.45, 0.48, 0.52], category: 'urban' },
    { id: 11, name: 'Neon Cyan', color: [0, 1, 1], category: 'neon', emissive: true, emissiveIntensity: 1.0 },
    { id: 12, name: 'Neon Magenta', color: [1, 0, 1], category: 'neon', emissive: true, emissiveIntensity: 1.0 },
    { id: 13, name: 'Neon Green', color: [0.22, 1, 0.08], category: 'neon', emissive: true, emissiveIntensity: 1.0 },
    { id: 14, name: 'Dark Glass', color: [0.15, 0.15, 0.2], category: 'urban', transparent: true },
    { id: 15, name: 'Cobblestone', color: [0.35, 0.33, 0.3], category: 'urban' },
];

for (const d of defaults) {
    blockRegistry.register(d);
}
