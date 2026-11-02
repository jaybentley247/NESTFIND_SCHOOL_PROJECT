import client, { getRefreshToken, setAccessToken, setRefreshToken } from "./client";

// Matches PRD section 6 exactly: POST /auth/register/, POST /auth/login/
// (Simple JWT token obtain), POST /auth/refresh/, GET /auth/me/. There is
// no /auth/logout/ endpoint in the PRD's table, so logout is client-only —
// it just discards the tokens.

export async function register(data) {
  const { data: result } = await client.post("/auth/register/", data);
  setAccessToken(result.access);
  setRefreshToken(result.refresh);
  return { user: result.user, accessToken: result.access };
}

export async function login({ email, password }) {
  const { data: tokens } = await client.post("/auth/login/", { email, password });
  setAccessToken(tokens.access);
  setRefreshToken(tokens.refresh);

  const { data: user } = await client.get("/auth/me/");
  return { user, accessToken: tokens.access };
}

export function logout() {
  setAccessToken(null);
  setRefreshToken(null);
}

export async function fetchMe() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const { data: tokens } = await client.post("/auth/refresh/", { refresh: refreshToken });
    setAccessToken(tokens.access);

    const { data: user } = await client.get("/auth/me/");
    return { user, accessToken: tokens.access };
  } catch {
    setAccessToken(null);
    setRefreshToken(null);
    return null;
  }
}
