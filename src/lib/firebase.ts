import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

function pick(...values: Array<string | undefined>) {
  for (const value of values) {
    const trimmed = value?.trim().replace(/^['",]+|['",]+$/g, "");
    if (trimmed) return trimmed;
  }
}

const firebaseConfig = {
  apiKey: pick(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, process.env.NEXT_PUBLIC_API_KEY),
  authDomain: pick(
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  ),
  projectId: pick(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    process.env.NEXT_PUBLIC_PROJECT_ID,
  ),
  storageBucket: pick(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  ),
  messagingSenderId: pick(
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  ),
  appId: pick(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, process.env.NEXT_PUBLIC_APP_ID),
};

export function getFirebaseApp() {
  if (!firebaseConfig.apiKey) {
    throw new Error(
      "Missing Firebase API key. Set NEXT_PUBLIC_FIREBASE_API_KEY in .env.local and restart next dev.",
    );
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export function firebaseAuthMessage(code: string) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
    case "auth/email-already-in-use":
      return "อีเมลนี้ถูกใช้แล้ว";
    case "auth/too-many-requests":
      return "ส่งถี่เกินไป รอสักครู่แล้วลองอีกครั้ง";
    case "auth/unauthorized-continue-uri":
      return "โดเมนแอปยังไม่ได้รับอนุญาตใน Firebase (Authorized domains)";
    case "auth/invalid-action-code":
    case "auth/expired-action-code":
      return "ลิงก์หมดอายุหรือถูกใช้ไปแล้ว";
    default:
      return "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
  }
}
