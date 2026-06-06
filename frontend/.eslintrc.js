module.exports = {
    ignorePatterns: ['archive/'],
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
        'plugin:react/jsx-runtime',
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'react', 'unused-imports'],
    rules: {
        'react/react-in-jsx-scope': 0,
        '@typescript-eslint/no-var-requires': 0,
        'unused-imports/no-unused-imports': 1,
        'unused-imports/no-unused-vars': [
            0,
            {
                vars: 'all',
                args: 'after-used',
                ignoreRestSiblings: true,
            },
        ],
        'react/no-children-prop': 0,
        'react/prop-types': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        'no-useless-escape': 0,
        'react/no-unescaped-entities': 0,

        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/no-explicit-any': 0,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
