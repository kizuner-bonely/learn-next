module.exports = {
  plugins: ['stylelint-prettier'],
  extends: ['stylelint-config-tailwindcss', 'stylelint-prettier/recommended'],
  rules: { 'prettier/prettier': true },
}
