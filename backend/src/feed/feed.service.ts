import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  private includePost = {
    author: { select: { id: true, name: true, avatar: true } },
    _count: { select: { likes: true, comments: true } },
  };

  async getFeed(userId: string, cursor?: string, take = 20) {
    return this.prisma.feedPost.findMany({
      where: { isPublic: true },
      include: {
        ...this.includePost,
        likes: { where: { userId }, select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
  }

  async createPost(authorId: string, content: string, imageUrl?: string) {
    return this.prisma.feedPost.create({
      data: { authorId, content, imageUrl },
      include: this.includePost,
    });
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.prisma.feedPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post não encontrado.');
    if (post.authorId !== userId) throw new ForbiddenException('Sem permissão.');
    return this.prisma.feedPost.delete({ where: { id: postId } });
  }

  async toggleLike(postId: string, userId: string) {
    const existing = await this.prisma.postLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) {
      await this.prisma.postLike.delete({ where: { id: existing.id } });
      return { liked: false };
    }

    await this.prisma.postLike.create({ data: { postId, userId } });
    return { liked: true };
  }

  async getComments(postId: string) {
    return this.prisma.postComment.findMany({
      where: { postId },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async addComment(postId: string, userId: string, content: string) {
    return this.prisma.postComment.create({
      data: { postId, userId, content },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
  }
}
