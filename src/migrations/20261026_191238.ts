import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" DROP COLUMN "reading_time";
  ALTER TABLE "_articles_v" DROP COLUMN "version_reading_time";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" ADD COLUMN "reading_time" numeric;
  ALTER TABLE "_articles_v" ADD COLUMN "version_reading_time" numeric;`)
}
