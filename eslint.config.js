import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const sharedRules = {
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
};

export default [
    {
        ignores: ['**/node_modules/', '**/coverage/', '**/dist/', 'frontend/'],
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
            ...sharedRules,
            'no-console': 'error',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },

    // Backend (TypeScript)
    ...tseslint.configs.recommended.map((config) => ({
        ...config,
        files: ['backend/**/*.ts'],
    })),
    {
        files: ['backend/**/*.ts'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
        rules: {
            ...sharedRules,
            // Серверу потрібні логи старту та помилок БД, решта console заборонена
            'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
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
