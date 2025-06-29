import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1751175858739 implements MigrationInterface {
    name = 'Migrations1751175858739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`kyc_profiles\` ADD \`token_id\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`kyc_profiles\` DROP COLUMN \`token_id\``);
    }

}
