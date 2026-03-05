/* ============================================
   City Gym — 4 Reaction/QTE Games for Stats
   Power Press | Speed Dash | Reflex Catch | Iron Hold
   ============================================ */

const ShopParkScreen = {
  _preview: null,
  _gameActive: false,
  _gameTimer: null,
  _gameInterval: null,

  // ---- NPC: BRICK — quiet, intense, cricket-obsessed ----
  _npcGreetings: [
    "Brick's mid-rep. He doesn't stop. \"...Sup.\"",
    "Brick looks you up and down. \"You eat today? ...You should eat crickets.\"",
    "Brick's mixing a shake. It's brown. \"Don't ask what's in it.\"",
    "\"This body? Crickets. Every single day. I'm not joking.\"",
    "Brick nods slowly. \"Glad you came. Most people can't handle this place.\"",
    "\"...You ever hold a cricket? They're strong for their size. Like me.\"",
  ],

  _npcWinQuips: [
    "Brick closes his eyes. \"...Yeah. That's it. That's the one.\"",
    "\"Not bad.\" He almost smiles. Almost.",
    "Brick nods. \"You've got something. Keep going.\"",
    "\"...Cricket-level performance. That's the highest compliment I give.\"",
    "Brick says nothing. Just fist-bumps you quietly.",
  ],

  _npcLoseQuips: [
    "Brick stares. \"...You need more protein. Specifically cricket protein.\"",
    "\"Hmm.\" He looks away. Disappointed but not surprised.",
    "\"...Come back when you've eaten something real.\"",
    "Brick hands you a dried cricket. Says nothing.",
  ],

  render() {
    this.cleanup();

    const container = document.getElementById('screen-container');
    const character = GameState.player.character;

    if (!character) {
      container.innerHTML = `
        <div style="padding: 32px; text-align: center;">
          <p style="color: rgba(255,255,255,0.7);">No character created yet.</p>
          <button class="retro-btn fun" onclick="App.navigateTo('select')">Create Character</button>
        </div>`;
      return;
    }

    const stats = character.stats || {};
    const greeting = this._npcGreetings[Math.floor(Math.random() * this._npcGreetings.length)];

    container.innerHTML = `
      <div style="padding: 16px; background: linear-gradient(180deg, #0a0008 0%, #1a0020 50%, #0a0008 100%); min-height: 100%;">
        <button class="back-to-town" onclick="App.navigateTo('town')">< Back to Town</button>

        <div class="glass-panel" style="text-align: center; margin-bottom: 16px; border-color: rgba(255,50,50,0.3);">
          <h1 class="pixel-text" style="font-size: 14px; color: #FF3333;">[G] CITY GYM [G]</h1>
          <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin-top: 4px;">Train your body. Shape your destiny.</p>
        </div>

        <!-- NPC Brick -->
        <div class="glass-panel" style="margin-bottom: 16px; padding: 14px; border-color: rgba(255,80,80,0.25); background: rgba(40,10,15,0.8); display: flex; align-items: center; gap: 14px;">
          <div style="font-size: 42px; flex-shrink: 0;">💪</div>
          <div>
            <div class="pixel-text" style="font-size: 9px; color: #FF6633; margin-bottom: 4px;">BRICK — Gym Bro · 🦗 Cricket Enthusiast</div>
            <div id="brick-speech" style="font-size: 12px; color: rgba(255,200,180,0.8); font-style: italic; line-height: 1.4;">${greeting}</div>
          </div>
        </div>

        <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">

          <!-- 3D Character Preview -->
          <div style="flex: 0 0 280px; position: sticky; top: 16px; align-self: flex-start;">
            <div class="glass-panel" style="text-align: center; border-color: rgba(255,50,50,0.2); padding: 8px;">
              <div class="pixel-text" style="font-size: 8px; color: rgba(255,255,255,0.4); margin-bottom: 4px;">// YOUR PHYSIQUE</div>
              <div id="gym-3d-preview" class="voxel-viewport" style="height: 280px; overflow: hidden;"></div>
              <div style="margin-top: 6px;">
                <span class="pixel-text" style="font-size: 8px; color: rgba(255,255,255,0.3);">drag to rotate</span>
              </div>
            </div>
            <!-- Quick stats -->
            <div class="glass-panel" style="margin-top: 8px; padding: 8px;">
              <div class="pixel-text" style="font-size: 7px; color: rgba(255,255,255,0.4); margin-bottom: 6px;">// STATS</div>
              ${this._renderMiniStats(stats)}
            </div>
          </div>

          <!-- Game Cards / Game Area -->
          <div id="gym-game-area" style="flex: 1; min-width: 300px; max-width: 550px;">
            ${this._renderGameCards()}
          </div>
        </div>

        <div id="gym-message" style="text-align: center; margin-top: 12px; min-height: 24px;"></div>
      </div>
    `;

    // Mount 3D preview
    const el = document.getElementById('gym-3d-preview');
    if (el && typeof VoxelCreatures !== 'undefined') {
      this._preview = VoxelCreatures.mountPreview(el, character, {
        height: 280,
        bgColor: 0x100010,
        orbit: true,
      });
    }

    GameState.updateAddressBar('gym');
    GameState.updateStatus('City Gym', 'G');
  },

  _renderMiniStats(stats) {
    const defs = [
      { key: 'strength', label: 'STR', color: '#FF4444' },
      { key: 'speed', label: 'SPD', color: '#FFD700' },
      { key: 'stamina', label: 'STA', color: '#32CD32' },
      { key: 'charisma', label: 'CHA', color: '#FF69B4' },
      { key: 'intelligence', label: 'INT', color: '#00BFFF' },
    ];
    return defs.map(d => `
      <div style="display: flex; align-items: center; gap: 4px; margin: 2px 0;">
        <span class="pixel-text" style="font-size: 7px; width: 24px; color: ${d.color};">${d.label}</span>
        <div style="flex: 1; height: 5px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden;">
          <div style="height: 100%; width: ${((stats[d.key] || 0) / 999) * 100}%; background: ${d.color}; border-radius: 2px;"></div>
        </div>
        <span style="font-size: 9px; color: rgba(255,255,255,0.4); width: 24px; text-align: right;">${stats[d.key] || 0}</span>
      </div>
    `).join('');
  },

  _renderGameCards() {
    const games = [
      {
        id: 'power', name: 'POWER PRESS', stat: 'STR', statColor: '#FF4444',
        desc: 'Mash the button to fill the power meter!',
        reward: '+5-15 Strength', icon: '|||',
      },
      {
        id: 'speed', name: 'SPEED DASH', stat: 'SPD', statColor: '#FFD700',
        desc: 'Hit the right arrow keys before they fade!',
        reward: '+3-12 Speed', icon: '>>>',
      },
      {
        id: 'reflex', name: 'REFLEX CATCH', stat: 'STA', statColor: '#32CD32',
        desc: 'Click targets before they vanish!',
        reward: '+3-10 Stamina', icon: '[+]',
      },
      {
        id: 'hold', name: 'IRON HOLD', stat: 'CHA+', statColor: '#FF69B4',
        desc: 'Hold and release at the perfect moment!',
        reward: '+3-8 Charisma + all stats', icon: '(O)',
      },
    ];

    return `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
      ${games.map(g => `
        <div class="glass-panel" style="text-align: center; padding: 14px; cursor: pointer; border-color: ${g.statColor}33; transition: all 0.15s;"
             onmouseenter="this.style.borderColor='${g.statColor}88'" onmouseleave="this.style.borderColor='${g.statColor}33'">
          <div style="font-size: 20px; font-family: var(--font-pixel); color: ${g.statColor}; margin-bottom: 6px;">${g.icon}</div>
          <h3 class="pixel-text" style="font-size: 10px; color: ${g.statColor};">${g.name}</h3>
          <p style="font-size: 10px; color: rgba(255,255,255,0.4); margin: 4px 0; line-height: 1.3;">${g.desc}</p>
          <div class="pixel-text" style="font-size: 7px; color: ${g.statColor}; margin-bottom: 8px;">${g.reward}</div>
          <button class="retro-btn fun" onclick="ShopParkScreen.startGame('${g.id}')" style="font-size: 10px; padding: 4px 16px;">TRAIN</button>
        </div>
      `).join('')}
    </div>`;
  },

  /* ==== GAME LAUNCHER ==== */
  startGame(gameId) {
    if (this._gameActive) return;
    this._gameActive = true;
    const area = document.getElementById('gym-game-area');
    if (!area) return;

    switch (gameId) {
      case 'power': this._startPowerPress(area); break;
      case 'speed': this._startSpeedDash(area); break;
      case 'reflex': this._startReflexCatch(area); break;
      case 'hold': this._startIronHold(area); break;
    }
  },

  _endGame(statBoosts, message) {
    this._gameActive = false;
    if (this._gameTimer) { clearTimeout(this._gameTimer); this._gameTimer = null; }
    if (this._gameInterval) { clearInterval(this._gameInterval); this._gameInterval = null; }

    const character = GameState.player.character;
    if (character && statBoosts) {
      PetEngine.boostStats(character, statBoosts);
    }

    // Brick's NPC quip
    const quips = statBoosts ? this._npcWinQuips : this._npcLoseQuips;
    const quip = quips[Math.floor(Math.random() * quips.length)];
    const speech = document.getElementById('brick-speech');
    if (speech) speech.textContent = quip;

    // Show result, then refresh
    const area = document.getElementById('gym-game-area');
    if (area) {
      const boostText = statBoosts
        ? Object.entries(statBoosts).map(([s, v]) => `+${v} ${s.toUpperCase()}`).join(', ')
        : 'No gains this time';
      area.innerHTML = `
        <div class="glass-panel" style="text-align: center; padding: 32px; border-color: ${statBoosts ? 'rgba(50,255,50,0.3)' : 'rgba(255,50,50,0.3)'};">
          <div style="font-size: 24px; font-family: var(--font-pixel); color: ${statBoosts ? '#39FF14' : '#FF4444'}; margin-bottom: 12px;">
            ${statBoosts ? 'GAINS!' : 'NO GAINS...'}
          </div>
          <p style="font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 8px;">${message}</p>
          <p class="pixel-text" style="font-size: 10px; color: #FFD700;">${boostText}</p>
          <button class="retro-btn fun" onclick="ShopParkScreen.render()" style="margin-top: 16px; font-size: 12px;">BACK TO GYM</button>
        </div>
      `;
    }

    // Refresh 3D model to show physique change
    if (this._preview && this._preview.creature && this._preview.entry) {
      const scene = this._preview.entry.scene;
      scene.remove(this._preview.creature);
      const newModel = VoxelCreatures.build(character, { scale: 0.8 });
      newModel.position.y = 0.1;
      scene.add(newModel);
      this._preview.creature = newModel;
    }

    SaveManager.autoSave();
  },

  /* ==== GAME 1: POWER PRESS ==== */
  _startPowerPress(area) {
    let taps = 0;
    const duration = 5000;
    const maxTaps = 40; // 40 taps = perfect
    let startTime = null;

    area.innerHTML = `
      <div class="glass-panel" style="text-align: center; padding: 20px; border-color: rgba(255,68,68,0.3);">
        <h2 class="pixel-text" style="font-size: 12px; color: #FF4444; margin-bottom: 12px;">POWER PRESS</h2>
        <p style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 16px;">Mash the button as fast as you can!</p>

        <!-- Timer bar -->
        <div style="margin-bottom: 16px;">
          <div style="font-size: 10px; color: rgba(255,255,255,0.4); margin-bottom: 4px;">TIME</div>
          <div style="height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
            <div id="pp-timer-bar" style="height: 100%; width: 100%; background: #FF4444; border-radius: 4px; transition: width 0.1s linear;"></div>
          </div>
        </div>

        <!-- Power meter -->
        <div style="margin-bottom: 16px;">
          <div style="font-size: 10px; color: rgba(255,255,255,0.4); margin-bottom: 4px;">POWER <span id="pp-count" style="color: #FF4444;">0</span></div>
          <div style="height: 24px; background: rgba(255,255,255,0.05); border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,68,68,0.2);">
            <div id="pp-power-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #FF4444, #FF8800); border-radius: 6px; transition: width 0.05s;"></div>
          </div>
        </div>

        <!-- Tap button -->
        <button id="pp-tap-btn" class="retro-btn fun" style="font-size: 16px; padding: 16px 48px; width: 100%;"
                onclick="ShopParkScreen._ppTap()">
          PRESS!
        </button>
      </div>
    `;

    startTime = Date.now();

    // Timer countdown
    this._gameInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1 - elapsed / duration);
      const bar = document.getElementById('pp-timer-bar');
      if (bar) bar.style.width = (remaining * 100) + '%';
    }, 50);

    // Store tap handler data on the screen object
    this._ppTaps = 0;
    this._ppMax = maxTaps;

    this._gameTimer = setTimeout(() => {
      clearInterval(this._gameInterval);
      const ratio = Math.min(1, this._ppTaps / maxTaps);
      const strGain = Math.round(5 + ratio * 10);
      if (ratio >= 0.25) {
        this._endGame({ strength: strGain }, `${this._ppTaps} presses! Raw power!`);
      } else {
        this._endGame(null, `Only ${this._ppTaps} presses... try harder!`);
      }
    }, duration);
  },

  _ppTap() {
    if (!this._gameActive) return;
    this._ppTaps = (this._ppTaps || 0) + 1;
    const count = document.getElementById('pp-count');
    const bar = document.getElementById('pp-power-bar');
    if (count) count.textContent = this._ppTaps;
    if (bar) bar.style.width = Math.min(100, (this._ppTaps / this._ppMax) * 100) + '%';
  },

  /* ==== GAME 2: SPEED DASH ==== */
  _startSpeedDash(area) {
    const arrows = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];
    const arrowSymbols = { ArrowLeft: '<', ArrowUp: '^', ArrowRight: '>', ArrowDown: 'v' };
    const totalRounds = 10;
    let round = 0;
    let hits = 0;
    let currentArrow = null;
    let arrowTimeout = null;

    area.innerHTML = `
      <div class="glass-panel" style="text-align: center; padding: 20px; border-color: rgba(255,215,0,0.3);">
        <h2 class="pixel-text" style="font-size: 12px; color: #FFD700; margin-bottom: 8px;">SPEED DASH</h2>
        <p style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 12px;">Press the matching arrow key!</p>
        <div style="font-size: 10px; color: rgba(255,255,255,0.4); margin-bottom: 12px;">
          Round: <span id="sd-round">0</span>/${totalRounds} | Hits: <span id="sd-hits" style="color: #39FF14;">0</span>
        </div>
        <div id="sd-arrow-display" style="font-size: 72px; font-family: var(--font-pixel); color: #FFD700; height: 100px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
          <span style="font-size: 14px; color: rgba(255,255,255,0.4);">Get ready...</span>
        </div>
        <div id="sd-feedback" style="font-size: 12px; min-height: 20px; margin-bottom: 8px;"></div>
        <div style="font-size: 10px; color: rgba(255,255,255,0.3);">Use arrow keys: < ^ > v</div>
      </div>
    `;

    const showNextArrow = () => {
      if (round >= totalRounds) {
        // Game over
        document.removeEventListener('keydown', keyHandler);
        const ratio = hits / totalRounds;
        const spdGain = Math.round(3 + ratio * 9);
        if (ratio >= 0.3) {
          this._endGame({ speed: spdGain }, `${hits}/${totalRounds} hits! Lightning reflexes!`);
        } else {
          this._endGame(null, `Only ${hits}/${totalRounds}... too slow!`);
        }
        return;
      }

      round++;
      const roundEl = document.getElementById('sd-round');
      if (roundEl) roundEl.textContent = round;

      currentArrow = arrows[Math.floor(Math.random() * arrows.length)];
      const display = document.getElementById('sd-arrow-display');
      if (display) {
        display.innerHTML = `<span style="color: #FFD700; text-shadow: 0 0 20px #FFD700;">${arrowSymbols[currentArrow]}</span>`;
      }

      // Arrow fades after 1.2s
      arrowTimeout = setTimeout(() => {
        currentArrow = null;
        const fb = document.getElementById('sd-feedback');
        if (fb) fb.innerHTML = '<span style="color: #FF4444;">MISS!</span>';
        if (display) display.innerHTML = '';
        setTimeout(showNextArrow, 400);
      }, 1200);
    };

    const keyHandler = (e) => {
      if (!currentArrow) return;
      if (e.key === currentArrow) {
        hits++;
        const hitsEl = document.getElementById('sd-hits');
        if (hitsEl) hitsEl.textContent = hits;
        const fb = document.getElementById('sd-feedback');
        if (fb) fb.innerHTML = '<span style="color: #39FF14;">HIT!</span>';
      } else {
        const fb = document.getElementById('sd-feedback');
        if (fb) fb.innerHTML = '<span style="color: #FF4444;">WRONG!</span>';
      }
      clearTimeout(arrowTimeout);
      currentArrow = null;
      const display = document.getElementById('sd-arrow-display');
      if (display) display.innerHTML = '';
      setTimeout(showNextArrow, 400);
    };

    document.addEventListener('keydown', keyHandler);
    // Store for cleanup
    this._sdKeyHandler = keyHandler;

    // Start after 1.5s
    setTimeout(showNextArrow, 1500);
  },

  /* ==== GAME 3: REFLEX CATCH ==== */
  _startReflexCatch(area) {
    const gridSize = 3;
    const totalTargets = 15;
    const gameDuration = 12000;
    let caught = 0;
    let spawned = 0;
    let activeCell = -1;

    area.innerHTML = `
      <div class="glass-panel" style="text-align: center; padding: 20px; border-color: rgba(50,205,50,0.3);">
        <h2 class="pixel-text" style="font-size: 12px; color: #32CD32; margin-bottom: 8px;">REFLEX CATCH</h2>
        <p style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 8px;">Click the targets before they vanish!</p>
        <div style="font-size: 10px; color: rgba(255,255,255,0.4); margin-bottom: 12px;">
          Caught: <span id="rc-caught" style="color: #39FF14;">0</span>/${totalTargets}
        </div>
        <!-- Timer -->
        <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; margin-bottom: 12px;">
          <div id="rc-timer-bar" style="height: 100%; width: 100%; background: #32CD32; border-radius: 3px; transition: width 0.1s linear;"></div>
        </div>
        <!-- Grid -->
        <div id="rc-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; max-width: 280px; margin: 0 auto;">
          ${Array.from({ length: 9 }, (_, i) => `
            <div id="rc-cell-${i}" onclick="ShopParkScreen._rcClick(${i})"
                 style="aspect-ratio: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
                        border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;
                        transition: all 0.1s; font-size: 24px; font-family: var(--font-pixel);"></div>
          `).join('')}
        </div>
      </div>
    `;

    const startTime = Date.now();
    const targetColors = ['#FF4444', '#FFD700', '#39FF14', '#FF69B4', '#00BFFF'];

    // Timer bar
    this._gameInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1 - elapsed / gameDuration);
      const bar = document.getElementById('rc-timer-bar');
      if (bar) bar.style.width = (remaining * 100) + '%';
    }, 50);

    // Store state
    this._rcCaught = 0;
    this._rcActive = -1;

    const spawnTarget = () => {
      if (spawned >= totalTargets) return;
      spawned++;

      // Clear previous
      if (this._rcActive >= 0) {
        const prev = document.getElementById(`rc-cell-${this._rcActive}`);
        if (prev) { prev.innerHTML = ''; prev.style.background = 'rgba(255,255,255,0.04)'; prev.style.borderColor = 'rgba(255,255,255,0.08)'; }
      }

      // Pick new cell
      let newCell;
      do { newCell = Math.floor(Math.random() * 9); } while (newCell === this._rcActive);
      this._rcActive = newCell;

      const cell = document.getElementById(`rc-cell-${newCell}`);
      const color = targetColors[Math.floor(Math.random() * targetColors.length)];
      if (cell) {
        cell.innerHTML = `<span style="color: ${color}; text-shadow: 0 0 10px ${color};">[X]</span>`;
        cell.style.background = `${color}11`;
        cell.style.borderColor = `${color}66`;
      }

      // Target vanishes after 700ms
      setTimeout(() => {
        if (this._rcActive === newCell) {
          const c = document.getElementById(`rc-cell-${newCell}`);
          if (c) { c.innerHTML = ''; c.style.background = 'rgba(255,255,255,0.04)'; c.style.borderColor = 'rgba(255,255,255,0.08)'; }
          this._rcActive = -1;
        }
      }, 700);
    };

    // Spawn targets at intervals
    const spawnInterval = setInterval(() => {
      if (spawned >= totalTargets) {
        clearInterval(spawnInterval);
        return;
      }
      spawnTarget();
    }, gameDuration / totalTargets);

    // Store for cleanup
    this._rcSpawnInterval = spawnInterval;

    // End game after duration
    this._gameTimer = setTimeout(() => {
      clearInterval(this._gameInterval);
      clearInterval(this._rcSpawnInterval);
      const ratio = this._rcCaught / totalTargets;
      const staGain = Math.round(3 + ratio * 7);
      if (ratio >= 0.2) {
        this._endGame({ stamina: staGain }, `${this._rcCaught}/${totalTargets} caught! Sharp reflexes!`);
      } else {
        this._endGame(null, `Only ${this._rcCaught}/${totalTargets}... need more practice!`);
      }
    }, gameDuration + 500);

    // Start first spawn
    setTimeout(spawnTarget, 800);
  },

  _rcClick(cellIdx) {
    if (this._rcActive === cellIdx) {
      this._rcCaught = (this._rcCaught || 0) + 1;
      const caughtEl = document.getElementById('rc-caught');
      if (caughtEl) caughtEl.textContent = this._rcCaught;

      // Visual feedback
      const cell = document.getElementById(`rc-cell-${cellIdx}`);
      if (cell) {
        cell.innerHTML = '<span style="color: #39FF14;">OK</span>';
        cell.style.background = 'rgba(57,255,20,0.1)';
        setTimeout(() => {
          if (cell) { cell.innerHTML = ''; cell.style.background = 'rgba(255,255,255,0.04)'; cell.style.borderColor = 'rgba(255,255,255,0.08)'; }
        }, 200);
      }
      this._rcActive = -1;
    }
  },

  /* ==== GAME 4: IRON HOLD ==== */
  _startIronHold(area) {
    const targetTime = 3 + Math.random() * 4; // 3-7 seconds hidden target
    let holding = false;
    let holdStart = 0;

    area.innerHTML = `
      <div class="glass-panel" style="text-align: center; padding: 20px; border-color: rgba(255,105,180,0.3);">
        <h2 class="pixel-text" style="font-size: 12px; color: #FF69B4; margin-bottom: 8px;">IRON HOLD</h2>
        <p style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 12px;">Hold the button and release at the perfect moment!</p>
        <p style="font-size: 10px; color: rgba(255,255,255,0.3); margin-bottom: 16px;">Target: somewhere between 3-7 seconds</p>

        <!-- Hold meter -->
        <div style="margin-bottom: 16px; position: relative;">
          <div style="height: 32px; background: rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,105,180,0.2); position: relative;">
            <div id="ih-fill" style="height: 100%; width: 0%; background: linear-gradient(90deg, #FF69B4, #FF00FF, #FFD700); border-radius: 8px; transition: width 0.05s;"></div>
            <!-- Zone markers -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: space-around; align-items: center; pointer-events: none;">
              <span style="font-size: 8px; color: rgba(255,255,255,0.2);">3s</span>
              <span style="font-size: 8px; color: rgba(255,255,255,0.2);">5s</span>
              <span style="font-size: 8px; color: rgba(255,255,255,0.2);">7s</span>
            </div>
          </div>
        </div>

        <div id="ih-time" class="pixel-text" style="font-size: 18px; color: #FF69B4; margin-bottom: 16px;">0.0s</div>

        <!-- Hold button -->
        <button id="ih-btn" class="retro-btn fun" style="font-size: 16px; padding: 20px 48px; width: 100%; user-select: none;"
                onmousedown="ShopParkScreen._ihDown()" onmouseup="ShopParkScreen._ihUp()"
                ontouchstart="ShopParkScreen._ihDown()" ontouchend="ShopParkScreen._ihUp()">
          HOLD
        </button>
        <div style="font-size: 9px; color: rgba(255,255,255,0.3); margin-top: 8px;">Hold down, release when you think you've hit the target</div>
      </div>
    `;

    this._ihTarget = targetTime;
    this._ihHolding = false;
    this._ihStart = 0;
  },

  _ihDown() {
    if (!this._gameActive || this._ihHolding) return;
    this._ihHolding = true;
    this._ihStart = Date.now();

    const btn = document.getElementById('ih-btn');
    if (btn) { btn.textContent = 'HOLDING...'; btn.style.background = 'rgba(255,105,180,0.3)'; }

    // Update display
    this._gameInterval = setInterval(() => {
      const elapsed = (Date.now() - this._ihStart) / 1000;
      const timeEl = document.getElementById('ih-time');
      if (timeEl) timeEl.textContent = elapsed.toFixed(1) + 's';

      const fill = document.getElementById('ih-fill');
      if (fill) fill.style.width = Math.min(100, (elapsed / 8) * 100) + '%';

      // Auto-fail at 8 seconds
      if (elapsed >= 8) {
        this._ihUp();
      }
    }, 50);
  },

  _ihUp() {
    if (!this._ihHolding) return;
    this._ihHolding = false;
    clearInterval(this._gameInterval);

    const elapsed = (Date.now() - this._ihStart) / 1000;
    const diff = Math.abs(elapsed - this._ihTarget);
    const accuracy = Math.max(0, 1 - diff / 3); // 0-1, 1 = perfect

    if (accuracy >= 0.15) {
      const chaGain = Math.round(3 + accuracy * 5);
      const allGain = Math.round(1 + accuracy * 2);
      this._endGame(
        { charisma: chaGain, strength: allGain, speed: allGain, stamina: allGain, intelligence: allGain },
        `Held for ${elapsed.toFixed(1)}s (target: ${this._ihTarget.toFixed(1)}s) — ${Math.round(accuracy * 100)}% accuracy!`
      );
    } else {
      this._endGame(null, `Held for ${elapsed.toFixed(1)}s but target was ${this._ihTarget.toFixed(1)}s — way off!`);
    }
  },

  /* ==== Utilities ==== */
  showMessage(text, type) {
    const el = document.getElementById('gym-message');
    if (!el) return;
    const color = type === 'success' ? '#39FF14' : type === 'warning' ? '#FF6347' : '#CCCCCC';
    el.innerHTML = `<span class="pixel-text" style="font-size: 9px; color: ${color};">${text}</span>`;
    setTimeout(() => { if (el) el.innerHTML = ''; }, 3000);
  },

  cleanup() {
    this._gameActive = false;
    if (this._gameTimer) { clearTimeout(this._gameTimer); this._gameTimer = null; }
    if (this._gameInterval) { clearInterval(this._gameInterval); this._gameInterval = null; }
    if (this._rcSpawnInterval) { clearInterval(this._rcSpawnInterval); this._rcSpawnInterval = null; }
    if (this._sdKeyHandler) { document.removeEventListener('keydown', this._sdKeyHandler); this._sdKeyHandler = null; }
    if (this._preview && this._preview.entry) {
      VoxelEngine.dispose(this._preview.entry.id);
      this._preview = null;
    }
  },
};
