/* ============================================
   Browser Chrome — Faux IE browser window UI
   ============================================ */

export const browserChrome = {
    init(app) {
        // Wire up nav buttons
        document.getElementById('btn-back').onclick = () => app.goBack();
        document.getElementById('btn-forward').onclick = () => { };
        document.getElementById('btn-refresh').onclick = () => app.navigateTo(app.screens[app.gameState?.currentScreen] ? app.gameState.currentScreen : 'title');
        document.getElementById('btn-home').onclick = () => {
            const { gameState } = import('../state/gameState.js');
            app.navigateTo(gameState?.player?.gameStarted ? 'town' : 'title');
        };

        // Wire up links bar
        document.querySelectorAll('.link-item').forEach(item => {
            const text = item.textContent.trim();
            if (text.includes('My Profile')) item.onclick = () => app.navigateTo('apartment');
            if (text.includes('Town Map')) item.onclick = () => app.navigateTo('town');
            if (text.includes('Inventory')) item.onclick = () => app.navigateTo('town');
            if (text.includes('Profile')) item.onclick = () => app.navigateTo('apartment');
        });
    },
};
