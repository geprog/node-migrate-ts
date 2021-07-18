import { Migration } from './Migration';
import { MigrationStore } from './MigrationStore';

export default async ({
  migrations,
  migrationStore,
}: {
  migrations: Migration[];
  migrationStore: MigrationStore;
}): Promise<void> => {
  const appliedMigrations = await migrationStore.getAppliedMigrations();
  const migrationsToApply = migrations.filter(
    (migration) =>
      appliedMigrations.find((appliedMigration) => appliedMigration.migrationId === migration.id) === undefined,
  );

  for await (const migration of migrationsToApply) {
    await migration.up();
    await migrationStore.insertMigration(migration);
  }
};
