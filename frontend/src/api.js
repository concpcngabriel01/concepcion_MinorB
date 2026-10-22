const API_ROOT = "/api";

function notifyAuthChange() {
  window.dispatchEvent(new Event("pokedex-auth-change"));
}

async function refreshAccessToken() {
  const refresh = sessionStorage.getItem("pokedex.refresh");
  if (!refresh) return false;

  const response = await fetch(`${API_ROOT}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) {
    sessionStorage.removeItem("pokedex.access");
    sessionStorage.removeItem("pokedex.refresh");
    sessionStorage.removeItem("pokedex.username");
    notifyAuthChange();
    return false;
  }

  const tokens = await response.json();
  sessionStorage.setItem("pokedex.access", tokens.access);
  return true;
}

function formatError(data) {
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.map(formatError).join(" ");
  if (data && typeof data === "object") {
    return Object.entries(data)
      .map(([key, value]) => `${key === "detail" ? "" : `${key}: `}${formatError(value)}`)
      .join(" ");
  }
  return "The request could not be completed.";
}

export async function api(path, options = {}, hasRetried = false) {
  const headers = new Headers(options.headers || {});
  const access = sessionStorage.getItem("pokedex.access");
  if (access) headers.set("Authorization", `Bearer ${access}`);

  let body = options.body;
  if (body && !(body instanceof FormData) && typeof body !== "string") {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const response = await fetch(`${API_ROOT}${path}`, { ...options, body, headers });
  if (response.status === 401 && !hasRetried && await refreshAccessToken()) {
    return api(path, options, true);
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(formatError(data) || `Request failed (${response.status}).`);
  }
  if (response.status === 204) return null;
  return response.json();
}
