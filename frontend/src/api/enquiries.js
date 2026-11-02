import client from "./client";

export async function listEnquiries(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const { data } = await client.get(`/enquiries/${qs ? `?${qs}` : ""}`);
  return data;
}

export async function createEnquiry(payload) {
  const { data } = await client.post("/enquiries/", payload);
  return data;
}

export async function updateEnquiryStatus(id, status) {
  const { data } = await client.patch(`/enquiries/${id}/`, { status });
  return data;
}

export async function listMessages(enquiryId) {
  const { data } = await client.get(`/enquiries/${enquiryId}/messages/`);
  return data;
}

export async function sendMessage(enquiryId, body) {
  const { data } = await client.post(`/enquiries/${enquiryId}/messages/`, { body });
  return data;
}

export async function listConversations() {
  const { data } = await client.get("/enquiries/conversations/");
  return data;
}
