import { Fraunces, Outfit } from "next/font/google";
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
    <div className={`rrc-root ${fraunces.variable} ${outfit.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
