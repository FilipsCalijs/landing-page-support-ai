import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex justify-center items-center font-medium transition-colors ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/50',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/50',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/50',
        ghost: 'hover:bg-accent hover:text-accent-foreground active:bg-accent/50',
      },
      size: {
        sm: 'h-9 text-sm',
        md: 'h-12 text-base',
        lg: 'h-11',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonVariantsType = VariantProps<typeof buttonVariants>;

export const getButtonClasses = (
  variant?: ButtonVariantsType['variant'],
  size?: ButtonVariantsType['size']
) => buttonVariants({ variant, size });