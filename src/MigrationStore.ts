import { Migration } from './Migration';

export interface MigrationModel {
  id?: string;
  migrationId: Migration['id'];
  timestamp: number;
}

export interface MigrationStore {
  init(options: Record<string, unknown>): Promise<void>;
  getAppliedMigrations(): Promise<MigrationModel[]>;
  insertMigration(migration: Migration): Promise<void>;
}
