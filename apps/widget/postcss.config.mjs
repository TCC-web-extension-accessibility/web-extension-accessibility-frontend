import tailwindcss from '@tailwindcss/postcss';
import propertyToCustomProp from './plugins/postcss-property-to-custom-prop.mjs';

export default {
  plugins: [tailwindcss(), propertyToCustomProp()],
};
