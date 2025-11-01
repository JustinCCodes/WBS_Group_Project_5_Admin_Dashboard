/**
 * Type declarations for Tauri runtime environment
 * .d.ts file to provide types for Tauri specific globals (really nice that this works just found out lol)
 */

interface Window {
  /**
   * Tauri API object - available when running in Tauri desktop app
   * Used to detect if code is running in Tauri vs browser context
   */
  __TAURI__?: {
    // Core Tauri API (extend as needed)
    invoke: <T>(cmd: string, args?: Record<string, unknown>) => Promise<T>;
  };
}
