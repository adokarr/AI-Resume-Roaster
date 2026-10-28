import Head from "next/head";
import { Fraunces, Outfit } from "next/font/google";
import { ThemeProvider } from "../lib/themeContext";
import "../styles/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Head>
        <title>Next Chapter — AI Resume Roaster & Reviewer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Next Chapter is an AI-powered resume reviewer that roasts your resume, spots weaknesses, and helps you turn it into a stronger application."
        />
      </Head>
      <div className={`rrc-root ${fraunces.variable} ${outfit.variable}`}>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}

export default MyApp;
