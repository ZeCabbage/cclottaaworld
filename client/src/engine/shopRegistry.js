/* ============================================
   Shop Registry — Data-driven shop definitions
   New shops are added via config, not code.
   ============================================ */

const shops = new Map();

/**
 * @typedef {object} ShopDef
 * @property {string} id - Unique identifier
 * @property {string} name - Display name
 * @property {string} icon - Emoji icon
 * @property {string} description - Short tagline
 * @property {string} themeColor - CSS neon accent color var name (e.g., '--neon-magenta')
 * @property {string} screenId - Screen to navigate to
 * @property {string} category - 'retail', 'service', 'entertainment', 'nature'
 * @property {Array} items - Available items for purchase
 * @property {object} [position] - Town map position { x, z }
 * @property {object} [building] - Building visual config { width, height, depth, style }
 * @property {function} [plugin] - Optional custom render plugin
 */

export const shopRegistry = {
    register(def) {
        shops.set(def.id, {
            items: [],
            category: 'retail',
            ...def,
        });
    },

    get(id) {
        return shops.get(id) || null;
    },

    getAll() {
        return [...shops.values()];
    },

    getByCategory(category) {
        return [...shops.values()].filter(s => s.category === category);
    },

    list() {
        return [...shops.keys()];
    },
};

/* ---- Register default shops ---- */
const defaultShops = [
    {
        id: 'shopFashion',
        name: 'Fashion Studio',
        icon: '👗',
        description: 'Style your character with the latest looks',
        themeColor: '--neon-magenta',
        screenId: 'shopFashion',
        category: 'retail',
        position: { x: -30, z: -10 },
        building: { width: 12, height: 18, depth: 10, style: 'glass_tower' },
    },
    {
        id: 'shopArcade',
        name: 'Arcade',
        icon: '🕹️',
        description: 'Play games and win prizes',
        themeColor: '--neon-cyan',
        screenId: 'shopArcade',
        category: 'entertainment',
        position: { x: 20, z: -15 },
        building: { width: 14, height: 14, depth: 12, style: 'brutalist' },
    },
    {
        id: 'shopPark',
        name: 'City Park',
        icon: '🌳',
        description: 'Relax and play with your creature',
        themeColor: '--neon-green',
        screenId: 'shopPark',
        category: 'nature',
        position: { x: 40, z: 20 },
        building: { width: 20, height: 6, depth: 20, style: 'open' },
    },
    {
        id: 'shopFortune',
        name: 'Psychiatrist',
        icon: '🔮',
        description: 'Discover your inner self',
        themeColor: '--neon-purple',
        screenId: 'shopFortune',
        category: 'service',
        position: { x: -40, z: 15 },
        building: { width: 10, height: 16, depth: 10, style: 'clinical' },
    },
    {
        id: 'shopVinyl',
        name: 'Vinyl Store',
        icon: '💿',
        description: 'Browse records and discover music',
        themeColor: '--neon-orange',
        screenId: 'shopVinyl',
        category: 'retail',
        position: { x: 15, z: 25 },
        building: { width: 10, height: 10, depth: 8, style: 'retro' },
    },
    {
        id: 'shopWork',
        name: 'Work Office',
        icon: '💼',
        description: 'Earn coins at your part-time job',
        themeColor: '--neon-blue',
        screenId: 'shopWork',
        category: 'service',
        position: { x: -20, z: 30 },
        building: { width: 16, height: 24, depth: 14, style: 'brutalist' },
    },
    {
        id: 'shopCafe',
        name: 'Café',
        icon: '☕',
        description: 'Grab a drink and restore energy',
        themeColor: '--neon-yellow',
        screenId: 'shopCafe',
        category: 'service',
        position: { x: 30, z: -5 },
        building: { width: 10, height: 8, depth: 8, style: 'cozy' },
    },
    {
        id: 'shopGarden',
        name: 'Night Garden',
        icon: '🌙',
        description: 'A moonlit park to explore',
        themeColor: '--neon-green',
        screenId: 'shopGarden',
        category: 'nature',
        position: { x: -10, z: -35 },
        building: { width: 18, height: 4, depth: 18, style: 'garden' },
    },
];

for (const shop of defaultShops) {
    shopRegistry.register(shop);
}
