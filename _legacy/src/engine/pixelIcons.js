/* ============================================
   Pixel Icons — PS2 Era Icon System
   Simple colored symbols in pixel font
   No images, no canvas, no box-shadow hacks
   ============================================ */

const PixelIcons = {
    /* Each icon returns an HTML string — a styled span.
       Uses Unicode block/geometric chars in the pixel font
       at controllable sizes. Reliable everywhere. */

    _icon(char, color, size) {
        size = size || 16;
        return `<span class="px-icon" style="color:${color};font-size:${size}px;">${char}</span>`;
    },

    // --- Navigation & UI ---
    coin(s) { return this._icon('◉', '#FFD700', s); },
    star(s) { return this._icon('★', '#FFD700', s); },
    controller(s) { return this._icon('◈', '#00FFFF', s); },
    supply(s) { return this._icon('■', '#A0522D', s); },
    tree(s) { return this._icon('▲', '#228844', s); },
    house(s) { return this._icon('⌂', '#FFAA00', s); },
    person(s) { return this._icon('◆', '#D4A574', s); },
    bag(s) { return this._icon('□', '#8B4513', s); },

    // --- Arcade Games ---
    cards(s) { return this._icon('♠', '#FF69B4', s); },
    grid(s) { return this._icon('▦', '#00BFFF', s); },
    antenna(s) { return this._icon('¥', '#32CD32', s); },
    trophy(s) { return this._icon('◈', '#FFD700', s); },
    skull(s) { return this._icon('✕', '#FF4444', s); },

    // --- Faces ---
    happy(s) { return this._icon('◉‿◉', '#32CD32', s); },
    sad(s) { return this._icon('◉︿◉', '#6666AA', s); },

    // --- Fashion ---
    shirt(s) { return this._icon('▽', '#CC4488', s); },

    /* Convenience sizes */
    inline(name, size) { return typeof this[name] === 'function' ? this[name](size || 14) : ''; },
    large(name) { return this.inline(name, 28); },
    xl(name) { return this.inline(name, 40); },
};
