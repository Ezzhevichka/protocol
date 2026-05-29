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
  './packages/config/tsconfig.json',
  './packages/database/tsconfig.json',
  './packages/shared/tsconfig.json',
];

const tsFiles = ['**/*.{ts,tsx}'];
const jsFiles = ['**/*.{js,jsx,mjs,cjs}'];

const frontendFiles = ['apps/frontend/**/*.{ts,tsx,js,jsx}'];
const frontendSrcFiles = ['apps/frontend/src/**/*.{ts,tsx,js,jsx}'];
const backendFiles = ['apps/backend/**/*.{ts,js}'];
const botFiles = ['apps/bot/**/*.{ts,js}'];
const packageFiles = ['packages/**/*.{ts,tsx,js,jsx}'];

const restrictedBackendImports = [
  {
    name: '@nestjs/platform-express',
    message: 'Импортируй platform-specific вещи только в bootstrap/main файлах, а не в бизнес-коде.',
  },
];

const restrictedFrontendImports = [
  {
    name: 'next/router',
    message: 'В App Router используй next/navigation. next/router оставь музеям и legacy pages router.',
  },
];

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
      'constructor-super': 'error',
      'for-direction': 'error',
      'getter-return': 'error',
      'no-async-promise-executor': 'error',
      'no-class-assign': 'error',
      'no-compare-neg-zero': 'error',
      'no-const-assign': 'error',
      'no-constant-binary-expression': 'error',
      'no-debugger': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-else-if': 'error',
      'no-duplicate-case': 'error',
      'no-fallthrough': 'error',
      'no-import-assign': 'error',
      'no-new-native-nonconstructor': 'error',
      'no-promise-executor-return': 'error',
      'no-prototype-builtins': 'error',
      'no-self-assign': 'error',
      'no-setter-return': 'error',
      'no-template-curly-in-string': 'error',
      'no-this-before-super': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',
      'no-unreachable': 'error',
      'no-use-before-define': 'off',
      'require-yield': 'error',
      'use-isnan': 'error',

      'no-dupe-args': 'off',
      'no-dupe-keys': 'off',
      'no-func-assign': 'off',
      'no-obj-calls': 'off',
      'no-undef': 'off',
      'valid-typeof': 'off',

      'array-callback-return': 'warn',
      'block-scoped-var': 'warn',
      'consistent-return': 'warn',
      'curly': ['warn', 'all'],
      'default-case-last': 'warn',
      'eqeqeq': ['warn', 'always', { null: 'ignore' }],
      'logical-assignment-operators': ['warn', 'always'],
      'no-alert': 'warn',
      'no-await-in-loop': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-continue': 'warn',
      'no-else-return': ['warn', { allowElseIf: false }],
      'no-empty-function': 'off',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'warn',
      'no-implicit-coercion': 'warn',
      'no-lone-blocks': 'warn',
      'no-multi-assign': 'warn',
      'no-new': 'warn',
      'no-param-reassign': [
        'warn',
        {
          props: true,
          ignorePropertyModificationsFor: [
            'acc',
            'draft',
            'req',
            'request',
            'res',
            'response',
            'ctx',
            'context',
          ],
        },
      ],
      'no-return-await': 'off',
      'no-sequences': 'warn',
      'no-shadow': 'off',
      'no-throw-literal': 'off',
      'no-unneeded-ternary': 'warn',
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',
      'no-useless-call': 'warn',
      'no-useless-computed-key': 'warn',
      'no-useless-concat': 'warn',
      'no-useless-constructor': 'off',
      'no-useless-rename': 'warn',
      'no-var': 'warn',
      'object-shorthand': ['warn', 'always'],
      'one-var': ['warn', 'never'],
      'prefer-arrow-callback': 'warn',
      'prefer-const': [
        'warn',
        {
          destructuring: 'all',
          ignoreReadBeforeAssign: true,
        },
      ],
      'prefer-destructuring': [
        'warn',
        {
          array: false,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      'prefer-template': 'warn',
      'radix': 'warn',
      'yoda': 'warn',

      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-base-to-string': 'warn',
      '@typescript-eslint/no-confusing-void-expression': [
        'warn',
        {
          ignoreArrowShorthand: true,
          ignoreVoidOperator: true,
        },
      ],
      '@typescript-eslint/no-deprecated': 'warn',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/no-dynamic-delete': 'warn',
      '@typescript-eslint/no-empty-function': [
        'warn',
        {
          allow: ['constructors', 'private-constructors', 'protected-constructors'],
        },
      ],
      '@typescript-eslint/no-explicit-any': [
        'warn',
        {
          fixToUnknown: false,
          ignoreRestArgs: true,
        },
      ],
      '@typescript-eslint/no-floating-promises': [
        'error',
        {
          ignoreVoid: true,
          ignoreIIFE: true,
        },
      ],
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-implied-eval': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            arguments: false,
            attributes: false,
          },
        },
      ],
      '@typescript-eslint/no-namespace': 'warn',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-redundant-type-constituents': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-shadow': [
        'warn',
        {
          hoist: 'all',
          ignoreTypeValueShadow: true,
          ignoreFunctionTypeParameterNameValueShadow: true,
        },
      ],
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-enum-comparison': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unused-expressions': [
        'warn',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
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
      '@typescript-eslint/no-useless-constructor': 'warn',
      '@typescript-eslint/only-throw-error': 'warn',
      '@typescript-eslint/prefer-as-const': 'warn',
      '@typescript-eslint/prefer-includes': 'warn',
      '@typescript-eslint/prefer-literal-enum-member': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': [
        'warn',
        {
          ignoreConditionalTests: true,
          ignoreMixedLogicalExpressions: true,
        },
      ],
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/prefer-promise-reject-errors': 'warn',
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/prefer-reduce-type-parameter': 'warn',
      '@typescript-eslint/prefer-return-this-type': 'warn',
      '@typescript-eslint/promise-function-async': [
        'warn',
        {
          allowedPromiseNames: ['Thenable'],
        },
      ],
      '@typescript-eslint/require-array-sort-compare': [
        'warn',
        {
          ignoreStringArrays: true,
        },
      ],
      '@typescript-eslint/restrict-plus-operands': [
        'warn',
        {
          allowAny: false,
          allowBoolean: false,
          allowNullish: false,
          allowNumberAndString: true,
          allowRegExp: false,
        },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'warn',
        {
          allowAny: false,
          allowBoolean: true,
          allowNever: false,
          allowNullish: false,
          allowNumber: true,
          allowRegExp: false,
        },
      ],
      '@typescript-eslint/return-await': ['warn', 'in-try-catch'],
      '@typescript-eslint/switch-exhaustiveness-check': 'warn',
      '@typescript-eslint/triple-slash-reference': [
        'warn',
        {
          path: 'never',
          types: 'prefer-import',
          lib: 'never',
        },
      ],
      '@typescript-eslint/unbound-method': [
        'warn',
        {
          ignoreStatic: true,
        },
      ],

      'import-x/export': 'error',
      'import-x/first': 'warn',
      'import-x/newline-after-import': 'warn',
      'import-x/no-absolute-path': 'error',
      'import-x/no-cycle': [
        'warn',
        {
          maxDepth: 3,
          ignoreExternal: true,
        },
      ],
      'import-x/no-duplicates': 'warn',
      'import-x/no-mutable-exports': 'warn',
      'import-x/no-named-default': 'warn',
      'import-x/no-self-import': 'error',
      'import-x/no-useless-path-segments': [
        'warn',
        {
          noUselessIndex: true,
        },
      ],
      'import-x/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      '@stylistic/array-bracket-spacing': ['warn', 'never'],
      '@stylistic/arrow-parens': ['warn', 'always'],
      '@stylistic/block-spacing': ['warn', 'always'],
      '@stylistic/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
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
      '@stylistic/comma-spacing': ['warn', { before: false, after: true }],
      '@stylistic/eol-last': ['warn', 'always'],
      '@stylistic/function-call-spacing': ['warn', 'never'],
      '@stylistic/indent': ['warn', 2, { SwitchCase: 1 }],
      '@stylistic/key-spacing': ['warn', { beforeColon: false, afterColon: true }],
      '@stylistic/keyword-spacing': ['warn', { before: true, after: true }],
      '@stylistic/lines-between-class-members': [
        'warn',
        'always',
        {
          exceptAfterSingleLine: true,
        },
      ],
      '@stylistic/max-len': [
        'warn',
        {
          code: 160,
          ignoreComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      '@stylistic/no-extra-semi': 'warn',
      '@stylistic/no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0 }],
      '@stylistic/no-trailing-spaces': 'warn',
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/operator-linebreak': ['warn', 'before'],
      '@stylistic/padded-blocks': ['warn', 'never'],
      '@stylistic/quotes': [
        'warn',
        'single',
        {
          avoidEscape: true,
        },
      ],
      '@stylistic/semi': ['warn', 'always'],
      '@stylistic/semi-spacing': ['warn', { before: false, after: true }],
      '@stylistic/space-before-blocks': ['warn', 'always'],
      '@stylistic/space-before-function-paren': [
        'warn',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      '@stylistic/space-infix-ops': 'warn',
      '@stylistic/type-annotation-spacing': 'warn',
      '@stylistic/member-delimiter-style': [
        'warn',
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
    },
  },

  {
    files: jsFiles,
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
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-string-refs': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-render-return': 'error',

      'react/boolean-prop-naming': 'warn',
      'react/button-has-type': 'warn',
      'react/destructuring-assignment': ['warn', 'always'],
      'react/display-name': 'warn',
      'react/function-component-definition': [
        'warn',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-boolean-value': ['warn', 'never'],
      'react/jsx-curly-brace-presence': [
        'warn',
        {
          props: 'never',
          children: 'never',
        },
      ],
      'react/jsx-fragments': ['warn', 'syntax'],
      'react/jsx-key': [
        'error',
        {
          checkFragmentShorthand: true,
          checkKeyMustBeforeSpread: true,
          warnOnDuplicates: true,
        },
      ],
      'react/jsx-no-bind': [
        'warn',
        {
          ignoreRefs: true,
          allowArrowFunctions: true,
          allowFunctions: false,
          allowBind: false,
        },
      ],
      'react/jsx-no-constructed-context-values': 'warn',
      'react/jsx-no-leaked-render': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-pascal-case': 'warn',
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'warn',
      'react/no-object-type-as-default-prop': 'warn',
      'react/no-unstable-nested-components': [
        'warn',
        {
          allowAsProps: true,
        },
      ],
      'react/self-closing-comp': 'warn',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/heading-has-content': 'warn',
      'jsx-a11y/html-has-lang': 'warn',
      'jsx-a11y/iframe-has-title': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/media-has-caption': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',

      '@next/next/no-assign-module-variable': 'error',
      '@next/next/no-async-client-component': 'error',
      '@next/next/no-before-interactive-script-outside-document': 'error',
      '@next/next/no-document-import-in-page': 'error',
      '@next/next/no-duplicate-head': 'error',
      '@next/next/no-head-import-in-document': 'error',
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-page-custom-font': 'warn',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-sync-scripts': 'warn',
      '@next/next/no-title-in-document-head': 'warn',

      '@stylistic/jsx-closing-bracket-location': ['warn', 'line-aligned'],
      '@stylistic/jsx-curly-spacing': ['warn', { when: 'never', children: true }],
      '@stylistic/jsx-equals-spacing': ['warn', 'never'],
      '@stylistic/jsx-first-prop-new-line': ['warn', 'multiline'],
      '@stylistic/jsx-max-props-per-line': ['warn', { maximum: 1, when: 'multiline' }],
      '@stylistic/jsx-quotes': ['warn', 'prefer-double'],
      '@stylistic/jsx-wrap-multilines': [
        'warn',
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

      'no-restricted-imports': [
        'warn',
        {
          paths: restrictedFrontendImports,
        },
      ],
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
        {
          type: 'app',
          pattern: 'apps/frontend/src/app/**',
        },
        {
          type: 'pages',
          pattern: 'apps/frontend/src/pages/**',
        },
        {
          type: 'widgets',
          pattern: 'apps/frontend/src/widgets/*/**',
          capture: ['segment'],
        },
        {
          type: 'features',
          pattern: 'apps/frontend/src/features/*/**',
          capture: ['segment'],
        },
        {
          type: 'entities',
          pattern: 'apps/frontend/src/entities/*/**',
          capture: ['segment'],
        },
        {
          type: 'shared',
          pattern: 'apps/frontend/src/shared/**',
        },
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
            {
              from: { type: 'app' },
              allow: {
                to: {
                  type: ['pages', 'widgets', 'features', 'entities', 'shared'],
                },
              },
            },
            {
              from: { type: 'pages' },
              allow: {
                to: {
                  type: ['widgets', 'features', 'entities', 'shared'],
                },
              },
            },
            {
              from: { type: 'widgets' },
              allow: {
                to: {
                  type: ['features', 'entities', 'shared'],
                },
              },
            },
            {
              from: { type: 'features' },
              allow: {
                to: {
                  type: ['entities', 'shared'],
                },
              },
            },
            {
              from: { type: 'entities' },
              allow: {
                to: {
                  type: ['shared'],
                },
              },
            },
            {
              from: { type: 'shared' },
              allow: {
                to: {
                  type: ['shared'],
                },
              },
            },
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
          paths: restrictedBackendImports,
          patterns: [
            {
              group: ['apps/frontend/**'],
              message: 'Backend не должен импортировать frontend. Монорепа не означает анархию.',
            },
            {
              group: ['apps/bot/**'],
              message: 'Backend не должен импортировать bot напрямую. Вынеси общее в packages/shared.',
            },
          ],
        },
      ],

      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
        },
      ],
      '@typescript-eslint/no-extraneous-class': [
        'warn',
        {
          allowConstructorOnly: true,
          allowEmpty: true,
          allowStaticOnly: false,
          allowWithDecorator: true,
        },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
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
            {
              group: ['apps/frontend/**'],
              message: 'Bot не должен импортировать frontend. Даже если очень хочется устроить цирк.',
            },
            {
              group: ['apps/backend/**'],
              message: 'Bot не должен импортировать backend напрямую. Общее место — packages/shared.',
            },
          ],
        },
      ],

      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            arguments: false,
            attributes: false,
          },
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
            {
              group: ['apps/**'],
              message: 'packages не должны зависеть от apps. Иначе shared превращается в свалку с дверью.',
            },
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