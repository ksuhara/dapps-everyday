import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const { email } = data;

  const body = {
    email: email,
    chain: "polygon",
  };

  const response = await fetch(
    `https://staging.crossmint.com/api/v1-alpha1/wallets`,
    {
      method: "POST",
      headers: {
        "X-PROJECT-ID": process.env.CROSSMINT_PROJECT_ID || "",
        "X-CLIENT-SECRET": process.env.CROSSMINT_CLIENT_SECRET || "",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const wallet = await response.json();
  console.log(wallet);
  return NextResponse.json(wallet);
}
