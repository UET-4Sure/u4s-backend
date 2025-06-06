import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1749185121237 implements MigrationInterface {
    name = 'Migrations1749185121237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pool_metrics\` CHANGE \`volumeUsd\` \`volumeUsd\` decimal(65,18) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pool_metrics\` CHANGE \`feeUsd\` \`feeUsd\` decimal(65,18) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pool_metrics\` CHANGE \`tvlUsd\` \`tvlUsd\` decimal(65,18) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pool_metrics\` CHANGE \`aprForLps\` \`aprForLps\` decimal(65,18) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pool_metrics\` CHANGE \`priceRatio\` \`priceRatio\` decimal(65,18) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pool_metrics\` CHANGE \`liquidity\` \`liquidity\` decimal(65,18) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pool_metrics\` CHANGE \`liquidity\` \`liquidity\` decimal(38,18) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pool_metrics\` CHANGE \`priceRatio\` \`priceRatio\` decimal(38,18) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pool_metrics\` CHANGE \`aprForLps\` \`aprForLps\` decimal(38,18) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pool_metrics\` CHANGE \`tvlUsd\` \`tvlUsd\` decimal(38,18) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pool_metrics\` CHANGE \`feeUsd\` \`feeUsd\` decimal(38,18) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pool_metrics\` CHANGE \`volumeUsd\` \`volumeUsd\` decimal(38,18) NOT NULL`);
    }

}
