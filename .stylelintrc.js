module.exports = {
  plugins: ['stylelint-prettier'],
  extends: [
    'stylelint-config-tailwindcss',
    'stylelint-prettier/recommended',
    'stylelint-config-recess-order',
    'stylelint-config-prettier',
  ],
  rules: { 'prettier/prettier': true },
}
