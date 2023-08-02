"use client";

import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { useState } from "react";
import Cookies from "js-cookie";
import { v4 as uuid } from "uuid";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [isVerified, setIsverified] = useState(false);
  const id = uuid();

  const accessControlConditions = [
    {
      contractAddress: "0xE71eE93Ad57c8b355e1bCDFe435B05673d8B4930",
      standardContractType: "ERC721",
      chain: "mumbai",
      method: "balanceOf",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: ">",
        value: "0",
      },
    },
  ];

  async function connect() {
    const resourceId = {
      baseUrl: "http://localhost:3000",
      path: "/contactus",
      orgId: "",
      role: "",
      extraData: id,
    };
    const client = new LitJsSdk.LitNodeClient({ alertWhenUnauthorized: false });

    await client.connect();

    if (client) {
      console.log("Am Connected");
    }

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });

    await client.saveSigningCondition({
      accessControlConditions,
      chain: "mumbai",
      authSig,
      resourceId,
    });

    try {
      const jwt = await client.getSignedToken({
        accessControlConditions,
        chain: "mumbai",
        authSig,
        resourceId: resourceId,
      });
      /**
       * Store retrieve jwt in cookies with the name lit-auth
       */
      Cookies.set("lit-auth", jwt, { expires: 1 });

      const { verified, payload } = LitJsSdk.verifyJwt({ jwt });

      setIsverified(verified);
    } catch (err) {
      console.log("error: ", err);
    }

    setConnected(true);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {connected ? (
        <>{isVerified ? <>secret content</> : <>not an NFT holder</>}</>
      ) : (
        <button onClick={connect}>Connect</button>
      )}
    </main>
  );
}
