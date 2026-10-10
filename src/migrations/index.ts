import * as migration_20260907_070109_initial from './20260907_070109_initial';
import * as migration_20261007_194849 from './20261007_194849';
import * as migration_20261007_221213 from './20261007_221213';
import * as migration_20261010_000000_sections_array_to_group from './20261010_000000_sections_array_to_group';

export const migrations = [
  {
    up: migration_20260907_070109_initial.up,
    down: migration_20260907_070109_initial.down,
    name: '20260907_070109_initial',
  },
  {
    up: migration_20261007_194849.up,
    down: migration_20261007_194849.down,
    name: '20261007_194849',
  },
  {
    up: migration_20261007_221213.up,
    down: migration_20261007_221213.down,
    name: '20261007_221213'
  },
  {
    up: migration_20261010_000000_sections_array_to_group.up,
    down: migration_20261010_000000_sections_array_to_group.down,
    name: '20261010_000000_sections_array_to_group'
  },
];
