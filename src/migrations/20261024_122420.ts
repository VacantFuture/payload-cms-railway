import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" DROP COLUMN "card_author";
  ALTER TABLE "articles" DROP COLUMN "display_date";
  ALTER TABLE "articles" DROP COLUMN "card_tag";
  ALTER TABLE "_articles_v" DROP COLUMN "version_card_author";
  ALTER TABLE "_articles_v" DROP COLUMN "version_display_date";
  ALTER TABLE "_articles_v" DROP COLUMN "version_card_tag";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" ADD COLUMN "card_author" varchar;
  ALTER TABLE "articles" ADD COLUMN "display_date" varchar;
  ALTER TABLE "articles" ADD COLUMN "card_tag" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_card_author" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_display_date" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_card_tag" varchar;`)
}
