const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://bgrpvjuvghdjbxmljtgm.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_WheOVPSgKqPTXiHuD1uhXA_S4Vubljo";

const BACKEND_FUNCTION_URL =
  SUPABASE_URL + "/functions/v1/portfolio-admin";

export async function callBackendEdge<T = any>(
  action: string,
  token?: string | null,
  payload: Record<string, unknown> = {},
): Promise<{ ok: boolean; status: number; data: T & { error?: string } }> {
  const response = await fetch(BACKEND_FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_PUBLISHABLE_KEY,
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    body: JSON.stringify({ action, ...payload }),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  return { ok: response.ok, status: response.status, data };
}
