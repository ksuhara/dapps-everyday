"use client";

import { ConnectWallet } from "@thirdweb-dev/react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ConnectWallet></ConnectWallet>
    </main>
  );
}
