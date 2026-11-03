import client from "./client";

export async function getPaymentQuote(propertyId) {
  const { data } = await client.get("/payments/quote/", { params: { property_id: propertyId } });
  return data;
}

export async function initiatePayment(payload) {
  const { data } = await client.post("/payments/initiate/", payload);
  return data;
}

export async function verifyPayment(payload) {
  const { data } = await client.post("/payments/verify/", payload);
  return data;
}

export async function listMyPayments(params = {}) {
  const { data } = await client.get("/payments/", { params });
  return data;
}

export async function listReceivedPayments(params = {}) {
  const { data } = await client.get("/payments/received/", { params });
  return data;
}
