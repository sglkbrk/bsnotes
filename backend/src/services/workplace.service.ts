import prisma from '../config/prisma';
import { Status } from '../types';

export class WorkplaceService {
  async getUserWorkplace(userId: number) {
    return prisma.workplace.findMany({
      where: {
        userId,
        status: Status.Active
      },
      orderBy: {
        order: 'asc'
      }
    });
  }

  async getById(id: number, userId: number) {
    return prisma.workplace.findFirst({
      where: {
        id,
        userId
      }
    });
  }

  async add(data: { name: string; icon?: string; status?: number; order?: number }, userId: number) {
    return prisma.workplace.create({
      data: {
        userId,
        name: data.name,
        icon: data.icon || 'FiFolder',
        status: data.status !== undefined ? data.status : Status.Active,
        order: data.order !== undefined ? data.order : 0,
        createdDate: new Date()
      }
    });
  }

  async update(id: number, data: { name?: string; icon?: string; status?: number; order?: number }) {
    return prisma.workplace.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.order !== undefined && { order: data.order })
      }
    });
  }

  async delete(id: number, userId: number) {
    const workplace = await this.getById(id, userId);
    if (!workplace) return;

    const now = new Date();

    await prisma.workplace.update({
      where: { id },
      data: {
        status: Status.Deleted,
        deletedDate: now
      }
    });

    // Also soft-delete notes in this workplace
    await prisma.note.updateMany({
      where: {
        workplaceId: id,
        userId,
        status: Status.Active
      },
      data: {
        status: Status.Deleted,
        deletedDate: now
      }
    });
  }

  async permanentDelete(id: number, userId: number) {
    const workplace = await this.getById(id, userId);
    if (!workplace) return;

    const notes = await prisma.note.findMany({
      where: { workplaceId: id },
      select: { id: true }
    });
    const noteIds = notes.map((n) => n.id);

    if (noteIds.length > 0) {
      await prisma.content.deleteMany({
        where: { noteId: { in: noteIds } }
      });
      await prisma.note.deleteMany({
        where: { id: { in: noteIds } }
      });
    }

    await prisma.workplace.delete({
      where: { id }
    });
  }

  async deleteMany(ids: number[], userId: number) {
    if (!ids || ids.length === 0) return;

    const now = new Date();

    await prisma.workplace.updateMany({
      where: {
        id: { in: ids },
        userId
      },
      data: {
        status: Status.Deleted,
        deletedDate: now
      }
    });

    await prisma.note.updateMany({
      where: {
        workplaceId: { in: ids },
        userId,
        status: Status.Active
      },
      data: {
        status: Status.Deleted,
        deletedDate: now
      }
    });
  }
}

export const workplaceService = new WorkplaceService();

