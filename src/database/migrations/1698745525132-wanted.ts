import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wanted1698745525132 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`users\`
                             (
                                 \`id\`                    bigint unsigned                                               NOT NULL AUTO_INCREMENT,
                                 \`username\`              varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                                 \`password\`              varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                                 \`email\`                 varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                                 \`is_recommend_notified\` tinyint(1)                                                    NOT NULL DEFAULT '0',
                                 \`is_expense_notified\`   tinyint(1)                                                    NOT NULL DEFAULT '0',
                                 \`created_at\`            timestamp                                                     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 \`updated_at\`            timestamp                                                     NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                 PRIMARY KEY (\`id\`),
                                 UNIQUE KEY \`username\` (\`username\`)
                             ) ENGINE = InnoDB
                               DEFAULT CHARSET = utf8mb4
                               COLLATE = utf8mb4_unicode_ci;`);
    await queryRunner.query(`CREATE TABLE \`categories\`
                             (
                                 \`id\`         bigint unsigned                         NOT NULL AUTO_INCREMENT,
                                 \`type\`       varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                                 \`created_at\` timestamp                               NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 \`updated_at\` timestamp                               NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                 PRIMARY KEY (\`id\`),
                                 UNIQUE KEY \`type\` (\`type\`)
                             ) ENGINE = InnoDB
                               DEFAULT CHARSET = utf8mb4
                               COLLATE = utf8mb4_unicode_ci;`);
    await queryRunner.query(`CREATE TABLE \`budget\`
                             (
                                 \`id\`          bigint unsigned                            NOT NULL AUTO_INCREMENT,
                                 \`user_id\`     bigint unsigned                            NOT NULL,
                                 \`category_id\` bigint unsigned                            NOT NULL,
                                 \`amount\`      bigint unsigned COLLATE utf8mb4_unicode_ci NOT NULL,
                                 \`created_at\`  timestamp                                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 \`updated_at\`  timestamp                                  NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                 PRIMARY KEY (\`id\`),
                                 CONSTRAINT \`budget_FK_01\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT,
                                 CONSTRAINT \`budget_FK_02\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT
                             ) ENGINE = InnoDB
                               DEFAULT CHARSET = utf8mb4
                               COLLATE = utf8mb4_unicode_ci;`);
    await queryRunner.query(`CREATE TABLE \`expenses\`
                             (
                                 \`id\`          bigint unsigned                            NOT NULL AUTO_INCREMENT,
                                 \`user_id\`     bigint unsigned                            NOT NULL,
                                 \`category_id\` bigint unsigned                            NOT NULL,
                                 \`date\`        timestamp                                  NOT NULL,
                                 \`amount\`      bigint unsigned COLLATE utf8mb4_unicode_ci NOT NULL,
                                 \`location\`    varchar(100) COLLATE utf8mb4_unicode_ci    NOT NULL,
                                 \`content\`     varchar(255) COLLATE utf8mb4_unicode_ci    NOT NULL,
                                 \`is_exclude\`  tinyint(1)                                 NOT NULL DEFAULT '0',
                                 \`created_at\`  timestamp                                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 \`updated_at\`  timestamp                                  NULL     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                 PRIMARY KEY (\`id\`),
                                 CONSTRAINT \`expenses_FK_01\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT,
                                 CONSTRAINT \`expenses_FK_02\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT
                             ) ENGINE = InnoDB
                               DEFAULT CHARSET = utf8mb4
                               COLLATE = utf8mb4_unicode_ci;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`budget\`
          DROP FOREIGN KEY \`budget_FK_01\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`budget\`
          DROP FOREIGN KEY \`budget_FK_02\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`expenses\`
          DROP FOREIGN KEY \`expenses_FK_01\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`expenses\`
          DROP FOREIGN KEY \`expenses_FK_02\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`categories\``);
    await queryRunner.query(`DROP TABLE \`budget\``);
    await queryRunner.query(`DROP TABLE \`expenses\``);
  }
}
