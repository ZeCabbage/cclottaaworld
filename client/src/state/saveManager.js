/* ============================================
   Save Manager — ES Module Port
   localStorage persistence
   ============================================ */

import { gameState } from './gameState.js';

const SAVE_KEY = 'cclottaaWorld_save';
let autoSaveInterval = null;

export const saveManager = {
    save() {
        try {
            const data = {
                player: { ...gameState.player },
                savedAt: Date.now(),
                version: 2,
            };
            localStorage.setItem(SAVE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('[SaveManager] Save failed:', e);
            return false;
        }
    },

    load() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (!raw) return false;

            const data = JSON.parse(raw);
            if (data.player) {
                Object.assign(gameState.player, data.player);
                return true;
            }
            return false;
        } catch (e) {
            console.error('[SaveManager] Load failed:', e);
            localStorage.removeItem(SAVE_KEY);
            return false;
        }
    },

    startAutoSave(intervalMs = 30000) {
        if (autoSaveInterval) clearInterval(autoSaveInterval);
        autoSaveInterval = setInterval(() => {
            if (gameState.player.gameStarted) {
                this.save();
            }
        }, intervalMs);
    },

    stopAutoSave() {
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
            autoSaveInterval = null;
        }
    },

    clearSave() {
        localStorage.removeItem(SAVE_KEY);
    },

    deleteSave() {
        this.clearSave();
    },

    hasSave() {
        return !!localStorage.getItem(SAVE_KEY);
    },
};
