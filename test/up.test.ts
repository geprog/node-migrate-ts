import { MongoMigrationStore } from '~/MongoMigrationStore';
import up from '~/up';
import { migration1, migration2, migration3 } from '$/__helpers__/TestMigrations';

jest.mock('~/MongoMigrationStore');

const MongoMigrationStoreMock = MongoMigrationStore as jest.MockedClass<typeof MongoMigrationStore>;

describe('up', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should call up on all given migrations', async () => {
    expect.assertions(3);

    // given
    const migrations = [migration1, migration2, migration3];
    MongoMigrationStoreMock.mockImplementationOnce(() => ({
      init: jest.fn(),
      getAppliedMigrations: jest.fn().mockReturnValueOnce([]),
      insertMigration: jest.fn(),
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
      init: jest.fn(),
      getAppliedMigrations: jest.fn().mockReturnValueOnce([{ migrationId: 'migration2', timestamp: 1251242789 }]),
      insertMigration: jest.fn(),
    }));
    const migrationStore = new MongoMigrationStore();

    // when
    await up({ migrations, migrationStore });

    // then
    expect(migration1.up).toHaveBeenCalledTimes(1);
    expect(migration2.up).not.toHaveBeenCalled();
    expect(migration3.up).toHaveBeenCalledTimes(1);
  });
});
