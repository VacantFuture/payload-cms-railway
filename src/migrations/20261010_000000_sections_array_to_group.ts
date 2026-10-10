import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migrates `sectionName` from a field array (stored in `sections_section_name`)
 * to a group (stored as `section_name_title` and `section_name_description` columns
 * directly on the `sections` table).
 *
 * This migration assumes the schema has already been updated to use a group type
 * for `sectionName` in the CollectionConfig. It only handles the database
 * structural changes.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Step 1: Add new columns for the group fields
    ALTER TABLE "sections" ADD COLUMN "section_name_title" varchar;
    ALTER TABLE "sections" ADD COLUMN "section_name_description" varchar;

    -- Step 2: Migrate data from the array table.
    -- For each section, take the first row's values (arrays should have at most one element here).
    UPDATE "sections" s
    SET
      "section_name_title" = sub.title,
      "section_name_description" = sub.description
    FROM (
      SELECT DISTINCT ON (_parent_id) _parent_id, title, description
      FROM "sections_section_name"
      ORDER BY _parent_id, _order
    ) sub
    WHERE s.id = sub._parent_id;

    -- Step 3: Drop indexes on the array table
    DROP INDEX IF EXISTS "sections_section_name_order_idx";
    DROP INDEX IF EXISTS "sections_section_name_parent_id_idx";
    DROP INDEX IF EXISTS "sections_section_name_parent_id_fk";

    -- Step 4: Drop the array table
    DROP TABLE IF EXISTS "sections_section_name";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Step 1: Recreate the array table
    CREATE TABLE "sections_section_name" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "description" varchar
    );

    -- Step 2: Move data back from group columns to the array table
    INSERT INTO "sections_section_name" ("_order", "_parent_id", "id", "title", "description")
    SELECT 0, id, gen_random_uuid(), "section_name_title", "section_name_description"
    FROM "sections"
    WHERE "section_name_title" IS NOT NULL;

    -- Step 3: Recreate indexes
    CREATE INDEX "sections_section_name_order_idx" ON "sections_section_name" USING btree ("_order");
    CREATE INDEX "sections_section_name_parent_id_idx" ON "sections_section_name" USING btree ("_parent_id");

    -- Step 4: Recreate foreign key
    ALTER TABLE "sections_section_name"
      ADD CONSTRAINT "sections_section_name_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;

    -- Step 5: Drop the new group columns
    ALTER TABLE "sections" DROP COLUMN "section_name_title";
    ALTER TABLE "sections" DROP COLUMN "section_name_description";
  `)
}
