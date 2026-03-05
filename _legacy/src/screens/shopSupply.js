/* ============================================
   Supply Store — Food, Toys, Drives, Medicine
   ============================================ */

const ShopSupplyScreen = {
  render() {
    const container = document.getElementById('screen-container');
    const drives = InventoryManager.getItemsByCategory('drive');
    const foods = InventoryManager.getItemsByCategory('food');
    const toys = InventoryManager.getItemsByCategory('toy');
    const meds = InventoryManager.getItemsByCategory('medicine');

    container.innerHTML = `
      <div style="padding: 16px; background: linear-gradient(180deg, #0a0020 0%, #120830 50%, #0a0020 100%); min-height: 100%;">
        <button class="back-to-town" onclick="App.navigateTo('town')">◀ Back to Town</button>
        
        <div class="glass-panel" style="text-align: center; margin-bottom: 16px;">
          <h1 class="pixel-text" style="font-size: 14px; color: #A0522D;">[S] ccllottaa Supply Co. [S]</h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 12px;">Everything your pet needs — now with Chaos Drives!</p>
        </div>

        <!-- Chaos Drives -->
        <div class="glass-panel" style="margin-bottom: 16px;">
          <h2 class="pixel-text" style="font-size: 11px; color: #FFD700; margin-bottom: 12px;">// Chaos Drives</h2>
          <p style="color: rgba(255,255,255,0.5); font-size: 11px; margin-bottom: 12px;">Energy orbs that boost your pet's stats! Feed them to influence evolution type.</p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
            ${drives.map(item => this.renderDriveCard(item)).join('')}
          </div>
        </div>

        <!-- Food -->
        <div class="glass-panel" style="margin-bottom: 16px;">
          <h2 class="pixel-text" style="font-size: 11px; color: #FF8C00; margin-bottom: 12px;">// Food & Treats</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px;">
            ${foods.map(item => this.renderItemCard(item)).join('')}
          </div>
        </div>

        <!-- Toys -->
        <div class="glass-panel" style="margin-bottom: 16px;">
          <h2 class="pixel-text" style="font-size: 11px; color: #FF69B4; margin-bottom: 12px;">// Toys</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px;">
            ${toys.map(item => this.renderItemCard(item)).join('')}
          </div>
        </div>

        <!-- Medicine -->
        <div class="glass-panel" style="margin-bottom: 16px;">
          <h2 class="pixel-text" style="font-size: 11px; color: #32CD32; margin-bottom: 12px;">// Medicine</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px;">
            ${meds.map(item => this.renderItemCard(item)).join('')}
          </div>
        </div>

        <div id="shop-message" style="text-align: center; margin-top: 8px;"></div>
      </div>
    `;

    GameState.updateAddressBar('shop/supply');
    GameState.updateStatus('Shopping at ccllottaa Supply Co.!', 'S');
  },

  renderDriveCard(item) {
    const owned = InventoryManager.getItemCount(item.id);
    const statName = Object.keys(item.statBoost)[0] || '';
    const statColors = { power: '#FF4444', run: '#33CC33', fly: '#9933CC', swim: '#CCAA33' };
    const color = statColors[statName] || '#888';
    return `
      <div class="glass-panel" style="text-align: center; padding: 12px; border: 1px solid ${color}40; min-width: 100px;">
        <div class="chaos-drive drive-${statName}" style="margin: 0 auto 8px;">*</div>
        <div class="pixel-text" style="font-size: 9px; color: ${color};">${item.name}</div>
        <div style="font-size: 10px; color: rgba(255,255,255,0.5); margin: 4px 0;">${item.desc}</div>
        <div style="font-size: 10px; color: ${color}; margin-bottom: 6px;">+${item.statBoost[statName]} ${statName}</div>
        <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
          <span class="pixel-text" style="font-size: 9px; color: #FFD700;">${item.price}c</span>
          <button class="retro-btn" onclick="ShopSupplyScreen.buy('${item.id}')" style="font-size: 10px; padding: 3px 10px;">Buy!</button>
        </div>
        ${owned > 0 ? `<div style="font-size: 9px; color: rgba(255,255,255,0.4); margin-top: 4px;">Owned: ${owned}</div>` : ''}
      </div>
    `;
  },

  renderItemCard(item) {
    const owned = InventoryManager.getItemCount(item.id);
    const boosts = item.statBoost ? Object.entries(item.statBoost).map(([s, v]) => `+${v} ${s}`).join(', ') : '';
    return `
      <div class="glass-panel" style="text-align: center; padding: 10px;">
        <div style="font-size: 28px; margin-bottom: 4px;">${item.emoji}</div>
        <div style="font-size: 11px; color: white; font-weight: bold;">${item.name}</div>
        <div style="font-size: 10px; color: rgba(255,255,255,0.5); margin: 2px 0;">${item.desc}</div>
        ${boosts ? `<div style="font-size: 9px; color: #32CD32; margin: 2px 0;">${boosts}</div>` : ''}
        <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 6px;">
          <span class="pixel-text" style="font-size: 9px; color: #FFD700;">${item.price}c</span>
          <button class="retro-btn" onclick="ShopSupplyScreen.buy('${item.id}')" style="font-size: 10px; padding: 3px 10px;">Buy!</button>
        </div>
        ${owned > 0 ? `<div style="font-size: 9px; color: rgba(255,255,255,0.4); margin-top: 3px;">Owned: ${owned}</div>` : ''}
      </div>
    `;
  },

  buy(itemId) {
    const result = InventoryManager.buyItem(itemId);
    PetViewScreen.showMessage(result.message, result.success ? 'success' : 'warning');
    this.render();
  }
};
