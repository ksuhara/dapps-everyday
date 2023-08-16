"use client";

import {
  ConnectWallet,
  Web3Button,
  useAddress,
  useClaimNFT,
  useContract,
} from "@thirdweb-dev/react";

export default function Home() {
  const address = useAddress();
  const { contract } = useContract(
    "0xE71eE93Ad57c8b355e1bCDFe435B05673d8B4930"
  );
  const { mutate: claimNFT, isLoading, error } = useClaimNFT(contract);

  if (error) {
    console.error("failed to claim nft", error);
  }
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <ConnectWallet></ConnectWallet>
      {address ? (
        <button
          className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          disabled={isLoading}
          onClick={() =>
            claimNFT({
              to: address,
              quantity: 1,
            })
          }
        >
          Claim NFT!
        </button>
      ) : (
        <></>
      )}
    </main>
  );
}
