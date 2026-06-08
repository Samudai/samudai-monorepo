import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierRecommended,
  {
    plugins: { 'unused-imports': unusedImports },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node, ...globals.es2021 }
    },
    rules: {
      // require() is used in places; keep parity with the prior config
      '@typescript-eslint/no-require-imports': 'off',
      // `declare global { namespace Express { interface Request } }` augmentation is idiomatic
      '@typescript-eslint/no-namespace': 'off',
      // surfaced as warnings: too many / too semantic to fix mechanically without
      // domain knowledge (any-typing, optional-chain assertions, prototype-access
      // footguns, redundant catch wrappers). Visible, non-blocking.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
      'no-prototype-builtins': 'warn',
      'no-useless-catch': 'warn',
      // unused-imports owns unused detection: dead imports are an auto-fixable error;
      // genuinely unused locals are an error (args are signature-driven, so not flagged)
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        { vars: 'all', varsIgnorePattern: '^_', args: 'none', ignoreRestSiblings: true }
      ],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-ignore': 'allow-with-description' }
      ],
      'no-useless-escape': 'error',
      'no-constant-condition': 'error'
    }
  }
);
