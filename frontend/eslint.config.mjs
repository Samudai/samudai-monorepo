import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import unusedImports from 'eslint-plugin-unused-imports';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default defineConfig([
    globalIgnores(['archive/', 'build/', 'dist/', 'node_modules/']),
    {
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            react.configs.flat.recommended,
            react.configs.flat['jsx-runtime'],
            prettierRecommended,
        ],
        plugins: { 'unused-imports': unusedImports },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: { ...globals.browser, ...globals.node, ...globals.es2021 },
        },
        settings: { react: { version: 'detect' } },
        rules: {
            // intentional React choices carried over from the prior config
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/no-children-prop': 'off',
            'react/no-unescaped-entities': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-namespace': 'off',
            // ~thousands of occurrences in a 113k-LOC app; surfaced as warnings
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/ban-ts-comment': [
                'error',
                { 'ts-ignore': 'allow-with-description' },
            ],
            '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
            'no-prototype-builtins': 'warn',
            'no-useless-catch': 'warn',
            // empty props interfaces (`interface FooProps {}`) are an idiomatic placeholder here
            '@typescript-eslint/no-empty-object-type': 'off',
            // allow the codebase's `cond && fn()` / `cond ? a() : b()` side-effect idioms
            '@typescript-eslint/no-unused-expressions': [
                'error',
                { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true },
            ],
            // useless escapes live in validation regexes (subdomain/URL); editing them is risky
            'no-useless-escape': 'warn',
            // intentional `false && <JSX/>` feature toggles
            'no-constant-binary-expression': 'warn',
            // unused-imports owns unused detection: imports are an auto-fixable error,
            // unused locals/args a warning (too many to block on in this app)
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
            'no-constant-condition': 'error',
        },
    },
]);
