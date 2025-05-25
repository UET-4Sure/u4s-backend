import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748181653275 implements MigrationInterface {
    name = 'Migrations1748181653275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tokens\` (\`id\` varchar(36) NOT NULL, \`address\` varchar(42) NOT NULL, \`symbol\` varchar(20) NULL, \`name\` varchar(100) NULL, \`decimals\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_8887c0fb937bc0e9dc36cb62f3\` (\`address\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`swaps\` (\`id\` varchar(36) NOT NULL, \`sender\` varchar(42) NOT NULL, \`recipient\` varchar(42) NOT NULL, \`amount_in\` decimal(38,18) NOT NULL, \`amount_out\` decimal(38,18) NOT NULL, \`sqrt_price_x96\` decimal(38,18) NOT NULL, \`liquidity\` decimal(38,18) NOT NULL, \`tick\` int NOT NULL, \`tx_hash\` varchar(66) NOT NULL, \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`pool_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`liquidity_events\` (\`id\` varchar(36) NOT NULL, \`event_type\` enum ('mint', 'burn') NOT NULL, \`amount\` decimal(38,18) NOT NULL, \`amount0\` decimal(38,18) NOT NULL, \`amount1\` decimal(38,18) NOT NULL, \`tx_hash\` varchar(66) NOT NULL, \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`position_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`positions\` (\`id\` varchar(36) NOT NULL, \`owner_address\` varchar(42) NOT NULL, \`tick_lower\` int NOT NULL, \`tick_upper\` int NOT NULL, \`liquidity_amount\` decimal(38,18) NOT NULL, \`fee_growth0\` decimal(38,18) NOT NULL DEFAULT '0.000000000000000000', \`fee_growth1\` decimal(38,18) NOT NULL DEFAULT '0.000000000000000000', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`pool_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pool_ticks\` (\`pool_id\` varchar(255) NOT NULL, \`tick_index\` int NOT NULL, \`liquidity_gross\` decimal(38,18) NOT NULL DEFAULT '0.000000000000000000', \`liquidity_net\` decimal(38,18) NOT NULL DEFAULT '0.000000000000000000', PRIMARY KEY (\`pool_id\`, \`tick_index\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pools\` (\`id\` varchar(36) NOT NULL, \`fee_tier\` int NOT NULL, \`tick_spacing\` int NOT NULL, \`hook_address\` varchar(42) NULL, \`initialized\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`token0_id\` varchar(36) NULL, \`token1_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`flash_callbacks\` (\`id\` varchar(36) NOT NULL, \`caller\` varchar(42) NOT NULL, \`amount0_delta\` decimal(38,18) NOT NULL, \`amount1_delta\` decimal(38,18) NOT NULL, \`fee0\` decimal(38,18) NOT NULL, \`fee1\` decimal(38,18) NOT NULL, \`tx_hash\` varchar(66) NOT NULL, \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`pool_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`swaps\` ADD CONSTRAINT \`FK_3b2305a183c3c48fbd702f4e0d0\` FOREIGN KEY (\`pool_id\`) REFERENCES \`pools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`liquidity_events\` ADD CONSTRAINT \`FK_db4bd82edcec14062f99365a92e\` FOREIGN KEY (\`position_id\`) REFERENCES \`positions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`positions\` ADD CONSTRAINT \`FK_5185f518d0c21270fc0de400683\` FOREIGN KEY (\`pool_id\`) REFERENCES \`pools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pool_ticks\` ADD CONSTRAINT \`FK_75fcf044f62b67a32c1db76e1cf\` FOREIGN KEY (\`pool_id\`) REFERENCES \`pools\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pools\` ADD CONSTRAINT \`FK_7e3b2e9c356a0762bc64e280f5e\` FOREIGN KEY (\`token0_id\`) REFERENCES \`tokens\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pools\` ADD CONSTRAINT \`FK_7c546065bdf3d8bc850034ac9f9\` FOREIGN KEY (\`token1_id\`) REFERENCES \`tokens\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`flash_callbacks\` ADD CONSTRAINT \`FK_fd0cc8ad2a14ee0fb027e4a39dd\` FOREIGN KEY (\`pool_id\`) REFERENCES \`pools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`flash_callbacks\` DROP FOREIGN KEY \`FK_fd0cc8ad2a14ee0fb027e4a39dd\``);
        await queryRunner.query(`ALTER TABLE \`pools\` DROP FOREIGN KEY \`FK_7c546065bdf3d8bc850034ac9f9\``);
        await queryRunner.query(`ALTER TABLE \`pools\` DROP FOREIGN KEY \`FK_7e3b2e9c356a0762bc64e280f5e\``);
        await queryRunner.query(`ALTER TABLE \`pool_ticks\` DROP FOREIGN KEY \`FK_75fcf044f62b67a32c1db76e1cf\``);
        await queryRunner.query(`ALTER TABLE \`positions\` DROP FOREIGN KEY \`FK_5185f518d0c21270fc0de400683\``);
        await queryRunner.query(`ALTER TABLE \`liquidity_events\` DROP FOREIGN KEY \`FK_db4bd82edcec14062f99365a92e\``);
        await queryRunner.query(`ALTER TABLE \`swaps\` DROP FOREIGN KEY \`FK_3b2305a183c3c48fbd702f4e0d0\``);
        await queryRunner.query(`DROP TABLE \`flash_callbacks\``);
        await queryRunner.query(`DROP TABLE \`pools\``);
        await queryRunner.query(`DROP TABLE \`pool_ticks\``);
        await queryRunner.query(`DROP TABLE \`positions\``);
        await queryRunner.query(`DROP TABLE \`liquidity_events\``);
        await queryRunner.query(`DROP TABLE \`swaps\``);
        await queryRunner.query(`DROP INDEX \`IDX_8887c0fb937bc0e9dc36cb62f3\` ON \`tokens\``);
        await queryRunner.query(`DROP TABLE \`tokens\``);
    }

}
