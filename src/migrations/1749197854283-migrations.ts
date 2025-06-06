import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1749197854283 implements MigrationInterface {
  name = 'Migrations1749197854283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`pool_metrics\` (\`id\` varchar(36) NOT NULL, \`volumeUsd\` decimal(65,18) NOT NULL, \`feeUsd\` decimal(65,18) NOT NULL, \`tvlUsd\` decimal(65,18) NOT NULL, \`aprForLps\` decimal(65,18) NOT NULL, \`priceRatio\` decimal(65,18) NOT NULL, \`liquidity\` decimal(65,18) NOT NULL, \`bucketStart\` timestamp NOT NULL, \`timestamp\` timestamp NOT NULL, \`pool_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`swaps\` (\`id\` varchar(36) NOT NULL, \`sender\` varchar(42) NOT NULL, \`recipient\` varchar(42) NOT NULL, \`token_in_address\` varchar(42) NOT NULL, \`amount_in\` decimal(38,18) NOT NULL, \`amount_out\` decimal(38,18) NOT NULL, \`tx_hash\` varchar(66) NOT NULL, \`timestamp\` timestamp NOT NULL, \`pool_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`token_price\` (\`id\` varchar(36) NOT NULL, \`priceUsd\` decimal(38,18) NOT NULL, \`timestamp\` timestamp NOT NULL, \`token_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tokens\` (\`id\` varchar(36) NOT NULL, \`address\` varchar(42) NOT NULL, \`symbol\` varchar(20) NULL, \`name\` varchar(100) NULL, \`decimals\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_8887c0fb937bc0e9dc36cb62f3\` (\`address\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`pools\` (\`id\` varchar(36) NOT NULL, \`address\` varchar(42) NOT NULL, \`fee_tier\` int NOT NULL, \`tick_spacing\` int NOT NULL, \`hook_address\` varchar(42) NULL, \`initialized\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`token0_id\` varchar(36) NULL, \`token1_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_8f9d6a1e9ca7c169ba22b77d0e\` (\`address\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`liquidity_events\` (\`id\` varchar(36) NOT NULL, \`type\` enum ('MINT', 'BURN') NOT NULL, \`liquidity_amount\` decimal(38,18) NOT NULL, \`amount0\` decimal(38,18) NOT NULL, \`amount1\` decimal(38,18) NOT NULL, \`tx_hash\` varchar(66) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`position_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`positions\` (\`id\` varchar(36) NOT NULL, \`owner_address\` varchar(42) NOT NULL, \`tick_lower\` int NOT NULL, \`tick_upper\` int NOT NULL, \`liquidity_amount\` decimal(38,18) NOT NULL, \`fee_growth0\` decimal(38,18) NOT NULL DEFAULT '0.000000000000000000', \`fee_growth1\` decimal(38,18) NOT NULL DEFAULT '0.000000000000000000', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`pool_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`kyc_profiles\` (\`id\` varchar(36) NOT NULL, \`full_name\` varchar(255) NOT NULL, \`document_type\` enum ('passport', 'id_card', 'driver_license') NOT NULL, \`document_number\` varchar(100) NOT NULL, \`document_front_image_url\` text NULL, \`document_back_image_url\` text NULL, \`verification_outcome\` enum ('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending', \`review_notes\` text NULL, \`reviewed_at\` timestamp NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NULL, UNIQUE INDEX \`REL_7e386a6324a0e96ca89a27afec\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`wallet_address\` varchar(42) NOT NULL, \`encrypted_private_key\` text NULL, \`authMethod\` enum ('wallet', 'google', 'facebook') NOT NULL, \`email\` varchar(255) NULL, \`facebook_id\` varchar(255) NULL, \`kyc_status\` enum ('none', 'pending', 'approved', 'rejected') NOT NULL DEFAULT 'none', \`banned_until\` timestamp NULL, \`ban_reason\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_196ef3e52525d3cd9e203bdb1d\` (\`wallet_address\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_bans\` (\`id\` varchar(36) NOT NULL, \`banned_by\` varchar(255) NULL, \`reason\` text NULL, \`start_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`end_at\` timestamp NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pool_metrics\` ADD CONSTRAINT \`FK_fb624a3965eaa9a97555776b621\` FOREIGN KEY (\`pool_id\`) REFERENCES \`pools\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`swaps\` ADD CONSTRAINT \`FK_3b2305a183c3c48fbd702f4e0d0\` FOREIGN KEY (\`pool_id\`) REFERENCES \`pools\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`swaps\` ADD CONSTRAINT \`FK_d8539933d1cc699cf4f7e701e67\` FOREIGN KEY (\`sender\`) REFERENCES \`users\`(\`wallet_address\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`swaps\` ADD CONSTRAINT \`FK_f3c77789bc9ae62c10df78d3d7b\` FOREIGN KEY (\`recipient\`) REFERENCES \`users\`(\`wallet_address\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`token_price\` ADD CONSTRAINT \`FK_cd060cfc0599a02dc0700e974ad\` FOREIGN KEY (\`token_id\`) REFERENCES \`tokens\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pools\` ADD CONSTRAINT \`FK_7e3b2e9c356a0762bc64e280f5e\` FOREIGN KEY (\`token0_id\`) REFERENCES \`tokens\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pools\` ADD CONSTRAINT \`FK_7c546065bdf3d8bc850034ac9f9\` FOREIGN KEY (\`token1_id\`) REFERENCES \`tokens\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`liquidity_events\` ADD CONSTRAINT \`FK_db4bd82edcec14062f99365a92e\` FOREIGN KEY (\`position_id\`) REFERENCES \`positions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`positions\` ADD CONSTRAINT \`FK_5185f518d0c21270fc0de400683\` FOREIGN KEY (\`pool_id\`) REFERENCES \`pools\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`positions\` ADD CONSTRAINT \`FK_d79183b4041988bcdb4d5306325\` FOREIGN KEY (\`owner_address\`) REFERENCES \`users\`(\`wallet_address\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` ADD CONSTRAINT \`FK_7e386a6324a0e96ca89a27afecb\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_bans\` ADD CONSTRAINT \`FK_a142c9954b2fd911b3e7ea8c307\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_bans\` DROP FOREIGN KEY \`FK_a142c9954b2fd911b3e7ea8c307\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`kyc_profiles\` DROP FOREIGN KEY \`FK_7e386a6324a0e96ca89a27afecb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`positions\` DROP FOREIGN KEY \`FK_d79183b4041988bcdb4d5306325\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`positions\` DROP FOREIGN KEY \`FK_5185f518d0c21270fc0de400683\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`liquidity_events\` DROP FOREIGN KEY \`FK_db4bd82edcec14062f99365a92e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`pools\` DROP FOREIGN KEY \`FK_7c546065bdf3d8bc850034ac9f9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`pools\` DROP FOREIGN KEY \`FK_7e3b2e9c356a0762bc64e280f5e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`token_price\` DROP FOREIGN KEY \`FK_cd060cfc0599a02dc0700e974ad\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`swaps\` DROP FOREIGN KEY \`FK_f3c77789bc9ae62c10df78d3d7b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`swaps\` DROP FOREIGN KEY \`FK_d8539933d1cc699cf4f7e701e67\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`swaps\` DROP FOREIGN KEY \`FK_3b2305a183c3c48fbd702f4e0d0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`pool_metrics\` DROP FOREIGN KEY \`FK_fb624a3965eaa9a97555776b621\``,
    );
    await queryRunner.query(`DROP TABLE \`user_bans\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_196ef3e52525d3cd9e203bdb1d\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(
      `DROP INDEX \`REL_7e386a6324a0e96ca89a27afec\` ON \`kyc_profiles\``,
    );
    await queryRunner.query(`DROP TABLE \`kyc_profiles\``);
    await queryRunner.query(`DROP TABLE \`positions\``);
    await queryRunner.query(`DROP TABLE \`liquidity_events\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_8f9d6a1e9ca7c169ba22b77d0e\` ON \`pools\``,
    );
    await queryRunner.query(`DROP TABLE \`pools\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_8887c0fb937bc0e9dc36cb62f3\` ON \`tokens\``,
    );
    await queryRunner.query(`DROP TABLE \`tokens\``);
    await queryRunner.query(`DROP TABLE \`token_price\``);
    await queryRunner.query(`DROP TABLE \`swaps\``);
    await queryRunner.query(`DROP TABLE \`pool_metrics\``);
  }
}
