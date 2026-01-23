import { cva } from 'class-variance-authority';

export const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-8xl font-bold',
      h2: 'text-8xl font-semibold',
      h3: 'text-7xl font-semibold',
      h4: 'text-6xl font-semibold',
      p: 'text-5xl',
      body1: 'text-2xl',
      body2: 'text-[2rem]',
      body3: 'text-lg',
      body4: 'text-sm',
    
    },
    color: {
      primary: 'text-primary',
      secondary: 'text-secondary',
      foreground: 'text-foreground',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      info: 'text-blue-600 dark:text-blue-400',
      white: 'text-white',
      black: 'text-black',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    truncate: {
      true: 'truncate',
      false: '',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
  },
  defaultVariants: {
    variant: 'body1',
    color: 'foreground',
    weight: 'normal',
    truncate: false,
    align: 'left',
  },
});
