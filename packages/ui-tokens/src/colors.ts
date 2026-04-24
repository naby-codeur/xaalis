export const colors = {
  brand: {
    50: "#f0f7ff",
    100: "#e0effe",
    500: "#0066ff",
    600: "#0052cc",
    700: "#003d99",
  },
  neutral: {
    0: "#ffffff",
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    500: "#71717a",
    700: "#3f3f46",
    900: "#18181b",
    1000: "#000000",
  },
  semantic: {
    success: "#16a34a",
    warning: "#f59e0b",
    danger: "#dc2626",
    info: "#0ea5e9",
  },
} as const;

export type ColorTokens = typeof colors;
