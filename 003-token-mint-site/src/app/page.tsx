"use client";

import {
  ConnectWallet,
  useActiveClaimConditionForWallet,
  useAddress,
  useClaimedNFTSupply,
  useContract,
  useContractMetadata,
  useNFT,
  useUnclaimedNFTSupply,
  useClaimNFT,
  Web3Button,
} from "@thirdweb-dev/react";
import { useMemo, useState } from "react";
import { BigNumber, utils } from "ethers";

export default function Home() {
  const tokenAddress = "0x15A142002C032CA499150359Ce2A3ef66c8533B0";
  const { contract } = useContract(tokenAddress, "token-drop");
  const address = useAddress();
  const [quantity, setQuantity] = useState(1);

  const activeClaimCondition = useActiveClaimConditionForWallet(
    contract,
    address
  );

  const price = useMemo(() => {
    const bnPrice = BigNumber.from(
      activeClaimCondition.data?.currencyMetadata.value || 0
    );
    return `${utils.formatUnits(
      bnPrice.mul(1).toString(),
      activeClaimCondition.data?.currencyMetadata.decimals || 18
    )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
  }, [
    activeClaimCondition.data?.currencyMetadata.decimals,
    activeClaimCondition.data?.currencyMetadata.symbol,
    activeClaimCondition.data?.currencyMetadata.value,
  ]);

  const isLoading = useMemo(() => {
    return activeClaimCondition.isLoading || !contract;
  }, [activeClaimCondition.isLoading, contract]);

  const maxClaimable = useMemo(() => {
    return Number(activeClaimCondition.data?.maxClaimablePerWallet) || 0;
  }, [activeClaimCondition.isLoading, contract]);

  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <p className="py-10 text-2xl">Mint Test Token</p>
      {!activeClaimCondition ? (
        <>
          <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
            loading...
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col w-full items-center space-y-2">
            <p>{price} / Token</p>
            <p>each wallet can mint up to {maxClaimable} tokens</p>
            <input
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > maxClaimable) {
                  setQuantity(maxClaimable);
                } else if (value < 1) {
                  setQuantity(1);
                } else {
                  setQuantity(value);
                }
              }}
              type="number"
              id="small-input"
              className="block p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {address ? (
              <>
                {isLoading ? (
                  <>loading...</>
                ) : (
                  <>
                    <Web3Button
                      contractAddress={tokenAddress}
                      action={(contract) => contract.erc20.claim(quantity)}
                      onSuccess={() => alert("Claimed!")}
                      onError={(err) => alert(err)}
                    >
                      Claim
                    </Web3Button>
                  </>
                )}
              </>
            ) : (
              <ConnectWallet />
            )}
          </div>
        </>
      )}
    </main>
  );
}
