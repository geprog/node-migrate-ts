// A declaration of a context passed to each migration.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MigrationContext {}

export interface Migration {
  id: string;
  up(this: void, context?: MigrationContext): Promise<void> | void;
  down(this: void, context?: MigrationContext): Promise<void> | void;
}
