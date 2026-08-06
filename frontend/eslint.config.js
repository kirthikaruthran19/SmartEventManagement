import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores(["dist"]),

    {
        files: ["**/*.{js,jsx}"],

        extends: [
            js.configs.recommended,
            reactRefresh.configs.vite,
        ],

        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        plugins: {
            "react-hooks": reactHooks,
        },

        rules: {
            ...reactHooks.configs.recommended.rules,

            // Disable new React Compiler rules
            "react-hooks/immutability": "off",
            "react-hooks/set-state-in-effect": "off",
            "react-hooks/component-hook-factories": "off",

            // Disable React Refresh warning
            "react-refresh/only-export-components": "off",
        },
    },
]);