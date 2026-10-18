import prisma from '../config/prisma';
import { OrderDto } from '../types';

export class ContentService {
  async getContents(noteId: number) {
    return prisma.content.findMany({
      where: { noteId },
      orderBy: { order: 'asc' }
    });
  }

  async getById(id: number) {
    return prisma.content.findUnique({
      where: { id }
    });
  }

  async add(data: any, userId: number) {
    const noteId = Number(data.noteId ?? data.NoteId);
    const contentType = Number(data.contentType ?? data.ContentType ?? 0);
    const contentValue = String(data.contentValue ?? data.ContentValue ?? '');
    const order = Number(data.order ?? data.Order ?? 0);
    const now = new Date();

    return prisma.content.create({
      data: {
        noteId,
        contentType,
        contentValue,
        order,
        createdDate: now,
        updatedDate: now,
        createdUserId: userId,
        updatedUserId: userId
      }
    });
  }

  async update(id: number, data: any, userId: number) {
    const contentValue = data.contentValue ?? data.ContentValue;
    const contentType = data.contentType ?? data.ContentType;
    const order = data.order ?? data.Order;

    return prisma.content.update({
      where: { id },
      data: {
        ...(contentValue !== undefined && { contentValue: String(contentValue) }),
        ...(contentType !== undefined && { contentType: Number(contentType) }),
        ...(order !== undefined && { order: Number(order) }),
        updatedUserId: userId,
        updatedDate: new Date()
      }
    });
  }

  async delete(ids: number[], userId: number) {
    if (!ids || ids.length === 0) return;

    await prisma.content.deleteMany({
      where: {
        id: { in: ids },
        createdUserId: userId
      }
    });
  }

  async updateOrder(orderDtos: OrderDto[]) {
    if (!orderDtos || orderDtos.length === 0) return;

    for (const dto of orderDtos) {
      const id = dto.id ?? dto.Id;
      const order = dto.order ?? dto.Order;

      if (id !== undefined && order !== undefined) {
        await prisma.content.updateMany({
          where: { id },
          data: { order }
        });
      }
    }
  }
}

export const contentService = new ContentService();

