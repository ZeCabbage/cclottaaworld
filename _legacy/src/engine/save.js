/* ============================================
   Save / Load Manager (localStorage)
   ============================================ */

const SaveManager = {
    SAVE_KEY: 'ccllottaaWorld_save',
    AUTO_SAVE_INTERVAL: 30000, // 30 seconds

    // Save game state
    save() {
        try {
            const data = {
                version: 3,
                timestamp: Date.now(),
                player: {
                    name: GameState.player.name,
                    coins: GameState.player.coins,
                    character: GameState.player.character,
                    inventory: GameState.player.inventory,
                    gameStarted: GameState.player.gameStarted,
                    totalPlayTime: GameState.player.totalPlayTime,
                    gamesPlayed: GameState.player.gamesPlayed,
                    itemsBought: GameState.player.itemsBought,
                },
                currentScreen: GameState.currentScreen,
            };
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('Save failed:', e);
            return false;
        }
    },

    // Load game state
    load() {
        try {
            const raw = localStorage.getItem(this.SAVE_KEY);
            if (!raw) return false;
            const data = JSON.parse(raw);
            if (!data || !data.player) return false;

            // Reject old saves (pet-based, pre-character)
            if (data.version < 3 || data.player.pet) {
                this.deleteSave();
                return false;
            }

            GameState.player.name = data.player.name || 'Player';
            GameState.player.coins = data.player.coins ?? 500;
            GameState.player.character = data.player.character || null;
            GameState.player.inventory = data.player.inventory || [];
            GameState.player.gameStarted = data.player.gameStarted || false;
            GameState.player.totalPlayTime = data.player.totalPlayTime || 0;
            GameState.player.gamesPlayed = data.player.gamesPlayed || 0;
            GameState.player.itemsBought = data.player.itemsBought || 0;

            GameState.updateCoinDisplay();
            return true;
        } catch (e) {
            console.warn('Load failed:', e);
            return false;
        }
    },

    // Check if save exists
    hasSave() {
        try {
            const raw = localStorage.getItem(this.SAVE_KEY);
            if (!raw) return false;
            const data = JSON.parse(raw);
            // Only consider v3+ saves with character data valid
            return !!(data && data.version >= 3 && data.player && data.player.character);
        } catch (e) {
            return false;
        }
    },

    // Delete save
    deleteSave() {
        localStorage.removeItem(this.SAVE_KEY);
    },

    // Auto-save (debounced)
    _autoSaveTimer: null,
    autoSave() {
        clearTimeout(this._autoSaveTimer);
        this._autoSaveTimer = setTimeout(() => {
            this.save();
            GameState.updateStatus('Auto-saved! 💾');
            setTimeout(() => GameState.updateStatus('Done'), 2000);
        }, 1000);
    },

    // Start periodic auto-save
    startAutoSave() {
        setInterval(() => {
            if (GameState.player.gameStarted) {
                this.save();
            }
        }, this.AUTO_SAVE_INTERVAL);
    }
};
