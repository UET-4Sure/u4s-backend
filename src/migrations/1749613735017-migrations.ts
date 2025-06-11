import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1749613735017 implements MigrationInterface {
  name = 'Migrations1749613735017';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` DROP COLUMN \`full_name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` DROP COLUMN \`document_front_image\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` ADD \`document_front_image\` longtext NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` DROP COLUMN \`document_back_image\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` ADD \`document_back_image\` longtext NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` DROP COLUMN \`document_back_image\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` ADD \`document_back_image\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` DROP COLUMN \`document_front_image\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` ADD \`document_front_image\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` ADD \`full_name\` varchar(255) NOT NULL`,
    );
  }
}
