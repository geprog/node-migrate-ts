import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MongoMigrationStore } from '~/MongoMigrationStore';
import up from '~/up';
import { migration1, migration2, migration3 } from '$/__helpers__/TestMigrations';

declare module '~/Migration' {
  interface MigrationContext {
    test: string;
  }
}

vi.mock('~/MongoMigrationStore');

const MongoMigrationStoreMock = vi.mocked(MongoMigrationStore);

describe('up', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it('should call up on all given migrations', async () => {
    expect.assertions(3);

    // given
    const migrations = [migration1, migration2, migration3];
    MongoMigrationStoreMock.mockImplementationOnce(() => ({
      init: vi.fn(),
      getAppliedMigrations: vi.fn().mockReturnValueOnce([]),
      insertMigration: vi.fn(),
    }));
    const migrationStore = new MongoMigrationStore();

    // when
    await up({ migrations, migrationStore });

    // then
    expect(migration1.up).toHaveBeenCalledTimes(1);
    expect(migration2.up).toHaveBeenCalledTimes(1);
    expect(migration3.up).toHaveBeenCalledTimes(1);
  });

  it('should call up on all not already applied migrations', async () => {
    expect.assertions(3);

    // given
    const migrations = [migration1, migration2, migration3];
    MongoMigrationStoreMock.mockImplementationOnce(() => ({
      init: vi.fn(),
      getAppliedMigrations: vi.fn().mockReturnValueOnce([{ migrationId: 'migration2', timestamp: 1251242789 }]),
      insertMigration: vi.fn(),
    }));
    const migrationStore = new MongoMigrationStore();

    // when
    await up({ migrations, migrationStore });

    // then
    expect(migration1.up).toHaveBeenCalledTimes(1);
    expect(migration2.up).not.toHaveBeenCalled();
    expect(migration3.up).toHaveBeenCalledTimes(1);
  });

  it('should pass a given context to the migrations up() function', async () => {
    expect.assertions(2);

    // given
    const migrations = [migration1];
    MongoMigrationStoreMock.mockImplementationOnce(() => ({
      init: vi.fn(),
      getAppliedMigrations: vi.fn().mockReturnValueOnce([]),
      insertMigration: vi.fn(),
    }));
    const migrationStore = new MongoMigrationStore();
    const context = { test: '123' };

    // when
    await up({ migrations, migrationStore, context });

    // then
    expect(migration1.up).toHaveBeenCalledTimes(1);
    expect(migration1.up).toHaveBeenCalledWith(context);
  });
});
