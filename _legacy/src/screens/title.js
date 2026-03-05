/* ============================================
   Title / Splash Screen
   ============================================ */

const TitleScreen = {
  render() {
    const hasSave = SaveManager.hasSave();
    const container = document.getElementById('screen-container');
    container.innerHTML = `
      <div class="screen-enter" style="
        min-height: 100%;
        background: linear-gradient(180deg, #1a0a2e 0%, #2d1b69 30%, #0a1628 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 32px;
        position: relative;
        overflow: hidden;
      ">
        <!-- Animated Stars Background -->
        <div id="title-stars" style="position: absolute; inset: 0; pointer-events: none;"></div>
        
        <!-- Logo -->
        <div style="position: relative; z-index: 2; text-align: center;">
          <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 8px;">${PixelIcons.large('star')}${PixelIcons.large('star')}${PixelIcons.large('star')}</div>
          <h1 class="pixel-text rainbow-text" style="font-size: 28px; line-height: 1.4; margin-bottom: 4px;">
            ccllottaaWorld
          </h1>
          <div class="retro-text" style="color: #FF69B4; font-size: 24px; margin-bottom: 24px;">
            ♡ Your World Awaits ♡
          </div>
          
          <!-- Sparkle Divider -->
          <div style="color: #FFD700; letter-spacing: 8px; margin: 16px 0; font-family: var(--font-pixel); font-size: 10px;">- * - * - * - * -</div>
          
          <!-- Marquee Welcome -->
          <div class="marquee-container" style="width: 400px; max-width: 90vw; margin: 16px auto; border: 2px ridge #FFD700;">
            <div class="marquee-content">
              Welcome to ccllottaaWorld! -- Create your character -- Explore the city -- Play games -- Shop for cool stuff -- 
            </div>
          </div>
          
          <!-- Buttons -->
          <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 24px; align-items: center;">
            ${hasSave ? `
              <button class="retro-btn primary" onclick="App.continueGame()" style="font-size: 16px; padding: 12px 40px; min-width: 220px;">
                ▶ Continue Game
              </button>
            ` : ''}
            <button class="retro-btn fun" onclick="App.navigateTo('select')" style="font-size: 16px; padding: 12px 40px; min-width: 220px;">
              >> Create Character
            </button>
            ${hasSave ? `
              <button class="retro-btn" onclick="TitleScreen.confirmReset()" style="font-size: 12px; padding: 8px 20px;">
                [x] Reset Save
              </button>
            ` : ''}
          </div>
          
          <!-- Under Construction Banner -->
          <div style="margin-top: 32px;">
            <div class="under-construction">
              /// UNDER CONSTRUCTION /// -- MORE FEATURES COMING SOON! -- ///
            </div>
          </div>
          
          <!-- Webring -->
          <div class="webring" style="margin-top: 16px; max-width: 400px;">
            ◀ <span class="retro-link">prev</span> |
            This site is part of the <b>ccllottaaWorld WebRing</b> |
            <span class="retro-link">next</span> ▶
          </div>
          
          <!-- Hit Counter -->
          <div style="margin-top: 12px; text-align: center; font-family: var(--font-system); font-size: 11px; color: #888;">
            You are visitor number: 
            <span class="hit-counter">
              <span class="digit">0</span>
              <span class="digit">0</span>
              <span class="digit">4</span>
              <span class="digit">8</span>
              <span class="digit">2</span>
              <span class="digit">9</span>
            </span>
          </div>
          
          <!-- Best Viewed Badge -->
          <div style="margin-top: 12px; font-family: var(--font-system); font-size: 10px; color: #666; text-align: center;">
            [!] Best viewed in Internet Explorer 6.0 at 800x600 resolution [!]
          </div>
          </div>
        </div>
      </div>
    `;

    // Add animated stars
    this.createStars();
    GameState.updateAddressBar('');
    GameState.updateStatus('Welcome to ccllottaaWorld!', '*');
  },

  createStars() {
    const container = document.getElementById('title-stars');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const star = document.createElement('div');
      star.className = 'sparkle-star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = (Math.random() * 3) + 's';
      star.style.animationDuration = (1 + Math.random() * 2) + 's';
      star.style.width = (6 + Math.random() * 10) + 'px';
      star.style.height = star.style.width;
      container.appendChild(star);
    }
  },

  confirmReset() {
    if (confirm('Are you sure you want to delete your save? Your character will be gone forever!')) {
      SaveManager.deleteSave();
      App.navigateTo('title');
    }
  }
};
