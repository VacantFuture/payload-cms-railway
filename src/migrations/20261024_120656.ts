import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" DROP COLUMN "excerpt";
  ALTER TABLE "_articles_v" DROP COLUMN "version_excerpt";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" ADD COLUMN "excerpt" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_excerpt" varchar;`)
}
