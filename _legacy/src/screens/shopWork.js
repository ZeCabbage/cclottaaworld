/* ============================================
   THE OFFICE — Work Building
   Earn coins by working shifts for a mean boss
   Brutalist concrete aesthetic
   ============================================ */

const ShopWorkScreen = {

    _lastShiftTime: 0,
    _shiftCooldown: 30000, // 30 seconds between shifts
    _isWorking: false,
    _bossMessage: '',

    _bossName: 'MR. GRINDSTONE',

    _bossGreetings: [
        "Oh, you again. Clock in and get to work. I'm not paying you to stand around.",
        "Late as usual. Your desk is over there. MOVE.",
        "Another day, another dollar... for ME. You get pennies. Now work.",
        "I see you decided to show up today. How generous of you.",
        "Don't just stand there gawking! There's filing to do!",
        "Ah, my least favorite employee. Get to work before I dock your pay.",
    ],

    _bossWorkQuotes: [
        "Faster! My grandma works faster and she's been dead for years!",
        "Is that the best you can do? Pathetic. But fine. Here's your pay.",
        "Adequate work. Don't let it go to your head.",
        "You call that effort? Whatever. Take your coins and get out.",
        "Hmph. Not terrible. Don't expect a raise though.",
        "The work is... acceptable. Barely. Your check is on the desk.",
        "Fine. FINE. You earned it. Now get back in line for the next shift.",
        "I've seen better work from interns. But... here's your pay.",
    ],

    _bossDenyQuotes: [
        "You JUST worked! What, you think shifts grow on trees? Come back later.",
        "Absolutely not. You need to rest. Company policy. Also I'm tired of your face.",
        "Break time isn't over yet. Go stare at a wall or something.",
        "NO. Come back when the clock says you can. I don't make the rules. Actually I do.",
    ],

    render() {
        const container = document.getElementById('screen-container');
        const now = Date.now();
        const canWork = (now - this._lastShiftTime) >= this._shiftCooldown;
        const timeLeft = Math.max(0, Math.ceil((this._shiftCooldown - (now - this._lastShiftTime)) / 1000));

        if (!this._bossMessage) {
            this._bossMessage = this._bossGreetings[Math.floor(Math.random() * this._bossGreetings.length)];
        }

        container.innerHTML = `
      <div style="padding: 16px; background: linear-gradient(180deg, #1a1a1a 0%, #252525 30%, #1f1f1f 60%, #111111 100%); min-height: 100%;">
        <button class="back-to-town" onclick="App.navigateTo('town')">◀ Back to Town</button>

        <!-- Office Header -->
        <div class="glass-panel" style="text-align: center; margin-bottom: 16px; border-color: rgba(150,150,150,0.2); background: rgba(40,40,40,0.8);">
          <h1 class="pixel-text" style="font-size: 14px; color: #999999; letter-spacing: 3px;">THE OFFICE</h1>
          <p style="color: rgba(255,255,255,0.3); font-size: 11px; margin-top: 4px;">GRINDSTONE & ASSOCIATES LTD.</p>
        </div>

        <div style="display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;">
          <!-- Boss Panel -->
          <div style="flex: 1; min-width: 280px; max-width: 450px;">
            <div class="glass-panel" style="padding: 20px; border-color: rgba(200,50,50,0.2); background: rgba(30,20,20,0.8);">
              <!-- Boss portrait -->
              <div style="text-align: center; margin-bottom: 12px;">
                <div style="width: 80px; height: 80px; margin: 0 auto; background: #333; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 40px; border: 2px solid #555;">
                  😠
                </div>
                <div class="pixel-text" style="font-size: 10px; color: #cc4444; margin-top: 6px;">${this._bossName}</div>
                <div style="font-size: 10px; color: rgba(255,255,255,0.3);">CEO & Professional Tyrant</div>
              </div>

              <!-- Boss dialogue -->
              <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(200,50,50,0.15); border-radius: 8px; padding: 14px; margin-bottom: 16px;">
                <div style="font-size: 9px; color: rgba(255,255,255,0.3); margin-bottom: 4px; font-family: var(--font-pixel);">${this._bossName}:</div>
                <p id="boss-dialogue" style="color: rgba(255,255,255,0.7); font-size: 12px; line-height: 1.6; font-style: italic;">
                  "${this._bossMessage}"
                </p>
              </div>

              <!-- Work button -->
              <div style="text-align: center;">
                ${canWork ? `
                  <button class="retro-btn fun" onclick="ShopWorkScreen.doShift()" style="font-size: 13px; padding: 10px 30px; letter-spacing: 1px;">
                    💼 WORK A SHIFT
                  </button>
                  <div style="font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 8px;">Earn 50–150 ccllottaaCoins</div>
                ` : `
                  <button class="retro-btn" disabled style="font-size: 13px; padding: 10px 30px; opacity: 0.4; cursor: not-allowed;">
                    ⏳ ON BREAK
                  </button>
                  <div style="font-size: 10px; color: rgba(255,100,100,0.5); margin-top: 8px;">
                    Next shift in ${timeLeft}s
                  </div>
                `}
              </div>
            </div>
          </div>

          <!-- Office Info -->
          <div style="flex: 0 0 220px;">
            <div class="glass-panel" style="padding: 14px; border-color: rgba(150,150,150,0.15); background: rgba(35,35,35,0.7); margin-bottom: 12px;">
              <h3 class="pixel-text" style="font-size: 9px; color: rgba(255,255,255,0.4); margin-bottom: 8px;">// YOUR BALANCE</h3>
              <div style="font-size: 20px; color: #FFD700; text-align: center; font-family: var(--font-pixel);">
                ${GameState.player.coins}c
              </div>
            </div>

            <div class="glass-panel" style="padding: 14px; border-color: rgba(150,150,150,0.1); background: rgba(35,35,35,0.7);">
              <h3 class="pixel-text" style="font-size: 9px; color: rgba(255,255,255,0.4); margin-bottom: 8px;">// OFFICE RULES</h3>
              <ul style="color: rgba(255,255,255,0.4); font-size: 10px; list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 4px;">→ No smiling</li>
                <li style="margin-bottom: 4px;">→ No fun</li>
                <li style="margin-bottom: 4px;">→ No asking for raises</li>
                <li style="margin-bottom: 4px;">→ Lunch is 3 minutes</li>
                <li style="margin-bottom: 4px;">→ Mr. Grindstone is always right</li>
              </ul>
            </div>
          </div>
        </div>

        <div id="work-message" style="text-align: center; margin-top: 12px;"></div>
      </div>
    `;

        GameState.updateAddressBar('work/office');
        GameState.updateStatus('At the office...', '💼');

        // If on cooldown, set up auto-refresh timer
        if (!canWork) {
            this._cooldownTimer = setTimeout(() => this.render(), (timeLeft * 1000) + 100);
        }
    },

    doShift() {
        const now = Date.now();
        if ((now - this._lastShiftTime) < this._shiftCooldown) {
            this._bossMessage = this._bossDenyQuotes[Math.floor(Math.random() * this._bossDenyQuotes.length)];
            this.render();
            return;
        }

        // Earn random coins
        const earned = 50 + Math.floor(Math.random() * 101); // 50-150
        GameState.player.coins += earned;
        GameState.updateCoinDisplay();
        this._lastShiftTime = now;

        // Boss reaction
        this._bossMessage = this._bossWorkQuotes[Math.floor(Math.random() * this._bossWorkQuotes.length)];

        // Show earn animation
        const msgEl = document.getElementById('work-message');
        if (msgEl) {
            msgEl.innerHTML = `
        <div style="color: #FFD700; font-family: var(--font-pixel); font-size: 14px; animation: fadeIn 0.3s;">
          +${earned} ccllottaaCoins! 💰
        </div>
      `;
        }

        // Auto-save
        SaveManager.autoSave();

        // Re-render after brief delay to show the message
        setTimeout(() => this.render(), 1500);
    },

    cleanup() {
        if (this._cooldownTimer) {
            clearTimeout(this._cooldownTimer);
            this._cooldownTimer = null;
        }
    },
};
