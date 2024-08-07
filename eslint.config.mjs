import jasmine from "eslint-plugin-jasmine";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    ignores: ["**/*.js", "**/*.mjs", "server/jigoku/**", "test/helpers/**", "test/server/**"],
  },
  {
    rules: {
        "@typescript-eslint/no-unused-vars": ["error", {
            "vars": "local",
        }],
        "@typescript-eslint/no-explicit-any": ["warn"],
    }
  }
);

// export default [{
//     // ignores: ["**/*.ts"],
//     ignores: ["**/*.js", "**/*.mjs", "server/jigoku/**", "test/helpers/**", "test/server/**"],
// }, ...compat.extends("eslint:recommended", "plugin:jasmine/recommended"), {
//     plugins: {
//         jasmine,
//     },

//     languageOptions: {
//         globals: {
//             ...globals.node,
//             ...globals.jasmine,
//         },

//         ecmaVersion: 2020,
//         sourceType: "commonjs",
//     },

//     rules: {
//         "jasmine/no-spec-dupes": 0,
//         "jasmine/no-suite-dupes": 0,
//         "jasmine/missing-expect": 1,
//         "jasmine/new-line-before-expect": 0,
//         "jasmine/prefer-toHaveBeenCalledWith": 0,

//         indent: [2, 4, {
//             SwitchCase: 1,
//         }],

//         quotes: [2, "single"],
//         "global-strict": 0,
//         "brace-style": [2, "1tbs"],
//         "no-sparse-arrays": [1],
//         eqeqeq: [2],
//         "no-else-return": [2],
//         "no-extra-bind": [2],
//         curly: [2, "all"],
//         "no-multi-spaces": [2],
//         "no-invalid-this": [2],
//         "no-useless-escape": [1],
//         "no-useless-concat": [1],
//         "no-useless-constructor": [1],
//         "array-bracket-spacing": [1, "never"],
//         "block-spacing": [2, "always"],
//         "@typescript-eslint/no-explicit-any": [1],
//         "eol-last": [0],

//         camelcase: [1, {
//             properties: "never",
//         }],

//         "comma-dangle": [1],
//         "space-before-blocks": [2],
//         "space-in-parens": [2, "never"],
//         "space-infix-ops": [2],
//         "no-multiple-empty-lines": [2],
//         "eol-last": [2],
//         semi: [2],
//         "no-unused-vars": [2, {
//             "vars": "local",
//             "args": "none"
//         }],
//         "keyword-spacing": [2, {
//             overrides: {
//                 if: {
//                     after: true,
//                 },

//                 for: {
//                     after: true,
//                 },

//                 while: {
//                     after: true,
//                 },

//                 switch: {
//                     after: true,
//                 },

//                 catch: {
//                     after: true,
//                 },
//             },
//         }],

//         "no-trailing-spaces": [2],
//     },
// }];