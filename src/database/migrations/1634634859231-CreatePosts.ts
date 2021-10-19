import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePosts1634634859231 implements MigrationInterface {
  name = 'CreatePosts1634634859231';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "posts"
                              (
                                  "id"          uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                  "slug"        character varying NOT NULL,
                                  "title"       character varying NOT NULL DEFAULT '',
                                  "description" character varying NOT NULL DEFAULT '',
                                  "createdAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                                  "updatedAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                                  "tagList"     text              NOT NULL,
                                  "nbrLikes"    integer           NOT NULL DEFAULT '0',
                                  CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id")
                              )`);
    await queryRunner.query(`ALTER TABLE "public"."users"
        ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."users"
        DROP COLUMN "createdAt"`);
    await queryRunner.query(`DROP TABLE "posts"`);
  }
}
