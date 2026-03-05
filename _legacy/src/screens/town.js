/* ============================================
   Town Map — 3D Voxel Town with HTML overlay
   ============================================ */

const TownScreen = {
  render() {
    const container = document.getElementById('screen-container');
    const character = GameState.player.character;

    container.innerHTML = `
      <div class="town-wrapper">
        <!-- 3D Town Canvas mounts here -->
        <div id="town-3d-viewport" class="voxel-viewport"></div>

        <!-- Bottom Bar (HTML overlay) -->
        <div class="town-bottom-bar">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div>
              <span class="pixel-text" style="font-size: 10px; color: #FFD700;">${character ? character.name : 'Stranger'}</span>
              <span style="color: rgba(255,255,255,0.5); font-size: 11px; margin-left: 6px;">${character ? PetEngine.renderLevelBadge(character) : ''}</span>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="retro-btn" onclick="App.navigateTo('apartment')" style="font-size: 11px; padding: 4px 10px;">[P] Profile</button>
            <button class="retro-btn" onclick="TownScreen.showInventory()" style="font-size: 11px; padding: 4px 10px;">[I] Bag</button>
          </div>
        </div>

        <!-- Tip Marquee -->
        <div class="marquee" style="background: rgba(0,0,0,0.8); padding: 4px 0; overflow: hidden;">
          <div class="marquee-content">
            Shop for gear & upgrades -- Find new outfits -- Play games at the arcade -- Train at the gym -- See Dr. Mind -- Browse records at VINYL -- Work at Grindstone & Co -- Chill at The Corner café -- Click buildings to visit -- Drag to look around
          </div>
        </div>

        <div id="town-overlay"></div>
      </div>
    `;

    // Mount the 3D town
    const viewport = document.getElementById('town-3d-viewport');
    if (viewport && typeof VoxelTown !== 'undefined' && typeof THREE !== 'undefined') {
      VoxelTown.mount(viewport);
    } else {
      // Fallback to 2D if Three.js didn't load
      this.renderFallback(viewport);
    }

    GameState.updateAddressBar('town');
    GameState.updateStatus('Done', '+');
  },

  renderFallback(viewport) {
    if (!viewport) return;

    viewport.innerHTML = `
      <div class="town-map" style="position: relative; width: 100%; min-height: 420px; background: linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%); overflow: hidden;">
        <div style="position: absolute; top: 2%; left: 50%; transform: translateX(-50%); text-align: center; z-index: 10;">
          <span class="pixel-text" style="font-size: 12px; color: #FFD700; text-shadow: 0 1px 4px rgba(0,0,0,0.8); background: rgba(0,0,0,0.4); padding: 4px 12px; border-radius: 8px;">ccllottaa City</span>
        </div>
        ${this.renderBuilding('68%', '18%', '👗', 'Fashion Studio', '#FF00FF', 'shopFashion', 'New outfits!')}
        ${this.renderBuilding('8%', '42%', '[>]', 'Arcade', '#00FFFF', 'shopArcade', 'Play games & earn coins!')}
        ${this.renderBuilding('82%', '35%', '[G]', 'Gym', '#FF3333', 'shopPark', 'Train your body!')}
        ${this.renderBuilding('42%', '10%', '[H]', 'My Place', '#FFAA00', 'apartment', 'View your profile!')}
        ${this.renderBuilding('50%', '72%', '[⌘]', 'Dr. Mind', '#00CCCC', 'shopFortune', 'Talk to the psychiatrist!')}
        ${this.renderBuilding('30%', '42%', '💿', 'VINYL', '#FFAA44', 'shopVinyl', 'Browse records!')}
        ${this.renderBuilding('8%', '65%', '🏢', 'Grindstone & Co', '#999999', 'shopWork', 'Earn coins!')}
        ${this.renderBuilding('68%', '55%', '☕', 'The Corner', '#FFCC66', 'shopCafe', 'Café & smoke shop!')}
        ${this.renderBuilding('45%', '50%', '🌙', 'Night Garden', '#66CC88', 'shopGarden', 'A quiet park...')}      </div>
    `;
  },

  renderBuilding(left, top, icon, name, color, screenId, tooltip) {
    return `
      <div class="town-building" style="position: absolute; left: ${left}; top: ${top}; cursor: pointer; text-align: center; z-index: 5;"
           onclick="App.navigateTo('${screenId}')" title="${tooltip}">
        <div style="background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(240,230,220,0.95) 100%); border: 2px solid ${color}; border-radius: 8px; padding: 8px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: transform 0.15s, box-shadow 0.15s;"
             onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.3)'"
             onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.2)'">
          <div style="font-size: 28px; margin-bottom: 2px;">${icon}</div>
          <div class="pixel-text" style="font-size: 7px; color: ${color}; white-space: nowrap;">${name}</div>
        </div>
      </div>
    `;
  },

  showInventory() {
    const overlay = document.getElementById('town-overlay');
    if (!overlay) return;
    const inv = GameState.player.inventory;
    let html = `<div style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 100; display: flex; align-items: center; justify-content: center;" onclick="if(event.target===this)document.getElementById('town-overlay').innerHTML=''">
      <div class="glass-panel" style="max-width: 400px; width: 90%; max-height: 80vh; overflow-y: auto; background: rgba(10,0,30,0.95);">
        <h3 class="pixel-text" style="font-size: 12px; color: #FFD700; text-align: center; margin-bottom: 12px;">🎒 Inventory</h3>`;

    if (inv.length === 0) {
      html += '<p style="text-align:center; color: rgba(255,255,255,0.5);">Empty! Visit the shops!</p>';
    } else {
      inv.forEach(slot => {
        const def = InventoryManager.getItemDef(slot.id);
        if (!def) return;
        html += `<div style="display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
          <span style="font-size: 18px;">${def.emoji}</span>
          <span style="flex: 1; color: white; font-size: 12px;">${def.name} <span style="opacity:0.5;">×${slot.count}</span></span>
        </div>`;
      });
    }
    html += `<div style="text-align:center; margin-top:12px;"><button class="retro-btn" onclick="document.getElementById('town-overlay').innerHTML=''">Close</button></div></div></div>`;
    overlay.innerHTML = html;
  },

  /* Cleanup when leaving town */
  cleanup() {
    if (typeof VoxelTown !== 'undefined') {
      VoxelTown.cleanup();
    }
  }
};
