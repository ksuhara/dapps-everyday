"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const walletAddress = localStorage.getItem("@collab.land:token-gating");
  const signOut = () => {
    localStorage.removeItem("@collab.land:token-gating");
    router.push("/");
  };

  const rules = [
    {
      type: "ERC721",
      chainId: 80001,
      minToken: "1",
      contractAddress: "0xE71eE93Ad57c8b355e1bCDFe435B05673d8B4930",
      roleId: "001",
    },
  ];

  const getRuleStatus = async () => {};
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      ダッシュボード
      <p>welcome: {walletAddress}</p>
      <button className="" onClick={signOut}>
        Sign out
      </button>
    </main>
  );
}
