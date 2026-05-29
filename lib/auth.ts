import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";
import type { RolUsuario } from "@prisma/client";
import { db } from "@/lib/db";

const SESSION_COOKIE = "fumc_session";
const EXPIRATION_SECONDS = 60 * 60 * 8;

export type SessionUser = {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
};

function getSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET ?? "fumc-local-development-secret"
  );
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRATION_SECONDS}s`)
    .sign(getSecret());
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: EXPIRATION_SECONDS
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.id !== "string" ||
      typeof payload.nombre !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.rol !== "string"
    ) {
      return null;
    }

    return {
      id: payload.id,
      nombre: payload.nombre,
      email: payload.email,
      rol: payload.rol as RolUsuario
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireRole(roles: RolUsuario[]) {
  const session = await requireUser();
  if (!roles.includes(session.rol)) redirect("/dashboard?denied=1");
  return session;
}

export async function getFreshUser(session: SessionUser) {
  return db.usuario.findUnique({
    where: { id: session.id },
    select: { id: true, nombre: true, email: true, rol: true, activo: true }
  });
}
