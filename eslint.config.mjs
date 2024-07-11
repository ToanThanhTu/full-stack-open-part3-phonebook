import globals from "globals"
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
  // use ESLint's recommended settings
  js.configs.recommended,
  {
    // ignore dist directory
    ignores: ["dist/**", "build/**"],
  },
  {
    // look at all JavaScript files
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      // include all global variables defined in the globals.node settings
      globals: {
        ...globals.node
      },
      // set ECMAScript version to the latest available version
      ecmaVersion: "latest",
    },
    // use a plugin with style-related rules
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/indent': [
        'error',
        // 4 space indent for VSCode
        4
      ],
      '@stylistic/js/linebreak-style': [
        'error',
        // linebreak rule for Windows
        'windows',
        // linebreak rule for Linux/Unix
        // 'unix',
      ],
      '@stylistic/js/quotes': [
        'error',
        'single'
      ],
      '@stylistic/js/semi': [
        'error',
        'never'
      ],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', 
        { 
          'before': true, 
          'after': true 
        },
      ],
      'no-console': 'off',
    },
  },
];