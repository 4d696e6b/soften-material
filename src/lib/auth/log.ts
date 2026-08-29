export function logAuth(event: string, details: Record<string, unknown>) {
  const safe = { ...details };
  delete safe.password;
  console.info(`[auth] ${event}`, safe);
}
