/* ============================================
   Game State Manager — ES Module Port
   Personal character with RPG-lite stats
   ============================================ */

export const gameState = {
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
        // Will be populated from legacy data during migration
        wallpapers: [],
        floors: [],
        posters: [],
        couches: [],
        rugs: [],
        lamps: [],
        bedSheets: [],
    },

    /* ---- Character customization options ---- */
    characterStyles: {
        skinTones: [],
        hairStyles: [],
        hairColors: [],
        outfits: [],
        shoeStyles: [],
        bottomTypes: [],
        lashColors: [],
        expressions: [],
    },

    createCharacter(options) {
        this.player.character = {
            name: options.name || 'Player',
            skinTone: options.skinTone || 'light',
            hairStyle: options.hairStyle || 'bob',
            hairColor: options.hairColor || 'black',
            outfit: options.outfit || 'casual',
            shoes: options.shoes || 'platform',
            bottomType: options.bottomType || 'pants',
            lashColor: options.lashColor || 'black',
            expression: options.expression || 'neutral',
            level: 1,
            xp: 0,
            mood: 100,
            hunger: 100,
            energy: 100,
            hygiene: 100,
        };
        this.player.gameStarted = true;
        return this.player.character;
    },

    _initCompat() {
        if (!Object.getOwnPropertyDescriptor(this.player, 'pet')) {
            Object.defineProperty(this.player, 'pet', {
                get: () => this.player.character,
                set: (val) => { this.player.character = val; },
                configurable: true,
            });
        }
    },

    addCoins(amount) {
        this.player.coins += amount;
        this.updateCoinDisplay();
        this.showCoinAnimation(amount);
    },

    removeCoins(amount) {
        if (this.player.coins >= amount) {
            this.player.coins -= amount;
            this.updateCoinDisplay();
            this.showCoinAnimation(-amount);
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
        anim.textContent = amount > 0 ? `+${amount}` : `${amount}`;
        anim.style.cssText = `position:absolute;color:${amount > 0 ? '#4caf50' : '#f44336'};font-weight:bold;font-size:14px;animation:coinPop 1s ease-out forwards;pointer-events:none;`;
        el.parentElement.style.position = 'relative';
        el.parentElement.appendChild(anim);
        setTimeout(() => anim.remove(), 1000);
    },

    updateAddressBar(path) {
        const el = document.getElementById('address-text');
        if (el) el.textContent = `http://www.cclottaaWorld.com/${path || ''}`;
    },

    updateStatus(text, icon = '✅') {
        const iconEl = document.getElementById('status-icon');
        const textEl = document.getElementById('status-text');
        if (iconEl) iconEl.textContent = icon;
        if (textEl) textEl.textContent = text;
    },

    getSkinHex(id) {
        const tone = this.characterStyles.skinTones.find(t => t.id === id);
        return tone ? tone.hex : '#FFDCB5';
    },

    getHairHex(id) {
        const color = this.characterStyles.hairColors.find(c => c.id === id);
        return color ? color.hex : '#1a1a1a';
    },
};
