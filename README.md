# Node Migrate TS

Abstract migration framework using TypeScript.

## Creating a migration

A migration is a simple `Migration` object containing a unique `id` and implementations for `up` and `down`.  
If necessary `up` and `down` can be async.

```ts
// exampleMigration.ts
import { Migration } from '@geprog/node-migrate-ts';

export const exampleMigration: Migration = {
  id: 'exampleMigration', // unique migration identifier
  up() {
    console.log('Do some migrations in here');
  },
  down() {
    console.log('Revert your migration in here');
  },
};
```

## State Storage

The state of migrations can be stored anywhere by passing a `MigrationStore` implementation to [up](src/up.ts)

Currently implemented `MigrationStore`s are:

- [MongoMigrationStore](src/MongoMigrationStore.ts)

Contributions are very welcome! :wink:

## Applying Migrations

This example uses `MongoMigrationStore` as `MigrationStore`.

```ts
import { Migration, MongoMigrationStore, up } from '@geprog/node-migrate-ts';
import { MongoClient } from 'mongodb';
import { exampleMigration } from './exampleMigration';

// migrations are applied in the order defined here
const migrations: Migration[] = [exampleMigration];

const client = await MongoClient.connect('mongodb://user:password@localhost:27017/database?authSource=admin', {
  useUnifiedTopology: true,
});
const db = client.db();

const migrationStore = new MongoMigrationStore();
migrationStore.init({
  db,
  migrationsCollection: 'migrations',
});

await up({ migrations, migrationStore });

await client.close();
```

## Passing a migration context

To avoid a lot of boilerplate in the migrations, a context can be passed to [up](src/up.ts).
This context will then be available in the migrations `up` and `down` functions.

To clarify, here is a modification of the above example to pass the database connection to all migrations:

```diff
import { Migration, MongoMigrationStore, up } from '@geprog/node-migrate-ts';
-import { MongoClient } from 'mongodb';
+import { Db, MongoClient } from 'mongodb';
import { exampleMigration } from './exampleMigration';

+declare module '@geprog/node-migrate-ts' {
+  interface MigrationContext {
+    db: Db;
+  }
+}
+
// migrations are applied in the order defined here
const migrations: Migration[] = [exampleMigration];

const client = await MongoClient.connect('mongodb://user:password@localhost:27017/database?authSource=admin', {
  useUnifiedTopology: true,
});
const db = client.db();

const migrationStore = new MongoMigrationStore();
migrationStore.init({
  db,
  migrationsCollection: 'migrations',
});

-await up({ migrations, migrationStore });
+await up({ migrations, migrationStore, context: { db } });

await client.close();
```

The migrations can now use the database connection from the context.

```ts
import { Migration } from '@geprog/node-migrate-ts';
import { ObjectId } from 'mongodb';

export const exampleMigration: Migration = {
  id: 'exampleMigration',
  async up(context) {
    if (!context || !context.db) {
      throw new Error('Please pass a context with a db object');
    }
    const { db } = context;

    console.log('Migrate some mongodb here');
  },
  async down(context) {
    if (!context || !context.db) {
      throw new Error('Please pass a context with a db object');
    }
    const { db } = context;

    console.log('Migrate some mongodb here');
  },
};
```

## Attribution

This project is based on:

- <https://github.com/tj/node-migrate>
- <https://github.com/mycodeself/mongo-migrate-ts>
