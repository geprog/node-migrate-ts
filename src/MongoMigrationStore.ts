/* c8 ignore start */
import { Collection, Db } from 'mongodb';

import { Migration } from './Migration';
import { MigrationModel, MigrationStore } from './MigrationStore';

export class MongoMigrationStore implements MigrationStore {
  private collection?: Collection<MigrationModel>;

  init({ db, migrationsCollection }: { db: Db; migrationsCollection: string }): void {
    this.collection = db.collection(migrationsCollection);
  }

  getAppliedMigrations(): Promise<MigrationModel[]> {
    if (this.collection === undefined) {
      throw new Error('call init() first');
    }
    return this.collection.find().sort({ timestamp: -1 }).toArray();
  }

  async insertMigration(migration: Migration): Promise<void> {
    if (this.collection === undefined) {
      throw new Error('call init() first');
    }
    await this.collection.insertOne({
      migrationId: migration.id,
      timestamp: +new Date(),
    });
  }
}
