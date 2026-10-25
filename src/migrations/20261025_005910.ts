import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "media_title" varchar;
   UPDATE "media" SET "media_title" = COALESCE(NULLIF("alt", ''), NULLIF("filename", ''), 'Untitled') WHERE "media_title" IS NULL;
   ALTER TABLE "media" ALTER COLUMN "media_title" SET NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP COLUMN IF EXISTS "media_title";`)
}
