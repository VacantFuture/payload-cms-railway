import * as migration_20260907_070109_initial from './20260907_070109_initial';
import * as migration_20261007_194849 from './20261007_194849';

export const migrations = [
  {
    up: migration_20260907_070109_initial.up,
    down: migration_20260907_070109_initial.down,
    name: '20260907_070109_initial',
  },
  {
    up: migration_20261007_194849.up,
    down: migration_20261007_194849.down,
    name: '20261007_194849'
  },
];
