import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() payload: { orgId?: string; role?: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (payload?.orgId) {
      client.join(`org:${payload.orgId}`);
    }
    if (payload?.role) {
      client.join(`role:${payload.role}`);
    }
  }

  emitNotification(orgId: string, role: string | null, notification: unknown) {
    this.server.to(`org:${orgId}`).emit('notification', notification);
    if (role) {
      this.server.to(`role:${role}`).emit('notification', notification);
    }
  }
}
