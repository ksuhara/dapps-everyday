import {
  ConnectWallet,
  useAddress,
  useClaimNFT,
  useContract,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const address = useAddress();
  const contractQuery = useContract(
    "0xE71eE93Ad57c8b355e1bCDFe435B05673d8B4930"
  );
  const {
    mutate: claimNFT,
    isLoading,
    error,
  } = useClaimNFT(contractQuery.contract);
  const mint = async () => {
    console.log(address);
    const tx = claimNFT({ to: address, quantity: 1 });
    console.log("test");
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="http://thirdweb.com/">thirdweb</a>!
        </h1>

        <p className={styles.description}>
          Get started by configuring your desired network in{" "}
          <code className={styles.code}>pages/_app.tsx</code>, then modify the{" "}
          <code className={styles.code}>pages/index.tsx</code> file!
        </p>

        <div className={styles.connect}>
          <ConnectWallet />
        </div>

        <div className={styles.grid}>
          <a href="https://portal.thirdweb.com/" className={styles.card}>
            <h2>Portal &rarr;</h2>
            <p>
              Guides, references and resources that will help you build with
              thirdweb.
            </p>
          </a>

          <a href="https://thirdweb.com/dashboard" className={styles.card}>
            <h2>Dashboard &rarr;</h2>
            <p>
              Deploy, configure and manage your smart contracts from the
              dashboard.
            </p>
          </a>

          <a
            href="https://portal.thirdweb.com/templates"
            className={styles.card}
          >
            <h2>Templates &rarr;</h2>
            <p>
              Discover and clone template projects showcasing thirdweb features.
            </p>
          </a>
          <button onClick={mint}>test</button>
        </div>
      </main>
    </div>
  );
};

export default Home;
