import Link from 'next/link'

const base =
  'inline-flex items-center justify-center gap-2 font-bold transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap'

const variants = {
  // .btn-orange - the accent gradient, black label
  primary: 'bg-grad-accent text-black hover:bg-grad-accent-h',
  solid: 'bg-accent text-black hover:bg-accent-h',
  // .btn-blue - telegram gradient
  telegram: 'bg-grad-telegram text-fg hover:brightness-95',
  // .btn-std / .btn-white - flat translucent fill, no border
  secondary: 'bg-regular text-fg/75 hover:bg-btn-h',
  ghost: 'text-fg/75 hover:bg-card hover:text-fg',
  // .btn - bordered, transparent, blurred backdrop
  outline: 'border border-btn-b bg-transparent text-fg/75 backdrop-blur-xl hover:bg-btn-h',
}

const sizes = {
  sm: 'h-9 px-4 text-sm rounded-btn',
  md: 'h-11 px-5 text-sm rounded-btn',
  lg: 'h-14 px-8 text-base rounded-[24px]',
}

export default function Button({
  as = 'link',
  href = '#',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (as === 'button') {
    return (
      <button className={cls} {...props}>
        {children}
      </button>
    )
  }

  return (
    <Link href={href} className={cls} {...props}>
      {children}
    </Link>
  )
}
