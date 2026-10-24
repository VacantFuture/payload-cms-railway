import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "articles_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "_articles_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "articles" ADD COLUMN "slug" varchar;
  ALTER TABLE "articles" ADD COLUMN "deck" varchar;
  ALTER TABLE "articles" ADD COLUMN "category" varchar;
  ALTER TABLE "articles" ADD COLUMN "author_role" varchar;
  ALTER TABLE "articles" ADD COLUMN "author_affiliation" varchar;
  ALTER TABLE "articles" ADD COLUMN "author_url" varchar;
  ALTER TABLE "articles" ADD COLUMN "published_at" timestamp(3) with time zone;
  ALTER TABLE "articles" ADD COLUMN "reading_time" numeric;
  ALTER TABLE "articles" ADD COLUMN "image_aspect" varchar;
  ALTER TABLE "articles" ADD COLUMN "card_author" varchar;
  ALTER TABLE "articles" ADD COLUMN "display_date" varchar;
  ALTER TABLE "articles" ADD COLUMN "card_tag" varchar;
  ALTER TABLE "articles" ADD COLUMN "order" numeric;
  ALTER TABLE "articles" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "_articles_v" ADD COLUMN "version_slug" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_deck" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_category" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_author_role" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_author_affiliation" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_author_url" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_published_at" timestamp(3) with time zone;
  ALTER TABLE "_articles_v" ADD COLUMN "version_reading_time" numeric;
  ALTER TABLE "_articles_v" ADD COLUMN "version_image_aspect" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_card_author" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_display_date" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_card_tag" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_order" numeric;
  ALTER TABLE "_articles_v" ADD COLUMN "version_featured" boolean DEFAULT false;
  ALTER TABLE "articles_tags" ADD CONSTRAINT "articles_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_tags" ADD CONSTRAINT "_articles_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_tags_order_idx" ON "articles_tags" USING btree ("_order");
  CREATE INDEX "articles_tags_parent_id_idx" ON "articles_tags" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_version_tags_order_idx" ON "_articles_v_version_tags" USING btree ("_order");
  CREATE INDEX "_articles_v_version_tags_parent_id_idx" ON "_articles_v_version_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v_version_tags" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "articles_tags" CASCADE;
  DROP TABLE "_articles_v_version_tags" CASCADE;
  DROP INDEX "articles_slug_idx";
  DROP INDEX "_articles_v_version_version_slug_idx";
  ALTER TABLE "articles" DROP COLUMN "slug";
  ALTER TABLE "articles" DROP COLUMN "deck";
  ALTER TABLE "articles" DROP COLUMN "category";
  ALTER TABLE "articles" DROP COLUMN "author_role";
  ALTER TABLE "articles" DROP COLUMN "author_affiliation";
  ALTER TABLE "articles" DROP COLUMN "author_url";
  ALTER TABLE "articles" DROP COLUMN "published_at";
  ALTER TABLE "articles" DROP COLUMN "reading_time";
  ALTER TABLE "articles" DROP COLUMN "image_aspect";
  ALTER TABLE "articles" DROP COLUMN "card_author";
  ALTER TABLE "articles" DROP COLUMN "display_date";
  ALTER TABLE "articles" DROP COLUMN "card_tag";
  ALTER TABLE "articles" DROP COLUMN "order";
  ALTER TABLE "articles" DROP COLUMN "featured";
  ALTER TABLE "_articles_v" DROP COLUMN "version_slug";
  ALTER TABLE "_articles_v" DROP COLUMN "version_deck";
  ALTER TABLE "_articles_v" DROP COLUMN "version_category";
  ALTER TABLE "_articles_v" DROP COLUMN "version_author_role";
  ALTER TABLE "_articles_v" DROP COLUMN "version_author_affiliation";
  ALTER TABLE "_articles_v" DROP COLUMN "version_author_url";
  ALTER TABLE "_articles_v" DROP COLUMN "version_published_at";
  ALTER TABLE "_articles_v" DROP COLUMN "version_reading_time";
  ALTER TABLE "_articles_v" DROP COLUMN "version_image_aspect";
  ALTER TABLE "_articles_v" DROP COLUMN "version_card_author";
  ALTER TABLE "_articles_v" DROP COLUMN "version_display_date";
  ALTER TABLE "_articles_v" DROP COLUMN "version_card_tag";
  ALTER TABLE "_articles_v" DROP COLUMN "version_order";
  ALTER TABLE "_articles_v" DROP COLUMN "version_featured";`)
}
