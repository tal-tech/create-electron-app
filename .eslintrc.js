module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base/legacy',
    'prettier',
    'prettier/@typescript-eslint'
  ],
  rules: {
    "no-console": "off"
  } 
};
