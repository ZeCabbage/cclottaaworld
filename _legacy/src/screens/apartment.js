/* ============================================
   My Apartment — Home Screen with Mirror Editor
   Cozy apartment + re-accessible character creator
   ============================================ */

const ApartmentScreen = {
  _preview: null,
  _mirrorOpen: false,

  // Mirror editor state (copy of current character's look)
  _mirrorChoices: null,
  _mirrorStep: 0,
  _mirrorSteps: ['skin', 'hair', 'eyes', 'lashes', 'expression', 'blush', 'outfit', 'bottom', 'shoes', 'name'],
  _mirrorPreview: null,

  render() {
    this.cleanup3D();
    this._mirrorOpen = false;
    this._lampOn = this._lampOn !== undefined ? this._lampOn : true;
    const container = document.getElementById('screen-container');
    const character = GameState.player.character;
    if (!character) {
      container.innerHTML = `<div style="padding:32px;text-align:center;"><p style="color:rgba(255,255,255,0.7);">No character created yet.</p><button class="retro-btn fun" onclick="App.navigateTo('select')" style="margin-top:16px;">Create Character</button></div>`;
      return;
    }
    const apt = GameState.player.apartment || {};
    const S = GameState.roomStyles;
    const wallDef = S.wallpapers.find(w => w.id === apt.wallpaper) || S.wallpapers[0];
    const floorDef = S.floors.find(f => f.id === apt.floor) || S.floors[0];
    const couchDef = S.couches.find(c => c.id === apt.couch) || S.couches[0];
    const lampDef = S.lamps.find(l => l.id === apt.lamp) || S.lamps[0];
    const rugDef = apt.rug && apt.rug !== 'none' ? S.rugs.find(r => r.id === apt.rug) : null;
    const p1 = S.posters.find(p => p.id === apt.poster1);
    const p2 = S.posters.find(p => p.id === apt.poster2);
    const bedDef = (S.bedSheets || []).find(b => b.id === apt.bedSheet) || (S.bedSheets || [])[0] || { color: '#6848a8', pattern: 'linear-gradient(#6848a8,#5838a8)' };
    const bright = this._lampOn ? 1 : 0.35;
    const glowOp = this._lampOn ? 0.6 : 0.05;

    // Character pixel art (simple)
    const charHTML = typeof VoxelCreatures !== 'undefined' && typeof THREE !== 'undefined'
      ? `<div id="apt-char-3d" style="width:120px;height:160px;"></div>`
      : `<div style="font-size:64px;">🧍</div>`;

    container.innerHTML = `
      <div style="position:relative;width:100%;min-height:100vh;background:${wallDef.color};overflow:hidden;">

        <!-- HUD -->
        <div style="position:absolute;top:10px;left:10px;z-index:30;display:flex;gap:6px;flex-wrap:wrap;">
          <button class="retro-btn" onclick="App.navigateTo('town')" style="font-size:9px;padding:5px 10px;">🚪 Leave</button>
          <button class="retro-btn" onclick="ApartmentScreen.openMirror()" style="font-size:9px;padding:5px 10px;">🪞 Mirror</button>
          <button class="retro-btn" onclick="ApartmentScreen.openRoom()" style="font-size:9px;padding:5px 10px;">🏠 Room</button>
        </div>
        <div style="position:absolute;top:10px;right:10px;z-index:30;">
          <span class="pixel-text" style="font-size:9px;color:#cc66ff;background:rgba(0,0,0,0.6);padding:4px 8px;border-radius:6px;">${character.name}'s Apartment</span>
        </div>

        <!-- ROOM SCENE -->
        <div id="apt-room-scene" style="position:relative;width:100%;max-width:900px;margin:50px auto 0;aspect-ratio:16/10;filter:brightness(${bright});transition:filter 0.5s;">

          <!-- Back Wall -->
          <div style="position:absolute;top:0;left:0;right:0;height:60%;background:${wallDef.pattern};${floorDef.patternSize ? 'background-size:' + floorDef.patternSize + ';' : ''}border-bottom:3px solid rgba(255,255,255,0.05);">

            <!-- Window -->
            <div style="position:absolute;top:15%;left:8%;width:18%;height:45%;background:linear-gradient(180deg,#0a0a25 0%,#151530 60%,#1a1a40 100%);border:3px solid #33334488;border-radius:2px;box-shadow:inset 0 0 20px rgba(0,0,0,0.5);">
              <div style="position:absolute;top:50%;left:0;right:0;height:2px;background:#33334466;"></div>
              <div style="position:absolute;left:50%;top:0;bottom:0;width:2px;background:#33334466;"></div>
              <div style="position:absolute;bottom:10%;left:15%;width:20%;height:15%;background:#ffdd0011;border-radius:50%;filter:blur(3px);"></div>
              <div style="position:absolute;bottom:15%;right:20%;width:10%;height:8%;background:#ff440011;border-radius:50%;filter:blur(2px);"></div>
            </div>

            <!-- Poster 1 -->
            ${p1 && p1.id !== 'none' ? `<div style="position:absolute;top:10%;left:35%;width:12%;height:30%;background:${p1.id === 'band' ? 'linear-gradient(#cc4444,#881122)' : p1.id === 'anime' ? 'linear-gradient(#ff88cc,#cc44aa)' : p1.id === 'abstract' ? 'linear-gradient(135deg,#44aacc,#cc44ff)' : p1.id === 'city' ? 'linear-gradient(#4466aa,#223355)' : 'linear-gradient(#8844cc,#442288)'};border:2px solid #ffffff15;border-radius:1px;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:28px;">${p1.emoji}</div>` : ''}

            <!-- Poster 2 -->
            ${p2 && p2.id !== 'none' ? `<div style="position:absolute;top:15%;left:52%;width:10%;height:25%;background:${p2.id === 'band' ? 'linear-gradient(#cc4444,#881122)' : p2.id === 'anime' ? 'linear-gradient(#ff88cc,#cc44aa)' : p2.id === 'abstract' ? 'linear-gradient(135deg,#44aacc,#cc44ff)' : p2.id === 'city' ? 'linear-gradient(#4466aa,#223355)' : 'linear-gradient(#8844cc,#442288)'};border:2px solid #ffffff15;border-radius:1px;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:22px;">${p2.emoji}</div>` : ''}

            <!-- Mirror on wall -->
            <div onclick="ApartmentScreen.openMirror()" style="cursor:pointer;position:absolute;top:12%;right:12%;width:10%;height:35%;background:linear-gradient(180deg,#aaccee44,#667788aa,#aaccee44);border:3px solid #8844aa;border-radius:4px;box-shadow:0 0 15px rgba(136,68,170,0.3);transition:box-shadow 0.2s;" onmouseenter="this.style.boxShadow='0 0 25px rgba(136,68,170,0.6)'" onmouseleave="this.style.boxShadow='0 0 15px rgba(136,68,170,0.3)'">
              <div style="position:absolute;top:5px;left:50%;transform:translateX(-50%);font-size:8px;color:rgba(200,160,255,0.5);" class="pixel-text">MIRROR</div>
            </div>

            <!-- Shelf/decorations -->
            <div style="position:absolute;bottom:8%;left:68%;width:22%;height:3px;background:rgba(80,60,40,0.6);box-shadow:0 1px 4px rgba(0,0,0,0.2);"></div>
            <div style="position:absolute;bottom:10%;left:70%;font-size:14px;">📚</div>
            <div style="position:absolute;bottom:10%;left:78%;font-size:12px;">🎮</div>
            <div style="position:absolute;bottom:10%;left:85%;font-size:10px;">🎧</div>
          </div>

          <!-- Floor -->
          <div style="position:absolute;bottom:0;left:0;right:0;height:40%;background:${floorDef.pattern};${floorDef.patternSize ? 'background-size:' + floorDef.patternSize + ';' : ''}">

            <!-- Door -->
            <div onclick="App.navigateTo('town')" style="cursor:pointer;position:absolute;top:-35%;left:3%;width:10%;height:65%;background:linear-gradient(180deg,#2a1a0a,#1a0a00);border:3px solid #3a2a1a;border-radius:2px 2px 0 0;transition:transform 0.15s;" onmouseenter="this.style.transform='scale(1.02)'" onmouseleave="this.style.transform=''">
              <div style="position:absolute;right:12%;top:45%;width:6px;height:6px;background:#ccaa66;border-radius:50%;box-shadow:0 0 4px #ccaa66;"></div>
              <div style="position:absolute;top:5px;left:50%;transform:translateX(-50%);font-size:7px;color:rgba(200,160,100,0.4);" class="pixel-text">EXIT</div>
            </div>

            <!-- Rug -->
            ${rugDef ? `<div style="position:absolute;top:25%;left:35%;width:30%;height:50%;background:${rugDef.color};border-radius:50%;opacity:0.6;box-shadow:inset 0 0 15px rgba(0,0,0,0.15);"></div>` : ''}

            <!-- Bed -->
            <div style="position:absolute;top:2%;left:40%;width:25%;height:45%;">
              <div style="position:absolute;bottom:0;left:0;right:0;height:30%;background:rgba(80,60,40,0.6);border-radius:3px;"></div>
              <div style="position:absolute;bottom:25%;left:3%;right:3%;height:60%;background:${bedDef.pattern};border-radius:4px 4px 0 0;box-shadow:0 -2px 8px rgba(0,0,0,0.15);"></div>
              <div style="position:absolute;top:5%;left:5%;width:30%;height:25%;background:rgba(255,255,255,0.7);border-radius:3px;box-shadow:0 1px 4px rgba(0,0,0,0.1);"></div>
              <div style="position:absolute;top:8%;right:8%;width:25%;height:20%;background:rgba(255,240,245,0.6);border-radius:3px;"></div>
            </div>

            <!-- Couch -->
            <div style="position:absolute;top:5%;right:8%;width:28%;height:30%;">
              <div style="position:absolute;bottom:0;left:0;right:0;height:50%;background:${couchDef.color};border-radius:4px 4px 2px 2px;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>
              <div style="position:absolute;bottom:45%;left:0;right:0;height:35%;background:${couchDef.color};filter:brightness(0.85);border-radius:4px 4px 0 0;"></div>
              <div style="position:absolute;bottom:10%;left:5%;width:18%;height:30%;background:${couchDef.color};filter:brightness(1.15);border-radius:3px;opacity:0.7;"></div>
              <div style="position:absolute;bottom:10%;right:5%;width:18%;height:30%;background:${couchDef.color};filter:brightness(1.15);border-radius:3px;opacity:0.7;"></div>
            </div>

            <!-- Gaming Station -->
            <div style="position:absolute;top:8%;left:15%;width:22%;height:25%;">
              <div style="position:absolute;bottom:0;left:0;right:0;height:35%;background:rgba(60,50,40,0.7);border-radius:2px;box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div>
              <div style="position:absolute;bottom:30%;left:10%;width:55%;height:30%;background:#222;border-radius:2px;border:2px solid #444;"></div>
              <div style="position:absolute;bottom:33%;left:14%;width:46%;height:22%;background:linear-gradient(135deg,#4466cc,#6644cc);border-radius:1px;"></div>
              <div style="position:absolute;bottom:8%;left:65%;width:25%;height:15%;background:#333;border-radius:1px;"></div>
              <div style="position:absolute;bottom:2%;left:70%;font-size:8px;">⌨️</div>
              <div style="position:absolute;bottom:25%;right:5%;font-size:10px;">🖱️</div>
              <div style="position:absolute;top:-5%;left:5%;font-size:10px;">🎧</div>
              <div style="position:absolute;bottom:35%;left:68%;width:8px;height:12px;background:#8844cc;border-radius:1px;box-shadow:0 0 6px #8844cc88;"></div>
            </div>

            <!-- Lamp (CLICKABLE) -->
            <div onclick="ApartmentScreen._toggleLamp()" style="cursor:pointer;position:absolute;top:0%;left:62%;width:6%;text-align:center;transition:transform 0.15s;" onmouseenter="this.style.transform='scale(1.1)'" onmouseleave="this.style.transform=''">
              <div style="width:60%;height:8px;margin:0 auto;background:#333;border-radius:2px;"></div>
              <div style="width:4px;height:40px;margin:0 auto;background:#444;"></div>
              <div style="width:80%;height:16px;margin:0 auto;background:${lampDef.color};border-radius:50% 50% 2px 2px;opacity:${this._lampOn ? 0.9 : 0.3};box-shadow:${this._lampOn ? '0 0 30px ' + lampDef.color + ', 0 0 60px ' + lampDef.color + '44' : 'none'};transition:all 0.3s;"></div>
              <div class="pixel-text" style="font-size:6px;color:rgba(255,255,255,0.3);margin-top:2px;">LAMP</div>
            </div>

            <!-- Character (CLICKABLE) -->
            <div onclick="ApartmentScreen._showStats()" style="cursor:pointer;position:absolute;top:10%;left:42%;transform:translateX(-50%);text-align:center;transition:transform 0.15s;z-index:10;" onmouseenter="this.style.transform='translateX(-50%) scale(1.05)'" onmouseleave="this.style.transform='translateX(-50%)'">
              ${charHTML}
              <div class="pixel-text" style="font-size:8px;color:#cc66ff;margin-top:2px;text-shadow:0 1px 3px rgba(0,0,0,0.8);">${character.name}</div>
            </div>

            <!-- Lamp glow overlay -->
            <div style="position:absolute;top:-20%;left:58%;width:20%;height:60%;background:radial-gradient(ellipse,${lampDef.color}${Math.round(glowOp * 255).toString(16).padStart(2, '0')} 0%,transparent 70%);pointer-events:none;"></div>
          </div>

          <!-- Room ambient glow -->
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 65% 65%,${lampDef.color}${this._lampOn ? '15' : '05'} 0%,transparent 60%);pointer-events:none;"></div>
        </div>

        <!-- Bottom hint -->
        <div style="text-align:center;padding:12px;margin-top:8px;">
          <span class="pixel-text" style="font-size:7px;color:rgba(200,160,255,0.35);">click: 🚪 door → town · 🪞 mirror → change look · 💡 lamp → toggle light · character → stats</span>
        </div>

        <div id="mirror-overlay"></div>
        <div id="room-overlay"></div>
        <div id="stats-overlay"></div>
      </div>
    `;

    // Mount small 3D character if available
    if (typeof VoxelCreatures !== 'undefined' && typeof THREE !== 'undefined') {
      const el = document.getElementById('apt-char-3d');
      if (el) {
        this._preview = VoxelCreatures.mountPreview(el, character, { height: 160, bgColor: null, orbit: false });
        // Make background transparent
        if (this._preview && this._preview.entry && this._preview.entry.renderer) {
          this._preview.entry.renderer.setClearColor(0x000000, 0);
        }
      }
    }

    GameState.updateAddressBar('apartment');
    GameState.updateStatus(`${character.name}'s Apartment`, '🏠');
  },

  /* ---- Toggle lamp brightness ---- */
  _toggleLamp() {
    this._lampOn = !this._lampOn;
    const scene = document.getElementById('apt-room-scene');
    if (scene) {
      scene.style.filter = `brightness(${this._lampOn ? 1 : 0.35})`;
    }
    // Update lamp glow without full re-render
    this.render();
  },

  /* ---- Stats popup ---- */
  _showStats() {
    const character = GameState.player.character;
    if (!character) return;
    const overlay = document.getElementById('stats-overlay');
    if (!overlay) return;
    overlay.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:200;display:flex;align-items:center;justify-content:center;" onclick="if(event.target===this)document.getElementById('stats-overlay').innerHTML=''">
        <div class="glass-panel" style="max-width:400px;width:90%;padding:20px;background:rgba(10,0,30,0.95);border-color:rgba(170,68,255,0.4);">
          <h3 class="pixel-text" style="font-size:12px;color:#cc66ff;text-align:center;margin-bottom:14px;">📊 ${character.name} · ${PetEngine.renderLevelBadge(character)}</h3>
          ${PetEngine.renderStatBars(character)}
          <div style="margin-top:14px;">
            <h4 class="pixel-text" style="font-size:9px;color:rgba(170,130,255,0.5);margin-bottom:8px;">// Equipped</h4>
            ${this._renderEquipped(character)}
          </div>
          <div style="text-align:center;margin-top:14px;display:flex;gap:8px;justify-content:center;">
            <button class="retro-btn fun" onclick="App.navigateTo('shopFashion')" style="font-size:10px;">[F] Fashion</button>
            <button class="retro-btn" onclick="document.getElementById('stats-overlay').innerHTML=''" style="font-size:10px;">Close</button>
          </div>
        </div>
      </div>`;
  },

  _renderEquipped(character) {
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

  // =============================================
  //  MIRROR — Re-accessible character editor
  // =============================================

  openMirror() {
    const character = GameState.player.character;
    if (!character) return;

    // Copy current appearance as starting point
    this._mirrorChoices = {
      skinTone: character.skinTone || 'medium',
      hairStyle: character.hairStyle || 'short',
      hairColor: character.hairColor || 'black',
      eyeColor: character.eyeColor || 'brown',
      outfit: character.outfit || 'casual',
      shoeStyle: character.shoeStyle || 'platform',
      bottomType: character.bottomType || 'pants',
      lashStyle: character.lashStyle || 'natural',
      expression: character.expression || 'neutral',
      blush: character.blush || false,
      name: character.name || '',
    };
    this._mirrorStep = 0;
    this._mirrorOpen = true;

    this._renderMirrorOverlay();
  },

  _renderMirrorOverlay() {
    const overlay = document.getElementById('mirror-overlay');
    if (!overlay) return;

    overlay.innerHTML = `
      <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 200; display: flex; align-items: center; justify-content: center;"
           onclick="if(event.target===this)ApartmentScreen.closeMirror()">
        <div style="background: linear-gradient(180deg, #1a0a3e 0%, #2a1050 50%, #1a0a3e 100%); border: 2px solid rgba(255,215,0,0.3); border-radius: 16px; max-width: 700px; width: 95%; max-height: 90vh; overflow-y: auto; box-shadow: 0 0 40px rgba(255,215,0,0.1);">

          <!-- Mirror Header -->
          <div style="text-align: center; padding: 16px 16px 8px;">
            <h2 class="rainbow-text" style="font-family: var(--font-pixel); font-size: 12px; letter-spacing: 2px;">🪞 Mirror — Change Your Look 🪞</h2>
          </div>

          <div style="display: flex; gap: 16px; padding: 0 16px; flex-wrap: wrap; justify-content: center;">
            <!-- 3D Preview -->
            <div style="flex: 0 0 220px;">
              <div id="mirror-3d-preview" style="width: 220px; height: 260px; border-radius: 8px; overflow: hidden;"></div>
            </div>

            <!-- Controls -->
            <div style="flex: 1; min-width: 240px;">
              <!-- Step indicator -->
              <div id="mirror-step-indicator" style="text-align: center; padding: 6px 0;"></div>
              <!-- Step controls -->
              <div id="mirror-controls" style="padding: 8px 0;"></div>
            </div>
          </div>

          <!-- Navigation -->
          <div id="mirror-nav" style="display: flex; justify-content: center; gap: 12px; padding: 12px 20px 16px;"></div>
        </div>
      </div>
    `;

    // Mount 3D preview in mirror
    this._mountMirrorPreview();
    this._renderMirrorStep();
  },

  _mountMirrorPreview() {
    const el = document.getElementById('mirror-3d-preview');
    if (!el || typeof VoxelCreatures === 'undefined') return;

    // Clean up old mirror preview
    if (this._mirrorPreview && this._mirrorPreview.entry) {
      VoxelEngine.dispose(this._mirrorPreview.entry.id);
    }

    const previewChar = this._buildMirrorCharacter();
    this._mirrorPreview = VoxelCreatures.mountPreview(el, previewChar, {
      height: 260,
      bgColor: 0x1a0a30,
      orbit: true,
    });
  },

  _buildMirrorCharacter() {
    return {
      name: this._mirrorChoices.name || 'Preview',
      skinTone: this._mirrorChoices.skinTone,
      hairStyle: this._mirrorChoices.hairStyle,
      hairColor: this._mirrorChoices.hairColor,
      eyeColor: this._mirrorChoices.eyeColor,
      outfit: this._mirrorChoices.outfit,
      shoeStyle: this._mirrorChoices.shoeStyle,
      bottomType: this._mirrorChoices.bottomType,
      lashStyle: this._mirrorChoices.lashStyle,
      expression: this._mirrorChoices.expression,
      blush: this._mirrorChoices.blush,
      stats: GameState.player.character ? GameState.player.character.stats : { strength: 0, speed: 0, intelligence: 0, charisma: 0, stamina: 0 },
      equippedItems: GameState.player.character ? GameState.player.character.equippedItems : [],
    };
  },

  _refreshMirrorPreview() {
    if (!this._mirrorPreview || !this._mirrorPreview.entry) return;
    const scene = this._mirrorPreview.entry.scene;

    if (this._mirrorPreview.creature) {
      scene.remove(this._mirrorPreview.creature);
    }

    const previewChar = this._buildMirrorCharacter();
    const newModel = VoxelCreatures.build(previewChar, { scale: 0.65 });
    newModel.position.y = 0.1;
    scene.add(newModel);
    this._mirrorPreview.creature = newModel;
  },

  _renderMirrorStep() {
    this._renderMirrorStepIndicator();
    this._renderMirrorControls();
    this._renderMirrorNav();
  },

  _renderMirrorStepIndicator() {
    const el = document.getElementById('mirror-step-indicator');
    if (!el) return;
    const labels = ['Skin', 'Hair', 'Eyes', 'Lashes', 'Expr', 'Blush', 'Outfit', 'Bottom', 'Shoes', 'Name'];
    el.innerHTML = this._mirrorSteps.map((s, i) => {
      const active = i === this._mirrorStep;
      const done = i < this._mirrorStep;
      return `<span style="
        display: inline-block; margin: 0 3px; padding: 3px 8px;
        font-family: var(--font-pixel); font-size: 7px;
        background: ${active ? 'rgba(255,255,255,0.15)' : 'transparent'};
        color: ${active ? '#FFD700' : done ? '#44ff44' : 'rgba(255,255,255,0.3)'};
        border-radius: 10px;
      ">${done ? '✓ ' : ''}${labels[i]}</span>`;
    }).join('');
  },

  _renderMirrorControls() {
    const el = document.getElementById('mirror-controls');
    if (!el) return;

    const step = this._mirrorSteps[this._mirrorStep];
    const styles = GameState.characterStyles;

    // Get owned outfits: default outfits + any purchased clothing
    const getAvailableOutfits = () => {
      const defaults = styles.outfits;
      return defaults;
    };

    switch (step) {
      case 'skin':
        el.innerHTML = `
          <div style="text-align: center; margin-bottom: 8px;">
            <span class="pixel-text" style="font-size: 10px; color: rgba(255,255,255,0.8);">Skin Tone</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;">
            ${styles.skinTones.map(t => `
              <div onclick="ApartmentScreen._mirrorPick('skinTone','${t.id}')"
                style="cursor: pointer; text-align: center; padding: 6px 10px; border-radius: 6px;
                       background: ${this._mirrorChoices.skinTone === t.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'};
                       border: 2px solid ${this._mirrorChoices.skinTone === t.id ? '#FFD700' : 'transparent'};">
                <div style="width: 30px; height: 30px; border-radius: 50%; background: ${t.hex}; margin: 0 auto 3px; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>
                <div style="font-size: 8px; color: rgba(255,255,255,0.5);">${t.name}</div>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 'hair':
        el.innerHTML = `
          <div style="text-align: center; margin-bottom: 8px;">
            <span class="pixel-text" style="font-size: 10px; color: rgba(255,255,255,0.8);">Hair Style & Color</span>
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 9px; color: rgba(255,255,255,0.5); margin-bottom: 4px; text-align: center;">Style</div>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 4px;">
              ${styles.hairStyles.map(h => `
                <button onclick="ApartmentScreen._mirrorPick('hairStyle','${h.id}')"
                  style="padding: 4px 10px; font-family: var(--font-pixel); font-size: 7px; cursor: pointer;
                         background: ${this._mirrorChoices.hairStyle === h.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'};
                         border: 1px solid ${this._mirrorChoices.hairStyle === h.id ? '#FFD700' : 'rgba(255,255,255,0.15)'};
                         color: ${this._mirrorChoices.hairStyle === h.id ? '#FFD700' : 'rgba(255,255,255,0.7)'};
                         border-radius: 6px;">${h.name}</button>
              `).join('')}
            </div>
          </div>
          <div>
            <div style="font-size: 9px; color: rgba(255,255,255,0.5); margin-bottom: 4px; text-align: center;">Color</div>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 6px;">
              ${styles.hairColors.map(c => `
                <div onclick="ApartmentScreen._mirrorPick('hairColor','${c.id}')"
                  style="cursor: pointer; width: 26px; height: 26px; border-radius: 50%;
                         background: ${c.hex}; box-shadow: 0 0 4px rgba(0,0,0,0.5);
                         border: 2px solid ${this._mirrorChoices.hairColor === c.id ? '#FFD700' : 'transparent'};"
                  title="${c.name}"></div>
              `).join('')}
            </div>
          </div>
        `;
        break;

      case 'eyes':
        el.innerHTML = `
          <div style="text-align: center; margin-bottom: 8px;">
            <span class="pixel-text" style="font-size: 10px; color: rgba(255,255,255,0.8);">Eye Color</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
            ${styles.eyeColors.map(c => `
              <div onclick="ApartmentScreen._mirrorPick('eyeColor','${c.id}')"
                style="cursor: pointer; text-align: center; padding: 8px 12px; border-radius: 6px;
                       background: ${this._mirrorChoices.eyeColor === c.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'};
                       border: 2px solid ${this._mirrorChoices.eyeColor === c.id ? '#FFD700' : 'transparent'};">
                <div style="width: 22px; height: 22px; border-radius: 50%; background: ${c.hex}; margin: 0 auto 3px;
                            box-shadow: 0 0 6px ${c.hex}55;"></div>
                <div style="font-size: 8px; color: rgba(255,255,255,0.5);">${c.name}</div>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 'lashes':
        el.innerHTML = `
          <div style="text-align: center; margin-bottom: 8px;">
            <span class="pixel-text" style="font-size: 10px; color: rgba(255,255,255,0.8);">Lash Style</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
            ${styles.lashStyles.map(l => `
              <div onclick="ApartmentScreen._mirrorPick('lashStyle','${l.id}')"
                style="cursor: pointer; text-align: center; padding: 10px 16px; border-radius: 6px;
                       background: ${this._mirrorChoices.lashStyle === l.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'};
                       border: 2px solid ${this._mirrorChoices.lashStyle === l.id ? '#FFD700' : 'transparent'};">
                <div style="font-size: 9px; color: rgba(255,255,255,0.6);">${l.name}</div>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 'expression':
        el.innerHTML = `
          <div style="text-align: center; margin-bottom: 8px;">
            <span class="pixel-text" style="font-size: 10px; color: rgba(255,255,255,0.8);">Expression</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
            ${styles.expressions.map(e => `
              <div onclick="ApartmentScreen._mirrorPick('expression','${e.id}')"
                style="cursor: pointer; text-align: center; padding: 10px 16px; border-radius: 6px;
                       background: ${this._mirrorChoices.expression === e.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'};
                       border: 2px solid ${this._mirrorChoices.expression === e.id ? '#FFD700' : 'transparent'};">
                <div style="font-size: 18px; margin-bottom: 3px;">${e.id === 'neutral' ? '😐' : e.id === 'happy' ? '😊' : e.id === 'fierce' ? '😤' : '😴'}</div>
                <div style="font-size: 9px; color: rgba(255,255,255,0.6);">${e.name}</div>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 'blush':
        el.innerHTML = `
          <div style="text-align: center; margin-bottom: 8px;">
            <span class="pixel-text" style="font-size: 10px; color: rgba(255,255,255,0.8);">Cheek Blush</span>
          </div>
          <div style="display: flex; justify-content: center; gap: 16px;">
            <div onclick="ApartmentScreen._mirrorPick('blush',false)"
              style="cursor: pointer; text-align: center; padding: 14px 24px; border-radius: 8px;
                     background: ${!this._mirrorChoices.blush ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'};
                     border: 2px solid ${!this._mirrorChoices.blush ? '#FFD700' : 'transparent'};">
              <div style="font-size: 20px; margin-bottom: 4px;">🫥</div>
              <div style="font-size: 9px; color: rgba(255,255,255,0.6);">No Blush</div>
            </div>
            <div onclick="ApartmentScreen._mirrorPick('blush',true)"
              style="cursor: pointer; text-align: center; padding: 14px 24px; border-radius: 8px;
                     background: ${this._mirrorChoices.blush ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'};
                     border: 2px solid ${this._mirrorChoices.blush ? '#FFD700' : 'transparent'};">
              <div style="font-size: 20px; margin-bottom: 4px;">☺️</div>
              <div style="font-size: 9px; color: rgba(255,255,255,0.6);">With Blush</div>
            </div>
          </div>
        `;
        break;

      case 'outfit':
        el.innerHTML = `
          <div style="text-align: center; margin-bottom: 8px;">
            <span class="pixel-text" style="font-size: 10px; color: rgba(255,255,255,0.8);">Outfit</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;">
            ${getAvailableOutfits().map(o => `
              <div onclick="ApartmentScreen._mirrorPick('outfit','${o.id}')"
                style="cursor: pointer; padding: 10px 14px; border-radius: 6px; text-align: center;
                       background: ${this._mirrorChoices.outfit === o.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'};
                       border: 2px solid ${this._mirrorChoices.outfit === o.id ? '#FFD700' : 'transparent'};">
                <div style="width: 32px; height: 32px; border-radius: 4px; margin: 0 auto 4px;
                            background: linear-gradient(180deg, ${o.torsoColor} 50%, ${o.legColor} 50%);
                            box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>
                <div style="font-size: 9px; color: rgba(255,255,255,0.6);">${o.label}</div>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 'bottom':
        el.innerHTML = `
          <div style="text-align: center; margin-bottom: 8px;">
            <span class="pixel-text" style="font-size: 10px; color: rgba(255,255,255,0.8);">Bottom Type</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;">
            ${styles.bottomTypes.map(b => `
              <div onclick="ApartmentScreen._mirrorPick('bottomType','${b.id}')"
                style="cursor: pointer; padding: 8px 14px; border-radius: 6px; text-align: center;
                       background: ${this._mirrorChoices.bottomType === b.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'};
                       border: 2px solid ${this._mirrorChoices.bottomType === b.id ? '#FFD700' : 'transparent'};">
                <div style="font-size: 9px; color: rgba(255,255,255,0.6);">${b.name}</div>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 'shoes':
        el.innerHTML = `
          <div style="text-align: center; margin-bottom: 8px;">
            <span class="pixel-text" style="font-size: 10px; color: rgba(255,255,255,0.8);">Shoe Style</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
            ${(styles.shoeStyles || []).map(s => `
              <div onclick="ApartmentScreen._mirrorPick('shoeStyle','${s.id}')"
                style="cursor: pointer; text-align: center; padding: 10px 16px; border-radius: 6px;
                       background: ${this._mirrorChoices.shoeStyle === s.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'};
                       border: 2px solid ${this._mirrorChoices.shoeStyle === s.id ? '#FFD700' : 'transparent'};">
                <div style="font-size: 24px; margin-bottom: 4px;">${s.id === 'platform' ? '👢' : s.id === 'sneakers' ? '👟' : '🩴'}</div>
                <div style="font-size: 9px; color: rgba(255,255,255,0.6);">${s.name}</div>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 'name':
        el.innerHTML = `
          <div style="text-align: center;">
            <span class="pixel-text" style="font-size: 10px; color: rgba(255,255,255,0.8);">Character Name</span>
            <div style="margin-top: 12px;">
              <input type="text" id="mirror-name-input" maxlength="14" placeholder="Enter a name..."
                value="${this._mirrorChoices.name}"
                oninput="ApartmentScreen._mirrorChoices.name = this.value"
                style="padding: 8px 16px; font-family: var(--font-pixel); font-size: 11px; width: 200px;
                       text-align: center; background: rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.2);
                       border-radius: 8px; color: white; outline: none;" />
            </div>
          </div>
        `;
        setTimeout(() => {
          const inp = document.getElementById('mirror-name-input');
          if (inp) inp.focus();
        }, 100);
        break;
    }
  },

  _renderMirrorNav() {
    const el = document.getElementById('mirror-nav');
    if (!el) return;
    const isFirst = this._mirrorStep === 0;
    const isLast = this._mirrorStep === this._mirrorSteps.length - 1;

    el.innerHTML = `
      <button class="retro-btn" onclick="ApartmentScreen.closeMirror()" style="font-size: 10px; padding: 6px 14px;">✕ Cancel</button>
      ${!isFirst ? `<button class="retro-btn" onclick="ApartmentScreen._mirrorPrev()" style="font-size: 10px; padding: 6px 16px;">◀ Back</button>` : ''}
      ${!isLast
        ? `<button class="retro-btn fun" onclick="ApartmentScreen._mirrorNext()" style="font-size: 10px; padding: 6px 18px;">Next ▶</button>`
        : `<button class="retro-btn fun" onclick="ApartmentScreen._mirrorConfirm()" style="font-size: 12px; padding: 8px 22px;">✨ Save Look</button>`
      }
    `;
  },

  // ---- Mirror picker helpers ----
  _mirrorPick(key, value) {
    this._mirrorChoices[key] = value;
    this._refreshMirrorPreview();
    this._renderMirrorControls();
  },

  _mirrorNext() {
    if (this._mirrorStep < this._mirrorSteps.length - 1) {
      this._mirrorStep++;
      this._renderMirrorStep();
    }
  },

  _mirrorPrev() {
    if (this._mirrorStep > 0) {
      this._mirrorStep--;
      this._renderMirrorStep();
    }
  },

  _mirrorConfirm() {
    const character = GameState.player.character;
    if (!character) return;

    // Apply changes to character
    character.skinTone = this._mirrorChoices.skinTone;
    character.hairStyle = this._mirrorChoices.hairStyle;
    character.hairColor = this._mirrorChoices.hairColor;
    character.eyeColor = this._mirrorChoices.eyeColor;
    character.outfit = this._mirrorChoices.outfit;
    character.shoeStyle = this._mirrorChoices.shoeStyle;
    character.bottomType = this._mirrorChoices.bottomType;
    character.lashStyle = this._mirrorChoices.lashStyle;
    character.expression = this._mirrorChoices.expression;
    character.blush = this._mirrorChoices.blush;
    character.name = this._mirrorChoices.name.trim() || character.name;
    character.lastUpdated = Date.now();

    SaveManager.autoSave();

    this.closeMirror();
    // Re-render the apartment to reflect changes
    this.render();
  },

  closeMirror() {
    this._mirrorOpen = false;
    // Clean up mirror 3D preview
    if (this._mirrorPreview && this._mirrorPreview.entry) {
      VoxelEngine.dispose(this._mirrorPreview.entry.id);
      this._mirrorPreview = null;
    }
    const overlay = document.getElementById('mirror-overlay');
    if (overlay) overlay.innerHTML = '';
  },

  cleanup3D() {
    if (this._preview && this._preview.entry) {
      VoxelEngine.dispose(this._preview.entry.id);
      this._preview = null;
    }
    if (this._mirrorPreview && this._mirrorPreview.entry) {
      VoxelEngine.dispose(this._mirrorPreview.entry.id);
      this._mirrorPreview = null;
    }
  },

  // =============================================
  //  ROOM — Apartment customization
  // =============================================

  openRoom() {
    const apt = GameState.player.apartment || { wallpaper: 'dark', floor: 'concrete', poster1: 'none', poster2: 'none' };
    this._roomChoices = { ...apt };
    this._renderRoomOverlay();
  },

  _renderRoomOverlay() {
    const overlay = document.getElementById('room-overlay');
    if (!overlay) return;

    const styles = GameState.roomStyles;
    const c = this._roomChoices;

    // Get background colors based on current choices
    const wallColor = (styles.wallpapers.find(w => w.id === c.wallpaper) || styles.wallpapers[0]).color;
    const floorColor = (styles.floors.find(f => f.id === c.floor) || styles.floors[0]).color;

    overlay.innerHTML = `
      <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 200; display: flex; align-items: center; justify-content: center;"
           onclick="if(event.target===this)ApartmentScreen.closeRoom()">
        <div style="background: linear-gradient(180deg, ${wallColor} 0%, ${wallColor} 60%, ${floorColor} 60%, ${floorColor} 100%); border: 2px solid rgba(255,170,68,0.3); border-radius: 16px; max-width: 700px; width: 95%; max-height: 90vh; overflow-y: auto; box-shadow: 0 0 40px rgba(255,170,68,0.1);">

          <!-- Header -->
          <div style="text-align: center; padding: 16px 16px 8px;">
            <h2 class="pixel-text" style="font-size: 12px; color: #ffaa44; letter-spacing: 2px;">🏠 Room Customization 🏠</h2>
          </div>

          <div style="padding: 12px 20px;">
            <!-- Wallpaper -->
            <div style="margin-bottom: 16px;">
              <div class="pixel-text" style="font-size: 9px; color: rgba(255,200,130,0.6); margin-bottom: 8px;">// WALLPAPER</div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                ${styles.wallpapers.map(w => `
                  <div onclick="ApartmentScreen._roomPick('wallpaper','${w.id}')"
                    style="cursor: pointer; text-align: center; padding: 8px 12px; border-radius: 6px;
                           background: ${c.wallpaper === w.id ? 'rgba(255,170,68,0.3)' : 'rgba(255,255,255,0.05)'};
                           border: 2px solid ${c.wallpaper === w.id ? '#ffaa44' : 'transparent'};">
                    <div style="width: 30px; height: 30px; background: ${w.color}; border-radius: 4px; margin: 0 auto 4px; border: 1px solid rgba(255,255,255,0.1);"></div>
                    <div style="font-size: 8px; color: rgba(255,200,130,0.6);">${w.name}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Floor -->
            <div style="margin-bottom: 16px;">
              <div class="pixel-text" style="font-size: 9px; color: rgba(255,200,130,0.6); margin-bottom: 8px;">// FLOOR</div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                ${styles.floors.map(f => `
                  <div onclick="ApartmentScreen._roomPick('floor','${f.id}')"
                    style="cursor: pointer; text-align: center; padding: 8px 12px; border-radius: 6px;
                           background: ${c.floor === f.id ? 'rgba(255,170,68,0.3)' : 'rgba(255,255,255,0.05)'};
                           border: 2px solid ${c.floor === f.id ? '#ffaa44' : 'transparent'};">
                    <div style="width: 30px; height: 20px; background: ${f.color}; border-radius: 2px; margin: 0 auto 4px; border: 1px solid rgba(255,255,255,0.1);"></div>
                    <div style="font-size: 8px; color: rgba(255,200,130,0.6);">${f.name}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Posters -->
            <div style="margin-bottom: 16px;">
              <div class="pixel-text" style="font-size: 9px; color: rgba(255,200,130,0.6); margin-bottom: 8px;">// POSTER 1</div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                ${styles.posters.map(p => `
                  <div onclick="ApartmentScreen._roomPick('poster1','${p.id}')"
                    style="cursor: pointer; text-align: center; padding: 8px; border-radius: 6px;
                           background: ${c.poster1 === p.id ? 'rgba(255,170,68,0.3)' : 'rgba(255,255,255,0.05)'};
                           border: 2px solid ${c.poster1 === p.id ? '#ffaa44' : 'transparent'};">
                    <div style="font-size: 22px;">${p.emoji}</div>
                    <div style="font-size: 7px; color: rgba(255,200,130,0.5);">${p.name}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="margin-bottom: 16px;">
              <div class="pixel-text" style="font-size: 9px; color: rgba(255,200,130,0.6); margin-bottom: 8px;">// POSTER 2</div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                ${styles.posters.map(p => `
                  <div onclick="ApartmentScreen._roomPick('poster2','${p.id}')"
                    style="cursor: pointer; text-align: center; padding: 8px; border-radius: 6px;
                           background: ${c.poster2 === p.id ? 'rgba(255,170,68,0.3)' : 'rgba(255,255,255,0.05)'};
                           border: 2px solid ${c.poster2 === p.id ? '#ffaa44' : 'transparent'};">
                    <div style="font-size: 22px;">${p.emoji}</div>
                    <div style="font-size: 7px; color: rgba(255,200,130,0.5);">${p.name}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Couch -->
            <div style="margin-bottom: 16px;">
              <div class="pixel-text" style="font-size: 9px; color: rgba(255,200,130,0.6); margin-bottom: 8px;">// COUCH</div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                ${(styles.couches || []).map(co => `
                  <div onclick="ApartmentScreen._roomPick('couch','${co.id}')"
                    style="cursor: pointer; text-align: center; padding: 8px 12px; border-radius: 6px;
                           background: ${c.couch === co.id ? 'rgba(255,170,68,0.3)' : 'rgba(255,255,255,0.05)'};
                           border: 2px solid ${c.couch === co.id ? '#ffaa44' : 'transparent'};">
                    <div style="width: 30px; height: 20px; background: ${co.color}; border-radius: 3px; margin: 0 auto 4px; border: 1px solid rgba(255,255,255,0.1);"></div>
                    <div style="font-size: 8px; color: rgba(255,200,130,0.6);">${co.name}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Rug -->
            <div style="margin-bottom: 16px;">
              <div class="pixel-text" style="font-size: 9px; color: rgba(255,200,130,0.6); margin-bottom: 8px;">// RUG</div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                ${(styles.rugs || []).map(r => `
                  <div onclick="ApartmentScreen._roomPick('rug','${r.id}')"
                    style="cursor: pointer; text-align: center; padding: 8px 12px; border-radius: 6px;
                           background: ${c.rug === r.id ? 'rgba(255,170,68,0.3)' : 'rgba(255,255,255,0.05)'};
                           border: 2px solid ${c.rug === r.id ? '#ffaa44' : 'transparent'};">
                    <div style="width: 24px; height: 24px; background: ${r.color}; border-radius: 50%; margin: 0 auto 4px; border: 1px solid rgba(255,255,255,0.1);"></div>
                    <div style="font-size: 8px; color: rgba(255,200,130,0.6);">${r.name}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Lamp -->
            <div style="margin-bottom: 16px;">
              <div class="pixel-text" style="font-size: 9px; color: rgba(255,200,130,0.6); margin-bottom: 8px;">// LAMP</div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                ${(styles.lamps || []).map(l => `
                  <div onclick="ApartmentScreen._roomPick('lamp','${l.id}')"
                    style="cursor: pointer; text-align: center; padding: 8px 12px; border-radius: 6px;
                           background: ${c.lamp === l.id ? 'rgba(255,170,68,0.3)' : 'rgba(255,255,255,0.05)'};
                           border: 2px solid ${c.lamp === l.id ? '#ffaa44' : 'transparent'};">
                    <div style="width: 20px; height: 20px; background: ${l.color}; border-radius: 50%; margin: 0 auto 4px; box-shadow: 0 0 8px ${l.color}; border: 1px solid rgba(255,255,255,0.1);"></div>
                    <div style="font-size: 8px; color: rgba(255,200,130,0.6);">${l.name}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Bed Sheets -->
            <div style="margin-bottom: 16px;">
              <div class="pixel-text" style="font-size: 9px; color: rgba(255,200,130,0.6); margin-bottom: 8px;">// BED SHEETS</div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                ${(styles.bedSheets || []).map(b => `
                  <div onclick="ApartmentScreen._roomPick('bedSheet','${b.id}')"
                    style="cursor: pointer; text-align: center; padding: 8px 12px; border-radius: 6px;
                           background: ${c.bedSheet === b.id ? 'rgba(255,170,68,0.3)' : 'rgba(255,255,255,0.05)'};
                           border: 2px solid ${c.bedSheet === b.id ? '#ffaa44' : 'transparent'};">
                    <div style="width: 30px; height: 20px; background: ${b.pattern}; border-radius: 3px; margin: 0 auto 4px; border: 1px solid rgba(255,255,255,0.1);"></div>
                    <div style="font-size: 8px; color: rgba(255,200,130,0.6);">${b.name}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          <div style="display: flex; justify-content: center; gap: 12px; padding: 12px 20px 16px;">
            <button class="retro-btn" onclick="ApartmentScreen.closeRoom()" style="font-size: 10px; padding: 6px 14px;">✕ Cancel</button>
            <button class="retro-btn fun" onclick="ApartmentScreen._roomConfirm()" style="font-size: 12px; padding: 8px 22px;">✨ Save Room</button>
          </div>
        </div>
      </div>
    `;
  },

  _roomPick(key, value) {
    this._roomChoices[key] = value;
    this._renderRoomOverlay();
  },

  _roomConfirm() {
    GameState.player.apartment = { ...this._roomChoices };
    SaveManager.autoSave();
    this.closeRoom();
    this.render();
  },

  closeRoom() {
    const overlay = document.getElementById('room-overlay');
    if (overlay) overlay.innerHTML = '';
  },
};
