/* ============================================
   THE NIGHT GARDEN — A quiet moonlit park
   Home to ECHO, a quiet girl and her strange creature
   ============================================ */

const ShopGardenScreen = {

  // ---- NPC: ECHO — quiet, terse, chews her hair ----
  _greetings: [
    "Echo's chewing the end of her hair. She glances at you. \"...Uh huh.\"",
    "\"You're here again, huh.\"",
    "Echo doesn't look up. Nibbles does.",
    "\"...What do you want?\"",
    "She's writing something in a notebook. She closes it when you get close.",
    "Echo tugs her hoodie strings. \"...Hey.\"",
  ],

  _talkLines: [
    "\"Did you see that? Oh, uhm. Nevermind.\"",
    "\"...\"",
    "\"Nibbles doesn't like most people. Don't take it personal if he bites you.\"",
    "\"I had a dream about the ocean last night.\" She stops. \"...Forget it.\"",
    "\"You ever just sit somewhere and feel like the world is watching you back?\" She pulls at her hair. \"...Weird question. Sorry.\"",
    "\"I come here because nobody else does.\" She pauses. \"...I guess that's ruined now.\"",
    "\"...You smell like the corner store.\"",
    "\"Hm.\" She looks at the sky for a long time. Doesn't say anything else.",
    "\"I was gonna say something but I forgot. ...It was probably nothing.\"",
    "\"Nibbles keeps staring at you. That either means he likes you or he wants to eat you. I can never tell.\"",
  ],

  _chaoQuips: [
    "Nibbles chirps once. Then stares.",
    "Nibbles bumps your hand with its head.",
    "Nibbles floats in a slow circle.",
    "Nibbles yawns.",
    "Nibbles tilts its head. Something ancient behind those eyes.",
    "Nibbles hums. It almost sounds like a song.",
  ],

  _petReactions: [
    "Nibbles lets you. Echo watches. \"...He doesn't do that with everyone.\"",
    "Nibbles purrs. The sound is strange — like static and rain.",
    "Nibbles nuzzles your hand and falls asleep immediately. Echo scoffs.",
    "Nibbles bites you. Gently. Echo: \"That means he likes you. Probably.\"",
    "Nibbles glows for a second. Neither of you mention it.",
  ],

  _sitMoments: [
    "You sit. She sits. Neither of you says anything for a while. It's fine.",
    "The wind moves the branches. Echo pulls her knees up. Nibbles settles between you.",
    "Silence. Somewhere far away, a train. Echo chews her hair.",
    "\"...This is nice.\" She says it so quietly you almost miss it.",
    "You watch the fireflies. She watches you watching them. Then looks away.",
  ],

  render() {
    const container = document.getElementById('screen-container');
    const greeting = this._greetings[Math.floor(Math.random() * this._greetings.length)];
    const chaoQuip = this._chaoQuips[Math.floor(Math.random() * this._chaoQuips.length)];

    container.innerHTML = `
      <div style="padding: 16px; background: linear-gradient(180deg, #080818 0%, #0a1020 30%, #0a0818 60%, #050510 100%); min-height: 100%; position: relative;">
        <button class="back-to-town" onclick="App.navigateTo('town')">◀ Back to Town</button>

        <div class="glass-panel" style="text-align: center; margin-bottom: 16px; border-color: rgba(100,200,150,0.25); background: rgba(5,15,10,0.8);">
          <h1 class="pixel-text" style="font-size: 14px; color: #66cc88;">🌙 THE NIGHT GARDEN 🌙</h1>
          <p style="color: rgba(100,200,150,0.35); font-size: 11px; margin-top: 4px;">a quiet place. something watches from the bench.</p>
        </div>

        <!-- Fireflies -->
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; overflow: hidden;">
          ${Array.from({ length: 8 }, (_, i) => `
            <div style="position: absolute; width: 2px; height: 2px; background: #88ffaa55; border-radius: 50%;
              top: ${15 + Math.random() * 70}%; left: ${Math.random() * 100}%;
              animation: firefly ${3 + Math.random() * 3}s ease-in-out infinite alternate;
              animation-delay: ${Math.random() * 2}s;
              box-shadow: 0 0 4px #88ffaa33;"></div>
          `).join('')}
        </div>
        <style>
          @keyframes firefly {
            0% { transform: translate(0, 0); opacity: 0.2; }
            50% { opacity: 0.7; }
            100% { transform: translate(${Math.random() > 0.5 ? '' : '-'}15px, -15px); opacity: 0.15; }
          }
        </style>

        <div style="max-width: 550px; margin: 0 auto;">

          <!-- Echo + Nibbles -->
          <div class="glass-panel" style="margin-bottom: 14px; padding: 16px; border-color: rgba(100,200,150,0.12); background: rgba(5,15,10,0.7);">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="text-align: center; flex-shrink: 0;">
                <div style="font-size: 48px; filter: drop-shadow(0 0 6px rgba(100,200,150,0.2));">🧝‍♀️</div>
                <div class="pixel-text" style="font-size: 7px; color: #66cc88; margin-top: 3px;">ECHO</div>
              </div>
              <div style="text-align: center; flex-shrink: 0;">
                <div style="font-size: 28px; filter: drop-shadow(0 0 5px rgba(100,180,255,0.3)); animation: firefly 2s ease-in-out infinite alternate;">🐾</div>
                <div class="pixel-text" style="font-size: 6px; color: #88aaff; margin-top: 2px;">NIBBLES</div>
              </div>
              <div style="flex: 1;">
                <div id="echo-speech" style="color: rgba(180,210,190,0.8); font-size: 12px; font-style: italic; line-height: 1.5;">${greeting}</div>
              </div>
            </div>
          </div>

          <!-- Nibbles -->
          <div class="glass-panel" style="margin-bottom: 14px; padding: 10px; border-color: rgba(100,150,255,0.1); background: rgba(5,10,20,0.6);">
            <div id="nibbles-activity" style="color: rgba(130,160,255,0.5); font-size: 10px; font-style: italic; text-align: center;">${chaoQuip}</div>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 14px;">
            <button class="retro-btn" onclick="ShopGardenScreen.talk()" style="font-size: 10px; padding: 6px 14px; border-color: rgba(100,200,150,0.2);">Talk</button>
            <button class="retro-btn" onclick="ShopGardenScreen.petNibbles()" style="font-size: 10px; padding: 6px 14px; border-color: rgba(100,150,255,0.2);">Pet Nibbles</button>
            <button class="retro-btn" onclick="ShopGardenScreen.sitQuietly()" style="font-size: 10px; padding: 6px 14px; border-color: rgba(200,200,100,0.2);">Sit</button>
          </div>

          <div id="garden-message" style="text-align: center; margin-top: 10px; min-height: 18px;"></div>
        </div>
      </div>
    `;

    GameState.updateAddressBar('garden');
    GameState.updateStatus('The Night Garden', '🌙');
  },

  talk() {
    const line = this._talkLines[Math.floor(Math.random() * this._talkLines.length)];
    const speech = document.getElementById('echo-speech');
    if (speech) speech.textContent = line;
    if (Math.random() > 0.5) {
      const q = this._chaoQuips[Math.floor(Math.random() * this._chaoQuips.length)];
      const nibAct = document.getElementById('nibbles-activity');
      if (nibAct) nibAct.textContent = q;
    }
    if (GameState.player.character) {
      const stats = GameState.player.character.stats || {};
      stats.intelligence = Math.min(999, (stats.intelligence || 0) + 1);
      SaveManager.autoSave();
      this._showMessage('+1 intelligence', 'success');
    }
  },

  petNibbles() {
    const r = this._petReactions[Math.floor(Math.random() * this._petReactions.length)];
    const nibAct = document.getElementById('nibbles-activity');
    if (nibAct) nibAct.textContent = r;
    if (GameState.player.character) {
      const stats = GameState.player.character.stats || {};
      stats.charisma = Math.min(999, (stats.charisma || 0) + 1);
      SaveManager.autoSave();
      this._showMessage('+1 charisma', 'success');
    }
  },

  sitQuietly() {
    const m = this._sitMoments[Math.floor(Math.random() * this._sitMoments.length)];
    const speech = document.getElementById('echo-speech');
    if (speech) speech.textContent = m;
    if (GameState.player.character) {
      const stats = GameState.player.character.stats || {};
      stats.stamina = Math.min(999, (stats.stamina || 0) + 1);
      SaveManager.autoSave();
      this._showMessage('+1 stamina', 'success');
    }
  },

  _showMessage(text, type) {
    const el = document.getElementById('garden-message');
    if (!el) return;
    const color = type === 'success' ? '#88cc88' : 'rgba(180,200,180,0.5)';
    el.innerHTML = `<div style="color: ${color}; font-family: var(--font-pixel); font-size: 9px; padding: 6px;">${text}</div>`;
    setTimeout(() => { if (el) el.innerHTML = ''; }, 3000);
  },
};
