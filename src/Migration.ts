export interface Migration {
  id: string;
  up(): Promise<void> | void;
  down(): Promise<void> | void;
}
