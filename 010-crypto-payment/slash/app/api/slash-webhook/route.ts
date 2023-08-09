import { NextResponse } from "next/server";
import * as crypto from "crypto";

import { SlashWebhookAPIRequest } from "../../types";
import initializeFirebaseServer from "@/lib/initFirebaseAdmin";

export async function POST(request: Request) {
  const data: SlashWebhookAPIRequest = await request.json();
  const { order_code, verify_token, amount, result } = data;
  const localVerifyToken = crypto
    .createHash("sha256")
    .update(`${order_code}::${amount}::${process.env.SLAHS_HASH_TOKEN}`)
    .digest("hex");

  if (localVerifyToken !== verify_token) {
    return NextResponse.error();
  }

  if (!result) {
    return NextResponse.error();
  }

  const splittedCode = order_code.split("_");
  const userId = splittedCode[0];

  const { db } = initializeFirebaseServer();
  const docRef = db.collection(`users`).doc(userId);
  await docRef.update({
    amount,
  });

  return NextResponse.json({});
}
