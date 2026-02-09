// Server-side OAuth2 token manager for PCRS Auto and Home APIs.
// Caches tokens in-memory with refresh logic.

interface TokenCache {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

let autoTokenCache: TokenCache | null = null;
let homeTokenCache: TokenCache | null = null;

async function requestToken(
  stsUrl: string,
  params: Record<string, string>
): Promise<{ access_token: string; refresh_token?: string; expires_in?: number } | null> {
  const body = new URLSearchParams(params).toString();
  const res = await fetch(stsUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    console.error(`Token request failed: ${res.status} ${await res.text()}`);
    return null;
  }

  return res.json();
}

async function getToken(
  cache: TokenCache | null,
  setCache: (c: TokenCache) => void,
  stsUrl: string,
  clientId: string,
  clientSecret: string,
  username: string,
  password: string
): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cache && cache.expiresAt > Date.now() + 60_000) {
    return cache.accessToken;
  }

  // Try refresh if we have a refresh token
  if (cache?.refreshToken) {
    const refreshed = await requestToken(stsUrl, {
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: cache.refreshToken,
    });

    if (refreshed?.access_token) {
      const newCache: TokenCache = {
        accessToken: refreshed.access_token,
        refreshToken: refreshed.refresh_token || cache.refreshToken,
        expiresAt: Date.now() + (refreshed.expires_in || 1800) * 1000,
      };
      setCache(newCache);
      return newCache.accessToken;
    }
  }

  // Full login
  const loginResult = await requestToken(stsUrl, {
    grant_type: 'password',
    client_id: clientId,
    client_secret: clientSecret,
    username,
    password,
  });

  if (!loginResult?.access_token) {
    throw new Error('Failed to authenticate with PCRS API');
  }

  const newCache: TokenCache = {
    accessToken: loginResult.access_token,
    refreshToken: loginResult.refresh_token || '',
    expiresAt: Date.now() + (loginResult.expires_in || 1800) * 1000,
  };
  setCache(newCache);
  return newCache.accessToken;
}

export async function getAutoAccessToken(): Promise<string> {
  return getToken(
    autoTokenCache,
    (c) => { autoTokenCache = c; },
    process.env.PCRS_AUTO_STS_URL!,
    process.env.PCRS_AUTO_CLIENT_ID!,
    process.env.PCRS_AUTO_CLIENT_SECRET!,
    process.env.PCRS_AUTO_USERNAME!,
    process.env.PCRS_AUTO_PASSWORD!
  );
}

export async function getHomeAccessToken(): Promise<string> {
  return getToken(
    homeTokenCache,
    (c) => { homeTokenCache = c; },
    process.env.PCRS_HOME_STS_URL!,
    process.env.PCRS_HOME_CLIENT_ID!,
    process.env.PCRS_HOME_CLIENT_SECRET!,
    process.env.PCRS_HOME_USERNAME!,
    process.env.PCRS_HOME_PASSWORD!
  );
}
