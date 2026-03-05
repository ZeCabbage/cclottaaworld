/* ============================================
   Inventory & Item Management — Evolution Edition
   Items boost stats, Chaos Drives, clothing renders ON pet
   ============================================ */

const InventoryManager = {
    items: {
        // --- CHAOS DRIVES (stat boosters) ---
        drive_power: {
            id: 'drive_power', name: 'Power Drive', emoji: '<span style="color:#FF4444;">●</span>', price: 20, category: 'drive', color: '#FF4444',
            desc: 'Red energy orb. Boosts Power stat.', statBoost: { power: 8 }, alignmentShift: 0
        },
        drive_run: {
            id: 'drive_run', name: 'Run Drive', emoji: '<span style="color:#33CC33;">●</span>', price: 20, category: 'drive', color: '#33CC33',
            desc: 'Green energy orb. Boosts Run stat.', statBoost: { run: 8 }, alignmentShift: 0
        },
        drive_fly: {
            id: 'drive_fly', name: 'Fly Drive', emoji: '<span style="color:#9933CC;">●</span>', price: 20, category: 'drive', color: '#9933CC',
            desc: 'Purple energy orb. Boosts Fly stat.', statBoost: { fly: 8 }, alignmentShift: 0
        },
        drive_swim: {
            id: 'drive_swim', name: 'Swim Drive', emoji: '<span style="color:#CCAA33;">●</span>', price: 20, category: 'drive', color: '#CCAA33',
            desc: 'Yellow energy orb. Boosts Swim stat.', statBoost: { swim: 8 }, alignmentShift: 0
        },

        // --- FOOD (restores hunger + boosts stamina, affects alignment) ---
        apple: {
            id: 'apple', name: 'Apple', emoji: '<span style="color:#FF4444;">o</span>', price: 10, category: 'food', power: 10,
            desc: 'Healthy & crunchy!', statBoost: { stamina: 2 }, alignmentShift: 2
        },
        pizza: {
            id: 'pizza', name: 'Pizza Slice', emoji: '<span style="color:#FFAA00;">▲</span>', price: 25, category: 'food', power: 20,
            desc: 'Yummy cheesy pizza!', statBoost: { stamina: 3 }, alignmentShift: 0
        },
        cake: {
            id: 'cake', name: 'Birthday Cake', emoji: '<span style="color:#FF69B4;">♦</span>', price: 50, category: 'food', power: 35,
            desc: 'A special treat!', statBoost: { stamina: 5 }, alignmentShift: 3
        },
        candy: {
            id: 'candy', name: 'Rainbow Candy', emoji: '<span style="color:#FF69B4;">◆</span>', price: 15, category: 'food', power: 12,
            desc: 'Sweet & colorful!', statBoost: { stamina: 1 }, alignmentShift: -1
        },
        icecream: {
            id: 'icecream', name: 'Ice Cream', emoji: '<span style="color:#EEDDCC;">▼</span>', price: 20, category: 'food', power: 18,
            desc: 'Cool & creamy!', statBoost: { stamina: 2, swim: 1 }, alignmentShift: 0
        },
        sushi: {
            id: 'sushi', name: 'Sushi Roll', emoji: '<span style="color:#FF6347;">◎</span>', price: 35, category: 'food', power: 25,
            desc: 'Fresh & fancy!', statBoost: { stamina: 4, swim: 2 }, alignmentShift: 2
        },
        cookie: {
            id: 'cookie', name: 'Cookie', emoji: '<span style="color:#CC8844;">○</span>', price: 8, category: 'food', power: 8,
            desc: 'Chocolate chip!', statBoost: { stamina: 1 }, alignmentShift: -1
        },
        stardust_fruit: {
            id: 'stardust_fruit', name: 'Stardust Fruit', emoji: '<span style="color:#FFD700;">★</span>', price: 80, category: 'food', power: 40,
            desc: 'Cosmic superfood! Boosts all stats.', statBoost: { stamina: 5, swim: 2, fly: 2, run: 2, power: 2 }, alignmentShift: 5
        },

        // --- TOYS (boost happiness + specific stats) ---
        ball: {
            id: 'ball', name: 'Bouncy Ball', emoji: '<span style="color:#FFFFFF;">●</span>', price: 30, category: 'toy', power: 15,
            desc: 'Boing boing!', statBoost: { run: 3 }, alignmentShift: 1
        },
        teddy: {
            id: 'teddy', name: 'Teddy Bear', emoji: '<span style="color:#8B4513;">♥</span>', price: 40, category: 'toy', power: 20,
            desc: 'Soft & cuddly!', statBoost: { stamina: 2 }, alignmentShift: 2
        },
        kite: {
            id: 'kite', name: 'Star Kite', emoji: '<span style="color:#FFD700;">◇</span>', price: 35, category: 'toy', power: 18,
            desc: 'Flies so high!', statBoost: { fly: 3 }, alignmentShift: 1
        },
        dumbbell: {
            id: 'dumbbell', name: 'Mini Dumbbell', emoji: '<span style="color:#888;">╬</span>', price: 45, category: 'toy', power: 12,
            desc: 'For strong pets!', statBoost: { power: 5 }, alignmentShift: 0
        },
        surfboard: {
            id: 'surfboard', name: 'Tiny Surfboard', emoji: '<span style="color:#00BFFF;">≋</span>', price: 45, category: 'toy', power: 15,
            desc: 'Ride the waves!', statBoost: { swim: 5 }, alignmentShift: 1
        },

        // --- MEDICINE ---
        bandaid: {
            id: 'bandaid', name: 'Band-Aid', emoji: '<span style="color:#FFAA77;">+</span>', price: 15, category: 'medicine', power: 20,
            desc: 'Fixes boo-boos!', statBoost: {}, alignmentShift: 1
        },
        vitamin: {
            id: 'vitamin', name: 'Vitamin Star', emoji: '<span style="color:#32CD32;">✦</span>', price: 30, category: 'medicine', power: 30,
            desc: 'Boosts all care stats!', statBoost: { stamina: 3 }, alignmentShift: 2
        },

        // --- CLOTHING (renders ON creature as SVG) ---
        hat_bow: {
            id: 'hat_bow', name: 'Pink Bow', emoji: '<span style="color:#FF69B4;">♡</span>', price: 60, category: 'clothing',
            rarity: 'common',
            desc: 'A delicate handcrafted bow. Simple but sweet.', renderData: { slot: 'head', type: 'bow', color: '#FF69B4', accent: '#FFD700' }
        },
        hat_crown: {
            id: 'hat_crown', name: 'Gold Crown', emoji: '<span style="color:#FFD700;">♛</span>', price: 150, category: 'clothing',
            rarity: 'legendary',
            desc: 'Forged from pure digital gold. Only true rulers wear this.', renderData: { slot: 'head', type: 'crown', color: '#FFD700', accent: '#FFA500' }
        },
        hat_flower: {
            id: 'hat_flower', name: 'Flower Crown', emoji: '<span style="color:#FF69B4;">✿</span>', price: 80, category: 'clothing',
            rarity: 'rare',
            desc: 'Woven from digital blossoms. Radiates natural aura.', renderData: { slot: 'head', type: 'flower', color: '#FF69B4', accent: '#FFD700' }
        },
        hat_tophat: {
            id: 'hat_tophat', name: 'Top Hat', emoji: '<span style="color:#333;">▓</span>', price: 120, category: 'clothing',
            rarity: 'epic',
            desc: 'Distinguished midnight velvet. For the truly elegant.', renderData: { slot: 'head', type: 'tophat', color: '#333333', accent: '#FFD700' }
        },
        glasses_round: {
            id: 'glasses_round', name: 'Round Glasses', emoji: '<span style="color:#666;">◎◎</span>', price: 70, category: 'clothing',
            rarity: 'rare',
            desc: 'Precision-lens frames. See the world in HD.', renderData: { slot: 'face', type: 'glasses_round', color: '#333333' }
        },
        glasses_star: {
            id: 'glasses_star', name: 'Star Glasses', emoji: '<span style="color:#FF69B4;">★★</span>', price: 90, category: 'clothing',
            rarity: 'epic',
            desc: 'Diamond-cut star lenses. You ARE the main character.', renderData: { slot: 'face', type: 'glasses_star', color: '#FF69B4' }
        },
        scarf_rainbow: {
            id: 'scarf_rainbow', name: 'Rainbow Scarf', emoji: '<span style="color:#FF4444;">≈</span>', price: 55, category: 'clothing',
            rarity: 'common',
            desc: 'Hand-knitted in seven colors. Keeps you warm.', renderData: { slot: 'neck', type: 'scarf', color: '#FF4444' }
        },
        pendant_star: {
            id: 'pendant_star', name: 'Star Pendant', emoji: '<span style="color:#FFD700;">☆</span>', price: 90, category: 'clothing',
            rarity: 'epic',
            desc: 'A fallen star fragment, captured in gold chain.', renderData: { slot: 'neck', type: 'pendant', color: '#FFD700', accent: '#FF69B4' }
        },
        cape: {
            id: 'cape', name: 'Hero Cape', emoji: '<span style="color:#CC3333;">▽</span>', price: 130, category: 'clothing',
            rarity: 'epic',
            desc: 'Crimson woven cape. Legends say it grants courage.', renderData: { slot: 'back', type: 'cape', color: '#CC3333' }
        },
        wings_angel: {
            id: 'wings_angel', name: 'Angel Wings', emoji: '<span style="color:#FFFFFF;">†</span>', price: 200, category: 'clothing',
            rarity: 'legendary',
            desc: 'Ethereal wings of pure light. The rarest item in ccllottaaWorld.', renderData: { slot: 'back', type: 'angel_wings', color: '#FFFFFF' }
        },
    },

    getItemDef(itemId) { return this.items[itemId] || null; },

    addItem(itemId) {
        const existing = GameState.player.inventory.find(i => i.id === itemId);
        if (existing) { existing.count++; }
        else { GameState.player.inventory.push({ id: itemId, count: 1 }); }
    },

    removeItem(itemId) {
        const idx = GameState.player.inventory.findIndex(i => i.id === itemId);
        if (idx === -1) return false;
        GameState.player.inventory[idx].count--;
        if (GameState.player.inventory[idx].count <= 0) GameState.player.inventory.splice(idx, 1);
        return true;
    },

    hasItem(itemId) { const i = GameState.player.inventory.find(i => i.id === itemId); return i && i.count > 0; },
    getItemCount(itemId) { const i = GameState.player.inventory.find(i => i.id === itemId); return i ? i.count : 0; },

    buyItem(itemId) {
        const def = this.getItemDef(itemId);
        if (!def) return { success: false, message: 'Item not found!' };
        if (GameState.player.coins < def.price) return { success: false, message: 'Not enough ccllottaaCoins!' };
        GameState.removeCoins(def.price);
        this.addItem(itemId);
        GameState.player.itemsBought++;
        SaveManager.autoSave();
        return { success: true, message: `You bought ${def.name}!` };
    },

    // Use an item (food/medicine/drive → apply stat boosts)
    useItem(itemId) {
        const def = this.getItemDef(itemId);
        if (!def || !this.hasItem(itemId)) return { success: false, boosted: 0 };
        const pet = GameState.player.pet;
        if (!pet) return { success: false, boosted: 0 };
        let totalBoosted = 0;

        if (def.category === 'food') {
            PetEngine.feed(pet, def);
            if (def.statBoost) totalBoosted = PetEngine.boostStats(pet, def.statBoost) || 0;
            this.removeItem(itemId);
            return { success: true, boosted: totalBoosted };
        }
        if (def.category === 'drive') {
            if (def.statBoost) totalBoosted = PetEngine.boostStats(pet, def.statBoost) || 0;
            this.removeItem(itemId);
            return { success: true, boosted: totalBoosted };
        }
        if (def.category === 'toy') {
            pet.happiness = Math.min(100, pet.happiness + def.power);
            if (def.statBoost) totalBoosted = PetEngine.boostStats(pet, def.statBoost) || 0;
            if (def.alignmentShift) pet.alignment = Math.max(-100, Math.min(100, pet.alignment + def.alignmentShift));
            PetEngine.updateMood(pet);
            return { success: true, boosted: totalBoosted };
        }
        if (def.category === 'medicine') {
            pet.hunger = Math.min(100, pet.hunger + def.power / 3);
            pet.happiness = Math.min(100, pet.happiness + def.power / 3);
            pet.energy = Math.min(100, pet.energy + def.power / 3);
            if (def.statBoost) totalBoosted = PetEngine.boostStats(pet, def.statBoost) || 0;
            PetEngine.updateMood(pet);
            this.removeItem(itemId);
            return { success: true, boosted: totalBoosted };
        }
        return { success: false, boosted: 0 };
    },

    toggleEquip(itemId) {
        const pet = GameState.player.pet;
        if (!pet) return;
        const idx = pet.equippedItems.indexOf(itemId);
        if (idx === -1) {
            // Check if same slot already occupied
            const def = this.getItemDef(itemId);
            if (def && def.renderData) {
                pet.equippedItems = pet.equippedItems.filter(id => {
                    const d = this.getItemDef(id);
                    return !d || !d.renderData || d.renderData.slot !== def.renderData.slot;
                });
            }
            pet.equippedItems.push(itemId);
        } else {
            pet.equippedItems.splice(idx, 1);
        }
        SaveManager.autoSave();
    },

    getItemsByCategory(cat) { return Object.values(this.items).filter(i => i.category === cat); },
};
