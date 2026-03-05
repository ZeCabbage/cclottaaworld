//! Chunk data structure — 16×16×16 voxel grid.

pub const CHUNK_SIZE: usize = 16;
pub const CHUNK_VOLUME: usize = CHUNK_SIZE * CHUNK_SIZE * CHUNK_SIZE; // 4096

/// A chunk stores block IDs in a flat array indexed by (x, y, z).
pub struct Chunk {
    pub blocks: [u8; CHUNK_VOLUME],
    pub cx: i32,
    pub cz: i32,
}

impl Chunk {
    pub fn new(cx: i32, cz: i32) -> Self {
        Chunk {
            blocks: [0u8; CHUNK_VOLUME],
            cx,
            cz,
        }
    }

    /// Get block at local (x, y, z) coordinates.
    #[inline]
    pub fn get(&self, x: usize, y: usize, z: usize) -> u8 {
        if x >= CHUNK_SIZE || y >= CHUNK_SIZE || z >= CHUNK_SIZE {
            return 0; // Air outside bounds
        }
        self.blocks[y * CHUNK_SIZE * CHUNK_SIZE + z * CHUNK_SIZE + x]
    }

    /// Set block at local (x, y, z) coordinates.
    #[inline]
    pub fn set(&mut self, x: usize, y: usize, z: usize, block_id: u8) {
        if x < CHUNK_SIZE && y < CHUNK_SIZE && z < CHUNK_SIZE {
            self.blocks[y * CHUNK_SIZE * CHUNK_SIZE + z * CHUNK_SIZE + x] = block_id;
        }
    }
}
