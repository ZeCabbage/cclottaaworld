/* ============================================
   Character Profile Screen (was PetViewScreen)
   3D character view + stats + equipped items
   ============================================ */

const PetViewScreen = {
  _preview: null,

  render() {
    this.cleanup3D();

    const container = document.getElementById('screen-container');
    const character = GameState.player.character;

    if (!character) {
      container.innerHTML = `
        <div style="padding: 32px; text-align: center;">
          <p style="color: rgba(255,255,255,0.7);">No character created yet.</p>
          <button class="retro-btn fun" onclick="App.navigateTo('select')" style="margin-top: 16px;">Create Character</button>
        </div>`;
      return;
    }

    const has3D = typeof VoxelCreatures !== 'undefined' && typeof THREE !== 'undefined';

    container.innerHTML = `
      <div style="padding: 16px; background: linear-gradient(180deg, #0a0020 0%, #1a0a3e 50%, #0a0020 100%); min-height: 100%;">

        <!-- Character Name & Level -->
        <div style="text-align: center; margin-bottom: 12px;">
          <h1 class="pixel-text" style="font-size: 14px; color: #FFD700;">${character.name}</h1>
          <div style="margin-top: 6px;">${PetEngine.renderLevelBadge(character)}</div>
        </div>

        <!-- 3D Preview -->
        ${has3D ? `
          <div id="profile-3d-view" class="voxel-viewport" style="height: 250px; border-radius: 12px; overflow: hidden; max-width: 400px; margin: 0 auto;"></div>
          <div style="text-align: center; margin-top: 4px;">
            <span style="font-size: 10px; color: rgba(255,255,255,0.3);">Drag to rotate</span>
          </div>
        ` : `
          <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">
            <p style="font-size: 48px;">🧍</p>
            <p>${character.name}</p>
          </div>
        `}

        <!-- Stats -->
        <div class="glass-panel" style="max-width: 500px; margin: 16px auto; padding: 16px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
          <h3 class="pixel-text" style="font-size: 10px; color: rgba(255,255,255,0.5); margin-bottom: 10px;">// Stats</h3>
          ${PetEngine.renderStatBars(character)}
        </div>

        <!-- Equipped Items -->
        <div class="glass-panel" style="max-width: 500px; margin: 12px auto; padding: 16px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
          <h3 class="pixel-text" style="font-size: 10px; color: rgba(255,255,255,0.5); margin-bottom: 10px;">// Equipped</h3>
          ${this.renderEquipped(character)}
        </div>

        <!-- Actions -->
        <div style="text-align: center; margin-top: 16px; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
          <button class="retro-btn fun" onclick="App.navigateTo('shopFashion')" style="font-size: 12px;">[F] Fashion Shop</button>
          <button class="retro-btn" onclick="App.navigateTo('town')" style="font-size: 12px;">Back to Town</button>
        </div>
      </div>
    `;

    // Mount 3D preview
    if (has3D) {
      const el = document.getElementById('profile-3d-view');
      if (el) {
        this._preview = VoxelCreatures.mountPreview(el, character, {
          height: 250,
          bgColor: 0x0a0a1a,
          orbit: true,
        });
      }
    }

    GameState.updateAddressBar('profile');
    GameState.updateStatus(`${character.name}'s Profile`, '*');
  },

  renderEquipped(character) {
    if (!character.equippedItems || character.equippedItems.length === 0) {
      return `<p style="color: rgba(255,255,255,0.3); font-size: 12px; text-align: center;">No items equipped. Visit the Fashion Shop!</p>`;
    }
    return character.equippedItems.map(itemId => {
      const def = typeof InventoryManager !== 'undefined' ? InventoryManager.getItemDef(itemId) : null;
      const name = def ? def.name : itemId;
      const rarity = def ? (def.rarity || 'common') : 'common';
      const slot = def && def.renderData ? def.renderData.slot : '?';
      const color = def && def.renderData ? def.renderData.color : '#888';
      const rarityColors = { common: '#888', rare: '#00FFFF', epic: '#FF00FF', legendary: '#FFD700' };
      return `
        <div style="display: flex; align-items: center; gap: 8px; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
          <div style="width: 16px; height: 16px; background: ${color}; border-radius: 2px; box-shadow: 0 0 4px ${color}88; flex-shrink: 0;"></div>
          <span style="color: rgba(255,255,255,0.7); font-size: 12px; flex: 1;">${name}</span>
          <span class="pixel-text" style="font-size: 6px; color: ${rarityColors[rarity]};">${rarity.toUpperCase()}</span>
          <span style="font-size: 10px; color: rgba(255,255,255,0.3);">${slot}</span>
        </div>
      `;
    }).join('');
  },

  cleanup3D() {
    if (this._preview && this._preview.entry) {
      VoxelEngine.dispose(this._preview.entry.id);
      this._preview = null;
    }
  },
};
