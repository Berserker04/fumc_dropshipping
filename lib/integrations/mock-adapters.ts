import { CanalNotificacion, EstadoNotificacion } from "@prisma/client";
import { db } from "@/lib/db";

export type NotificationPayload = {
  pedidoId?: string;
  canal: CanalNotificacion;
  destinatario: string;
  asunto: string;
  mensaje: string;
};

export async function sendMockNotification(payload: NotificationPayload) {
  return db.notificacion.create({
    data: {
      pedidoId: payload.pedidoId,
      canal: payload.canal,
      destinatario: payload.destinatario,
      asunto: payload.asunto,
      mensaje: payload.mensaje,
      estado: EstadoNotificacion.ENVIADA,
      enviadaEn: new Date()
    }
  });
}

export function generateMockTracking(orderId: string) {
  return `FUMC-${orderId.slice(-8).toUpperCase()}`;
}

export function generateMockLabel(tracking: string) {
  return `mock://etiqueta/${tracking}`;
}
