const IDENTITY_URL = "https://identitytoolkit.googleapis.com/v1/accounts";

type SignInSuccess = {
  idToken: string;
  localId: string;
  email: string;
  emailVerified?: boolean;
};

type IdentityError = {
  error?: { message?: string };
};

function apiKey() {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!key) throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY");
  return key;
}

async function identityPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${IDENTITY_URL}:${path}?key=${apiKey()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as T & IdentityError;
  if (!res.ok) {
    throw new IdentityToolkitError(data.error?.message ?? "IDENTITY_ERROR");
  }
  return data;
}

export class IdentityToolkitError extends Error {
  constructor(public readonly code: string) {
    super(code);
  }
}

export async function signInWithPassword(email: string, password: string) {
  return identityPost<SignInSuccess>("signInWithPassword", {
    email,
    password,
    returnSecureToken: true,
  });
}

export async function signInWithCustomToken(token: string) {
  return identityPost<{ idToken: string }>("signInWithCustomToken", {
    token,
    returnSecureToken: true,
  });
}

export async function sendPasswordResetEmail(email: string) {
  await identityPost("sendOobCode", {
    requestType: "PASSWORD_RESET",
    email,
  });
}

export async function sendVerificationEmail(idToken: string) {
  await identityPost("sendOobCode", {
    requestType: "VERIFY_EMAIL",
    idToken,
  });
}

export function isInvalidCredential(code: string) {
  return (
    code === "EMAIL_NOT_FOUND" ||
    code === "INVALID_PASSWORD" ||
    code === "INVALID_LOGIN_CREDENTIALS" ||
    code === "USER_DISABLED"
  );
}
