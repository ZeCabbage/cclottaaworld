//! Block type definitions.

/// Each block type has an ID (u8) and properties.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Block {
    Air = 0,
    Stone = 1,
    Dirt = 2,
    Grass = 3,
    Concrete = 4,
    Brick = 5,
    Glass = 6,
    Neon = 7,
    Asphalt = 8,
}

impl Block {
    /// Convert a raw u8 ID to a Block enum.
    pub fn from_id(id: u8) -> Self {
        match id {
            1 => Block::Stone,
            2 => Block::Dirt,
            3 => Block::Grass,
            4 => Block::Concrete,
            5 => Block::Brick,
            6 => Block::Glass,
            7 => Block::Neon,
            8 => Block::Asphalt,
            _ => Block::Air,
        }
    }

    /// Whether this block is transparent (should not generate faces).
    pub fn is_transparent(&self) -> bool {
        matches!(self, Block::Air | Block::Glass)
    }

    /// Get the RGB color for this block type (0.0 - 1.0 range).
    pub fn color(&self) -> [f32; 3] {
        match self {
            Block::Air => [0.0, 0.0, 0.0],
            Block::Stone => [0.5, 0.5, 0.5],
            Block::Dirt => [0.45, 0.3, 0.15],
            Block::Grass => [0.2, 0.55, 0.15],
            Block::Concrete => [0.6, 0.58, 0.55],
            Block::Brick => [0.6, 0.25, 0.2],
            Block::Glass => [0.7, 0.85, 0.95],
            Block::Neon => [0.9, 0.2, 0.8],
            Block::Asphalt => [0.2, 0.2, 0.22],
        }
    }
}
