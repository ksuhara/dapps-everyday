"use client";

import {
  ThirdwebProvider,
  paperWallet,
  metamaskWallet,
} from "@thirdweb-dev/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      supportedWallets={[
        paperWallet({
          paperClientId: process.env.NEXT_PUBLIC_PAPER_CLIENT_ID || "",
        }),
        metamaskWallet(),
      ]}
      sdkOptions={{
        gasless: {
          biconomy: {
            apiKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY,
            apiId: process.env.NEXT_PUBLIC_BICONOMY_API_ID,
          },
        },
      }}
    >
      {children}
    </ThirdwebProvider>
  );
}
