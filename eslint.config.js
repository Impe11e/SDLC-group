import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
    {
        ignores: ['node_modules/', 'coverage/', 'dist/'],
    },

    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-console': 'error',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-var': 'error',
            'prefer-const': 'error',
            eqeqeq: ['error', 'always'],
        },
    },

    {
        files: ['**/*.test.js', '**/__tests__/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
    },

    prettierConfig,
];
