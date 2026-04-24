// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
<<<<<<< HEAD
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "import/no-unresolved": "off",
    },
  },
  {
=======
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
    ignores: ['dist/*'],
  },
]);
