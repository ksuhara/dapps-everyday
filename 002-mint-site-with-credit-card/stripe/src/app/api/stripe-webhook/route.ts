import { NextResponse } from "next/server";
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

  return NextResponse.json({});
}
