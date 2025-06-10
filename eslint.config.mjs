import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import pluginImport from "eslint-plugin-import";
import pluginReactHooks from "eslint-plugin-react-hooks";
import security from "eslint-plugin-security";
import js from '@eslint/js';
import nextPlugin from 'eslint-config-next';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

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

  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      import: pluginImport,
      'jsx-a11y': jsxA11yPlugin,
      react: reactPlugin,
      'react-hooks': pluginReactHooks,
      security: security,
    },
    rules: {
      'no-console': 'off',
      'security/detect-object-injection': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'import/no-anonymous-default-export': 'off',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-role': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  ...nextPlugin,
];

export default config;