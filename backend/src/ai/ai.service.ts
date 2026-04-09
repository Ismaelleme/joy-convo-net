import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async getConversations(userId: string) {
    return this.prisma.aIConversation.findMany({
      where: { userId },
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getConversation(id: string, userId: string) {
    const conv = await this.prisma.aIConversation.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!conv || conv.userId !== userId) throw new NotFoundException('Conversa não encontrada.');
    return conv;
  }

  async createConversation(userId: string, title?: string) {
    return this.prisma.aIConversation.create({
      data: { userId, title: title ?? 'Nova conversa' },
      include: { messages: true },
    });
  }

  async sendMessage(conversationId: string, userId: string, content: string) {
    const conv = await this.getConversation(conversationId, userId);

    // Save user message
    const userMsg = await this.prisma.aIMessage.create({
      data: { conversationId, role: 'user', content },
    });

    // Generate AI response (placeholder — integrate real AI provider here)
    const aiResponse = this.generateResponse(content);

    const aiMsg = await this.prisma.aIMessage.create({
      data: { conversationId, role: 'assistant', content: aiResponse },
    });

    await this.prisma.aIConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return { userMessage: userMsg, aiMessage: aiMsg };
  }

  async deleteConversation(id: string, userId: string) {
    await this.getConversation(id, userId);
    return this.prisma.aIConversation.delete({ where: { id } });
  }

  private generateResponse(input: string): string {
    // Placeholder — replace with OpenAI/Anthropic/etc integration
    const responses: Record<string, string> = {
      agenda: 'Posso ajudar com sua agenda! Quer que eu liste seus próximos compromissos?',
      contato: 'Para gerenciar contatos, vá até a aba Contatos. Posso te guiar!',
      ligação: 'Para fazer uma ligação, acesse a aba Chamadas e selecione o contato.',
    };

    const key = Object.keys(responses).find((k) =>
      input.toLowerCase().includes(k),
    );

    return key
      ? responses[key]
      : `Entendi sua mensagem: "${input}". Como posso ajudar com isso?`;
  }
}
