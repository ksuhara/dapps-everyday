"use client";

import Image from "next/image";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import SuperfluidWidget, {
  EventListeners,
  supportedNetworks,
} from "@superfluid-finance/widget";
import superTokenList from "@superfluid-finance/tokenlist";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { useWeb3Modal, Web3Modal } from "@web3modal/react";
import { useMemo } from "react";

const widget = {
  productDetails: {
    name: "Dapps Everyday",
    description: "This is the product",
    imageURI: "",
  },
  paymentDetails: {
    paymentOptions: [
      {
        receiverAddress: "0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b",
        superToken: {
          address: "0x5d8b4c2554aeb7e86f387b4d6c00ac33499ed01f",
        },
        chainId: 80001,
        flowRate: {
          amountEther: "10",
          period: "month",
        },
      },
    ],
  },
  type: "page",
  theme: {
    typography: {
      fontFamily: "'Noto Sans', 'sans-serif'",
    },
    palette: {
      mode: "light",
      primary: {
        main: "#1d59b2",
      },
      secondary: {
        main: "#fff",
      },
    },
    shape: {
      borderRadius: 20,
    },
    components: {
      MuiStepIcon: {
        styleOverrides: {
          text: {
            fill: "#fff",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
    },
  },
};

const projectId = "2c57261df45d4fb0fa3c2c788585ea4b";

const { publicClient } = configureChains(supportedNetworks, [
  w3mProvider({ projectId }),
]);

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: w3mConnectors({
    projectId,
    chains: supportedNetworks,
  }),
  publicClient,
});

export default function Home() {
  const { open, isOpen } = useWeb3Modal();
  const walletManager = useMemo(
    () => ({
      open,
      isOpen,
    }),
    [open, isOpen]
  );

  const eventListeners: EventListeners = useMemo(
    () => ({
      onSuccess: () => console.log("onSuccess"),
      onSuccessButtonClick: () => console.log("onSuccessButtonClick"),
    }),
    []
  );
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <WagmiConfig config={wagmiConfig}>
        <SuperfluidWidget
          productDetails={widget.productDetails}
          paymentDetails={widget.paymentDetails as any}
          tokenList={superTokenList}
          type="dialog"
          walletManager={walletManager}
          eventListeners={eventListeners}
        >
          {({ openModal }) => (
            <button onClick={() => openModal()}>Drawer</button>
          )}
        </SuperfluidWidget>
      </WagmiConfig>
    </main>
  );
}
