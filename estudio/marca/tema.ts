import { buildLegacyTheme } from "sanity";

export const tema = buildLegacyTheme({
  "--font-family-base":
    '"Archivo", "Segoe UI", system-ui, -apple-system, Arial, sans-serif',

  "--black": "#171310",
  "--white": "#f6f2e9",

  "--brand-primary": "#a8482a",
  "--focus-color": "#a8482a",

  "--component-bg": "#f6f2e9",
  "--component-text-color": "#171310",

  "--gray-base": "#5a544e",
  "--gray": "#807870",

  "--main-navigation-color": "#171310",
  "--main-navigation-color--inverted": "#f6f2e9",

  "--default-button-color": "#5a544e",
  "--default-button-primary-color": "#a8482a",

  "--state-info-color": "#8a5a33",
});
