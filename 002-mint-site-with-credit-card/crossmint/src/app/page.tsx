"use client";

import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CrossmintPayButton
        collectionId="a1f6cca0-1c24-4226-92c5-f50a85bbd965"
        projectId="28990d6d-1252-4c45-a89f-1a7e0eb4e5bc"
        mintConfig={{
          type: "thirdweb-drop",
          totalPrice: "0.01",
          quantity: "1",
        }}
        environment="staging"
      />
    </main>
  );
}
