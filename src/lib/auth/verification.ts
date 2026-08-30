import { sendEmailVerification, type User } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export async function sendAppVerificationEmail(user: User) {
  const continueUrl =
    (typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL) +
    "/auth/action";

  try {
    await sendEmailVerification(user, {
      url: continueUrl,
      handleCodeInApp: false,
    });
  } catch (error) {
    const code = error instanceof FirebaseError ? error.code : "";
    if (
      code === "auth/unauthorized-continue-uri" ||
      code === "auth/invalid-continue-uri" ||
      code === "auth/missing-continue-uri"
    ) {
      await sendEmailVerification(user);
      return;
    }
    throw error;
  }
}
