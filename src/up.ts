import { Migration, MigrationContext } from './Migration';
import { MigrationStore } from './MigrationStore';

export default async ({
  context,
  migrations,
  migrationStore,
}: {
  context?: MigrationContext;
  migrations: Migration[];
  migrationStore: MigrationStore;
}): Promise<void> => {
  const appliedMigrations = await migrationStore.getAppliedMigrations();
  const migrationsToApply = migrations.filter(
    (migration) =>
      appliedMigrations.find((appliedMigration) => appliedMigration.migrationId === migration.id) === undefined,
  );

  for await (const migration of migrationsToApply) {
    await migration.up(context);
    await migrationStore.insertMigration(migration);
  }
};
