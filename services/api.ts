import mockPlans from "@/mocks/plans.json";
import { CheckoutPayload, CheckoutResponse, Plan } from "@/types/plan";

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const USER_STORAGE_KEY = "asegurat_user";
const SESSION_STORAGE_KEY = "asegurat_session";

export interface UserSession {
  email: string;
  authenticated: boolean;
}

export async function getPlans(): Promise<Plan[]> {
  // El wait artificial se eliminó para no depender de setTimeout en el cliente
  const plans = Array.isArray(mockPlans) ? mockPlans : (mockPlans as { default: Plan[] }).default;
  return plans as Plan[];
}

export async function registerUser(
  email: string,
  password: string,
): Promise<{ ok: boolean }> {
  await wait(400);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify({
        email,
        password,
      }),
    );
  }

  return { ok: true };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ ok: boolean; message: string }> {
  await wait(350);
  if (typeof window === "undefined") {
    return { ok: false, message: "No se pudo validar la sesión" };
  }

  const rawUser = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!rawUser) {
    return { ok: false, message: "No existe una cuenta registrada" };
  }

  const savedUser = JSON.parse(rawUser) as { email: string; password: string };
  if (savedUser.email !== email || savedUser.password !== password) {
    return { ok: false, message: "Correo o contraseña inválidos" };
  }

  window.localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({ email, authenticated: true }),
  );
  return { ok: true, message: "Inicio de sesión exitoso" };
}

export function getCurrentSession(): UserSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession) as UserSession;
    if (!session.authenticated || !session.email) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function logoutUser() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

export async function processCheckout(
  payload: CheckoutPayload,
): Promise<CheckoutResponse> {
  await wait(800);
  const now = new Date();
  const policyNumber = `POL-${now.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const receiptNumber = `RC-${Math.floor(100000 + Math.random() * 900000)}`;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      "asegurat_last_purchase",
      JSON.stringify({
        ...payload,
        policyNumber,
        receiptNumber,
      }),
    );
  }

  return {
    ok: true,
    policyNumber,
    receiptNumber,
    confirmationEmailSent: true,
  };
}
