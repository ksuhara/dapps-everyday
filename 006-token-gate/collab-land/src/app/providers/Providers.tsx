"use client";

import { ThirdwebProvider } from "@thirdweb-dev/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const domainName = "http://test.com";
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      authConfig={{
        domain: domainName,
        authUrl: "/api/auth",
      }}
    >
      {children}
    </ThirdwebProvider>
  );
}
