// Learn more https://docs.expo.dev/router/reference/static-rendering/#root-html

import { ScrollViewStyleReset } from 'expo-router/html';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* 
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native. 
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Add any additional <head> elements that you want globally available on web... */}
        <meta property="og:title" content="Fun Fitness" />
        <meta property="og:description" content="A sleek, gamified fitness tracking app to log workouts and monitor progress in an Urban Neon style." />
        <meta property="og:image" content="https://funfitness.vercel.app/fun_fitness_app_icon.png" />
        <meta property="og:url" content="https://funfitness.vercel.app" />
        <meta property="og:type" content="website" />
        <style dangerouslySetInnerHTML={{ __html: `body { background-color: #121212; }` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
