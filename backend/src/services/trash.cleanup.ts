import { trashService } from './trash.service';

export function initTrashCleanup() {
  console.log('🧹 Trash Auto-Purge Worker initialized (15-day retention policy)');

  // Run immediately on boot
  trashService.purgeExpiredTrash().catch((err) => {
    console.error('Initial trash purge failed:', err);
  });

  // Run every 1 hour (3600000 ms)
  setInterval(() => {
    trashService.purgeExpiredTrash().catch((err) => {
      console.error('Periodic trash purge failed:', err);
    });
  }, 60 * 60 * 1000);
}

