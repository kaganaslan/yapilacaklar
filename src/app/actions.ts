"use server";

export async function loginAction(
  userKey: string,
  password: string
): Promise<boolean> {
  const passwords: Record<string, string | undefined> = {
    serra: process.env.SERRA_PASSWORD,
    kagan: process.env.KAGAN_PASSWORD,
  };
  return passwords[userKey] === password;
}
