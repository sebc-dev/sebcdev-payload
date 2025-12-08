import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * Helper to add a column to a table, ignoring duplicate column errors.
 * SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN.
 */
async function addColumnIfNotExists(
  db: MigrateUpArgs['db'],
  table: string,
  column: string,
  definition: string,
): Promise<void> {
  try {
    await db.run(sql`ALTER TABLE ${sql.raw(table)} ADD ${sql.raw(column)} ${sql.raw(definition)};`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorLower = errorMessage.toLowerCase()
    if (errorLower.includes('duplicate column') || errorLower.includes('already exists')) {
      return
    }
    throw error
  }
}

/**
 * Helper to drop a column from a table, ignoring errors if column doesn't exist.
 * SQLite 3.35.0+ (used by Cloudflare D1) supports ALTER TABLE DROP COLUMN.
 */
async function dropColumnIfExists(
  db: MigrateDownArgs['db'],
  table: string,
  column: string,
): Promise<void> {
  try {
    await db.run(sql`ALTER TABLE ${sql.raw(table)} DROP COLUMN ${sql.raw(column)};`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorLower = errorMessage.toLowerCase()
    if (errorLower.includes('no such column') || errorLower.includes('does not exist')) {
      return
    }
    throw error
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create articles table
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`articles\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`featured_image_id\` integer,
  	\`category_id\` integer,
  	\`author_id\` integer,
  	\`published_at\` text,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`reading_time\` numeric,
  	\`complexity\` text DEFAULT 'intermediate' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`articles_slug_idx\` ON \`articles\` (\`slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`articles_featured_image_idx\` ON \`articles\` (\`featured_image_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`articles_category_idx\` ON \`articles\` (\`category_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`articles_author_idx\` ON \`articles\` (\`author_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`articles_updated_at_idx\` ON \`articles\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`articles_created_at_idx\` ON \`articles\` (\`created_at\`);`,
  )

  // Create articles_locales table
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`articles_locales\` (
  	\`title\` text NOT NULL,
  	\`content\` text,
  	\`excerpt\` text,
  	\`seo_meta_title\` text,
  	\`seo_meta_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`articles_locales_locale_parent_id_unique\` ON \`articles_locales\` (\`_locale\`,\`_parent_id\`);`,
  )

  // Create articles_rels table for tags relationship
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`articles_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`tags_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tags_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`articles_rels_order_idx\` ON \`articles_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`articles_rels_parent_idx\` ON \`articles_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`articles_rels_path_idx\` ON \`articles_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`articles_rels_tags_id_idx\` ON \`articles_rels\` (\`tags_id\`);`,
  )

  // Add caption column to media table if not exists
  await addColumnIfNotExists(db, '`media`', '`caption`', 'text')

  // Add articles_id column to payload_locked_documents_rels if not exists
  await addColumnIfNotExists(
    db,
    '`payload_locked_documents_rels`',
    '`articles_id`',
    'integer REFERENCES articles(id)',
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`,
  )

  // Update query planner statistics
  await db.run(sql`PRAGMA optimize;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop index and column from payload_locked_documents_rels BEFORE dropping articles table
  // This removes the FK reference that would otherwise block DROP TABLE articles
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_articles_id_idx\`;`)
  await dropColumnIfExists(db, '`payload_locked_documents_rels`', '`articles_id`')

  // Drop caption column from media (added in up())
  await dropColumnIfExists(db, '`media`', '`caption`')

  // Drop articles tables
  await db.run(sql`DROP TABLE IF EXISTS \`articles_rels\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`articles_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`articles\`;`)
}
