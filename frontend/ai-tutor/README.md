# NextJS App
## Local
### Requirements
* NodeJS: v20.19.X
* NextJS: v15.X.X
* Tailwind


Next & React Manual Install: `npm install next@latest react@latest react-dom@latest`

## Learn More
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploying
### Local
Create your own `.env` file setting the following variables:
```env
NEXT_PUBLIC_POSTHOG_KEY=<POSTHOG_API_KEY>
NEXT_PUBLIC_POSTHOG_HOST=<POSTHOG_HOSTNAME>
```

Compile & install dependencies, then run the development server:
```bash
npm run build
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### NextJS Deployment Docs
Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Using Docker
* https://github.com/vercel/next.js/tree/canary/examples/with-docker

### AWS Amplify
1. Run `npm create amplify@latest -y` to create a lightweight scaffold.
2. Get started using: `npx ampx sandbox`.
3. Run `npx ampx help` for help.
