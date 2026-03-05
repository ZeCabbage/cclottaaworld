/* ============================================
   THE CORNER — Café & Smoke Shop
   Food, drinks, and cigarettes
   Warm cozy dark interior
   ============================================ */

const ShopCafeScreen = {

  // ---- NPC: TONY the shopkeeper ----
  _npcGreetings: [
    "Tony doesn't look up. \"...Hey.\"",
    "Tony's reading something behind the counter. \"Mm.\"",
    "Tony glances at you. \"Back again.\"",
    "\"...You gonna buy something or just stand there?\"",
    "Tony nods once. Says nothing.",
    "\"Door's open, register's on. You know the drill.\"",
  ],

  _npcBuyQuips: {
    luxe_noir: [
      "\"Easy on the smokes, kid.\"",
      "\"...Your lungs, your call.\"",
      "He slides the pack across without a word.",
    ],
    donini_wine: [
      "\"Donini. ...Respect.\"",
      "\"That's the last one. Don't waste it.\"",
    ],
    pale_ale: [
      "\"...Solid choice.\"",
      "Tony cracks one open for himself too.",
    ],
    cucumbers: [
      "\"...Really? Just cucumbers?\"",
      "\"Alright.\"",
    ],
    yams: [
      "\"Good pick.\"",
      "\"Those are fresh. Probably.\"",
    ],
    macedonian_feta: [
      "\"...You've got taste. Don't tell anyone I said that.\"",
    ],
    rye_bread: [
      "\"Rye. Old school.\"",
    ],
    honeycomb: [
      "\"Careful, that's sticky.\"",
    ],
    strawberry_cake: [
      "\"...My wife made that one.\" He looks away.",
    ],
  },

  _npcDefaultQuip: [
    "Tony bags it up. Says nothing.",
    "\"Mm.\"",
  ],

  _menu: [
    { id: 'luxe_noir', name: 'Luxe Noir', desc: 'Fake designer cigarettes. Very chic.', emoji: '🚬', price: 25, category: 'smoke', statBoost: { charisma: 2 } },
    { id: 'donini_wine', name: 'Donini Wine', desc: 'A bottle of the finest Donini.', emoji: '🍷', price: 40, category: 'drink', statBoost: { charisma: 3 } },
    { id: 'pale_ale', name: 'Pale Ale', desc: 'Crisp, hoppy, refreshing.', emoji: '🍺', price: 30, category: 'drink', statBoost: { stamina: 2 } },
    { id: 'cucumbers', name: 'Cucumbers', desc: 'Cool and crunchy.', emoji: '🥒', price: 10, category: 'food', statBoost: { stamina: 1 } },
    { id: 'yams', name: 'Yams', desc: 'Hearty root vegetable goodness.', emoji: '🍠', price: 15, category: 'food', statBoost: { strength: 2 } },
    { id: 'macedonian_feta', name: 'Macedonian Feta', desc: 'Sharp, crumbly, perfect.', emoji: '🧀', price: 20, category: 'food', statBoost: { intelligence: 2 } },
    { id: 'rye_bread', name: 'Rye Bread', desc: 'Dense, dark, soulful bread.', emoji: '🍞', price: 12, category: 'food', statBoost: { stamina: 1 } },
    { id: 'honeycomb', name: 'Honeycomb', desc: 'Sweet golden hexagons.', emoji: '🍯', price: 35, category: 'food', statBoost: { speed: 2 } },
    { id: 'strawberry_cake', name: 'Strawberry Cake', desc: 'Layered pink perfection.', emoji: '🍰', price: 45, category: 'food', statBoost: { charisma: 3 } },
  ],

  render() {
    const container = document.getElementById('screen-container');
    const smokes = this._menu.filter(i => i.category === 'smoke');
    const drinks = this._menu.filter(i => i.category === 'drink');
    const foods = this._menu.filter(i => i.category === 'food');
    const greeting = this._npcGreetings[Math.floor(Math.random() * this._npcGreetings.length)];

    container.innerHTML = `
      <div style="padding: 16px; background: linear-gradient(180deg, #1a1008 0%, #2a1a0e 30%, #1a1008 60%, #0d0800 100%); min-height: 100%;">
        <button class="back-to-town" onclick="App.navigateTo('town')">◀ Back to Town</button>

        <!-- Scene Backdrop -->
        <div style="position: relative; height: 140px; margin-bottom: 16px; border-radius: 8px; overflow: hidden; background: linear-gradient(180deg, #1a0d05 0%, #2a1808 60%, #3a2510 100%);">
          <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 45%; background: linear-gradient(180deg, #2a1a0e, #352010);"></div>
          <div style="position: absolute; bottom: 20%; left: 10%; right: 10%; height: 8px; background: #4a3018; border-radius: 2px; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>
          <div style="position: absolute; bottom: 28%; left: 15%; width: 20px; height: 30px; background: #555; border-radius: 2px;"><div style="position: absolute; top: 3px; left: 3px; width: 6px; height: 6px; background: #ff4400; border-radius: 50%; box-shadow: 0 0 6px #ff4400;"></div></div>
          <div style="position: absolute; top: 8%; left: 25%; width: 2px; height: 25%; background: #333;"></div>
          <div style="position: absolute; top: 32%; left: 22%; width: 8px; height: 8px; background: #ffcc44; border-radius: 50%; box-shadow: 0 0 20px #ffcc4466;"></div>
          <div style="position: absolute; top: 5%; left: 55%; width: 2px; height: 30%; background: #333;"></div>
          <div style="position: absolute; top: 34%; left: 52%; width: 8px; height: 8px; background: #ffcc44; border-radius: 50%; box-shadow: 0 0 20px #ffcc4466;"></div>
          <div style="position: absolute; top: 10%; left: 80%; width: 2px; height: 22%; background: #333;"></div>
          <div style="position: absolute; top: 31%; left: 77%; width: 8px; height: 8px; background: #ffcc44; border-radius: 50%; box-shadow: 0 0 20px #ffcc4466;"></div>
          <div style="position: absolute; top: 10%; right: 12%; width: 60px; height: 50px; background: #1a2a40; border: 3px solid #3a2510; border-radius: 2px;"></div>
          <div style="position: absolute; bottom: 35%; left: 38%; display: flex; gap: 4px;">
            <div style="width: 6px; height: 18px; background: #663344; border-radius: 2px 2px 0 0;"></div>
            <div style="width: 6px; height: 14px; background: #446633; border-radius: 2px 2px 0 0;"></div>
            <div style="width: 6px; height: 20px; background: #553322; border-radius: 2px 2px 0 0;"></div>
          </div>
        </div>

        <div class="glass-panel" style="text-align: center; margin-bottom: 16px; border-color: rgba(255,200,100,0.3); background: rgba(30,20,8,0.8);">
          <h1 class="pixel-text" style="font-size: 14px; color: #ffcc66;">☕ THE CORNER ☕</h1>
          <p style="color: rgba(255,200,130,0.5); font-size: 12px; margin-top: 4px;">café · smoke shop · good vibes only</p>
        </div>

        <!-- NPC Tony -->
        <div class="glass-panel" style="margin-bottom: 16px; padding: 14px; border-color: rgba(255,180,80,0.25); background: rgba(40,25,10,0.8); display: flex; align-items: center; gap: 14px;">
          <div style="font-size: 42px; flex-shrink: 0;">🧔</div>
          <div>
            <div class="pixel-text" style="font-size: 9px; color: #ffcc66; margin-bottom: 4px;">TONY — Shopkeeper</div>
            <div id="tony-speech" style="font-size: 12px; color: rgba(255,220,160,0.8); font-style: italic; line-height: 1.4;">${greeting}</div>
          </div>
        </div>

        <!-- Smokes -->
        <div class="glass-panel" style="margin-bottom: 16px; padding: 16px; border-color: rgba(180,100,50,0.2); background: rgba(25,15,5,0.7);">
          <h2 class="pixel-text" style="font-size: 10px; color: #cc8844; margin-bottom: 12px;">// SMOKES</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px;">
            ${smokes.map(item => this._renderMenuItem(item)).join('')}
          </div>
        </div>

        <!-- Drinks -->
        <div class="glass-panel" style="margin-bottom: 16px; padding: 16px; border-color: rgba(100,60,150,0.2); background: rgba(20,10,25,0.7);">
          <h2 class="pixel-text" style="font-size: 10px; color: #aa66cc; margin-bottom: 12px;">// DRINKS</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px;">
            ${drinks.map(item => this._renderMenuItem(item)).join('')}
          </div>
        </div>

        <!-- Food -->
        <div class="glass-panel" style="margin-bottom: 16px; padding: 16px; border-color: rgba(100,150,60,0.2); background: rgba(15,20,10,0.7);">
          <h2 class="pixel-text" style="font-size: 10px; color: #88aa44; margin-bottom: 12px;">// FOOD</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px;">
            ${foods.map(item => this._renderMenuItem(item)).join('')}
          </div>
        </div>

        <div id="cafe-message" style="text-align: center; margin-top: 8px;"></div>
      </div>
    `;

    GameState.updateAddressBar('shop/cafe');
    GameState.updateStatus('Chilling at The Corner', '☕');
  },

  _renderMenuItem(item) {
    const boosts = item.statBoost ? Object.entries(item.statBoost).map(([s, v]) => `+${v} ${s}`).join(', ') : '';
    return `
      <div class="glass-panel" style="text-align: center; padding: 12px; border-color: rgba(255,200,100,0.1);">
        <div style="font-size: 32px; margin-bottom: 6px;">${item.emoji}</div>
        <div style="font-size: 12px; color: rgba(255,220,160,0.9); font-weight: bold;">${item.name}</div>
        <div style="font-size: 10px; color: rgba(255,200,130,0.4); margin: 3px 0;">${item.desc}</div>
        ${boosts ? `<div style="font-size: 9px; color: #88cc44; margin: 3px 0;">${boosts}</div>` : ''}
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 8px;">
          <span class="pixel-text" style="font-size: 9px; color: #FFD700;">${item.price}c</span>
          <button class="retro-btn" onclick="ShopCafeScreen.buy('${item.id}')" style="font-size: 10px; padding: 3px 12px;">Buy</button>
        </div>
      </div>
    `;
  },

  buy(itemId) {
    const item = this._menu.find(i => i.id === itemId);
    if (!item) return;

    if (GameState.player.coins < item.price) {
      this._showMessage('Not enough coins! Go work a shift.', 'warning');
      return;
    }

    GameState.player.coins -= item.price;
    GameState.updateCoinDisplay();

    if (item.statBoost && GameState.player.character) {
      const stats = GameState.player.character.stats;
      Object.entries(item.statBoost).forEach(([stat, val]) => {
        if (stats[stat] !== undefined) {
          stats[stat] = Math.min(999, stats[stat] + val);
        }
      });
    }

    GameState.player.itemsBought = (GameState.player.itemsBought || 0) + 1;
    SaveManager.autoSave();

    // NPC quip
    const quips = this._npcBuyQuips[itemId] || this._npcDefaultQuip;
    const quip = quips[Math.floor(Math.random() * quips.length)];
    const speech = document.getElementById('tony-speech');
    if (speech) speech.textContent = quip;

    const boostStr = Object.entries(item.statBoost || {}).map(([s, v]) => `+${v} ${s}`).join(', ');
    this._showMessage(`Bought ${item.name}! ${boostStr}`, 'success');
  },

  _showMessage(text, type) {
    const el = document.getElementById('cafe-message');
    if (!el) return;
    const color = type === 'success' ? '#88cc44' : type === 'warning' ? '#ffaa44' : '#ffffff';
    el.innerHTML = `<div style="color: ${color}; font-family: var(--font-pixel); font-size: 11px; padding: 8px;">${text}</div>`;
    setTimeout(() => { if (el) el.innerHTML = ''; }, 3000);
  },
};
