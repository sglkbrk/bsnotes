import prisma from '../config/prisma';
import { Status } from '../types';

export class NoteService {
  async getUserAndWorkspaceNotes(userId: number, workplaceId: number) {
    return prisma.note.findMany({
      where: {
        userId,
        workplaceId,
        status: Status.Active
      },
      orderBy: {
        order: 'asc'
      }
    });
  }

  async getById(id: number, userId: number) {
    return prisma.note.findFirst({
      where: {
        id,
        userId
      }
    });
  }

  async add(data: any, userId: number) {
    const workplaceId = Number(data.workplaceId || data.WorkplaceId);
    const now = new Date();

    return prisma.note.create({
      data: {
        userId,
        workplaceId,
        title: data.title ?? '',
        description: data.description ?? '',
        location: data.location ?? '',
        tags: data.tags ?? '',
        status: data.status !== undefined ? data.status : Status.Active,
        order: data.order !== undefined ? data.order : 0,
        createdDate: now,
        updatedDate: now
      }
    });
  }

  async update(id: number, data: any, userId: number) {
    const existing = await prisma.note.findUnique({
      where: { id }
    });

    if (!existing || existing.userId !== userId) {
      const error: any = new Error('Unauthorized');
      error.status = 401;
      throw error;
    }

    const workplaceId = data.workplaceId !== undefined || data.WorkplaceId !== undefined
      ? Number(data.workplaceId ?? data.WorkplaceId)
      : existing.workplaceId;

    return prisma.note.update({
      where: { id },
      data: {
        workplaceId,
        title: data.title !== undefined ? data.title : existing.title,
        description: data.description !== undefined ? data.description : existing.description,
        location: data.location !== undefined ? data.location : existing.location,
        tags: data.tags !== undefined ? data.tags : existing.tags,
        status: data.status !== undefined ? data.status : existing.status,
        order: data.order !== undefined ? data.order : existing.order,
        updatedDate: new Date()
      }
    });
  }

  async delete(ids: number[], userId: number) {
    if (!ids || ids.length === 0) return;

    const now = new Date();

    // Soft delete notes by setting status to Deleted and recording deletedDate
    await prisma.note.updateMany({
      where: {
        id: { in: ids },
        userId
      },
      data: {
        status: Status.Deleted,
        deletedDate: now
      }
    });
  }

  async exportNote(id: number, userId: number) {
    const note = await prisma.note.findFirst({
      where: { id, userId },
      include: {
        contents: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!note) {
      const error: any = new Error('Not bulunamadı');
      error.status = 404;
      throw error;
    }

    return {
      version: '1.0',
      type: 'bsnote-export',
      exportedAt: new Date().toISOString(),
      note: {
        title: note.title,
        description: note.description,
        location: note.location,
        tags: note.tags,
        contents: note.contents.map((c) => ({
          contentType: c.contentType,
          contentValue: c.contentValue,
          order: c.order
        }))
      }
    };
  }

  async importNote(data: any, userId: number) {
    let workplaceId = Number(data.workplaceId || data.WorkplaceId);

    // Çalışma alanını doğrula veya kullanıcının mevcut çalışma alanını seç
    let targetWorkplace = workplaceId
      ? await prisma.workplace.findFirst({
          where: { id: workplaceId, userId, status: Status.Active }
        })
      : null;

    if (!targetWorkplace) {
      targetWorkplace = await prisma.workplace.findFirst({
        where: { userId, status: Status.Active }
      });
    }

    // Kullanıcının hiç çalışma alanı yoksa varsayılan bir tane oluştur
    if (!targetWorkplace) {
      targetWorkplace = await prisma.workplace.create({
        data: {
          userId,
          name: 'Genel Notlar',
          icon: 'FiFolder',
          status: Status.Active,
          order: 0,
          createdDate: new Date()
        }
      });
    }

    const finalWorkplaceId = targetWorkplace.id;
    const notePayload = data.note || data;
    const contentsPayload = notePayload.contents || [];

    const now = new Date();

    return prisma.$transaction(async (tx) => {
      const newNote = await tx.note.create({
        data: {
          userId,
          workplaceId: finalWorkplaceId,
          title: notePayload.title || 'İçe Aktarılan Not',
          description: notePayload.description || '',
          location: notePayload.location || '',
          tags: notePayload.tags || '',
          status: Status.Active,
          order: 0,
          createdDate: now,
          updatedDate: now
        }
      });

      if (Array.isArray(contentsPayload) && contentsPayload.length > 0) {
        await tx.content.createMany({
          data: contentsPayload.map((c: any, index: number) => ({
            noteId: newNote.id,
            contentType: Number(c.contentType ?? 0),
            contentValue: String(c.contentValue ?? ''),
            order: Number(c.order !== undefined ? c.order : index),
            createdDate: now,
            updatedDate: now,
            createdUserId: userId,
            updatedUserId: userId
          }))
        });
      }

      return newNote;
    });
  }
}

export const noteService = new NoteService();

