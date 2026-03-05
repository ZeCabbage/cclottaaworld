/* Screen: Pet View */
import { screenRegistry } from '../engine/screenRegistry.js';

export const petViewScreen = {
  render() {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
      <div class="screen-enter" style="min-height:100%;background:var(--color-bg-surface);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:var(--space-2xl);">
        <div style="font-size:48px;margin-bottom:var(--space-lg);">🐾</div>
        <h2 class="pixel-text" style="font-size:var(--text-sm);color:var(--neon-cyan);margin-bottom:var(--space-md);">Pet View</h2>
        <p style="font-family:var(--font-retro);font-size:var(--text-lg);color:var(--color-text-secondary);">Migrating to new architecture...</p>
      </div>`;
  },
  cleanup() { },
  cleanup3D() { },
};
screenRegistry.register('petView', petViewScreen, { title: 'Pet View', path: 'petView', icon: '🐾', category: 'general' });
