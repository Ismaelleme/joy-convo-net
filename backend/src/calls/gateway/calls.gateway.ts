import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type OfferPayload = {
  fromUserId: string;
  toUserId: string;
  callId: string;
  sdp: unknown;
};

type AnswerPayload = {
  fromUserId: string;
  toUserId: string;
  callId: string;
  sdp: unknown;
};

type IcePayload = {
  fromUserId: string;
  toUserId: string;
  callId: string;
  candidate: unknown;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'calls',
})
export class CallsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private userSockets = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    client.emit('connected', { socketId: client.id });
  }

  handleDisconnect(client: Socket) {
    this.userSockets.forEach((sockets, userId) => {
      sockets.delete(client.id);
      if (!sockets.size) {
        this.userSockets.delete(userId);
      }
    });
  }

  @SubscribeMessage('join-user')
  joinUserRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string },
  ) {
    const sockets = this.userSockets.get(payload.userId) ?? new Set<string>();
    sockets.add(client.id);
    this.userSockets.set(payload.userId, sockets);
    client.join(`user:${payload.userId}`);

    return { ok: true };
  }

  @SubscribeMessage('call-offer')
  handleOffer(@ConnectedSocket() client: Socket, @MessageBody() payload: OfferPayload) {
    this.server.to(`user:${payload.toUserId}`).emit('call-offer', payload);
    client.emit('offer-sent', { callId: payload.callId });
  }

  @SubscribeMessage('call-answer')
  handleAnswer(@ConnectedSocket() client: Socket, @MessageBody() payload: AnswerPayload) {
    this.server.to(`user:${payload.toUserId}`).emit('call-answer', payload);
    client.emit('answer-sent', { callId: payload.callId });
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: IcePayload,
  ) {
    this.server.to(`user:${payload.toUserId}`).emit('ice-candidate', payload);
    client.emit('ice-sent', { callId: payload.callId });
  }

  @SubscribeMessage('hangup')
  handleHangup(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { fromUserId: string; toUserId: string; callId: string },
  ) {
    this.server.to(`user:${payload.toUserId}`).emit('hangup', payload);
    client.emit('hangup-sent', { callId: payload.callId });
  }
}
