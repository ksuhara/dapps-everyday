import { NextResponse } from "next/server";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});
async function readStream(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result += new TextDecoder().decode(value);
  }

  return result;
}

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature") as string;
  let event;
  if (!request.body) return;
  const body = await request.json();
  const rawBody = await readStream(request.body);

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_ENDPOINT_SECRET || ""
    );
  } catch (err: any) {
    return NextResponse.error();
  }

  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      const metadata = body.data.object.metadata;
      console.log(metadata);
      const receiverAddress = metadata.address;

      const sdk = new ThirdwebSDK("mumbai", {
        secretKey: process.env.SECRET_KEY,
      });

      const contract = await sdk.getContract(
        "0xE71eE93Ad57c8b355e1bCDFe435B05673d8B4930"
      );
      const tx = await contract.erc721.claimTo(receiverAddress, 1);

      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({});
}
