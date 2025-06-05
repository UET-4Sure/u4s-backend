import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1748763799761 implements MigrationInterface {
  name = 'Migrations1748763799761';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`swaps\` DROP FOREIGN KEY \`FK_3b2305a183c3c48fbd702f4e0d0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`positions\` DROP FOREIGN KEY \`FK_5185f518d0c21270fc0de400683\``,
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
      `ALTER TABLE \`swaps\` CHANGE \`pool_id\` \`pool_id\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pool_metrics\` CHANGE \`tvl_usd\` \`tvl_usd\` decimal(38,18) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pool_metrics\` CHANGE \`volume_24h_usd\` \`volume_24h_usd\` decimal(38,18) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pool_metrics\` CHANGE \`fees_24h_usd\` \`fees_24h_usd\` decimal(38,18) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pool_metrics\` CHANGE \`apr_for_lps\` \`apr_for_lps\` decimal(10,4) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pool_metrics\` CHANGE \`price_ratio\` \`price_ratio\` decimal(38,18) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pool_metrics\` CHANGE \`liquidity\` \`liquidity\` decimal(38,18) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`positions\` CHANGE \`pool_id\` \`pool_id\` varchar(36) NOT NULL`,
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
      `ALTER TABLE \`swaps\` DROP FOREIGN KEY \`FK_f3c77789bc9ae62c10df78d3d7b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`swaps\` DROP FOREIGN KEY \`FK_d8539933d1cc699cf4f7e701e67\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`swaps\` DROP FOREIGN KEY \`FK_3b2305a183c3c48fbd702f4e0d0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`positions\` CHANGE \`pool_id\` \`pool_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pool_metrics\` CHANGE \`liquidity\` \`liquidity\` decimal(38,18) NOT NULL DEFAULT '0.000000000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pool_metrics\` CHANGE \`price_ratio\` \`price_ratio\` decimal(38,18) NOT NULL DEFAULT '0.000000000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pool_metrics\` CHANGE \`apr_for_lps\` \`apr_for_lps\` decimal(10,4) NOT NULL DEFAULT '0.0000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pool_metrics\` CHANGE \`fees_24h_usd\` \`fees_24h_usd\` decimal(38,18) NOT NULL DEFAULT '0.000000000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pool_metrics\` CHANGE \`volume_24h_usd\` \`volume_24h_usd\` decimal(38,18) NOT NULL DEFAULT '0.000000000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pool_metrics\` CHANGE \`tvl_usd\` \`tvl_usd\` decimal(38,18) NOT NULL DEFAULT '0.000000000000000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`swaps\` CHANGE \`pool_id\` \`pool_id\` varchar(36) NULL`,
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
    await queryRunner.query(
      `ALTER TABLE \`positions\` ADD CONSTRAINT \`FK_5185f518d0c21270fc0de400683\` FOREIGN KEY (\`pool_id\`) REFERENCES \`pools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`swaps\` ADD CONSTRAINT \`FK_3b2305a183c3c48fbd702f4e0d0\` FOREIGN KEY (\`pool_id\`) REFERENCES \`pools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
