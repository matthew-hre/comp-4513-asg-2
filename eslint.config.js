import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import n from "eslint-plugin-n";
import perfectionist from "eslint-plugin-perfectionist";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "@stylistic": stylistic,
      "better-tailwindcss": betterTailwindcss,
      n,
    },
    rules: {
      // these are some stylistic rules i like having
      "@stylistic/indent": ["error", 2],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],

      // some ts configs i try to follow
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      }],

      // i like having my tailwind auto-sorted
      ...betterTailwindcss.configs["recommended-warn"].rules,

      // this needs to be explicitly ignored
      "n/no-process-env": "error",

      // good practice
      "no-console": "warn",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    ...perfectionist.configs["recommended-natural"],
  },
]);
