import { default as React } from 'react';
import { VariantProps } from 'tailwind-variants';
declare const variants: import('tailwind-variants').TVReturnType<{
    variant: {
        primary: string[];
        secondary: string[];
        destructive: string[];
        ghost: string[];
        link: string[];
    };
    size: {
        small: string[];
        default: string[];
        large: string[];
    };
}, undefined, string[], {
    variant: {
        primary: string[];
        secondary: string[];
        destructive: string[];
        ghost: string[];
        link: string[];
    };
    size: {
        small: string[];
        default: string[];
        large: string[];
    };
}, undefined, import('tailwind-variants').TVReturnType<{
    variant: {
        primary: string[];
        secondary: string[];
        destructive: string[];
        ghost: string[];
        link: string[];
    };
    size: {
        small: string[];
        default: string[];
        large: string[];
    };
}, undefined, string[], unknown, unknown, undefined>>;
type ButtonVariant = VariantProps<typeof variants>['variant'];
type ButtonSize = VariantProps<typeof variants>['size'];
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    ref?: React.Ref<HTMLButtonElement>;
};
declare const Button: {
    ({ className, children, variant, size, loading, ref, ...rest }: ButtonProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export { Button };
export type { ButtonProps };
//# sourceMappingURL=Button.d.ts.map