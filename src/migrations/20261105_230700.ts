import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" ADD COLUMN "author_role" varchar;
  ALTER TABLE "articles" ADD COLUMN "author_affiliation" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_author_role" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_author_affiliation" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" DROP COLUMN "author_role";
  ALTER TABLE "articles" DROP COLUMN "author_affiliation";
  ALTER TABLE "_articles_v" DROP COLUMN "version_author_role";
  ALTER TABLE "_articles_v" DROP COLUMN "version_author_affiliation";`)
}
