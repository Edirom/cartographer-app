// Shared application entry point.
//
// On mobile (Android/iOS) the Rust code is compiled as a shared library that
// the native wrapper loads, so the Tauri setup lives here in `run()` and is
// exposed through the `mobile_entry_point`. The desktop binary in `main.rs`
// simply calls this same function.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
