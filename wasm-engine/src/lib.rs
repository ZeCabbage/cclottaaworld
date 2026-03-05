//! ccllottaaWorld Voxel Engine — Wasm Entry Point
//!
//! Exposes chunk generation and greedy meshing to JavaScript
//! via wasm-bindgen.

use wasm_bindgen::prelude::*;

mod world;
mod meshing;
mod utils;

/// Initialize the Wasm module (called once from JS).
#[wasm_bindgen(start)]
pub fn main() {
    // Set up panic hook for better error messages in browser console
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();

    web_sys::console::log_1(&"[wasm-engine] Initialized.".into());
}

/// Generate voxel data for a 16×16×16 chunk at (cx, cz).
/// Returns a flat Uint8Array of block IDs (4096 elements).
#[wasm_bindgen]
pub fn generate_chunk(cx: i32, cz: i32) -> Vec<u8> {
    world::generator::generate(cx, cz)
}

/// Run greedy meshing on chunk data.
/// Input: flat array of 4096 block IDs (16×16×16).
/// Returns a JS object with `vertices` (Float32Array) and `indices` (Uint32Array).
#[wasm_bindgen]
pub fn mesh_chunk(chunk_data: &[u8]) -> JsValue {
    let mesh = meshing::greedy::mesh(chunk_data);
    serde_wasm_bindgen::to_value(&mesh).unwrap_or(JsValue::NULL)
}

/// 3D noise value at a world position.
#[wasm_bindgen]
pub fn noise_3d(x: f64, y: f64, z: f64) -> f64 {
    utils::noise::sample_3d(x, y, z)
}
