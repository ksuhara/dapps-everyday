"use client";

import {
  useContract,
  ConnectWallet,
  useListings,
  useNFT,
  useAddress,
} from "@thirdweb-dev/react";
import { useState } from "react";

export default function NFT({ params }: { params: { tokenId: string } }) {
  const nftContractAddress = "0xE71eE93Ad57c8b355e1bCDFe435B05673d8B4930";
  const { contract } = useContract(
    "0xE71eE93Ad57c8b355e1bCDFe435B05673d8B4930"
  );

  const { contract: marketContract } = useContract(
    "0xaEa0d74cEFc8D75Fa42Ab1e49B2a7122620128fC",
    "marketplace"
  );

  const [sellingPrice, setSellingPrice] = useState("");

  const { data: nft, isLoading, error } = useNFT(contract, params.tokenId);

  const {
    data: listings,
    isLoading: listingLoding,
    error: listingError,
  } = useListings(marketContract, {
    tokenContract: nftContractAddress,
    tokenId: params.tokenId,
    start: 0,
    count: 100,
  });

  const address = useAddress();

  const handleCancel = async (listingId: string) => {
    await marketContract?.direct.cancelListing(listingId);
  };

  const handleSell = async () => {
    const listing = {
      assetContractAddress: nftContractAddress,
      tokenId: params.tokenId,
      startTimestamp: new Date(),
      listingDurationInSeconds: 86400,
      quantity: 1,
      currencyContractAddress: "0x0000000000000000000000000000000000000000",
      buyoutPricePerToken: sellingPrice,
    };
    await marketContract?.direct.createListing(listing);
  };

  const handleBuy = async (listingId: string) => {
    await marketContract?.direct.buyoutListing(listingId, 1);
  };

  return (
    <main>
      <div className="bg-white min-h-screen">
        <div className="mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
            {/* Product image */}
            <div className="lg:col-span-4 lg:row-end-1">
              <div className="aspect-h-4 aspect-w-4 overflow-hidden rounded-lg bg-gray-100">
                {isLoading ? (
                  <>...loading</>
                ) : (
                  <img
                    src={nft?.metadata.image!}
                    alt={nft?.metadata.name as string}
                    className="object-cover object-center mx-auto"
                  />
                )}
              </div>
            </div>

            {/* Product details */}
            <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
              <div className="flex flex-col-reverse">
                <div className="mt-4">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {nft?.metadata.name}
                  </h1>

                  <h2 id="information-heading" className="sr-only">
                    Product information
                  </h2>
                </div>
              </div>

              <p className="mt-6 text-gray-500">{nft?.metadata.description}</p>
              {listings?.length && (
                <p className="mt-10 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {listings![0].buyoutCurrencyValuePerToken.displayValue}{" "}
                  {listings![0].buyoutCurrencyValuePerToken.symbol}
                </p>
              )}
              <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {address ? (
                  <>
                    {/* listingがあるとき */}
                    {listings?.length ? (
                      <>
                        {listings![0].sellerAddress != address ? (
                          <>
                            <button
                              onClick={() => handleBuy(listings[0].id)}
                              type="button"
                              className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                            >
                              {/* listingがあり、売り手アドレスが自分以外の時 */}
                              Buy
                            </button>
                            <button
                              type="button"
                              className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-50 px-8 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                            >
                              {/* listingがなく、NFTオーナーが自分以外の時 */}
                              Offer
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleCancel(listings[0].id)}
                            type="button"
                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                          >
                            {/* listingがあり、売り手アドレスが自分の時 */}
                            Cancel
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {/* listingがないとき */}
                        {nft?.owner == address ? (
                          <>
                            <div className="relative mt-2 rounded-md">
                              <input
                                type="text"
                                name="price"
                                id="price"
                                className="block w-full rounded-md border-0 py-3 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="0.00"
                                aria-describedby="price-currency"
                                onChange={(e) => {
                                  setSellingPrice(e.target.value);
                                }}
                              />
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span
                                  className="text-gray-500 sm:text-sm"
                                  id="price-currency"
                                >
                                  MATIC
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={handleSell}
                              type="button"
                              className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                            >
                              {/* listingがなく、NFTオーナーが自分の時 */}
                              Sell
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                          >
                            {/* listingがなく、NFTオーナーが自分以外の時 */}
                            Offer
                          </button>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <ConnectWallet></ConnectWallet>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
