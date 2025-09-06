// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import prettierConfig from 'eslint-config-prettier';

export default withNuxt({
  rules: {
    ...prettierConfig.rules,
  },
});
// Your custom configs here
