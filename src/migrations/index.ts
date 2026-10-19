import * as migration_20260907_070109_initial from './20260907_070109_initial';
import * as migration_20261019_231805 from './20261019_231805';
import * as migration_20261019_235439 from './20261019_235439';

export const migrations = [
  {
    up: migration_20260907_070109_initial.up,
    down: migration_20260907_070109_initial.down,
    name: '20260907_070109_initial',
  },
  {
    up: migration_20261019_231805.up,
    down: migration_20261019_231805.down,
    name: '20261019_231805',
  },
  {
    up: migration_20261019_235439.up,
    down: migration_20261019_235439.down,
    name: '20261019_235439'
  },
];
