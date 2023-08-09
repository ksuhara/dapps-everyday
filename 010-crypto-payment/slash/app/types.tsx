export type SlashWebhookAPIRequest = {
  order_code: string;
  transaction_code: string;
  amount: string;
  verify_token: string;
  result: boolean;
};

export type SlashCheckoutAPIRequest = {
  userId: string;
  amount: string;
};
