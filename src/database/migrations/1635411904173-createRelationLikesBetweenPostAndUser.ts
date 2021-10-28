import {MigrationInterface, QueryRunner} from "typeorm";

export class createRelationLikesBetweenPostAndUser1635411904173 implements MigrationInterface {
    name = 'createRelationLikesBetweenPostAndUser1635411904173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_likes_posts" ("usersId" uuid NOT NULL, "postsId" uuid NOT NULL, CONSTRAINT "PK_f27ba1d3ccf3231afc39c8c8ccd" PRIMARY KEY ("usersId", "postsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_477edeb6e0a0eea4e6fa312822" ON "users_likes_posts" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_df62e7391693eb4bbb6cef23e5" ON "users_likes_posts" ("postsId") `);
        await queryRunner.query(`ALTER TABLE "users_likes_posts" ADD CONSTRAINT "FK_477edeb6e0a0eea4e6fa312822e" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_likes_posts" ADD CONSTRAINT "FK_df62e7391693eb4bbb6cef23e51" FOREIGN KEY ("postsId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_likes_posts" DROP CONSTRAINT "FK_df62e7391693eb4bbb6cef23e51"`);
        await queryRunner.query(`ALTER TABLE "users_likes_posts" DROP CONSTRAINT "FK_477edeb6e0a0eea4e6fa312822e"`);
        await queryRunner.query(`DROP INDEX "IDX_df62e7391693eb4bbb6cef23e5"`);
        await queryRunner.query(`DROP INDEX "IDX_477edeb6e0a0eea4e6fa312822"`);
        await queryRunner.query(`DROP TABLE "users_likes_posts"`);
    }

}
