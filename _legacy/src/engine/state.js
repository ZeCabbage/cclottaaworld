/* ============================================
   Game State Manager — Character Edition
   Personal character with RPG-lite stats
   ============================================ */

const GameState = {
  currentScreen: 'title',
  previousScreen: null,

  player: {
    name: 'Player',
    coins: 500,
    character: null,
    inventory: [],
    gameStarted: false,
    totalPlayTime: 0,
    gamesPlayed: 0,
    itemsBought: 0,
    apartment: {
      wallpaper: 'lavender',
      floor: 'pink_checker',
      poster1: 'anime',
      poster2: 'band',
      couch: 'purple',
      rug: 'round_pink',
      lamp: 'pink',
      bedSheet: 'galaxy',
    },
  },

  /* ---- Apartment room customization options ---- */
  roomStyles: {
    wallpapers: [
      { id: 'lavender', name: 'Lavender', color: '#c8b8e8', pattern: 'linear-gradient(180deg, #c8b8e8 0%, #b0a0d8 100%)' },
      { id: 'sakura', name: 'Sakura', color: '#f0c8d8', pattern: 'radial-gradient(6px 6px at 20% 30%, #ffaacc55 50%, transparent 50%), radial-gradient(4px 4px at 60% 15%, #ffaacc44 50%, transparent 50%), radial-gradient(5px 5px at 80% 60%, #ffaacc33 50%, transparent 50%), radial-gradient(3px 3px at 35% 75%, #ffaacc44 50%, transparent 50%), linear-gradient(#f0c8d8, #e8b8d0)' },
      { id: 'mint', name: 'Mint', color: '#b8e8d8', pattern: 'linear-gradient(180deg, #b8e8d8 0%, #98d8c8 100%)' },
      { id: 'sunset', name: 'Sunset', color: '#e8c0a8', pattern: 'linear-gradient(180deg, #e8c0a8 0%, #d8a888 50%, #c89878 100%)' },
      { id: 'neon', name: 'Neon', color: '#2a1040', pattern: 'linear-gradient(180deg, #3a1555 0%, #2a1040 100%)' },
      { id: 'sky', name: 'Sky', color: '#a8c8f0', pattern: 'radial-gradient(80px 40px at 30% 25%, #ffffff44 0%, transparent 100%), radial-gradient(60px 30px at 70% 40%, #ffffff33 0%, transparent 100%), linear-gradient(#a8c8f0, #88b0e0)' },
      { id: 'brick', name: 'Brick', color: '#c89878', pattern: 'repeating-linear-gradient(0deg, transparent 0px, transparent 18px, #b0886822 18px, #b0886822 20px), repeating-linear-gradient(90deg, #c89878 0px, #c89878 30px, #b0886822 30px, #b0886822 32px)' },
      { id: 'dark', name: 'Dark', color: '#2a2035', pattern: 'linear-gradient(180deg, #2a2035 0%, #1a1025 100%)' },
    ],
    floors: [
      { id: 'pink_checker', name: 'Pink Check', color: '#d8a8c0', pattern: 'repeating-conic-gradient(#d8a8c0 0% 25%, #c898b0 0% 50%) 0 0 / 28px 28px' },
      { id: 'hardwood', name: 'Hardwood', color: '#c8a878', pattern: 'repeating-linear-gradient(90deg, #c8a878 0px, #d8b888 4px, #c8a878 8px, #b89868 12px)' },
      { id: 'carpet', name: 'Carpet', color: '#b898c8', pattern: 'radial-gradient(circle, #c8a8d844 1px, transparent 1px), linear-gradient(#b898c8, #b898c8)', patternSize: '8px 8px' },
      { id: 'tile', name: 'Tile', color: '#88c8c8', pattern: 'repeating-linear-gradient(0deg, transparent 0px, transparent 28px, #ffffff22 28px, #ffffff22 30px), repeating-linear-gradient(90deg, #88c8c8 0px, #88c8c8 28px, #ffffff22 28px, #ffffff22 30px)' },
      { id: 'concrete', name: 'Concrete', color: '#989898', pattern: 'linear-gradient(180deg, #989898 0%, #888888 100%)' },
      { id: 'tatami', name: 'Tatami', color: '#c8b888', pattern: 'repeating-linear-gradient(0deg, #c8b888 0px, #d0c090 2px, #c8b888 4px)' },
    ],
    posters: [
      { id: 'none', name: 'Empty', emoji: '⬜' },
      { id: 'band', name: 'Band', emoji: '🎸' },
      { id: 'anime', name: 'Anime', emoji: '🌸' },
      { id: 'abstract', name: 'Abstract', emoji: '🎨' },
      { id: 'city', name: 'City', emoji: '🌃' },
      { id: 'vinyl', name: 'Records', emoji: '💿' },
    ],
    couches: [
      { id: 'purple', name: 'Purple', color: '#9868b8' },
      { id: 'pink', name: 'Pink', color: '#d878a8' },
      { id: 'teal', name: 'Teal', color: '#68b8b8' },
      { id: 'red', name: 'Red', color: '#c86868' },
      { id: 'cream', name: 'Cream', color: '#d8c8a8' },
      { id: 'noir', name: 'Noir', color: '#484848' },
    ],
    rugs: [
      { id: 'none', name: 'None', color: 'transparent' },
      { id: 'round_pink', name: 'Pink', color: '#d898b8' },
      { id: 'round_teal', name: 'Teal', color: '#88c8b8' },
      { id: 'shag', name: 'Shag', color: '#c8b898' },
    ],
    lamps: [
      { id: 'pink', name: 'Pink', color: '#ff88bb' },
      { id: 'neon', name: 'Neon', color: '#cc88ff' },
      { id: 'warm', name: 'Warm', color: '#ffcc88' },
      { id: 'cool', name: 'Cool', color: '#88ccff' },
      { id: 'green', name: 'Mint', color: '#88ffcc' },
    ],
    bedSheets: [
      { id: 'galaxy', name: 'Galaxy', color: '#6848a8', pattern: 'linear-gradient(135deg, #4838a8 0%, #6848a8 40%, #8858c8 70%, #4838a8 100%)' },
      { id: 'pink_stripe', name: 'Pink Stripe', color: '#d888a8', pattern: 'repeating-linear-gradient(0deg, #d888a8 0px, #d888a8 4px, #e898b8 4px, #e898b8 8px)' },
      { id: 'floral', name: 'Floral', color: '#c8e8d8', pattern: 'radial-gradient(6px 6px at 25% 25%, #ff99bb55 50%, transparent 50%), radial-gradient(4px 4px at 75% 50%, #ff99bb44 50%, transparent 50%), linear-gradient(#c8e8d8, #b8d8c8)' },
      { id: 'plaid', name: 'Plaid', color: '#8888c8', pattern: 'repeating-linear-gradient(0deg, transparent 0px, transparent 8px, #9898d822 8px, #9898d822 10px), repeating-linear-gradient(90deg, #8888c8 0px, #8888c8 8px, #9898d822 8px, #9898d822 10px)' },
      { id: 'plain_white', name: 'White', color: '#e8e8f0', pattern: 'linear-gradient(#e8e8f0, #d8d8e8)' },
    ],
  },

  /* ---- Character customization options ---- */
  characterStyles: {
    skinTones: [
      { id: 'light', hex: '#FFDCB5', name: 'Light' },
      { id: 'fair', hex: '#F0C8A0', name: 'Fair' },
      { id: 'medium', hex: '#D4A574', name: 'Medium' },
      { id: 'tan', hex: '#C68E5B', name: 'Tan' },
      { id: 'brown', hex: '#8D5524', name: 'Brown' },
      { id: 'dark', hex: '#5C3A1E', name: 'Dark' },
      { id: 'deep', hex: '#3B2210', name: 'Deep' },
      { id: 'pale', hex: '#FFE8D6', name: 'Pale' },
    ],

    hairStyles: [
      { id: 'short', name: 'Short' },
      { id: 'long', name: 'Long' },
      { id: 'spiky', name: 'Spiky' },
      { id: 'curly', name: 'Curly' },
      { id: 'ponytail', name: 'Ponytail' },
      { id: 'bob', name: 'Bob' },
      { id: 'twintails', name: 'Twintails' },
      { id: 'mohawk', name: 'Mohawk' },
      { id: 'sidetail', name: 'Sidetail' },
      { id: 'messy', name: 'Messy' },
      { id: 'flowing', name: 'Flowing' },
      { id: 'bald', name: 'Bald' },
    ],

    hairColors: [
      { id: 'black', hex: '#1a1a1a', name: 'Black' },
      { id: 'brown', hex: '#5C3317', name: 'Brown' },
      { id: 'blonde', hex: '#DAA520', name: 'Blonde' },
      { id: 'red', hex: '#8B2500', name: 'Red' },
      { id: 'white', hex: '#CCCCCC', name: 'White' },
      { id: 'blue', hex: '#4488DD', name: 'Blue' },
      { id: 'pink', hex: '#CC4488', name: 'Pink' },
      { id: 'green', hex: '#228844', name: 'Green' },
      { id: 'pastel_pink', hex: '#FFB6C1', name: 'Pastel Pink' },
      { id: 'sky_blue', hex: '#87CEEB', name: 'Sky Blue' },
      { id: 'mint', hex: '#98FB98', name: 'Mint' },
      { id: 'lavender', hex: '#B0A0D4', name: 'Lavender' },
      { id: 'coral', hex: '#FF7F50', name: 'Coral' },
    ],

    eyeColors: [
      { id: 'brown', hex: '#4A2800', name: 'Brown' },
      { id: 'blue', hex: '#2266CC', name: 'Blue' },
      { id: 'green', hex: '#228833', name: 'Green' },
      { id: 'hazel', hex: '#8B7355', name: 'Hazel' },
      { id: 'gray', hex: '#666677', name: 'Gray' },
      { id: 'violet', hex: '#6622AA', name: 'Violet' },
      { id: 'amethyst', hex: '#9966CC', name: 'Amethyst' },
      { id: 'ruby', hex: '#CC2244', name: 'Ruby' },
    ],

    outfits: [
      { id: 'casual', name: 'Casual', torsoColor: '#6688AA', legColor: '#445566', accentColor: '#8899BB', label: 'Casual' },
      { id: 'preppy', name: 'Preppy', torsoColor: '#4CAF50', legColor: '#EEEEEE', accentColor: '#FFD54F', label: 'Preppy', stockingColor: '#5588CC' },
      { id: 'streetpunk', name: 'Street', torsoColor: '#FFD54F', legColor: '#555555', accentColor: '#E65100', label: 'Street' },
      { id: 'idol', name: 'Idol', torsoColor: '#F48FB1', legColor: '#CE93D8', accentColor: '#FFFFFF', label: 'Idol', stockingColor: '#F48FB1' },
      { id: 'explorer', name: 'Explorer', torsoColor: '#2E7D32', legColor: '#3E50B4', accentColor: '#EEEEEE', label: 'Explorer' },
      { id: 'sporty', name: 'Sporty', torsoColor: '#E53935', legColor: '#333333', accentColor: '#FFFFFF', label: 'Sporty' },
      { id: 'cozy', name: 'Cozy', torsoColor: '#FFAB91', legColor: '#8D6E63', accentColor: '#FFE0B2', label: 'Cozy' },
      { id: 'school', name: 'School', torsoColor: '#1565C0', legColor: '#37474F', accentColor: '#FFFFFF', label: 'School', stockingColor: '#1565C0' },
    ],

    shoeStyles: [
      { id: 'platform', name: 'Platforms' },
      { id: 'sneakers', name: 'Sneakers' },
      { id: 'chunky_sandals', name: 'Sandals' },
    ],

    bottomTypes: [
      { id: 'pants', name: 'Pants' },
      { id: 'long_skirt', name: 'Long Skirt' },
      { id: 'mini_skirt', name: 'Mini Skirt' },
      { id: 'mini_shorts', name: 'Mini Shorts' },
      { id: 'jorts', name: 'Jorts' },
      { id: 'culottes', name: 'Culottes' },
      { id: 'overalls', name: 'Overalls' },
    ],

    lashStyles: [
      { id: 'natural', name: 'Natural' },
      { id: 'long', name: 'Long Lashes' },
      { id: 'dark', name: 'Dark Lashes' },
      { id: 'brown', name: 'Brown Lashes' },
    ],

    expressions: [
      { id: 'neutral', name: 'Neutral' },
      { id: 'happy', name: 'Happy' },
      { id: 'fierce', name: 'Fierce' },
      { id: 'sleepy', name: 'Sleepy' },
    ],
  },

  /* ---- Create a character from creator choices ---- */
  createCharacter(options) {
    return {
      name: options.name || 'Stranger',
      // Appearance
      skinTone: options.skinTone || 'medium',
      hairStyle: options.hairStyle || 'short',
      hairColor: options.hairColor || 'black',
      eyeColor: options.eyeColor || 'brown',
      outfit: options.outfit || 'casual',
      shoeStyle: options.shoeStyle || 'platform',
      bottomType: options.bottomType || 'pants',
      lashStyle: options.lashStyle || 'natural',
      expression: options.expression || 'neutral',
      blush: options.blush || false,
      // RPG-lite stats (0-999 each)
      stats: { strength: 0, speed: 0, intelligence: 0, charisma: 0, stamina: 0 },
      // Level & XP
      level: 1,
      totalXP: 0,
      // Equipped items (wearables from fashion shop, etc.)
      equippedItems: [],
      // Meta
      mood: 'neutral',
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };
  },

  // --- backward compat bridge ---
  // Many screens reference player.pet — alias to character via Object.defineProperty
  _initCompat() {
    Object.defineProperty(this.player, 'pet', {
      get: () => this.player.character,
      set: (val) => { this.player.character = val; },
      enumerable: false,
      configurable: true,
    });
  },

  /* ---- Economy ---- */
  addCoins(amount) {
    this.player.coins += amount;
    this.updateCoinDisplay();
    this.showCoinAnimation(amount);
  },

  removeCoins(amount) {
    if (this.player.coins >= amount) {
      this.player.coins -= amount;
      this.updateCoinDisplay();
      return true;
    }
    return false;
  },

  updateCoinDisplay() {
    const el = document.getElementById('coin-display');
    if (el) el.textContent = this.player.coins;
  },

  showCoinAnimation(amount) {
    const el = document.getElementById('coin-display');
    if (!el) return;
    const anim = document.createElement('span');
    anim.textContent = (amount > 0 ? '+' : '') + amount;
    anim.style.cssText = `position: absolute; color: ${amount > 0 ? '#32CD32' : '#FF6347'}; font-family: var(--font-pixel); font-size: 10px; pointer-events: none; animation: float-up 1.5s ease-out forwards;`;
    el.parentElement.style.position = 'relative';
    el.parentElement.appendChild(anim);
    setTimeout(() => anim.remove(), 1500);
  },

  updateAddressBar(path) {
    const el = document.getElementById('address-text');
    if (el) el.textContent = `http://www.ccllottaaWorld.com/${path}`;
  },

  updateStatus(text, icon = '✅') {
    const textEl = document.getElementById('status-text');
    const iconEl = document.getElementById('status-icon');
    if (textEl) textEl.textContent = text;
    if (iconEl) iconEl.textContent = icon;
  },

  /* ---- Helpers for skin/hair lookups ---- */
  getSkinHex(id) {
    const s = this.characterStyles.skinTones.find(t => t.id === id);
    return s ? s.hex : '#D4A574';
  },
  getHairHex(id) {
    const h = this.characterStyles.hairColors.find(c => c.id === id);
    return h ? h.hex : '#1a1a1a';
  },
  getEyeHex(id) {
    const e = this.characterStyles.eyeColors.find(c => c.id === id);
    return e ? e.hex : '#4A2800';
  },
  getOutfit(id) {
    return this.characterStyles.outfits.find(o => o.id === id) || this.characterStyles.outfits[0];
  },
};
