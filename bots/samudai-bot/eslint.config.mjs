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
      // `declare global { namespace Express { interface Request } }` augmentation is idiomatic
      '@typescript-eslint/no-namespace': 'off',
      // surfaced as warnings: too many / too semantic to fix mechanically without domain knowledge
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
      'no-prototype-builtins': 'warn',
      // hardened to errors and fixed
      '@typescript-eslint/no-require-imports': 'error',
      'no-useless-catch': 'error',
      // unused-imports owns unused detection: dead imports are an auto-fixable error;
      // unused vars AND args are errors (intentional bindings may be `_`-prefixed)
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
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
