import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1749466783884 implements MigrationInterface {
  name = 'Migrations1749466783884';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` DROP COLUMN \`document_back_image_url\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` DROP COLUMN \`document_front_image_url\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` ADD \`document_front_image\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` ADD \`document_back_image\` text NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` DROP COLUMN \`document_back_image\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` DROP COLUMN \`document_front_image\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` ADD \`document_front_image_url\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` ADD \`document_back_image_url\` text NULL`,
    );
  }
}
