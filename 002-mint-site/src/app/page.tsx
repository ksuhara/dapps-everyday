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
} from "@thirdweb-dev/react";
import { useMemo } from "react";
import { BigNumber, utils } from "ethers";

export default function Home() {
  const contractAddress = "0xE71eE93Ad57c8b355e1bCDFe435B05673d8B4930";
  const contractQuery = useContract(contractAddress);
  const contractMetadata = useContractMetadata(contractQuery.contract);
  const { data: firstNft, isLoading: firstNftLoading } = useNFT(
    contractQuery.contract,
    0
  );
  const address = useAddress();
  const activeClaimCondition = useActiveClaimConditionForWallet(
    contractQuery.contract,
    address
  );

  const unclaimedSupply = useUnclaimedNFTSupply(contractQuery.contract);
  const claimedSupply = useClaimedNFTSupply(contractQuery.contract);

  const numberClaimed = useMemo(() => {
    return BigNumber.from(claimedSupply.data || 0).toString();
  }, [claimedSupply]);

  const numberTotal = useMemo(() => {
    return BigNumber.from(claimedSupply.data || 0)
      .add(BigNumber.from(unclaimedSupply.data || 0))
      .toString();
  }, [claimedSupply.data, unclaimedSupply.data]);

  const priceToMint = useMemo(() => {
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

  const {
    mutate: claimNFT,
    isLoading,
    error,
  } = useClaimNFT(contractQuery.contract);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {firstNftLoading ? (
        <></>
      ) : (
        <>
          <img
            src={contractMetadata.data?.image || firstNft?.metadata.image}
            className="box-border border rounded-xl"
          ></img>
          <p className="mt-4">
            {numberClaimed} / {numberTotal} claimed
          </p>
          <p className="mt-4">{priceToMint}</p>
          {address ? (
            <>
              {isLoading ? (
                <>loading...</>
              ) : (
                <button
                  onClick={() => claimNFT({ to: address, quantity: 1 })}
                  type="button"
                  className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                  Claim
                </button>
              )}
            </>
          ) : (
            <ConnectWallet />
          )}
        </>
      )}
    </main>
  );
}
