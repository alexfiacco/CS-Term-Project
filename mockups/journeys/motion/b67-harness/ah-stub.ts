export async function authHeaders(): Promise<Record<string, string>> { return { "content-type": "application/json" }; }
export async function authFormHeaders(): Promise<Record<string, string>> { return {}; }
export function markLibraryWrite(_at: number | undefined): void {}
export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> { return fetch(input, init); }
export async function apiFetchRetry(input: string, init: RequestInit = {}): Promise<Response> { return fetch(input, init); }
