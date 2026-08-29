import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getAdminCredential() {
  const json = process.env.FIREBASE_ADMIN_SDK_JSON;
  if (json) {
    return cert(JSON.parse(json) as Record<string, string>);
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin credentials");
  }

  return cert({ projectId, clientEmail, privateKey });
}

export function getAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp({ credential: getAdminCredential() });
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}
