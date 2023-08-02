"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleLogin = () => {
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts: string[]) => {
        localStorage.setItem("@collab.land:token-gating", accounts[0]);
        router.push("dashboard");
      })
      .catch((error: { code: number }) => {
        if (error.code === 4001) {
        }
      });
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      テスト
      <button className="" onClick={handleLogin}>
        connect wallet
      </button>
    </main>
  );
}
