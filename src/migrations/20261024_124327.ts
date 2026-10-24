import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "author_role" varchar;
  ALTER TABLE "users" ADD COLUMN "author_affiliation" varchar;
  ALTER TABLE "articles" DROP COLUMN "category";
  ALTER TABLE "articles" DROP COLUMN "author_role";
  ALTER TABLE "articles" DROP COLUMN "author_affiliation";
  ALTER TABLE "articles" DROP COLUMN "author_url";
  ALTER TABLE "articles" DROP COLUMN "published_at";
  ALTER TABLE "articles" DROP COLUMN "image_aspect";
  ALTER TABLE "_articles_v" DROP COLUMN "version_category";
  ALTER TABLE "_articles_v" DROP COLUMN "version_author_role";
  ALTER TABLE "_articles_v" DROP COLUMN "version_author_affiliation";
  ALTER TABLE "_articles_v" DROP COLUMN "version_author_url";
  ALTER TABLE "_articles_v" DROP COLUMN "version_published_at";
  ALTER TABLE "_articles_v" DROP COLUMN "version_image_aspect";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" ADD COLUMN "category" varchar;
  ALTER TABLE "articles" ADD COLUMN "author_role" varchar;
  ALTER TABLE "articles" ADD COLUMN "author_affiliation" varchar;
  ALTER TABLE "articles" ADD COLUMN "author_url" varchar;
  ALTER TABLE "articles" ADD COLUMN "published_at" timestamp(3) with time zone;
  ALTER TABLE "articles" ADD COLUMN "image_aspect" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_category" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_author_role" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_author_affiliation" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_author_url" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_published_at" timestamp(3) with time zone;
  ALTER TABLE "_articles_v" ADD COLUMN "version_image_aspect" varchar;
  ALTER TABLE "users" DROP COLUMN "author_role";
  ALTER TABLE "users" DROP COLUMN "author_affiliation";`)
}
