import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "generate_slug" boolean DEFAULT true;
  ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_generate_slug" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" DROP COLUMN IF EXISTS "generate_slug";
  ALTER TABLE "_articles_v" DROP COLUMN IF EXISTS "version_generate_slug";`)
}
