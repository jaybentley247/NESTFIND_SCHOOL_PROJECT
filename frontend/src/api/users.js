import client from "./client";

export async function getUser(id) {
  const { data } = await client.get(`/users/${id}/`);
  return data;
}
