// Runtime platform detection helpers.
//
// The same Vue bundle is shipped to the web and to every Tauri target
// (macOS/Windows/Linux desktop + Android/iOS). Some features must behave
// differently per platform (file download, fullscreen, touch navigation,
// toolbar placement), so components branch on these helpers at runtime.
//
// Detection is based on the user agent (reliable inside a Tauri WebView) plus
// the Tauri global, so no extra Tauri OS plugin / Rust dependency is required.

const ua = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : ''
const maxTouchPoints = typeof navigator !== 'undefined' ? (navigator.maxTouchPoints || 0) : 0

/**
 * True when running inside a Tauri WebView (any platform), false on the plain web.
 * @returns {boolean}
 */
export function isTauri () {
  return typeof window !== 'undefined' &&
    (typeof window.__TAURI_INTERNALS__ !== 'undefined' || typeof window.__TAURI__ !== 'undefined')
}

/**
 * @returns {boolean} True on Android.
 */
export function isAndroid () {
  return /android/i.test(ua)
}

/**
 * @returns {boolean} True on iOS/iPadOS (iPadOS reports as "Macintosh" but has touch).
 */
export function isIOS () {
  return /iphone|ipad|ipod/i.test(ua) ||
    (/macintosh/i.test(ua) && maxTouchPoints > 1)
}

/**
 * @returns {boolean} True on any mobile/touch platform (Android or iOS).
 */
export function isMobile () {
  return isAndroid() || isIOS()
}

/**
 * @returns {boolean} True on macOS desktop (excludes touch iPadOS).
 */
export function isMacOS () {
  return /macintosh|mac os x/i.test(ua) && !isIOS()
}

/**
 * @returns {boolean} True on a Tauri desktop build (not mobile).
 */
export function isDesktop () {
  return isTauri() && !isMobile()
}

/**
 * @returns {boolean} True when running as a plain web app (not packaged by Tauri).
 */
export function isWeb () {
  return !isTauri()
}

/**
 * True only inside the packaged native mobile app (Android/iOS Tauri build).
 * This is what the mobile-specific UI (single top bar, touch navigation) keys
 * off — a mobile *browser* opening the web app keeps the normal desktop layout.
 * @returns {boolean}
 */
export function isMobileApp () {
  return isTauri() && isMobile()
}
