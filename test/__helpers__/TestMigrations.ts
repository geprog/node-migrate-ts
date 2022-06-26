import { vi } from 'vitest';

import { Migration } from '~/Migration';

export const migration1: Migration = {
  id: 'migration1',
  up: vi.fn(),
  down: vi.fn(),
};

export const migration2: Migration = {
  id: 'migration2',
  up: vi.fn(),
  down: vi.fn(),
};

export const migration3: Migration = {
  id: 'migration3',
  up: vi.fn(),
  down: vi.fn(),
};
