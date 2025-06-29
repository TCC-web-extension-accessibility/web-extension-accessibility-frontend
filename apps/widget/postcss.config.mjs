import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import propertyToCustomProp from './plugins/postcss-property-to-custom-prop.mjs';

export default {
  plugins: [tailwindcss(), autoprefixer(), propertyToCustomProp()],
};
