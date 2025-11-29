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
    // SQLite SQLITE_ERROR (1): duplicate column name: xxx
    // D1 may return: "already exists" or "duplicate column"
    if (errorLower.includes('duplicate column') || errorLower.includes('already exists')) {
      // Expected: column already exists from dev mode
      return
    }
    // Unexpected error - log and rethrow
    console.error(`Failed to add ${column} column to ${table}:`, errorMessage)
    throw error
  }
}

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Categories table - use IF NOT EXISTS for idempotency (dev mode may have created them)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`color\` text,
  	\`icon\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`categories_slug_idx\` ON \`categories\` (\`slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`categories_updated_at_idx\` ON \`categories\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`categories_created_at_idx\` ON \`categories\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`categories_locales\` (
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`categories_locales_locale_parent_id_unique\` ON \`categories_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  // Tags table
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`tags\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`tags_slug_idx\` ON \`tags\` (\`slug\`);`)
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`tags_updated_at_idx\` ON \`tags\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`tags_created_at_idx\` ON \`tags\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`tags_locales\` (
  	\`name\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`tags_locales_locale_parent_id_unique\` ON \`tags_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  // payload_kv table is already created by Payload in dev mode, skip if exists
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`,
  )
  // ALTER TABLE ADD COLUMN - SQLite doesn't support IF NOT EXISTS for columns
  await addColumnIfNotExists(
    db,
    '`payload_locked_documents_rels`',
    '`categories_id`',
    'integer REFERENCES categories(id)',
  )
  await addColumnIfNotExists(
    db,
    '`payload_locked_documents_rels`',
    '`tags_id`',
    'integer REFERENCES tags(id)',
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_tags_id_idx\` ON \`payload_locked_documents_rels\` (\`tags_id\`);`,
  )

  // Update query planner statistics after index creation
  await db.run(sql`PRAGMA optimize;`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Remove categories_id and tags_id columns from payload_locked_documents_rels
  // and drop taxonomy tables within a single transaction for FK safety
  // CRITICAL: Must remove FK columns BEFORE dropping referenced tables to avoid constraint violations
  try {
    // Begin transaction
    await db.run(sql`BEGIN TRANSACTION;`)

    // Defer foreign key checks until commit (safer than disabling entirely)
    // This allows schema changes while still validating FK integrity at commit time
    await db.run(sql`PRAGMA defer_foreign_keys=ON;`)

    // Check if columns exist before attempting removal
    const tableInfo = await db.run(sql`PRAGMA table_info(\`payload_locked_documents_rels\`);`)

    // Defensively validate PRAGMA result structure
    if (!Array.isArray(tableInfo.results)) {
      throw new Error(
        `PRAGMA table_info returned unexpected result type: ${typeof tableInfo.results}`,
      )
    }

    // Extract column names with type guard
    const columns = tableInfo.results
      .filter((item): item is { name: string } => {
        return (
          typeof item === 'object' &&
          item !== null &&
          'name' in item &&
          typeof item.name === 'string'
        )
      })
      .map((col) => col.name)

    // Only proceed with table rebuild if categories_id or tags_id exist
    if (columns.includes('categories_id') || columns.includes('tags_id')) {
      // Drop temporary table if it exists from previous failed run
      await db.run(sql`DROP TABLE IF EXISTS \`__new_payload_locked_documents_rels\`;`)

      // Create new table without categories_id and tags_id
      await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
      	\`id\` integer PRIMARY KEY NOT NULL,
      	\`order\` integer,
      	\`parent_id\` integer NOT NULL,
      	\`path\` text NOT NULL,
      	\`users_id\` integer,
      	\`media_id\` integer,
      	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
      	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
      	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
      );
      `)

      // Copy data (only columns that exist in both tables)
      await db.run(
        sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`,
      )

      // Drop old table
      await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)

      // Rename new table
      await db.run(
        sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`,
      )

      // Recreate indexes with IF NOT EXISTS for idempotency
      await db.run(
        sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`,
      )
      await db.run(
        sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`,
      )
      await db.run(
        sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`,
      )
      await db.run(
        sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
      )
      await db.run(
        sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
      )
    }

    // Drop locale tables first (child tables with FKs) before parent tables
    // Safe to drop now because FK columns have been removed from payload_locked_documents_rels
    await db.run(sql`DROP TABLE IF EXISTS \`categories_locales\`;`)
    await db.run(sql`DROP TABLE IF EXISTS \`tags_locales\`;`)
    await db.run(sql`DROP TABLE IF EXISTS \`categories\`;`)
    await db.run(sql`DROP TABLE IF EXISTS \`tags\`;`)
    await db.run(sql`DROP TABLE IF EXISTS \`payload_kv\`;`)

    // Commit transaction - defer_foreign_keys automatically resets and FK checks run here
    await db.run(sql`COMMIT;`)
  } catch (error) {
    // Rollback transaction on error
    // defer_foreign_keys automatically resets on rollback, no manual cleanup needed
    try {
      await db.run(sql`ROLLBACK;`)
    } catch (rollbackError) {
      console.error('Failed to rollback transaction:', rollbackError)
    }
    throw error
  }
}
