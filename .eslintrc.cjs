process.env.ESLINT_TSCONFIG = 'tsconfig.json'

module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    '@antfu/eslint-config-ts',
    '@antfu/eslint-config-react',
  ],
  env: {
    node: true,
  },
  rules: {
    'eqeqeq': ['error', 'smart'],
    'antfu/if-newline': 'off',
    'no-await-in-loop': 'error',
    'no-unused-expressions': 'off',
    'jsx-quotes': ['error', 'prefer-single'],
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
    '@typescript-eslint/brace-style': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unused-expressions': 'warn',
    '@next/next/no-img-element': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'n/prefer-global/buffer': 'off',
    'n/prefer-global/process': ['error', 'always'],
    'max-len': [
      'warn',
      {
        tabWidth: 2,
        ignoreStrings: true,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreUrls: true,
      },
    ],
  },
  overrides: [
    {
      files: ['*.json5'],
      rules: {
        'jsonc/quotes': ['error', 'single'],
        'jsonc/quote-props': ['error', 'consistent'],
        'jsonc/comma-dangle': ['error', 'always-multiline'],
      },
    },
  ],
}
