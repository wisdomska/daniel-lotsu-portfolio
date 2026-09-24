/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Keep history authored by a human: no tool attribution trailers.
    'trailer-exists': [2, 'never', 'Co-Authored-By:'],
  },
};
