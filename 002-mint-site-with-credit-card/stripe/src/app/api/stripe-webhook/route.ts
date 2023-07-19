import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

export async function POST(request: Request) {
  const bodyString = await request.text();
  console.log(bodyString);
  const body = JSON.parse(bodyString);
  console.log(body, "body");
  const signature = headers().get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      bodyString,
      signature,
      process.env.STRIPE_ENDPOINT_SECRET || ""
    );
  } catch (err: any) {
    return NextResponse.error();
  }

  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed

      const sdk = new ThirdwebSDK("mumbai", {
        secretKey: process.env.SECRET_KEY,
      });

      const contract = await sdk.getContract(
        "0xE71eE93Ad57c8b355e1bCDFe435B05673d8B4930"
      );

      const tx = await contract.erc721.claimTo(body.object.metadata.address, 1);
      console.log(tx);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({});
}
