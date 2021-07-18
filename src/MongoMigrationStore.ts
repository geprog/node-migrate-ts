import { Collection, MongoClient, MongoClientOptions } from 'mongodb';

import { Migration } from './Migration';
import { MigrationModel, MigrationStore } from './MigrationStore';

export class MongoMigrationStore implements MigrationStore {
  private collection?: Collection<MigrationModel>;

  async init({
    uri,
    database,
    migrationsCollection,
    options,
  }: {
    uri: string;
    database: string;
    migrationsCollection: string;
    options?: MongoClientOptions;
  }): Promise<void> {
    try {
      const client = await MongoClient.connect(uri, options);
      const db = client.db(database);
      this.collection = db.collection(migrationsCollection);
    } catch (e) {
      throw new Error(e);
    }
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
