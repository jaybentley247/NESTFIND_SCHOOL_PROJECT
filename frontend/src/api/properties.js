import client from "./client";
import { buildQueryString } from "../utils/buildQueryString";

export async function listProperties(filters = {}) {
  const qs = buildQueryString(filters);
  const { data } = await client.get(`/properties/${qs ? `?${qs}` : ""}`);
  return data; // DRF paginated shape: { count, next, previous, results }
}

export async function getProperty(id) {
  const { data } = await client.get(`/properties/${id}/`);
  return data;
}

export async function getSimilarProperties(id) {
  const { data } = await client.get(`/properties/${id}/similar/`);
  return data;
}

export async function incrementView(id) {
  const { data } = await client.post(`/properties/${id}/increment-view/`);
  return data;
}

export async function createProperty(payload) {
  // Plain JSON — photos are attached afterwards via addPropertyImage(),
  // matching the PRD's two-step create-then-attach-images flow (page 9).
  const { data } = await client.post("/properties/", payload);
  return data;
}

export async function updateProperty(id, payload) {
  const { data } = await client.patch(`/properties/${id}/`, payload);
  return data;
}

export async function deleteProperty(id) {
  await client.delete(`/properties/${id}/`);
}

export async function addPropertyImage(id, file) {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await client.post(`/properties/${id}/images/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deletePropertyImage(id, imageId) {
  await client.delete(`/properties/${id}/images/${imageId}/`);
}
