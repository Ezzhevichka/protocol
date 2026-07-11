import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import next from '@next/eslint-plugin-next';
import boundaries from 'eslint-plugin-boundaries';
import importX from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tsconfigRootDir = __dirname;

const tsProjects = [
  './apps/backend/tsconfig.json',
  './apps/frontend/tsconfig.json',
  './apps/bot/tsconfig.json',
  './shared/database/tsconfig.json',
  './shared/redis/tsconfig.json',
  './shared/types/tsconfig.json',
];

const tsFiles = ['**/*.{ts,tsx}'];
const jsFiles = ['**/*.{js,jsx,mjs,cjs}'];

const frontendFiles = ['apps/frontend/**/*.{ts,tsx,js,jsx}'];
const frontendSrcFiles = ['apps/frontend/src/**/*.{ts,tsx,js,jsx}'];
const backendFiles = ['apps/backend/**/*.{ts,js}'];
const botFiles = ['apps/bot/**/*.{ts,js}'];
const packageFiles = ['shared/**/*.{ts,tsx,js,jsx}'];

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/.cache/**',
      '**/generated/**',
      '**/prisma/generated/**',
      '**/next-env.d.ts',
      '**/*.d.ts',
      '**/*.config.js',
      '**/*.config.cjs',
      '**/*.config.mjs',
      '**/*.config.ts',
      '**/*.config.mts',
      'docker-compose.bots.generated.yml',
    ],
  },

  js.configs.recommended,

  {
    files: [...tsFiles, ...jsFiles],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: tsProjects,
        tsconfigRootDir,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.es2022,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@stylistic': stylistic,
      'import-x': importX,
    },
    settings: {
      'import-x/extensions': ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'],
      'import-x/resolver': {
        typescript: {
          project: tsProjects,
        },
        node: true,
      },
    },
    rules: {
      'eqeqeq': ['warn', 'always', { null: 'ignore' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-empty-function': 'off',
      'no-eval': 'error',
      'no-implicit-coercion': 'warn',
      'no-shadow': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-var': 'warn',
      'object-shorthand': ['warn', 'always'],
      'prefer-const': ['warn', { destructuring: 'all' }],
      'prefer-template': 'warn',

      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': ['warn', { fixToUnknown: false, ignoreRestArgs: true }],
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true, ignoreIIFE: true }],
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { arguments: false, attributes: false } }],
      '@typescript-eslint/no-shadow': ['warn', { hoist: 'all', ignoreTypeValueShadow: true }],
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': ['warn', { ignoreConditionalTests: true, ignoreMixedLogicalExpressions: true }],
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/return-await': ['warn', 'in-try-catch'],
      '@typescript-eslint/switch-exhaustiveness-check': 'warn',

      'import-x/export': 'error',
      'import-x/first': 'warn',
      'import-x/newline-after-import': 'warn',
      'import-x/no-absolute-path': 'error',
      'import-x/no-cycle': ['warn', { maxDepth: 3, ignoreExternal: true }],
      'import-x/no-duplicates': 'warn',
      'import-x/no-self-import': 'error',
      'import-x/no-useless-path-segments': ['warn', { noUselessIndex: true }],

      '@stylistic/comma-dangle': [
        'warn',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
        },
      ],
      '@stylistic/eol-last': ['warn', 'always'],
      '@stylistic/indent': ['warn', 'tab', { SwitchCase: 1, tabLength: 4 }],
      '@stylistic/max-len': ['warn', { code: 510, ignoreComments: true, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
      '@stylistic/no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0 }],
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['warn', 'always'],
    },
  },

  {
    files: jsFiles,
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },

  {
    files: frontendFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      '@next/next': next,
    },
    settings: {
      react: {
        version: 'detect',
      },
      next: {
        rootDir: ['apps/frontend/'],
      },
    },
    rules: {
      'react/jsx-uses-vars': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-key': ['error', { checkFragmentShorthand: true, warnOnDuplicates: true }],
      'react/self-closing-comp': 'warn',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/html-has-lang': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',

      '@next/next/no-assign-module-variable': 'error',
      '@next/next/no-async-client-component': 'error',
      '@next/next/no-document-import-in-page': 'error',
      '@next/next/no-duplicate-head': 'error',
      '@next/next/no-head-import-in-document': 'error',
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'warn',

      '@stylistic/jsx-quotes': ['warn', 'prefer-double'],
    },
  },

  {
    files: frontendSrcFiles,
    plugins: {
      boundaries,
    },
    settings: {
      'boundaries/include': ['apps/frontend/src/**/*'],
      'boundaries/elements': [
        { type: 'app', pattern: 'apps/frontend/src/app/**' },
        { type: 'pages', pattern: 'apps/frontend/src/pages/**' },
        { type: 'widgets', pattern: 'apps/frontend/src/widgets/*/**', capture: ['segment'] },
        { type: 'features', pattern: 'apps/frontend/src/features/*/**', capture: ['segment'] },
        { type: 'entities', pattern: 'apps/frontend/src/entities/*/**', capture: ['segment'] },
        { type: 'shared', pattern: 'apps/frontend/src/shared/**' },
      ],
    },
    rules: {
      'boundaries/no-unknown': 'warn',
      'boundaries/no-unknown-files': 'warn',
      'boundaries/dependencies': [
        'warn',
        {
          default: 'disallow',
          rules: [
            { from: { type: 'app' }, allow: { to: { type: ['pages', 'widgets', 'features', 'entities', 'shared'] } } },
            { from: { type: 'pages' }, allow: { to: { type: ['widgets', 'features', 'entities', 'shared'] } } },
            { from: { type: 'widgets' }, allow: { to: { type: ['features', 'entities', 'shared'] } } },
            { from: { type: 'features' }, allow: { to: { type: ['entities', 'shared'] } } },
            { from: { type: 'entities' }, allow: { to: { type: ['shared'] } } },
            { from: { type: 'shared' }, allow: { to: { type: ['shared'] } } },
          ],
        },
      ],
    },
  },

  {
    files: backendFiles,
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            { group: ['apps/frontend/**'], message: 'Backend must not import frontend code.' },
            { group: ['apps/bot/**'], message: 'Backend must not import bot code directly.' },
          ],
        },
      ],
    },
  },

  {
    files: botFiles,
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            { group: ['apps/frontend/**'], message: 'Bot must not import frontend code.' },
            { group: ['apps/backend/**'], message: 'Bot must not import backend code directly.' },
          ],
        },
      ],
    },
  },

  {
    files: packageFiles,
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            { group: ['apps/**'], message: 'Shared must not depend on apps.' },
          ],
        },
      ],
    },
  },

  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
