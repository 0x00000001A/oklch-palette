module.exports = {
  root: true,
  env: {browser: true, es2020: true},
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:perfectionist/recommended-natural'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'perfectionist'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      {allowConstantExport: true}
    ],
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: 'useBemClassName'
      }
    ],
    'perfectionist/sort-jsx-props': [
      'error',
      {
        'custom-groups': {
          callback: 'on[A-Z]*',
          boolean: '(is|with|has|should)[A-Z]*'
        },
        type: 'natural',
        order: 'asc',
        groups: ['multiline', 'unknown', 'callback', 'shorthand']
      }
    ],
    'perfectionist/sort-imports': ['error', {
      groups: [
        ['builtin', 'external', 'type'],
        ['internal', 'internal-type'],
        ['parent', 'parent-type'],
        ['sibling', 'sibling-type'],
        ['index', 'index-type'],
        ['side-effect', 'side-effect-style'],
        'object',
        'unknown'
      ]
    }]
  }
}
