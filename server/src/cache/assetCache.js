/* ============================================
   Asset Cache — File-based caching for generated .glb files
   ============================================ */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, '../../output');

export const assetCache = {
    /**
     * Check if a cached asset exists.
     */
    has(type, id) {
        return fs.existsSync(path.join(CACHE_DIR, `${type}_${id}.glb`));
    },

    /**
     * Get a cached asset.
     * @returns {Buffer|null}
     */
    get(type, id) {
        const filepath = path.join(CACHE_DIR, `${type}_${id}.glb`);
        if (fs.existsSync(filepath)) {
            return fs.readFileSync(filepath);
        }
        return null;
    },

    /**
     * Store a generated asset.
     */
    set(type, id, buffer) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
        fs.writeFileSync(path.join(CACHE_DIR, `${type}_${id}.glb`), Buffer.from(buffer));
    },

    /**
     * Clear all cached assets.
     */
    clear() {
        if (fs.existsSync(CACHE_DIR)) {
            const files = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.glb'));
            for (const file of files) {
                fs.unlinkSync(path.join(CACHE_DIR, file));
            }
        }
    },
};
