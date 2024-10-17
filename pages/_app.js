import { ToneProvider } from "@/helpers/tonecontext";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ToneProvider>
      <Component {...pageProps} />
    </ToneProvider>
  );
}

export default MyApp;
