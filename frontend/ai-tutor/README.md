This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Structure & UI
1. Install ChakraUI - `npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion`
2. Follow guide from: https://medium.com/stackademic/architecting-a-front-end-app-with-next-js-a-technical-leaders-guide-7e0b27750a1f

## Deploying
### NextJS Deployment Docs
Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### AWS Amplify
1. Run `npm create amplify@latest -y` to create a lightweight scaffold.
2. Get started using: `npx ampx sandbox`.
3. Run `npx ampx help` for help.

## Understanding the App
### Purpose of _app.tsx
* Shared UI: It defines the common UI structure and elements that will be shared across all pages. This is similar to a master template in other frameworks
* Consistent Look and Feel: It ensures a consistent look and feel throughout the application by wrapping all pages with the same HTML structure, styles, and potentially navigation elements.
* Root of the Component Tree: It's the highest-level component in the page hierarchy. Any component within the app directory will be rendered as a child within this layout.
* Metadata: It can be used to set the default metadata for all pages.
Font configuration: It can be used to set the fonts that will be used in the entire application.