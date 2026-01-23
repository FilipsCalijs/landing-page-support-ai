# Landing Page Support AI

A modern, multilingual landing page built with Next.js 16, React 19, and TypeScript. Features AI-powered support automation messaging with internationalization support for English, Russian, and Latvian.

## Features

- ⚡ **Next.js 16** with App Router
- 🎨 **Tailwind CSS v4** for styling
- 🌍 **next-intl** for internationalization (en, ru, lv)
- 📱 **Fully responsive** design
- 🎭 **TypeScript** for type safety
- 🖼️ **Image optimization** with next/image
- 🎯 **Component-based** architecture with CVA
- 🔒 **SEO optimized** with metadata

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Project Structure

```
├── app/
│   ├── [locale]/          # Localized routes
│   │   ├── layout.tsx     # Layout with i18n
│   │   ├── page.tsx       # Home page
│   │   ├── error.tsx      # Error boundary
│   │   └── loading.tsx    # Loading state
│   └── modules/           # Page sections
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button/
│   │   ├── Card/
│   │   └── Typography/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── LanguageSwitcher.tsx
├── i18n/
│   └── request.ts         # i18n configuration
├── messages/              # Translation files
│   ├── en.json
│   ├── ru.json
│   └── lv.json
├── middleware.ts          # i18n middleware
└── i18n.config.ts         # Locale configuration
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# landing-page-support-ai
