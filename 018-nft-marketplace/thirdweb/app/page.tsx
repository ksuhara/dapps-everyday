"use client";

import Image from "next/image";
import { NextPage } from "next";
import {
  MediaRenderer,
  useActiveListings,
  useContract,
  ConnectWallet,
  useListings,
  useNFTs,
} from "@thirdweb-dev/react";
import Link from "next/link";
import router from "next/router";

const Home: NextPage = () => {
  const { contract } = useContract(
    "0xE71eE93Ad57c8b355e1bCDFe435B05673d8B4930"
  );

  const { data: nfts, isLoading, error } = useNFTs(contract);
  return (
    <main>
      <>
        {isLoading ? (
          <div>Loading listings...</div>
        ) : (
          // Otherwise, show the listings
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="bg-white">
              <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    Trending products
                  </h2>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
                  {nfts?.map((nft) => (
                    <div key={nft.metadata.id} className="group relative">
                      <Link href={`nft/${nft.metadata.id}`}>
                        <div className="aspect-h-7 aspect-w-10 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 ">
                          <img
                            src={nft.metadata.image!}
                            alt={nft.metadata.name as string}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <h3 className="mt-4 text-sm text-gray-700">
                          <a>
                            <span className="absolute inset-0" />
                            {nft.metadata.name}
                          </a>
                        </h3>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {nft.metadata.id}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </main>
  );
};

export default Home;
