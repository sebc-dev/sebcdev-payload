import * as migration_20250929_111647 from './20250929_111647'
import * as migration_20251129_164608 from './20251129_164608'
import * as migration_20251208_061019_articles from './20251208_061019_articles'

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20251129_164608.up,
    down: migration_20251129_164608.down,
    name: '20251129_164608',
  },
  {
    up: migration_20251208_061019_articles.up,
    down: migration_20251208_061019_articles.down,
    name: '20251208_061019_articles',
  },
]
