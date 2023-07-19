"use client";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const address = useAddress();
  const router = useRouter();

  const payment = async () => {
    const response: any = await fetch(`/api/stripe-checkout`, {
      method: "POST",
      body: JSON.stringify({
        address: address,
      }),
    });
    console.log(response);
    const result = await response.json();
    router.push(result.checkout_url);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {address ? (
        <button
          type="button"
          onClick={payment}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Payment
        </button>
      ) : (
        <ConnectWallet></ConnectWallet>
      )}
    </main>
  );
}
