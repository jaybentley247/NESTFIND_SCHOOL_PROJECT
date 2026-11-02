import client from "./client";

export async function listSaved(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const { data } = await client.get(`/saved/${qs ? `?${qs}` : ""}`);
  return data;
}

export async function saveProperty(propertyId) {
  const { data } = await client.post("/saved/", { property: propertyId });
  return data;
}

export async function unsaveProperty(savedId) {
  await client.delete(`/saved/${savedId}/`);
}
