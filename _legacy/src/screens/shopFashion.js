/* ============================================
   Fashion Studio — 3D Character + Live Try-On
   PS2-era styling with rarity tiers
   ============================================ */

const ShopFashionScreen = {
  _preview: null,
  _previewItem: null,

  render() {
    this.cleanup3D();

    const container = document.getElementById('screen-container');
    const character = GameState.player.character;
    const clothing = InventoryManager.getItemsByCategory('clothing');

    if (!character) {
      container.innerHTML = `
        <div style="padding: 32px; text-align: center;">
          <p style="color: rgba(255,255,255,0.7);">No character created yet.</p>
          <button class="retro-btn fun" onclick="App.navigateTo('select')" style="margin-top: 16px;">Create Character</button>
        </div>`;
      return;
    }

    const slotGroups = {
      head: clothing.filter(i => i.renderData && i.renderData.slot === 'head'),
      face: clothing.filter(i => i.renderData && i.renderData.slot === 'face'),
      neck: clothing.filter(i => i.renderData && i.renderData.slot === 'neck'),
      back: clothing.filter(i => i.renderData && i.renderData.slot === 'back'),
    };

    container.innerHTML = `
      <div style="padding: 16px; background: linear-gradient(180deg, #0a0020 0%, #1a0a3e 50%, #0a0020 100%); min-height: 100%;">
        <button class="back-to-town" onclick="App.navigateTo('town')">< Back to Town</button>

        <!-- Header -->
        <div class="glass-panel" style="text-align: center; margin-bottom: 16px; border-color: rgba(255,0,255,0.3);">
          <h1 class="pixel-text" style="font-size: 14px; color: #FF00FF;">[*] FASHION STUDIO [*]</h1>
          <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin-top: 4px;">Exclusive items for your character</p>
          <p class="pixel-text" style="font-size: 9px; color: #FFD700; margin-top: 4px;">${GameState.player.coins}c available</p>
        </div>

        <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">

          <!-- 3D Character Preview -->
          <div style="flex: 0 0 280px; position: sticky; top: 16px; align-self: flex-start;">
            <div class="glass-panel" style="text-align: center; border-color: rgba(255,0,255,0.2); padding: 8px;">
              <div class="pixel-text" style="font-size: 8px; color: rgba(255,255,255,0.4); margin-bottom: 4px;">// LIVE PREVIEW</div>
              <div id="fashion-3d-preview" class="voxel-viewport" style="height: 300px; overflow: hidden;"></div>
              <div style="margin-top: 6px;">
                <span class="pixel-text" style="font-size: 8px; color: rgba(255,255,255,0.3);">drag to rotate</span>
              </div>
            </div>
            <div id="preview-label" style="text-align: center; margin-top: 6px; min-height: 24px;"></div>
          </div>

          <!-- Item Grid -->
          <div style="flex: 1; min-width: 300px; max-width: 600px;">
            ${Object.entries(slotGroups).map(([slot, items]) => {
      if (!items.length) return '';
      const slotNames = { head: 'HEADWEAR', face: 'EYEWEAR', neck: 'NECKWEAR', back: 'BACKWEAR' };
      const slotColors = { head: '#FFD700', face: '#00BFFF', neck: '#FF69B4', back: '#9B30FF' };
      return `
                <div style="margin-bottom: 20px;">
                  <div class="pixel-text" style="font-size: 9px; color: ${slotColors[slot]}; margin-bottom: 8px; padding-left: 4px;">// ${slotNames[slot]}</div>
                  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px;">
                    ${items.map(item => this.renderItemCard(item, character)).join('')}
                  </div>
                </div>
              `;
    }).join('')}
          </div>
        </div>

        <div id="shop-message" style="text-align: center; margin-top: 12px; min-height: 24px;"></div>
      </div>
    `;

    // Mount 3D character
    this.mount3DPreview(character);

    GameState.updateAddressBar('shop/fashion');
    GameState.updateStatus('Fashion Studio', '*');
  },

  mount3DPreview(character) {
    const el = document.getElementById('fashion-3d-preview');
    if (!el || typeof VoxelCreatures === 'undefined') return;

    this._preview = VoxelCreatures.mountPreview(el, character, {
      height: 300,
      bgColor: 0x0f0525,
      orbit: true,
    });
  },

  renderItemCard(item, character) {
    const owned = InventoryManager.getItemCount(item.id);
    const isEquipped = character && character.equippedItems && character.equippedItems.includes(item.id);
    const rarity = item.rarity || 'common';

    const rarityColors = {
      common: { border: 'rgba(255,255,255,0.15)', label: '#888888', name: 'COMMON' },
      rare: { border: 'rgba(0,255,255,0.4)', label: '#00FFFF', name: 'RARE' },
      epic: { border: 'rgba(255,0,255,0.4)', label: '#FF00FF', name: 'EPIC' },
      legendary: { border: 'rgba(255,215,0,0.5)', label: '#FFD700', name: 'LEGENDARY' },
    };
    const rc = rarityColors[rarity] || rarityColors.common;

    const slotIcons = { head: '^', face: '◎', neck: '~', back: '>' };
    const slot = item.renderData ? item.renderData.slot : '?';

    // Color swatch from item renderData
    const itemColor = item.renderData ? item.renderData.color : '#888';

    return `
      <div class="glass-panel" style="text-align: center; padding: 10px;
           border: 1px solid ${isEquipped ? '#FFD700' : rc.border};
           ${isEquipped ? 'box-shadow: 0 0 12px rgba(255,215,0,0.2);' : ''}
           cursor: pointer; transition: all 0.15s;"
           onmouseenter="ShopFashionScreen.previewOn('${item.id}')"
           onmouseleave="ShopFashionScreen.previewOff()">

        <!-- Color swatch + rarity -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span class="pixel-text" style="font-size: 6px; color: ${rc.label};">${rc.name}</span>
          <span style="font-size: 9px; color: rgba(255,255,255,0.3);">${slotIcons[slot] || '?'}</span>
        </div>

        <!-- Item visual -->
        <div style="width: 48px; height: 48px; margin: 0 auto 6px; border-radius: 6px;
                    background: radial-gradient(circle, ${itemColor}44 0%, transparent 70%);
                    display: flex; align-items: center; justify-content: center;
                    border: 1px solid ${itemColor}66;">
          <div style="width: 24px; height: 24px; background: ${itemColor}; border-radius: 3px;
                      box-shadow: 0 0 8px ${itemColor}88;"></div>
        </div>

        <!-- Name -->
        <div style="font-size: 13px; color: white; font-weight: bold; margin-bottom: 2px;">${item.name}</div>
        <div style="font-size: 10px; color: rgba(255,255,255,0.4); margin-bottom: 6px; line-height: 1.3;">${item.desc}</div>

        <!-- Action -->
        <div style="display: flex; gap: 4px; justify-content: center; flex-wrap: wrap;">
          ${owned > 0 ? `
            <button class="retro-btn ${isEquipped ? 'fun' : ''}" onclick="ShopFashionScreen.toggleEquip('${item.id}')"
                    style="font-size: 10px; padding: 3px 10px;">
              ${isEquipped ? '[-] UNEQUIP' : '[+] EQUIP'}
            </button>
          ` : `
            <span class="pixel-text" style="font-size: 9px; color: #FFD700; margin-right: 6px;">${item.price}c</span>
            <button class="retro-btn primary" onclick="ShopFashionScreen.buy('${item.id}')"
                    style="font-size: 10px; padding: 3px 10px;">BUY</button>
          `}
        </div>
      </div>
    `;
  },

  previewOn(itemId) {
    if (!this._preview || !this._preview.creature) return;
    this._previewItem = itemId;

    const character = GameState.player.character;
    if (!character) return;

    // Build temp equipped list with this item added
    let tempEquipped = [...(character.equippedItems || [])];
    if (!tempEquipped.includes(itemId)) {
      // Remove same slot
      const def = InventoryManager.getItemDef(itemId);
      if (def && def.renderData) {
        tempEquipped = tempEquipped.filter(id => {
          const d = InventoryManager.getItemDef(id);
          return !d || !d.renderData || d.renderData.slot !== def.renderData.slot;
        });
      }
      tempEquipped.push(itemId);
    }

    // Refresh 3D equipment on the model
    VoxelCreatures.refreshEquipment(this._preview.creature, tempEquipped);

    // Show preview label
    const def = InventoryManager.getItemDef(itemId);
    const label = document.getElementById('preview-label');
    if (label && def) {
      label.innerHTML = `<span class="pixel-text" style="font-size: 8px; color: #FF00FF;">previewing: ${def.name}</span>`;
    }
  },

  previewOff() {
    if (!this._preview || !this._preview.creature) return;
    this._previewItem = null;

    const character = GameState.player.character;
    if (!character) return;

    // Restore actual equipped items
    VoxelCreatures.refreshEquipment(this._preview.creature, character.equippedItems || []);

    const label = document.getElementById('preview-label');
    if (label) label.innerHTML = '';
  },

  buy(itemId) {
    const result = InventoryManager.buyItem(itemId);
    this.showMessage(result.message, result.success ? 'success' : 'warning');
    this.render();
  },

  toggleEquip(itemId) {
    InventoryManager.toggleEquip(itemId);
    this.render();
  },

  showMessage(text, type) {
    const el = document.getElementById('shop-message');
    if (!el) return;
    const color = type === 'success' ? '#39FF14' : type === 'warning' ? '#FF6347' : '#CCCCCC';
    el.innerHTML = `<span class="pixel-text" style="font-size: 9px; color: ${color};">${text}</span>`;
    setTimeout(() => { if (el) el.innerHTML = ''; }, 3000);
  },

  cleanup3D() {
    if (this._preview && this._preview.entry) {
      VoxelEngine.dispose(this._preview.entry.id);
      this._preview = null;
    }
  },
};
