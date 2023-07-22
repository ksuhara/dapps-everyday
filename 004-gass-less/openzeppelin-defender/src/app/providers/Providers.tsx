"use client";

import { ThirdwebProvider, paperWallet } from "@thirdweb-dev/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      supportedWallets={[
        paperWallet({
          paperClientId: process.env.NEXT_PUBLIC_PAPER_CLIENT_ID || "",
        }),
      ]}
      sdkOptions={{
        gasless: {
          openzeppelin: {
            relayerUrl: process.env.NEXT_PUBLIC_OPENZEPPELIN_URL || "",
          },
        },
      }}
    >
      {children}
    </ThirdwebProvider>
  );
}
