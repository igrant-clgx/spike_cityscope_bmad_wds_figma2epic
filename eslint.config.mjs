import nextPlugin from "@next/eslint-plugin-next";

// eslint-config-next bundles typescript-eslint, which does not yet support the
// pinned TypeScript 7.0 native compiler and crashes on load. Until it does, we
// lint with the Next.js plugin's flat "core-web-vitals" config directly, which
// provides the Next rule set without pulling in typescript-eslint.
const eslintConfig = [
  {
    // Lint only the application scaffold; ignore repo planning/handover assets.
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      ".agents/**",
      "_bmad/**",
      "_bmad-output/**",
      "design-artifacts/**",
      "docs/**",
    ],
  },
  nextPlugin.configs["core-web-vitals"],
];

export default eslintConfig;
