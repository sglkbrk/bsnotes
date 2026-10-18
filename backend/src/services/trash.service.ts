import prisma from '../config/prisma';
import { Status } from '../types';

export class TrashService {
  async getTrash(userId: number) {
    const now = new Date();

    const workplaces = await prisma.workplace.findMany({
      where: {
        userId,
        status: Status.Deleted
      },
      orderBy: {
        deletedDate: 'desc'
      }
    });

    const notes = await prisma.note.findMany({
      where: {
        userId,
        status: Status.Deleted
      },
      include: {
        workplace: {
          select: {
            id: true,
            name: true,
            status: true
          }
        }
      },
      orderBy: {
        deletedDate: 'desc'
      }
    });

    const formatDaysLeft = (deletedDate: Date | null) => {
      if (!deletedDate) return 15;
      const diffMs = now.getTime() - new Date(deletedDate).getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return Math.max(0, 15 - diffDays);
    };

    return {
      workplaces: workplaces.map((w) => ({
        ...w,
        daysLeft: formatDaysLeft(w.deletedDate)
      })),
      notes: notes.map((n) => ({
        ...n,
        workplaceName: n.workplace?.name || 'Bilinmeyen Çalışma Alanı',
        isWorkplaceDeleted: n.workplace?.status === Status.Deleted,
        daysLeft: formatDaysLeft(n.deletedDate)
      }))
    };
  }

  async restoreItem(type: 'workplace' | 'note', id: number, userId: number, targetWorkplaceId?: number) {
    if (type === 'workplace') {
      const workplace = await prisma.workplace.findFirst({
        where: { id, userId }
      });
      if (!workplace) return null;

      // Restore workplace
      const restored = await prisma.workplace.update({
        where: { id },
        data: {
          status: Status.Active,
          deletedDate: null
        }
      });

      // Restore notes that were deleted when workplace was deleted
      await prisma.note.updateMany({
        where: {
          workplaceId: id,
          userId,
          status: Status.Deleted
        },
        data: {
          status: Status.Active,
          deletedDate: null
        }
      });

      return restored;
    } else {
      const note = await prisma.note.findFirst({
        where: { id, userId },
        include: { workplace: true }
      });
      if (!note) return null;

      let newWorkplaceId = note.workplaceId;
      // If parent workplace is deleted and user specified a target workspace, use that
      if (targetWorkplaceId) {
        newWorkplaceId = targetWorkplaceId;
      } else if (note.workplace?.status === Status.Deleted) {
        // If target not provided but workplace is deleted, check for first active workplace
        const firstActive = await prisma.workplace.findFirst({
          where: { userId, status: Status.Active }
        });
        if (firstActive) {
          newWorkplaceId = firstActive.id;
        }
      }

      return prisma.note.update({
        where: { id },
        data: {
          status: Status.Active,
          deletedDate: null,
          workplaceId: newWorkplaceId,
          updatedDate: new Date()
        }
      });
    }
  }

  async permanentDelete(type: 'workplace' | 'note', id: number, userId: number) {
    if (type === 'workplace') {
      const workplace = await prisma.workplace.findFirst({
        where: { id, userId }
      });
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
    } else {
      const note = await prisma.note.findFirst({
        where: { id, userId }
      });
      if (!note) return;

      await prisma.content.deleteMany({
        where: { noteId: id }
      });

      await prisma.note.delete({
        where: { id }
      });
    }
  }

  async emptyTrash(userId: number) {
    // Find all soft-deleted notes for this user
    const notes = await prisma.note.findMany({
      where: { userId, status: Status.Deleted },
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

    // Find and delete soft-deleted workplaces
    const workplaces = await prisma.workplace.findMany({
      where: { userId, status: Status.Deleted },
      select: { id: true }
    });
    const workplaceIds = workplaces.map((w) => w.id);

    if (workplaceIds.length > 0) {
      // Clean any remaining notes for these workplaces
      const remainingNotes = await prisma.note.findMany({
        where: { workplaceId: { in: workplaceIds } },
        select: { id: true }
      });
      const remainingNoteIds = remainingNotes.map((n) => n.id);
      if (remainingNoteIds.length > 0) {
        await prisma.content.deleteMany({
          where: { noteId: { in: remainingNoteIds } }
        });
        await prisma.note.deleteMany({
          where: { id: { in: remainingNoteIds } }
        });
      }

      await prisma.workplace.deleteMany({
        where: { id: { in: workplaceIds } }
      });
    }
  }

  async purgeExpiredTrash() {
    const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);

    // Find expired notes
    const expiredNotes = await prisma.note.findMany({
      where: {
        status: Status.Deleted,
        deletedDate: { lte: fifteenDaysAgo }
      },
      select: { id: true }
    });
    const expiredNoteIds = expiredNotes.map((n) => n.id);

    if (expiredNoteIds.length > 0) {
      await prisma.content.deleteMany({
        where: { noteId: { in: expiredNoteIds } }
      });
      await prisma.note.deleteMany({
        where: { id: { in: expiredNoteIds } }
      });
      console.log(`[Trash Auto-Purge] ${expiredNoteIds.length} expired note(s) purged.`);
    }

    // Find expired workplaces
    const expiredWorkplaces = await prisma.workplace.findMany({
      where: {
        status: Status.Deleted,
        deletedDate: { lte: fifteenDaysAgo }
      },
      select: { id: true }
    });
    const expiredWorkplaceIds = expiredWorkplaces.map((w) => w.id);

    if (expiredWorkplaceIds.length > 0) {
      const relatedNotes = await prisma.note.findMany({
        where: { workplaceId: { in: expiredWorkplaceIds } },
        select: { id: true }
      });
      const relatedNoteIds = relatedNotes.map((n) => n.id);
      if (relatedNoteIds.length > 0) {
        await prisma.content.deleteMany({
          where: { noteId: { in: relatedNoteIds } }
        });
        await prisma.note.deleteMany({
          where: { id: { in: relatedNoteIds } }
        });
      }

      await prisma.workplace.deleteMany({
        where: { id: { in: expiredWorkplaceIds } }
      });
      console.log(`[Trash Auto-Purge] ${expiredWorkplaceIds.length} expired workplace(s) purged.`);
    }
  }
}

export const trashService = new TrashService();

