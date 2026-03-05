/* ============================================
   VINYL — Record Store
   Browse crates · Link to Dandelion Records
   Dark warm amber aesthetic
   ============================================ */

const ShopVinylScreen = {

  _crates: [
    { genre: 'Hip-Hop', emoji: '🎤', color: '#ff6600', records: ['Midnight Beats', 'Lo-Fi Legends', 'Street Hymns', 'Boom Bap Revival'] },
    { genre: 'Jazz', emoji: '🎷', color: '#ffaa44', records: ['Blue Notes After Dark', 'Smoky Sessions', 'Twilight Standards', 'Cool Cats'] },
    { genre: 'Electronic', emoji: '🎹', color: '#00ddff', records: ['Neon Dreams', 'Synthwave City', 'Bass Cathedral', 'Digital Rain'] },
    { genre: 'Indie', emoji: '🎸', color: '#ff44aa', records: ['Bedroom Tapes', 'Garage Days', 'Shoegaze Sunset', 'Fuzz & Reverb'] },
    { genre: 'R&B / Soul', emoji: '💜', color: '#aa44ff', records: ['Velvet Nights', 'Golden Hour', 'Silk & Honey', 'Sunday Morning'] },
    { genre: 'World', emoji: '🌍', color: '#44cc88', records: ['Desert Echoes', 'Ocean Breeze', 'Mountain Songs', 'City of Stars'] },
  ],

  render() {
    const container = document.getElementById('screen-container');

    container.innerHTML = `
      <div style="padding: 16px; background: linear-gradient(180deg, #1a0f05 0%, #2a1a08 30%, #1a0f05 60%, #0d0800 100%); min-height: 100%;">
        <button class="back-to-town" onclick="App.navigateTo('town')">◀ Back to Town</button>

        <!-- Scene Backdrop -->
        <div style="position: relative; height: 140px; margin-bottom: 16px; border-radius: 8px; overflow: hidden; background: linear-gradient(180deg, #1a0f05 0%, #2a1508 60%, #352010 100%);">
          <!-- Shelf on wall -->
          <div style="position: absolute; top: 25%; left: 8%; right: 8%; height: 4px; background: #4a3018; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
          <!-- Records on wall -->
          <div style="position: absolute; top: 8%; left: 12%; display: flex; gap: 8px;">
            <div style="width: 22px; height: 22px; background: #cc4444; border-radius: 50%; border: 2px solid #222;"></div>
            <div style="width: 22px; height: 22px; background: #4488cc; border-radius: 50%; border: 2px solid #222;"></div>
            <div style="width: 22px; height: 22px; background: #cc8844; border-radius: 50%; border: 2px solid #222;"></div>
          </div>
          <!-- Crates -->
          <div style="position: absolute; bottom: 10%; left: 10%; width: 35px; height: 28px; background: #3a2510; border: 1px solid #4a3518; border-radius: 2px;"></div>
          <div style="position: absolute; bottom: 10%; left: 20%; width: 35px; height: 22px; background: #352210; border: 1px solid #4a3518; border-radius: 2px;"></div>
          <div style="position: absolute; bottom: 10%; left: 30%; width: 35px; height: 32px; background: #3a2812; border: 1px solid #4a3518; border-radius: 2px;"></div>
          <!-- Turntable -->
          <div style="position: absolute; bottom: 15%; right: 15%; width: 45px; height: 30px; background: #222; border-radius: 3px; border: 1px solid #444;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 18px; height: 18px; background: #111; border-radius: 50%; border: 1px solid #555;">
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 4px; height: 4px; background: #ffaa44; border-radius: 50%;"></div>
            </div>
          </div>
          <!-- Warm glow -->
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(ellipse at 50% 30%, rgba(255,170,68,0.08) 0%, transparent 70%);"></div>
        </div>

        <!-- Store Header -->
        <div class="glass-panel" style="text-align: center; margin-bottom: 16px; border-color: rgba(255,170,68,0.3); background: rgba(30,15,5,0.8);">
          <h1 class="pixel-text" style="font-size: 16px; color: #ffaa44; letter-spacing: 4px;">VINYL</h1>
          <p style="color: rgba(255,200,130,0.5); font-size: 12px; margin-top: 4px;">dig through the crates · find your sound</p>
        </div>

        <!-- Dandelion Records Link -->
        <div class="glass-panel" style="text-align: center; margin-bottom: 20px; border-color: rgba(255,100,0,0.4); background: rgba(40,20,0,0.7); cursor: pointer; transition: all 0.3s;"
             onclick="window.open('https://dandelionrecords.ca/collections/all', '_blank')"
             onmouseenter="this.style.borderColor='rgba(255,170,68,0.8)'; this.style.boxShadow='0 0 30px rgba(255,170,68,0.2)'"
             onmouseleave="this.style.borderColor='rgba(255,100,0,0.4)'; this.style.boxShadow=''">
          <div style="font-size: 36px; margin-bottom: 8px;">📀</div>
          <div class="pixel-text" style="font-size: 12px; color: #ffaa44;">SHOP REAL VINYL</div>
          <p style="color: rgba(255,200,130,0.6); font-size: 11px; margin-top: 6px;">
            Browse the full collection at<br>
            <span style="color: #ff8844; text-decoration: underline;">dandelionrecords.ca</span>
          </p>
          <div style="margin-top: 8px; font-size: 10px; color: rgba(255,170,68,0.4);">opens in new tab →</div>
        </div>

        <!-- Crates -->
        <div style="margin-bottom: 8px;">
          <h2 class="pixel-text" style="font-size: 10px; color: rgba(255,200,130,0.5); text-align: center; margin-bottom: 12px;">// DIG THROUGH THE CRATES</h2>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px;">
          ${this._crates.map(crate => `
            <div class="glass-panel" style="padding: 14px; border-color: ${crate.color}22; background: rgba(20,10,0,0.7);">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                <span style="font-size: 22px;">${crate.emoji}</span>
                <span class="pixel-text" style="font-size: 9px; color: ${crate.color};">${crate.genre}</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${crate.records.map(rec => `
                  <div style="display: flex; align-items: center; gap: 6px; padding: 4px 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
                    <div style="width: 24px; height: 24px; background: ${crate.color}33; border-radius: 2px; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0;">💿</div>
                    <span style="font-size: 11px; color: rgba(255,200,130,0.7);">${rec}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 12px;">
          <p style="color: rgba(255,170,68,0.3); font-size: 10px; font-family: var(--font-pixel);">
            "music is the soundtrack to your world"
          </p>
        </div>
      </div>
    `;

    GameState.updateAddressBar('shop/vinyl');
    GameState.updateStatus('Browsing records at VINYL', '🎵');
  },
};
