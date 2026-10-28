import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const setInitialThemeScript = `
    (function() {
      try {
        var storedTheme = localStorage.getItem('next-chapter-theme');
        var theme = storedTheme;
        if (!theme) {
          var mql = window.matchMedia('(prefers-color-scheme: dark)');
          theme = mql.matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {}
    })();
  `;

  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Next Chapter — An AI-powered resume reviewer that roasts your resume, spots weaknesses, and helps you turn it into a stronger application." />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✨</text></svg>" />
        <script dangerouslySetInnerHTML={{ __html: setInitialThemeScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
