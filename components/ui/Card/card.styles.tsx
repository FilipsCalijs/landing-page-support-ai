import { cva, type VariantProps } from 'class-variance-authority';

// 1. Основная обертка карточки
// Изменил скругление на 2.5rem и убрал бордер по умолчанию, как на макете
export const cardVariants = cva(
  'rounded-[2.5rem] bg-white text-card-foreground shadow transition-all overflow-hidden', 
  {
    variants: {
      variant: {
        default: 'border-none',
        elevated: 'shadow-lg hover:shadow-lg',
        outline: 'border border-slate-200',
        ghost: 'shadow-none bg-transparent',
      },
      size: {
        default: '',
        card: 'w-full md:w-[24rem]', 
      },
      color: {
        default: 'bg-white',      
        green50: 'bg-[#F0FDF4]',   
        blue50: 'bg-blue-50',     
        orange500: 'bg-orange-500 text-white', 
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      color: 'default',
    },
  }
);

// 2. Шапка (Header)
export const cardHeaderVariants = cva('flex flex-col space-y-1.5', {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-6 pb-0',
      md: 'p-8 pb-0',
      lg: 'p-10 pb-0',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});

// 3. Контент (Content) - ИСПРАВЛЕНО ДЛЯ ТИПОВ
// Ключи должны быть одинаковыми (sm, md, lg), чтобы не было ошибок TS
export const cardContentVariants = cva('flex flex-col gap-6', {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-6',
      md: 'py-8 px-6',
      lg: 'p-10', // Для того самого "просторного" вида
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});

// 4. Футер (Footer)
export const cardFooterVariants = cva('flex items-center', {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-6 pt-0',
      md: 'p-8 pt-0',
      lg: 'p-10 pt-0',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});


export type CardVariantsType = VariantProps<typeof cardVariants>;

export type CardPaddingType = VariantProps<typeof cardContentVariants>['padding'];

export const getCardClasses = (
  variant?: CardVariantsType['variant'],
  size?: CardVariantsType['size'],
  color?: CardVariantsType['color']
) => cardVariants({ variant, size, color });

export const getCardHeaderClasses = (padding?: CardPaddingType) =>
  cardHeaderVariants({ padding });

export const getCardContentClasses = (padding?: CardPaddingType) =>
  cardContentVariants({ padding });

export const getCardFooterClasses = (padding?: CardPaddingType) =>
  cardFooterVariants({ padding });