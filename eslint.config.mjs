import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import pluginImport from "eslint-plugin-import";
import pluginReactHooks from "eslint-plugin-react-hooks";
import security from "eslint-plugin-security";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:import/recommended",
  ),

  {
    plugins: {
      security,
      "import": pluginImport,
      "react-hooks": pluginReactHooks,
    },
    rules: {
      "security/detect-object-injection": "warn",

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-html-link-for-pages": "error",

      "import/order": ["warn", {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        "alphabetize": { "order": "asc", "caseInsensitive": true }
      }],
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/prefer-default-export": "off",


      "eqeqeq": ["error", "always"],
      "no-multi-spaces": "warn",
      "no-trailing-spaces": "warn",
      "object-curly-spacing": ["warn", "always"],
      "array-bracket-spacing": ["warn", "never"],

      "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-debugger": "error",

      "@next/next/no-img-element": "off",
      "import/no-anonymous-default-export": "off",
    },
  },

  {
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx"],
        },
      },
      react: {
        version: "detect",
      },
    },
  },

  {
    ignores: [
      "**/node_modules/",
      ".next/",
      "out/",
      "dist/",
      "prisma/seed.js",
    ],
  },
];

export default config;