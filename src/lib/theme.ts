export const THEME_STORAGE_KEY = "marketlab-theme";

export type ThemePreference = "light" | "dark";

export function themeScript(): string {
  return `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);var d=s==="dark";document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;
}
