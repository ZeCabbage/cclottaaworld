/* ============================================
   Dev Tools — FPS Counter & Memory Monitor
   Only visible in development mode.
   Toggle with backtick (`) key.
   ============================================ */

let overlay = null;
let visible = false;
let frameCount = 0;
let lastFpsTime = 0;
let fps = 0;

export const devTools = {
    enabled: false,

    /**
     * Initialize the dev tools overlay.
     * Call once at app startup.
     */
    init() {
        // Only enable in dev mode
        if (!import.meta.env.DEV) return;
        this.enabled = true;

        // Create overlay element
        overlay = document.createElement('div');
        overlay.id = 'dev-tools-overlay';
        overlay.style.cssText = `
      position: fixed;
      top: 8px;
      right: 8px;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.85);
      border: 1px solid rgba(0, 255, 255, 0.3);
      padding: 8px 12px;
      font-family: 'VT323', monospace;
      font-size: 14px;
      color: #39FF14;
      pointer-events: none;
      user-select: none;
      display: none;
      min-width: 180px;
      line-height: 1.6;
    `;
        overlay.innerHTML = `
      <div style="color: #00FFFF; font-size: 10px; letter-spacing: 2px; margin-bottom: 4px;">DEV TOOLS</div>
      <div id="dt-fps">FPS: --</div>
      <div id="dt-memory">MEM: --</div>
      <div id="dt-renderer">GPU: --</div>
      <div id="dt-screens">SCR: --</div>
      <div style="color: #666; font-size: 11px; margin-top: 4px;">Press \` to toggle</div>
    `;
        document.body.appendChild(overlay);

        // Toggle with backtick key
        document.addEventListener('keydown', (e) => {
            if (e.key === '`') {
                visible = !visible;
                overlay.style.display = visible ? 'block' : 'none';
            }
        });

        // Start update loop
        this._update();
    },

    /**
     * Update loop — runs every frame when visible.
     */
    _update() {
        if (!this.enabled) return;

        frameCount++;
        const now = performance.now();

        if (now - lastFpsTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastFpsTime = now;

            if (visible) {
                this._render();
            }
        }

        requestAnimationFrame(() => this._update());
    },

    _render() {
        const fpsEl = document.getElementById('dt-fps');
        const memEl = document.getElementById('dt-memory');
        const rendEl = document.getElementById('dt-renderer');

        if (fpsEl) {
            const color = fps >= 30 ? '#39FF14' : fps >= 20 ? '#FFD700' : '#FF6347';
            fpsEl.innerHTML = `FPS: <span style="color:${color}">${fps}</span>`;
        }

        if (memEl && performance.memory) {
            const mb = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
            const limit = (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(0);
            memEl.textContent = `MEM: ${mb}MB / ${limit}MB`;
        } else if (memEl) {
            memEl.textContent = 'MEM: N/A';
        }

        if (rendEl) {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
                if (gl) {
                    const ext = gl.getExtension('WEBGL_debug_renderer_info');
                    if (ext) {
                        const gpu = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
                        rendEl.textContent = `GPU: ${gpu.substring(0, 30)}`;
                    } else {
                        rendEl.textContent = 'GPU: WebGL2';
                    }
                }
            } else {
                rendEl.textContent = 'GPU: No canvas';
            }
        }
    },

    /**
     * Log a custom metric to the overlay.
     */
    setMetric(key, value) {
        if (!this.enabled || !visible) return;
        const el = document.getElementById(`dt-${key}`);
        if (el) el.textContent = `${key.toUpperCase()}: ${value}`;
    },
};
