# Who am I?

A browser information dashboard that shows everything your browser knows about you.

## GitHub Pages Deployment

This site is deployed at: [https://cf-llc.github.io/who-am-i/](https://cf-llc.github.io/who-am-i/)

## Features

- Displays detailed user information (location, browser, system, network, battery)
- Beautiful halftone waves animation background
- Fully responsive design

## Deployment

This site is configured for GitHub Pages deployment. To deploy:

1. Fork this repository
2. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Set the Source to "GitHub Actions"
3. The GitHub Actions workflow will automatically build and deploy the site

### Troubleshooting GitHub Pages

If you encounter a 404 error after deployment:

1. Make sure GitHub Pages is enabled in your repository settings
2. Ensure the gh-pages branch exists and contains the built files
3. Check that the .nojekyll file exists in the root of your gh-pages branch
4. Verify that the basePath and assetPrefix in next.config.mjs match your repository name

## Local Development

\`\`\`bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
\`\`\`

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components

## License

MIT
