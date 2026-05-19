import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function optionalPlugin(packageName) {
  try {
    return require(packageName);
  } catch {
    return null;
  }
}

const react = optionalPlugin('eslint-plugin-react');
const reactHooks = optionalPlugin('eslint-plugin-react-hooks');
const jsxA11y = optionalPlugin('eslint-plugin-jsx-a11y');
const stylistic = optionalPlugin('@stylistic/eslint-plugin');
const next = optionalPlugin('@next/eslint-plugin-next');

const appTsconfigs = [
    './apps/backend/tsconfig.json',
    './apps/frontend/tsconfig.json',
    './apps/bot/tsconfig.json',
    './packages/config/tsconfig.json',
    './packages/database/tsconfig.json',
    './packages/shared/tsconfig.json',
];

const plugins = {
  '@typescript-eslint': tsPlugin,
  ...(react ? { react } : {}),
  ...(reactHooks ? { 'react-hooks': reactHooks } : {}),
  ...(jsxA11y ? { 'jsx-a11y': jsxA11y } : {}),
  ...(stylistic ? { '@stylistic': stylistic } : {}),
  ...(next ? { '@next/next': next } : {}),
};

const stylisticRules = stylistic
  ? {
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/block-spacing': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
        },
      ],
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/function-call-spacing': ['error', 'never'],
      '@stylistic/indent': ['warn', 4, { SwitchCase: 1 }],
      '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
      '@stylistic/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      '@stylistic/max-len': [
        'warn',
        {
          code: 120,
          ignoreComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/padded-blocks': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/semi-spacing': ['error', { before: false, after: true }],
      '@stylistic/space-before-blocks': ['error', 'always'],
      '@stylistic/space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/type-annotation-spacing': 'error',
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
        },
      ],
      '@stylistic/jsx-closing-bracket-location': ['error', 'line-aligned'],
      '@stylistic/jsx-curly-spacing': ['error', { when: 'never', children: true }],
      '@stylistic/jsx-equals-spacing': ['error', 'never'],
      '@stylistic/jsx-first-prop-new-line': ['error', 'multiline'],
      '@stylistic/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/jsx-wrap-multilines': [
        'error',
        {
          declaration: 'parens-new-line',
          assignment: 'parens-new-line',
          return: 'parens-new-line',
          arrow: 'parens-new-line',
          condition: 'parens-new-line',
          logical: 'parens-new-line',
          prop: 'parens-new-line',
        },
      ],
    }
  : {};

const reactRules = react
  ? {
      'react/jsx-uses-vars': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-deprecated': 'warn',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-string-refs': 'error',
      'react/no-unescaped-entities': 'warn',
      'react/no-unknown-property': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-render-return': 'error',
    }
  : {};

const reactHooksRules = reactHooks
  ? {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    }
  : {};

const nextRules = next
  ? {
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-page-custom-font': 'warn',
    }
  : {};

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/generated/**',
      '**/prisma/generated/**',
      '**/*.config.js',
      '**/*.config.cjs',
      '**/*.config.mjs',
    ],
  },

  js.configs.recommended,

  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.es2022,
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins,
    rules: {
      ...stylisticRules,

      'no-cond-assign': ['error', 'always'],
      'no-constant-condition': 'error',
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      'no-func-assign': 'error',
      'no-inner-declarations': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-obj-calls': 'error',
      'no-sparse-arrays': 'error',
      'no-unreachable': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
      'no-unused-vars': 'off',
      'no-console': 'warn',
      'no-undef': 'warn',

       '@typescript-eslint/no-unused-vars': [
         'warn',
         {
           argsIgnorePattern: '^_',
           varsIgnorePattern: '^_',
           caughtErrorsIgnorePattern: '^_',
           ignoreRestSiblings: true,
         },
       ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  {
    files: ['apps/frontend/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: appTsconfigs,
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
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
      ...reactRules,
      ...reactHooksRules,
      ...nextRules,
    },
  },

  {
    files: ['apps/backend/**/*.{ts,js}', 'apps/bot/**/*.{ts,js}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: appTsconfigs,
        tsconfigRootDir: __dirname,
      },
    },
  },

  {
    files: ['packages/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },

  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
];