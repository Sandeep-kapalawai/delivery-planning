module.exports = {
    // Modified from Vue's own TS eslint config:
    // https://github.com/vuejs/eslint-config-typescript/blob/e7e184c/index.js
    root: true,
    plugins: ['@typescript-eslint'],
    env: {
        node: true,
    },
    extends: ['plugin:vue/essential', 'plugin:vue/recommended', 'plugin:@typescript-eslint/eslint-recommended'],
    parserOptions: {
        parser: require.resolve('@typescript-eslint/parser'),
        extraFileExtensions: ['.vue'],
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

        // global linting
        indent: ['error', 4, { SwitchCase: 1 }],
        quotes: ['error', 'single'],
        'comma-dangle': ['error', 'always-multiline'],
        'comma-spacing': ['error', { before: false, after: true }],
        semi: ['error', 'always'],
        'space-before-function-paren': 0,
        'no-return-assign': 0,

        // vue linting...
        'vue/singleline-html-element-content-newline': 0,
        'vue/component-definition-name-casing': 0,
        'vue/comment-directive': 0,
        'vue/no-unused-vars': 'error',
        'vue/html-closing-bracket-newline': 0,
        'vue/max-attributes-per-line': 0,
        'vue/html-self-closing': 0,
        'vue/order-in-components': 0,

        // base vue linting
        'vue/html-indent': ['error', 4, { baseIndent: 1, attribute: 1, ignores: [] }],
        'vue/script-indent': ['error', 4, { baseIndent: 1, switchCase: 1, ignores: [] }],
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx', '*.vue'],
            rules: {
                indent: 'off',
                'vue/html-indent': 'off',
                'vue/script-indent': 'off',
                'vue/multi-word-component-names': 'off',
                // The core 'no-unused-vars' rules (in the eslint:recommeded ruleset)
                // does not work with type definitions
                'no-unused-vars': 'off',
                semi: ['error', 'always'],
            },
        },
    ],
};
