/**
 * PostCSS plugin to convert @property declarations to CSS custom properties
 * This helps with using property values inside Shadow DOM
 */
export default (opts = {}) => {
  return {
    postcssPlugin: 'postcss-property-to-custom-prop',
    prepare(result) {
      // Store all the properties we find
      const properties = [];

      return {
        AtRule: {
          property: (rule) => {
            // Extract the property name and initial value
            const propertyName = rule.params.match(/--[\w-]+/)?.[0];
            let initialValue = '';

            rule.walkDecls('initial-value', (decl) => {
              initialValue = decl.value;
            });

            if (propertyName && initialValue) {
              // Store the property
              properties.push({ name: propertyName, value: initialValue });

              // Remove the original @property rule
              rule.remove();
            }
          },
        },

        OnceExit(root, { Rule, Declaration }) {
          // If we found properties, add them to :root, :host
          if (properties.length > 0) {
            // Create the :root, :host rule using the Rule constructor from helpers
            const rootRule = new Rule({ selector: ':root, :host' });

            // Add all properties as declarations
            properties.forEach((prop) => {
              // Create a new declaration for each property
              const decl = new Declaration({
                prop: prop.name,
                value: prop.value,
              });
              rootRule.append(decl);
            });

            // Add the rule to the beginning of the CSS
            root.prepend(rootRule);
          }
        },
      };
    },
  };
};

export const postcss = true;
