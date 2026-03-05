/* ============================================
   Character Creator Screen
   Step-by-step customization + live 3D preview
   ============================================ */

const SelectScreen = {
  _preview: null,
  _previewCharacter: null,

  // Current creator state
  _choices: {
    skinTone: 'medium',
    hairStyle: 'short',
    hairColor: 'black',
    eyeColor: 'brown',
    outfit: 'casual',
    name: '',
  },

  _step: 0,
  _steps: ['skin', 'hair', 'eyes', 'outfit', 'name'],

  render() {
    this.cleanup3D();
    this._step = 0;

    const container = document.getElementById('screen-container');
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; min-height: 100%; background: linear-gradient(180deg, #0a0020 0%, #1a0a3e 50%, #0a0020 100%);">
        <!-- Header -->
        <div style="text-align: center; padding: 16px 16px 8px;">
          <h1 class="rainbow-text" style="font-family: var(--font-pixel); font-size: 14px; letter-spacing: 2px;">✨ Create Your Character ✨</h1>
        </div>

        <!-- 3D Preview -->
        <div id="creator-preview" style="width: 100%; height: 280px; margin: 0 auto; max-width: 400px;"></div>

        <!-- Step indicator -->
        <div id="step-indicator" style="text-align: center; padding: 8px 0;"></div>

        <!-- Controls area -->
        <div id="creator-controls" style="flex: 1; padding: 8px 20px 16px; max-width: 600px; margin: 0 auto; width: 100%;"></div>

        <!-- Navigation -->
        <div id="creator-nav" style="display: flex; justify-content: center; gap: 12px; padding: 12px 20px 20px;"></div>

        <!-- Back link -->
        <div style="text-align: center; padding: 0 0 16px;">
          <a href="#" onclick="App.navigateTo('title'); return false;" style="color: rgba(255,255,255,0.4); font-family: var(--font-retro); font-size: 14px;">◀ Back to Title</a>
        </div>
      </div>
    `;

    this.mount3DPreview();
    this.renderStep();

    GameState.updateAddressBar('create-character');
    GameState.updateStatus('Design your character!', '🎨');
  },

  mount3DPreview() {
    const el = document.getElementById('creator-preview');
    if (!el || typeof VoxelCreatures === 'undefined') return;

    this._previewCharacter = this.buildPreviewCharacter();
    this._preview = VoxelCreatures.mountPreview(el, this._previewCharacter, {
      height: 280,
      bgColor: 0x0a0a1a,
      orbit: true,
    });
  },

  buildPreviewCharacter() {
    return {
      name: this._choices.name || 'Preview',
      skinTone: this._choices.skinTone,
      hairStyle: this._choices.hairStyle,
      hairColor: this._choices.hairColor,
      eyeColor: this._choices.eyeColor,
      outfit: this._choices.outfit,
      stats: { strength: 0, speed: 0, intelligence: 0, charisma: 0, stamina: 0 },
      equippedItems: [],
    };
  },

  refreshPreview() {
    if (!this._preview || !this._preview.entry) return;
    const scene = this._preview.entry.scene;

    // Remove old character model
    if (this._preview.creature) {
      scene.remove(this._preview.creature);
    }

    // Build fresh
    this._previewCharacter = this.buildPreviewCharacter();
    const newModel = VoxelCreatures.build(this._previewCharacter, { scale: 0.8 });
    newModel.position.y = 0.1;
    scene.add(newModel);
    this._preview.creature = newModel;
  },

  renderStep() {
    this.renderStepIndicator();
    this.renderControls();
    this.renderNav();
  },

  renderStepIndicator() {
    const el = document.getElementById('step-indicator');
    if (!el) return;
    const labels = ['Skin', 'Hair', 'Eyes', 'Outfit', 'Name'];
    el.innerHTML = this._steps.map((s, i) => {
      const active = i === this._step;
      const done = i < this._step;
      return `<span style="
        display: inline-block; margin: 0 4px; padding: 3px 10px;
        font-family: var(--font-pixel); font-size: 8px;
        background: ${active ? 'rgba(255,255,255,0.15)' : 'transparent'};
        color: ${active ? '#FFD700' : done ? '#44ff44' : 'rgba(255,255,255,0.3)'};
        border-radius: 10px;
      ">${done ? '✓ ' : ''}${labels[i]}</span>`;
    }).join('');
  },

  renderControls() {
    const el = document.getElementById('creator-controls');
    if (!el) return;

    const step = this._steps[this._step];
    const styles = GameState.characterStyles;

    switch (step) {
      case 'skin':
        el.innerHTML = `
          <div style="text-align: center; margin-bottom: 12px;">
            <span class="pixel-text" style="font-size: 11px; color: rgba(255,255,255,0.8);">Choose Skin Tone</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
            ${styles.skinTones.map(t => `
              <div onclick="SelectScreen.pickSkin('${t.id}')"
                style="cursor: pointer; text-align: center; padding: 8px 12px; border-radius: 8px;
                       background: ${this._choices.skinTone === t.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'};
                       border: 2px solid ${this._choices.skinTone === t.id ? '#FFD700' : 'transparent'};">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: ${t.hex}; margin: 0 auto 4px; box-shadow: 0 0 6px rgba(0,0,0,0.5);"></div>
                <div style="font-size: 9px; color: rgba(255,255,255,0.6);">${t.name}</div>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 'hair':
        el.innerHTML = `
          <div style="text-align: center; margin-bottom: 10px;">
            <span class="pixel-text" style="font-size: 11px; color: rgba(255,255,255,0.8);">Hair Style & Color</span>
          </div>
          <div style="margin-bottom: 14px;">
            <div style="font-size: 10px; color: rgba(255,255,255,0.5); margin-bottom: 6px; text-align: center;">Style</div>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 6px;">
              ${styles.hairStyles.map(h => `
                <button onclick="SelectScreen.pickHairStyle('${h.id}')"
                  style="padding: 6px 14px; font-family: var(--font-pixel); font-size: 8px; cursor: pointer;
                         background: ${this._choices.hairStyle === h.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'};
                         border: 1px solid ${this._choices.hairStyle === h.id ? '#FFD700' : 'rgba(255,255,255,0.15)'};
                         color: ${this._choices.hairStyle === h.id ? '#FFD700' : 'rgba(255,255,255,0.7)'};
                         border-radius: 6px;">${h.name}</button>
              `).join('')}
            </div>
          </div>
          <div>
            <div style="font-size: 10px; color: rgba(255,255,255,0.5); margin-bottom: 6px; text-align: center;">Color</div>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;">
              ${styles.hairColors.map(c => `
                <div onclick="SelectScreen.pickHairColor('${c.id}')"
                  style="cursor: pointer; width: 32px; height: 32px; border-radius: 50%;
                         background: ${c.hex}; box-shadow: 0 0 6px rgba(0,0,0,0.5);
                         border: 2px solid ${this._choices.hairColor === c.id ? '#FFD700' : 'transparent'};"
                  title="${c.name}"></div>
              `).join('')}
            </div>
          </div>
        `;
        break;

      case 'eyes':
        el.innerHTML = `
          <div style="text-align: center; margin-bottom: 12px;">
            <span class="pixel-text" style="font-size: 11px; color: rgba(255,255,255,0.8);">Eye Color</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px;">
            ${styles.eyeColors.map(c => `
              <div onclick="SelectScreen.pickEyeColor('${c.id}')"
                style="cursor: pointer; text-align: center; padding: 10px 14px; border-radius: 8px;
                       background: ${this._choices.eyeColor === c.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'};
                       border: 2px solid ${this._choices.eyeColor === c.id ? '#FFD700' : 'transparent'};">
                <div style="width: 28px; height: 28px; border-radius: 50%; background: ${c.hex}; margin: 0 auto 4px;
                            box-shadow: 0 0 8px ${c.hex}55;"></div>
                <div style="font-size: 9px; color: rgba(255,255,255,0.6);">${c.name}</div>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 'outfit':
        el.innerHTML = `
          <div style="text-align: center; margin-bottom: 12px;">
            <span class="pixel-text" style="font-size: 11px; color: rgba(255,255,255,0.8);">Starter Outfit</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
            ${styles.outfits.map(o => `
              <div onclick="SelectScreen.pickOutfit('${o.id}')"
                style="cursor: pointer; padding: 12px 18px; border-radius: 8px; text-align: center;
                       background: ${this._choices.outfit === o.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'};
                       border: 2px solid ${this._choices.outfit === o.id ? '#FFD700' : 'transparent'};">
                <div style="width: 40px; height: 40px; border-radius: 6px; margin: 0 auto 6px;
                            background: linear-gradient(180deg, ${o.torsoColor} 50%, ${o.legColor} 50%);
                            box-shadow: 0 0 6px rgba(0,0,0,0.5);"></div>
                <div style="font-size: 10px; color: rgba(255,255,255,0.7);">${o.label}</div>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 'name':
        el.innerHTML = `
          <div style="text-align: center;">
            <span class="pixel-text" style="font-size: 11px; color: rgba(255,255,255,0.8);">Name Your Character</span>
            <div style="margin-top: 16px;">
              <input type="text" id="char-name-input" maxlength="14" placeholder="Enter a name..."
                value="${this._choices.name}"
                oninput="SelectScreen._choices.name = this.value"
                style="padding: 10px 20px; font-family: var(--font-pixel); font-size: 12px; width: 220px;
                       text-align: center; background: rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.2);
                       border-radius: 8px; color: white; outline: none;" />
            </div>
            <p style="margin-top: 12px; font-size: 12px; color: rgba(255,255,255,0.4);">
              You can always change this later.
            </p>
          </div>
        `;
        // Focus the input
        setTimeout(() => {
          const inp = document.getElementById('char-name-input');
          if (inp) inp.focus();
        }, 100);
        break;
    }
  },

  renderNav() {
    const el = document.getElementById('creator-nav');
    if (!el) return;
    const isFirst = this._step === 0;
    const isLast = this._step === this._steps.length - 1;

    el.innerHTML = `
      ${!isFirst ? `<button class="retro-btn" onclick="SelectScreen.prevStep()" style="font-size: 12px; padding: 8px 20px;">◀ Back</button>` : ''}
      ${!isLast
        ? `<button class="retro-btn fun" onclick="SelectScreen.nextStep()" style="font-size: 12px; padding: 8px 24px;">Next ▶</button>`
        : `<button class="retro-btn fun" onclick="SelectScreen.confirmCharacter()" style="font-size: 14px; padding: 10px 28px;">🌃 Enter the City</button>`
      }
    `;
  },

  /* ---- Pickers ---- */
  pickSkin(id) { this._choices.skinTone = id; this.refreshPreview(); this.renderControls(); },
  pickHairStyle(id) { this._choices.hairStyle = id; this.refreshPreview(); this.renderControls(); },
  pickHairColor(id) { this._choices.hairColor = id; this.refreshPreview(); this.renderControls(); },
  pickEyeColor(id) { this._choices.eyeColor = id; this.refreshPreview(); this.renderControls(); },
  pickOutfit(id) { this._choices.outfit = id; this.refreshPreview(); this.renderControls(); },

  /* ---- Navigation ---- */
  nextStep() {
    if (this._step < this._steps.length - 1) {
      this._step++;
      this.renderStep();
    }
  },
  prevStep() {
    if (this._step > 0) {
      this._step--;
      this.renderStep();
    }
  },

  /* ---- Confirm ---- */
  confirmCharacter() {
    const name = this._choices.name.trim() || 'Stranger';
    GameState.player.character = GameState.createCharacter({
      name,
      skinTone: this._choices.skinTone,
      hairStyle: this._choices.hairStyle,
      hairColor: this._choices.hairColor,
      eyeColor: this._choices.eyeColor,
      outfit: this._choices.outfit,
    });
    GameState.player.gameStarted = true;
    SaveManager.autoSave();

    this.cleanup3D();
    App.navigateTo('town');
  },

  /* ---- Cleanup ---- */
  cleanup3D() {
    if (this._preview && this._preview.entry) {
      VoxelEngine.dispose(this._preview.entry.id);
      this._preview = null;
    }
  },
};
