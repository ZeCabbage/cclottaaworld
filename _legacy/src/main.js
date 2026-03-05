/* ============================================
   ccllottaaWorld — Main App Router
   ============================================ */

const App = {
    screens: {
        title: TitleScreen,
        select: SelectScreen,
        town: TownScreen,
        petView: PetViewScreen,
        shopFashion: ShopFashionScreen,
        shopArcade: ShopArcadeScreen,
        shopPark: ShopParkScreen,
        shopFortune: ShopFortuneScreen,
        shopVinyl: ShopVinylScreen,
        shopWork: ShopWorkScreen,
        shopCafe: ShopCafeScreen,
        shopGarden: ShopGardenScreen,
        apartment: ApartmentScreen,
    },

    screenHistory: [],

    init() {
        // Set up backward compat (player.pet → player.character)
        GameState._initCompat();
        const saved = localStorage.getItem('ccllottaaWorld_save');
        if (saved) {
            try {
                const d = JSON.parse(saved);
                if (d.player && d.player.pet && !d.player.character) {
                    // Old pet-based save — clear it
                    localStorage.removeItem('ccllottaaWorld_save');
                }
                if (d.player && d.player.pet && !d.player.pet.skinTone) {
                    // Old creature save without character appearance fields
                    localStorage.removeItem('ccllottaaWorld_save');
                }
            } catch (e) { localStorage.removeItem('ccllottaaWorld_save'); }
        }

        // Try to load saved game
        const hasLoaded = SaveManager.load();

        // Wire up nav buttons
        document.getElementById('btn-back').onclick = () => this.goBack();
        document.getElementById('btn-forward').onclick = () => { };
        document.getElementById('btn-refresh').onclick = () => this.navigateTo(GameState.currentScreen);
        document.getElementById('btn-home').onclick = () => this.navigateTo(GameState.player.gameStarted ? 'town' : 'title');

        // Wire up links bar
        document.querySelectorAll('.link-item').forEach(item => {
            const text = item.textContent.trim();
            if (text.includes('My Profile')) item.onclick = () => this.navigateTo('apartment');
            if (text.includes('Town Map')) item.onclick = () => this.navigateTo('town');
            if (text.includes('Inventory')) item.onclick = () => {
                if (GameState.currentScreen === 'town') TownScreen.showInventory();
                else this.navigateTo('town');
            };
            if (text.includes('Profile')) item.onclick = () => this.navigateTo('apartment');
        });

        // Start auto-save
        SaveManager.startAutoSave();

        // Update coins display
        GameState.updateCoinDisplay();

        // Navigate to appropriate screen
        if (hasLoaded && GameState.player.gameStarted) {
            this.navigateTo('town');
        } else {
            this.navigateTo('title');
        }
    },

    navigateTo(screenId) {
        // Loading animation
        GameState.updateStatus('Loading...', '⏳');

        // Universal 3D cleanup — kill ALL old WebGL contexts + animation loops
        if (typeof VoxelEngine !== 'undefined') {
            VoxelEngine.disposeAll();
        }

        // Screen-specific cleanup (timers, event listeners, etc.)
        const currentScreen = GameState.currentScreen;
        if (currentScreen && currentScreen !== screenId) {
            const screen = this.screens[currentScreen];
            if (screen && screen.cleanup) screen.cleanup();
            if (screen && screen.cleanup3D) screen.cleanup3D();
        }

        // Track history
        if (GameState.currentScreen && GameState.currentScreen !== screenId) {
            this.screenHistory.push(GameState.currentScreen);
            if (this.screenHistory.length > 20) this.screenHistory.shift();
        }

        GameState.previousScreen = GameState.currentScreen;
        GameState.currentScreen = screenId;

        const screen = this.screens[screenId];
        if (screen && screen.render) {
            // Brief loading delay for retro feel
            setTimeout(() => {
                screen.render();
                // Update coin display after render
                GameState.updateCoinDisplay();
            }, 150);
        } else {
            document.getElementById('screen-container').innerHTML = `
        <div style="padding: 32px; text-align: center;">
          <h1 style="font-family: var(--font-pixel); font-size: 14px; color: #FF6347;">404 — Page Not Found</h1>
          <p style="margin-top: 12px;">The page you're looking for doesn't exist in ccllottaaWorld!</p>
          <button class="retro-btn" onclick="App.navigateTo('town')" style="margin-top: 16px;">Go Home</button>
        </div>
      `;
        }
    },

    goBack() {
        if (this.screenHistory.length > 0) {
            const prev = this.screenHistory.pop();
            GameState.currentScreen = prev;
            const screen = this.screens[prev];
            if (screen && screen.render) screen.render();
        }
    },

    continueGame() {
        if (SaveManager.load()) {
            this.navigateTo('town');
        }
    }
};

// Boot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
