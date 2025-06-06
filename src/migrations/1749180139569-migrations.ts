import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1749180139569 implements MigrationInterface {
    name = 'Migrations1749180139569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`pool_metrics\` (\`id\` varchar(36) NOT NULL, \`volumeUsd\` decimal(38,18) NOT NULL, \`feeUsd\` decimal(38,18) NOT NULL, \`tvlUsd\` decimal(38,18) NOT NULL, \`aprForLps\` decimal(38,18) NOT NULL, \`priceRatio\` decimal(38,18) NOT NULL, \`liquidity\` decimal(38,18) NOT NULL, \`bucketStart\` timestamp NOT NULL, \`timestamp\` timestamp NOT NULL, \`pool_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`swaps\` DROP COLUMN \`tick\``);
        await queryRunner.query(`ALTER TABLE \`swaps\` DROP COLUMN \`timestamp\``);
        await queryRunner.query(`ALTER TABLE \`swaps\` ADD \`timestamp\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pool_metrics\` ADD CONSTRAINT \`FK_fb624a3965eaa9a97555776b621\` FOREIGN KEY (\`pool_id\`) REFERENCES \`pools\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pool_metrics\` DROP FOREIGN KEY \`FK_fb624a3965eaa9a97555776b621\``);
        await queryRunner.query(`ALTER TABLE \`swaps\` DROP COLUMN \`timestamp\``);
        await queryRunner.query(`ALTER TABLE \`swaps\` ADD \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`swaps\` ADD \`tick\` int NOT NULL`);
        await queryRunner.query(`DROP TABLE \`pool_metrics\``);
    }

}
