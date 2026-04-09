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
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  private onlineUsers = new Map<string, Set<string>>();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    client.emit('connected', { socketId: client.id });
  }

  handleDisconnect(client: Socket) {
    this.onlineUsers.forEach((sockets, userId) => {
      sockets.delete(client.id);
      if (!sockets.size) {
        this.onlineUsers.delete(userId);
        this.server.emit('user-offline', { userId });
      }
    });
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() payload: { userId: string }) {
    const sockets = this.onlineUsers.get(payload.userId) ?? new Set();
    sockets.add(client.id);
    this.onlineUsers.set(payload.userId, sockets);
    client.join(`user:${payload.userId}`);
    this.server.emit('user-online', { userId: payload.userId });
    return { ok: true };
  }

  @SubscribeMessage('join-chat')
  handleJoinChat(@ConnectedSocket() client: Socket, @MessageBody() payload: { chatId: string }) {
    client.join(`chat:${payload.chatId}`);
    return { ok: true };
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string; senderId: string; content: string; type?: string; replyToId?: string },
  ) {
    const message = await this.chatService.sendMessage(
      payload.chatId,
      payload.senderId,
      payload.content,
      payload.type,
      payload.replyToId,
    );
    this.server.to(`chat:${payload.chatId}`).emit('new-message', message);
    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string; userId: string; isTyping: boolean },
  ) {
    client.to(`chat:${payload.chatId}`).emit('typing', payload);
  }

  @SubscribeMessage('read')
  async handleRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string; userId: string },
  ) {
    await this.chatService.markAsRead(payload.chatId, payload.userId);
    this.server.to(`chat:${payload.chatId}`).emit('messages-read', payload);
  }
}
