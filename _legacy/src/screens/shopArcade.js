/* ============================================
   Arcade — 3 Strategy Mini-Games
   Glitch Trader · Void Grid · Signal Decoder
   ============================================ */

const ShopArcadeScreen = {
  gameActive: false,
  gameTimer: null,

  render() {
    const container = document.getElementById('screen-container');
    const character = GameState.player.character;
    const charName = character ? character.name : 'Stranger';

    container.innerHTML = `
      <div style="padding: 16px; background: linear-gradient(180deg, #0a0020 0%, #1a0a30 50%, #0a0020 100%); min-height: 100%;">
        <button class="back-to-town" onclick="App.navigateTo('town')">◀ Back to Town</button>

        <div class="glass-panel" style="text-align: center; margin-bottom: 16px; border-color: rgba(106,90,205,0.3);">
          <h1 class="pixel-text" style="font-size: 14px; color: #6A5ACD;">[>>] ccllottaa Arcade [<<]</h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 12px;">Strategy games — think before you act.</p>
          <p style="color: rgba(255,255,255,0.35); font-size: 10px; margin-top: 4px;">${GameState.player.coins} coins</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; max-width: 800px; margin: 0 auto;">
          
          <!-- Glitch Trader -->
          <div class="glass-panel" style="text-align: center;">
            <div style="margin-bottom: 8px;">${PixelIcons.large('cards')}</div>
            <h3 class="pixel-text" style="font-size: 11px; color: #FF69B4;">Glitch Trader</h3>
            <p style="font-size: 10px; color: rgba(255,255,255,0.5); margin: 6px 0; line-height: 1.4;">Beat the Shadow Dealer's hand.<br>Peek, swap, or fold.</p>
            <div style="font-size: 10px; color: #FFD700; margin-bottom: 8px;">+30 coins, +5 charisma</div>
            <button class="retro-btn fun" onclick="ShopArcadeScreen.showRules('trader')">Play!</button>
          </div>

          <!-- Void Grid -->
          <div class="glass-panel" style="text-align: center;">
            <div style="margin-bottom: 8px;">${PixelIcons.large('grid')}</div>
            <h3 class="pixel-text" style="font-size: 11px; color: #00BFFF;">Void Grid</h3>
            <p style="font-size: 10px; color: rgba(255,255,255,0.5); margin: 6px 0; line-height: 1.4;">Claim safe cells on the grid.<br>Avoid the void.</p>
            <div style="font-size: 10px; color: #FFD700; margin-bottom: 8px;">+35 coins, +5 intelligence</div>
            <button class="retro-btn fun" onclick="ShopArcadeScreen.showRules('grid')">Play!</button>
          </div>

          <!-- Signal Decoder -->
          <div class="glass-panel" style="text-align: center;">
            <div style="margin-bottom: 8px;">${PixelIcons.large('antenna')}</div>
            <h3 class="pixel-text" style="font-size: 11px; color: #32CD32;">Signal Decoder</h3>
            <p style="font-size: 10px; color: rgba(255,255,255,0.5); margin: 6px 0; line-height: 1.4;">Crack the encrypted signal.<br>5 attempts to decode.</p>
            <div style="font-size: 10px; color: #FFD700; margin-bottom: 8px;">+25 coins, +5 intelligence</div>
            <button class="retro-btn fun" onclick="ShopArcadeScreen.showRules('decoder')">Play!</button>
          </div>
        </div>

        <div id="arcade-game-area" style="margin-top: 20px;"></div>
        <div id="shop-message" style="text-align: center; margin-top: 8px;"></div>
      </div>
    `;

    GameState.updateAddressBar('arcade');
    GameState.updateStatus('Playing at the Arcade!', '>');
  },

  cleanup() {
    this.gameActive = false;
    if (this.gameTimer) clearInterval(this.gameTimer);
  },

  /* =============== SHARED UTILITIES =============== */

  rewardPlayer(coins, statBoosts) {
    GameState.addCoins(coins);
    const character = GameState.player.character;
    if (character && statBoosts) {
      PetEngine.boostStats(character, statBoosts);
    }
    GameState.player.gamesPlayed++;
    SaveManager.autoSave();
  },

  showWinScreen(coins, statName) {
    const area = document.getElementById('arcade-game-area');
    const character = GameState.player.character;
    const charName = character ? character.name : 'You';
    area.innerHTML = `
      <div class="glass-panel" style="max-width: 400px; margin: 0 auto; text-align: center; border-color: rgba(50,205,50,0.4);">
        <div style="margin-bottom: 8px;">${PixelIcons.xl('happy')}</div>
        <h2 class="pixel-text" style="font-size: 14px; color: #32CD32; margin-bottom: 8px;">YOU WIN!</h2>
        <p style="font-size: 13px; color: #FFD700; margin-bottom: 4px;">+${coins} coins</p>
        <p style="font-size: 11px; color: rgba(255,255,255,0.6);">+5 ${statName} ⬆</p>
        <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 12px;">${charName} looks satisfied.</p>
        <button class="retro-btn fun" onclick="ShopArcadeScreen.render()" style="margin-top: 16px;">Back to Arcade</button>
      </div>
    `;
  },

  showLoseScreen() {
    const area = document.getElementById('arcade-game-area');
    const character = GameState.player.character;
    const charName = character ? character.name : 'You';
    area.innerHTML = `
      <div class="glass-panel" style="max-width: 400px; margin: 0 auto; text-align: center; border-color: rgba(255,99,71,0.4);">
        <div style="margin-bottom: 8px;">${PixelIcons.xl('sad')}</div>
        <h2 class="pixel-text" style="font-size: 14px; color: #FF6347; margin-bottom: 8px;">YOU LOSE</h2>
        <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 4px;">${charName} looks broke and disappointed.</p>
        <p style="font-size: 14px; margin: 8px 0; font-family: var(--font-pixel); color: #FF6347;">-x- NO COINS -x-</p>
        <p style="font-size: 10px; color: rgba(255,255,255,0.3);">No coins this time...</p>
        <button class="retro-btn" onclick="ShopArcadeScreen.render()" style="margin-top: 16px;">Try Again</button>
      </div>
    `;
  },

  /* =============== RULES SCREENS =============== */

  showRules(game) {
    const area = document.getElementById('arcade-game-area');
    const rules = {
      trader: {
        title: '🃏 Glitch Trader',
        color: '#FF69B4',
        lines: [
          'You and the Shadow Dealer each get <b>3 data cards</b> (values 1–9).',
          'Your cards are <b>face-up</b>. The Dealer\'s are <b>face-down</b>.',
          'You may <b>PEEK</b> at one dealer card (costs 10 coins).',
          'You may <b>SWAP</b> one of your cards for a new random one (once).',
          'When ready, <b>BET</b> to compare totals — or <b>FOLD</b> to quit safely.',
          'If your total ≥ Dealer\'s total → <b>you win +30 coins!</b>',
          'If your total < Dealer\'s → <b>you lose.</b>',
        ],
        start: 'ShopArcadeScreen.startGlitchTrader()',
      },
      grid: {
        title: '🔲 Void Grid',
        color: '#00BFFF',
        lines: [
          'A 4×4 grid hides <b>5 void cells</b> (dangerous) and <b>11 data cells</b> (safe).',
          'You must <b>claim exactly 4 cells</b>, one at a time.',
          'Each claimed data cell shows a <b>number</b> = how many adjacent cells are void.',
          'Use the numbers to <b>deduce</b> where the voids are hiding.',
          'Claim 4 data cells → <b>you win +35 coins!</b>',
          'Hit a void → <b>game over.</b>',
        ],
        start: 'ShopArcadeScreen.startVoidGrid()',
      },
      decoder: {
        title: '📡 Signal Decoder',
        color: '#32CD32',
        lines: [
          'A secret <b>3-symbol code</b> is hidden (from 6 possible symbols).',
          'You have <b>5 attempts</b> to crack the code.',
          'After each guess, feedback tells you:',
          '&nbsp;&nbsp;✦ = <b>right symbol, right position</b>',
          '&nbsp;&nbsp;◇ = <b>right symbol, wrong position</b>',
          '&nbsp;&nbsp;✕ = <b>wrong symbol entirely</b>',
          'Decode all 3 → <b>you win +25 coins!</b>',
        ],
        start: 'ShopArcadeScreen.startSignalDecoder()',
      },
    };

    const r = rules[game];
    area.innerHTML = `
      <div class="glass-panel" style="max-width: 440px; margin: 0 auto; text-align: left; border-color: ${r.color}33;">
        <h2 class="pixel-text" style="font-size: 13px; color: ${r.color}; text-align: center; margin-bottom: 12px;">${r.title}</h2>
        <div style="font-size: 12px; color: rgba(255,255,255,0.7); line-height: 1.8;">
          ${r.lines.map((l, i) => `<div style="margin-bottom: 4px;">${i + 1}. ${l}</div>`).join('')}
        </div>
        <div style="text-align: center; margin-top: 16px;">
          <button class="retro-btn fun" onclick="${r.start}" style="font-size: 13px; padding: 10px 28px;">Got it — Let's play!</button>
        </div>
      </div>
    `;
  },

  /* =============== GAME 1: GLITCH TRADER =============== */

  startGlitchTrader() {
    this.gameActive = true;
    const randCard = () => Math.floor(Math.random() * 9) + 1;

    this._trader = {
      playerCards: [randCard(), randCard(), randCard()],
      dealerCards: [randCard(), randCard(), randCard()],
      peeked: [false, false, false],
      swapped: false,
      peekCost: 10,
    };

    this.renderTrader();
  },

  renderTrader() {
    const t = this._trader;
    const area = document.getElementById('arcade-game-area');
    const pTotal = t.playerCards.reduce((a, b) => a + b, 0);
    const canPeek = GameState.player.coins >= t.peekCost;

    area.innerHTML = `
      <div class="glass-panel" style="max-width: 460px; margin: 0 auto; text-align: center; border-color: rgba(255,105,180,0.3);">
        <h3 class="pixel-text" style="font-size: 11px; color: #FF69B4; margin-bottom: 12px;">🃏 Glitch Trader</h3>
        
        <!-- Dealer's Hand -->
        <p style="font-size: 10px; color: rgba(255,255,255,0.4); margin-bottom: 6px;">Shadow Dealer's Hand</p>
        <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 16px;">
          ${t.dealerCards.map((card, i) => `
            <div style="width: 60px; height: 80px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: bold;
              ${t.peeked[i]
        ? `background: rgba(255,105,180,0.15); border: 2px solid rgba(255,105,180,0.5); color: #FF69B4;`
        : `background: rgba(80,40,100,0.4); border: 2px solid rgba(80,40,100,0.6); color: rgba(255,255,255,0.2);`}
            ">${t.peeked[i] ? card : '?'}</div>
          `).join('')}
        </div>
        
        <!-- Player's Hand -->
        <p style="font-size: 10px; color: rgba(255,255,255,0.4); margin-bottom: 6px;">Your Hand (total: <span style="color: #FFD700;">${pTotal}</span>)</p>
        <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 16px;">
          ${t.playerCards.map((card, i) => `
            <div style="width: 60px; height: 80px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: bold;
              background: rgba(50,205,50,0.1); border: 2px solid rgba(50,205,50,0.4); color: #32CD32;
            ">${card}${!t.swapped ? `<span onclick="ShopArcadeScreen.traderSwap(${i})" style="position: absolute; font-size: 8px; color: #FFD700; cursor: pointer; margin-top: 60px;">swap</span>` : ''}</div>
          `).join('')}
        </div>
        
        <!-- Actions -->
        <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
          ${!t.peeked.every(p => p) ? `
            <button class="retro-btn" onclick="ShopArcadeScreen.traderPeek()" ${!canPeek ? 'disabled style="opacity:0.4"' : ''} style="font-size: 11px;">
              👁️ Peek (${t.peekCost}💰)
            </button>
          ` : ''}
          <button class="retro-btn fun" onclick="ShopArcadeScreen.traderBet()" style="font-size: 11px;">
            ⚔️ BET!
          </button>
          <button class="retro-btn" onclick="ShopArcadeScreen.traderFold()" style="font-size: 11px;">
            🏳️ Fold
          </button>
        </div>
      </div>
    `;
  },

  traderPeek() {
    if (!this.gameActive) return;
    const t = this._trader;
    if (GameState.player.coins < t.peekCost) return;

    // Find first un-peeked card
    const idx = t.peeked.findIndex(p => !p);
    if (idx === -1) return;

    GameState.removeCoins(t.peekCost);
    t.peeked[idx] = true;
    this.renderTrader();
  },

  traderSwap(index) {
    if (!this.gameActive || this._trader.swapped) return;
    this._trader.swapped = true;
    this._trader.playerCards[index] = Math.floor(Math.random() * 9) + 1;
    this.renderTrader();
  },

  traderBet() {
    if (!this.gameActive) return;
    this.gameActive = false;
    const t = this._trader;
    const pTotal = t.playerCards.reduce((a, b) => a + b, 0);
    const dTotal = t.dealerCards.reduce((a, b) => a + b, 0);
    const won = pTotal >= dTotal;

    // Award immediately if won
    if (won) {
      try { this.rewardPlayer(30, { charisma: 5 }); } catch (e) { console.warn('reward error', e); }
    }

    const area = document.getElementById('arcade-game-area');
    if (!area) return;

    const resultEmoji = won ? '😎' : '😢';
    const resultTitle = won ? 'YOU WIN!' : 'YOU LOSE';
    const resultColor = won ? '#32CD32' : '#FF6347';
    const character = GameState.player.character;
    const charName = character ? character.name : 'You';
    const resultMsg = won
      ? `<p style="font-size: 13px; color: #FFD700;">+30 coins 💰</p><p style="font-size: 11px; color: rgba(255,255,255,0.6);">+5 charisma ⬆</p><p style="font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 4px;">${charName} looks satisfied.</p>`
      : `<p style="font-size: 12px; color: rgba(255,255,255,0.5);">${charName} looks broke and disappointed.</p><p style="font-size: 20px; margin: 4px 0;">💸🚫💸</p>`;

    area.innerHTML = `
      <div class="glass-panel" style="max-width: 460px; margin: 0 auto; text-align: center; border-color: ${won ? 'rgba(50,205,50,0.4)' : 'rgba(255,99,71,0.4)'};">
        <h3 class="pixel-text" style="font-size: 11px; color: #FF69B4; margin-bottom: 12px;">🃏 Results</h3>
        <div style="display: flex; justify-content: center; gap: 24px; margin-bottom: 16px;">
          <div>
            <p style="font-size: 10px; color: rgba(255,255,255,0.4); margin-bottom: 6px;">Dealer: <b style="color: #FF69B4;">${dTotal}</b></p>
            <div style="display: flex; gap: 6px;">${t.dealerCards.map(c => `<div style="width: 50px; height: 65px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; background: rgba(255,105,180,0.15); border: 2px solid rgba(255,105,180,0.5); color: #FF69B4;">${c}</div>`).join('')}</div>
          </div>
          <div style="display: flex; align-items: center; font-size: 24px; color: #FFD700;">VS</div>
          <div>
            <p style="font-size: 10px; color: rgba(255,255,255,0.4); margin-bottom: 6px;">You: <b style="color: #32CD32;">${pTotal}</b></p>
            <div style="display: flex; gap: 6px;">${t.playerCards.map(c => `<div style="width: 50px; height: 65px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; background: rgba(50,205,50,0.1); border: 2px solid rgba(50,205,50,0.4); color: #32CD32;">${c}</div>`).join('')}</div>
          </div>
        </div>
        <div style="font-size: 48px; margin: 8px 0;">${resultEmoji}</div>
        <h2 class="pixel-text" style="font-size: 14px; color: ${resultColor}; margin-bottom: 8px;">${resultTitle}</h2>
        ${resultMsg}
        <button class="retro-btn fun" onclick="ShopArcadeScreen.render()" style="margin-top: 16px;">${won ? 'Back to Arcade' : 'Try Again'}</button>
      </div>
    `;
  },

  traderFold() {
    if (!this.gameActive) return;
    this.gameActive = false;
    const area = document.getElementById('arcade-game-area');
    area.innerHTML = `
      <div class="glass-panel" style="max-width: 400px; margin: 0 auto; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 8px;">🏳️</div>
        <p style="font-size: 12px; color: rgba(255,255,255,0.6);">You folded. No coins lost, no coins gained.</p>
        <p style="font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 6px;">The Shadow Dealer grins...</p>
        <button class="retro-btn" onclick="ShopArcadeScreen.render()" style="margin-top: 16px;">Back to Arcade</button>
      </div>
    `;
  },

  /* =============== GAME 2: VOID GRID =============== */

  startVoidGrid() {
    this.gameActive = true;

    // Generate 4x4 grid: 5 voids (true), 11 data (false)
    const cells = new Array(16).fill(false);
    const voidPositions = [];
    while (voidPositions.length < 5) {
      const pos = Math.floor(Math.random() * 16);
      if (!voidPositions.includes(pos)) {
        voidPositions.push(pos);
        cells[pos] = true;
      }
    }

    this._grid = {
      cells,          // true = void, false = data
      revealed: new Array(16).fill(false),
      claims: 0,
      maxClaims: 4,
    };

    this.renderGrid();
  },

  getAdjacentVoidCount(index) {
    const cells = this._grid.cells;
    const row = Math.floor(index / 4);
    const col = index % 4;
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < 4 && nc >= 0 && nc < 4) {
          if (cells[nr * 4 + nc]) count++;
        }
      }
    }
    return count;
  },

  renderGrid() {
    const g = this._grid;
    const area = document.getElementById('arcade-game-area');

    area.innerHTML = `
      <div class="glass-panel" style="max-width: 360px; margin: 0 auto; text-align: center; border-color: rgba(0,191,255,0.3);">
        <h3 class="pixel-text" style="font-size: 11px; color: #00BFFF; margin-bottom: 8px;">🔲 Void Grid</h3>
        <p style="font-size: 10px; color: rgba(255,255,255,0.4); margin-bottom: 10px;">Claims: ${g.claims}/${g.maxClaims} — Pick carefully</p>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; max-width: 260px; margin: 0 auto;">
          ${g.cells.map((isVoid, i) => {
      if (g.revealed[i]) {
        if (isVoid) {
          return `<div style="width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; font-size: 22px; border-radius: 6px; background: rgba(255,50,50,0.25); border: 2px solid rgba(255,50,50,0.6);">${PixelIcons.inline('skull', 3)}</div>`;
        } else {
          const adj = this.getAdjacentVoidCount(i);
          const adjColor = adj === 0 ? '#32CD32' : adj <= 2 ? '#FFD700' : '#FF6347';
          return `<div style="width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; border-radius: 6px; background: rgba(0,191,255,0.12); border: 2px solid rgba(0,191,255,0.4); color: ${adjColor};">${adj}</div>`;
        }
      } else {
        return `<div onclick="ShopArcadeScreen.claimCell(${i})" style="width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; font-size: 16px; border-radius: 6px; cursor: pointer; background: rgba(60,60,100,0.3); border: 2px solid rgba(100,100,160,0.4); transition: all 0.15s;" onmouseover="this.style.borderColor='rgba(0,191,255,0.8)'" onmouseout="this.style.borderColor='rgba(100,100,160,0.4)'">▪</div>`;
      }
    }).join('')}
        </div>

        <p style="font-size: 9px; color: rgba(255,255,255,0.3); margin-top: 10px;">Numbers = adjacent void cells</p>
      </div>
    `;
  },

  claimCell(index) {
    if (!this.gameActive) return;
    const g = this._grid;
    if (g.revealed[index]) return;

    g.revealed[index] = true;
    g.claims++;

    if (g.cells[index]) {
      // Hit void — game over!
      this.gameActive = false;
      this.renderGrid();
      setTimeout(() => this.showLoseScreen(), 800);
      return;
    }

    // Safe cell claimed
    if (g.claims >= g.maxClaims) {
      // Won!
      this.gameActive = false;
      this.renderGrid();
      setTimeout(() => {
        this.rewardPlayer(35, { intelligence: 5 });
        this.showWinScreen(35, 'intelligence');
      }, 600);
      return;
    }

    this.renderGrid();
  },

  /* =============== GAME 3: SIGNAL DECODER =============== */

  startSignalDecoder() {
    this.gameActive = true;
    const symbols = ['<span style="display:inline-block;width:16px;height:16px;background:#FF4444;border-radius:3px;"></span>', '<span style="display:inline-block;width:16px;height:16px;background:#4488FF;border-radius:3px;"></span>', '<span style="display:inline-block;width:16px;height:16px;background:#44CC44;border-radius:3px;"></span>', '<span style="display:inline-block;width:16px;height:16px;background:#FFCC00;border-radius:3px;"></span>', '<span style="display:inline-block;width:16px;height:16px;background:#AA44CC;border-radius:3px;"></span>', '<span style="display:inline-block;width:16px;height:16px;background:#CCCCCC;border-radius:3px;"></span>'];
    const code = [
      symbols[Math.floor(Math.random() * 6)],
      symbols[Math.floor(Math.random() * 6)],
      symbols[Math.floor(Math.random() * 6)],
    ];

    this._decoder = {
      symbols,
      code,
      guesses: [],       // [{guess: [...], feedback: [...]}]
      currentGuess: [null, null, null],
      maxAttempts: 5,
      selectedSlot: 0,
    };

    this.renderDecoder();
  },

  renderDecoder() {
    const d = this._decoder;
    const area = document.getElementById('arcade-game-area');
    const remaining = d.maxAttempts - d.guesses.length;

    area.innerHTML = `
      <div class="glass-panel" style="max-width: 420px; margin: 0 auto; text-align: center; border-color: rgba(50,205,50,0.3);">
        <h3 class="pixel-text" style="font-size: 11px; color: #32CD32; margin-bottom: 8px;">📡 Signal Decoder</h3>
        <p style="font-size: 10px; color: rgba(255,255,255,0.4); margin-bottom: 10px;">Attempts remaining: ${remaining}</p>

        <!-- Previous guesses -->
        ${d.guesses.length > 0 ? `
          <div style="margin-bottom: 12px;">
            ${d.guesses.map((g, gi) => `
              <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 4px;">
                <span style="font-size: 10px; color: rgba(255,255,255,0.3); width: 16px;">${gi + 1}.</span>
                ${g.guess.map(s => `<span style="font-size: 20px;">${s}</span>`).join('')}
                <span style="margin-left: 8px; font-size: 14px; letter-spacing: 2px;">${g.feedback.join(' ')}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Current guess slots -->
        <p style="font-size: 10px; color: rgba(255,255,255,0.5); margin-bottom: 6px;">Your guess:</p>
        <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 12px;">
          ${d.currentGuess.map((sym, i) => `
            <div onclick="ShopArcadeScreen.decoderSelectSlot(${i})" style="
              width: 52px; height: 52px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
              font-size: 24px; cursor: pointer; transition: all 0.15s;
              ${i === d.selectedSlot
        ? 'border: 2px solid #32CD32; background: rgba(50,205,50,0.15);'
        : 'border: 2px solid rgba(100,100,160,0.4); background: rgba(60,60,100,0.2);'}
            ">${sym || '·'}</div>
          `).join('')}
        </div>

        <!-- Symbol picker -->
        <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 14px; flex-wrap: wrap;">
          ${d.symbols.map(sym => `
            <div onclick="ShopArcadeScreen.decoderPickSymbol('${sym}')" style="
              width: 40px; height: 40px; border-radius: 6px; display: flex; align-items: center; justify-content: center;
              font-size: 20px; cursor: pointer; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); transition: all 0.15s;
            " onmouseover="this.style.borderColor='#32CD32'" onmouseout="this.style.borderColor='rgba(255,255,255,0.2)'">${sym}</div>
          `).join('')}
        </div>

        <!-- Submit -->
        <button class="retro-btn fun" onclick="ShopArcadeScreen.decoderSubmit()" 
          ${d.currentGuess.includes(null) ? 'disabled style="opacity: 0.4;"' : ''}
          style="font-size: 12px; padding: 8px 24px;">
          Submit Guess
        </button>

        <!-- Legend -->
        <p style="font-size: 9px; color: rgba(255,255,255,0.3); margin-top: 10px;">✦ = right place &nbsp; ◇ = wrong place &nbsp; ✕ = not in code</p>
      </div>
    `;
  },

  decoderSelectSlot(index) {
    if (!this.gameActive) return;
    this._decoder.selectedSlot = index;
    this.renderDecoder();
  },

  decoderPickSymbol(sym) {
    if (!this.gameActive) return;
    const d = this._decoder;
    d.currentGuess[d.selectedSlot] = sym;
    // Auto-advance to next empty slot
    const nextEmpty = d.currentGuess.findIndex((s, i) => s === null && i > d.selectedSlot);
    if (nextEmpty !== -1) d.selectedSlot = nextEmpty;
    this.renderDecoder();
  },

  decoderSubmit() {
    if (!this.gameActive) return;
    const d = this._decoder;
    if (d.currentGuess.includes(null)) return;

    // Generate feedback using Mastermind rules
    const guess = [...d.currentGuess];
    const code = [...d.code];
    const feedback = [];
    const codeUsed = [false, false, false];
    const guessUsed = [false, false, false];

    // Pass 1: exact matches (✦)
    for (let i = 0; i < 3; i++) {
      if (guess[i] === code[i]) {
        feedback.push('✦');
        codeUsed[i] = true;
        guessUsed[i] = true;
      }
    }

    // Pass 2: color matches in wrong position (◇)
    for (let i = 0; i < 3; i++) {
      if (guessUsed[i]) continue;
      for (let j = 0; j < 3; j++) {
        if (codeUsed[j]) continue;
        if (guess[i] === code[j]) {
          feedback.push('◇');
          codeUsed[j] = true;
          guessUsed[i] = true;
          break;
        }
      }
    }

    // Fill remaining with misses (✕)
    while (feedback.length < 3) feedback.push('✕');

    // Sort feedback so position isn't revealed
    feedback.sort();

    d.guesses.push({ guess: [...d.currentGuess], feedback });
    d.currentGuess = [null, null, null];
    d.selectedSlot = 0;

    // Check win
    if (feedback.filter(f => f === '✦').length === 3) {
      this.gameActive = false;
      this.renderDecoder();
      setTimeout(() => {
        this.rewardPlayer(25, { intelligence: 5 });
        this.showWinScreen(25, 'intelligence');
      }, 800);
      return;
    }

    // Check max attempts
    if (d.guesses.length >= d.maxAttempts) {
      this.gameActive = false;
      // Show the answer
      const area = document.getElementById('arcade-game-area');
      this.renderDecoder();
      setTimeout(() => {
        const area = document.getElementById('arcade-game-area');
        const revealHtml = `
          <div class="glass-panel" style="max-width: 400px; margin: 0 auto 12px; text-align: center;">
            <p style="font-size: 11px; color: rgba(255,255,255,0.5);">The code was: <span style="font-size: 24px;">${d.code.join(' ')}</span></p>
          </div>
        `;
        area.innerHTML = revealHtml;
        setTimeout(() => this.showLoseScreen(), 1200);
      }, 600);
      return;
    }

    this.renderDecoder();
  },
};
