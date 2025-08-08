import tailwindPlugin from 'prettier-plugin-tailwindcss';

module.exports = {
  plugins: [tailwindPlugin],
  tailwindConfig: './tailwind.config.js',
  tailwindAttributes: ['className'],
  tailwindFunctions: ['clsx', 'cn'],
};
