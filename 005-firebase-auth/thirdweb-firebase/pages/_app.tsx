import type { AppProps } from "next/app";
import { ThirdwebProvider, paperWallet } from "@thirdweb-dev/react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  // This is the chain your dApp will work on.
  const activeChain = "mumbai";

  return (
    <ThirdwebProvider
      authConfig={{
        domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN as string,
      }}
      activeChain={activeChain}
      supportedWallets={[
        paperWallet({
          paperClientId: process.env.NEXT_PUBLIC_PAPER_CLIENT_ID || "",
        }),
      ]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
