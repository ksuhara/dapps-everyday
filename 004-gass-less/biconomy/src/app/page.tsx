"use client";

import { Web3Button } from "@thirdweb-dev/react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Web3Button
        contractAddress="0xE71eE93Ad57c8b355e1bCDFe435B05673d8B4930"
        action={(contract) => {
          contract.erc721.claim(1);
        }}
      >
        Claim
      </Web3Button>
    </main>
  );
}
