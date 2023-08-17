import { Mumbai, Chain } from "@thirdweb-dev/chains";

// your token bound factory address
export const factoryAddress: string =
  "0x02101dfB77FDE026414827Fdc604ddAF224F0921";
export const implementation: string =
  "0xa786cF1e3245C792474c5cc7C23213fa2c111A95";

// Your thirdweb api key - you can get one at https://thirdweb.com/dashboard/api-keys
export const TWApiKey: string = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID!;
export const activeChain: Chain = Mumbai;

export const nftDropAddress: string =
  "0xE71eE93Ad57c8b355e1bCDFe435B05673d8B4930";
export const tokenAddress: string =
  "0x15A142002C032CA499150359Ce2A3ef66c8533B0";
