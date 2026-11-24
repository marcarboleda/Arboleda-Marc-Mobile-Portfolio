import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

// Root HTML for the static web export (Vercel). Only runs at build time in Node.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <meta name="theme-color" content="#060608" />
        <meta name="color-scheme" content="dark" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const css = `
html, body { background-color: #060608; color: #F5F5F4; }
html { scroll-behavior: smooth; }
body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; }
::selection { background: #C5F36B; color: #060608; }
*:focus-visible { outline: 1px solid #C5F36B; outline-offset: 3px; }
input:focus { outline: none; }
`;
