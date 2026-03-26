const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_TOKEN = import.meta.env.VITE_API_TOKEN || '';

const headers = () => ({
  'Content-Type': 'application/json',
  'x-token-worthy': API_TOKEN,
});

export async function fetchConfig() {
  const res = await fetch(`${API_URL}/v1/openclaw/config`, { headers: headers() });
  if (!res.ok) throw new Error(`Failed to load config (${res.status})`);
  return res.json();
}

export async function savePrompt(content) {
  const res = await fetch(`${API_URL}/v1/openclaw/config/prompt`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error(`Failed to save prompt (${res.status})`);
  return res.json();
}

export async function saveBehavior(data) {
  const res = await fetch(`${API_URL}/v1/openclaw/config/behavior`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to save behavior (${res.status})`);
  return res.json();
}

export async function saveEnv(data) {
  const res = await fetch(`${API_URL}/v1/openclaw/config/env`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to save env (${res.status})`);
  return res.json();
}
