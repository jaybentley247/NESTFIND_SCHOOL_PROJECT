import client from "./client";

export async function getHosts(page = 1) {
  const { data } = await client.get("/users/hosts/", { params: { page } });
  return data;
}

export async function getUser(id) {
  const { data } = await client.get(`/users/${id}/`);
  return data;
}
