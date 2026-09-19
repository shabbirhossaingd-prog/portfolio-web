const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://bgrpvjuvghdjbxmljtgm.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_WheOVPSgKqPTXiHuD1uhXA_S4Vubljo";

export async function callNamedEdge<T = any>(
  functionName: string,
  token?: string | null,
  payload: Record<string, unknown> = {},
): Promise<{ ok: boolean; status: number; data: T & { error?: string } }> {
  const response = await fetch(SUPABASE_URL + "/functions/v1/" + functionName, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_PUBLISHABLE_KEY,
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  return { ok: response.ok, status: response.status, data };
}


export async function callBackendEdge<T = any>(
  action: string,
  token?: string | null,
  payload: Record<string, unknown> = {},
) {
  return callNamedEdge<T>("portfolio-admin", token, { action, ...payload });
}
