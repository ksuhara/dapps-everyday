import { NextResponse } from "next/server";
import * as crypto from "crypto";
import axios from "axios";

import { SlashCheckoutAPIRequest } from "../../types";
import randomstring from "randomstring";

export async function POST(request: Request) {
  const data: SlashCheckoutAPIRequest = await request.json();
  const { userId } = data;
  const rand = randomstring.generate({
    length: 16,
    charset: "alphanumeric",
    capitalization: "lowercase",
  });
  const amount = 100;
  const orderCode = `${userId}_${rand}`;
  const authenticationToken = process.env.SLASH_AUTH_TOKEN;
  const hashToken = process.env.SLASH_HASH_TOKEN;
  const raw = orderCode + "::" + amount + "::" + hashToken;
  const hashHex = crypto.createHash("sha256").update(raw, "utf8").digest("hex");
  const amountType = "USD";

  const requestObj = {
    identification_token: authenticationToken,
    order_code: orderCode,
    verify_token: hashHex,
    amount: amount,
    amount_type: amountType,
  };

  const paymentRequestUrl = "https://testnet.slash.fi/api/v1/payment/receive";
  const result = await axios.post(paymentRequestUrl, requestObj);

  return NextResponse.json({
    payment_id: result.data.token,
    checkout_url: result.data.url,
  });
}
