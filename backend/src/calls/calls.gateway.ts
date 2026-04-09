import {
  ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage, WebSocketGateway, WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'calls' })
export class CallsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private userSockets = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    client.emit('connected', { socketId: client.id });
  }

  handleDisconnect(client: Socket) {
    this.userSockets.forEach((sockets, userId) => {
      sockets.delete(client.id);
      if (!sockets.size) this.userSockets.delete(userId);
    });
  }

  @SubscribeMessage('join-user')
  joinUser(@ConnectedSocket() client: Socket, @MessageBody() payload: { userId: string }) {
    const sockets = this.userSockets.get(payload.userId) ?? new Set();
    sockets.add(client.id);
    this.userSockets.set(payload.userId, sockets);
    client.join(`user:${payload.userId}`);
    return { ok: true };
  }

  @SubscribeMessage('call-offer')
  handleOffer(@ConnectedSocket() client: Socket, @MessageBody() p: any) {
    this.server.to(`user:${p.toUserId}`).emit('call-offer', p);
  }

  @SubscribeMessage('call-answer')
  handleAnswer(@ConnectedSocket() client: Socket, @MessageBody() p: any) {
    this.server.to(`user:${p.toUserId}`).emit('call-answer', p);
  }

  @SubscribeMessage('ice-candidate')
  handleIce(@ConnectedSocket() client: Socket, @MessageBody() p: any) {
    this.server.to(`user:${p.toUserId}`).emit('ice-candidate', p);
  }

  @SubscribeMessage('hangup')
  handleHangup(@ConnectedSocket() client: Socket, @MessageBody() p: any) {
    this.server.to(`user:${p.toUserId}`).emit('hangup', p);
  }
}
