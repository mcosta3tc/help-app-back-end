import { MigrationInterface, QueryRunner } from 'typeorm';

export class createRelationBetweenPostAndUser1634638190336
  implements MigrationInterface
{
  name = 'createRelationBetweenPostAndUser1634638190336';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."posts"
          ADD "content" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."posts"
          ADD "creatorId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."posts"
          ADD CONSTRAINT "FK_c07f375e63832303f0a5049b776" FOREIGN KEY ("creatorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."posts"
          DROP CONSTRAINT "FK_c07f375e63832303f0a5049b776"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."posts"
          DROP COLUMN "creatorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."posts"
          DROP COLUMN "content"`,
    );
  }
}
