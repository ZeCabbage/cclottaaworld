/* ============================================
   Inventory Manager — ES Module Port
   ============================================ */

import { gameState } from './gameState.js';

export const inventory = {
    /**
     * Add an item to the player's inventory.
     */
    addItem(item) {
        gameState.player.inventory.push({
            ...item,
            id: item.id || `item_${Date.now()}`,
            acquiredAt: Date.now(),
        });
    },

    /**
     * Remove an item by ID.
     */
    removeItem(itemId) {
        const idx = gameState.player.inventory.findIndex(i => i.id === itemId);
        if (idx !== -1) {
            gameState.player.inventory.splice(idx, 1);
            return true;
        }
        return false;
    },

    /**
     * Check if player has an item.
     */
    hasItem(itemId) {
        return gameState.player.inventory.some(i => i.id === itemId);
    },

    /**
     * Get all items of a type.
     */
    getItemsByType(type) {
        return gameState.player.inventory.filter(i => i.type === type);
    },
};
