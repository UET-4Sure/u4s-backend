import { Position } from 'src/modules/position/entities/position.entity';
import { Swap } from 'src/modules/swap/entities/swap.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KycProfile } from './kyc_profile.entity';

export enum AuthMethod {
  WALLET = 'wallet', // user signed in via wallet signature
  GOOGLE = 'google', // user signed in via Google OAuth
  FACEBOOK = 'facebook', // user signed in via Facebook OAuth
}

export enum KycStatus {
  NONE = 'none', // user never submitted KYC
  PENDING = 'pending', // user has submitted, waiting for review
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 42,
    name: 'wallet_address',
    unique: true,
  })
  walletAddress: string;

  @Column({
    type: 'text',
    name: 'encrypted_private_key',
    nullable: true,
  })
  encryptedPrivateKey: string | null;

  @Column({
    type: 'enum',
    enum: AuthMethod,
  })
  authMethod: AuthMethod;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 255, name: 'facebook_id', nullable: true })
  facebookId: string | null;

  @Column({
    type: 'enum',
    enum: KycStatus,
    default: KycStatus.NONE,
    name: 'kyc_status',
  })
  kycStatus: KycStatus;

  @Column({ type: 'timestamp', name: 'banned_until', nullable: true })
  bannedUntil: Date | null;

  @Column({ type: 'varchar', length: 255, name: 'ban_reason', nullable: true })
  banReason: string | null;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => KycProfile, (kyc) => kyc.user, { cascade: true })
  kycProfile: KycProfile;

  @OneToMany(() => Position, (pos) => pos.user)
  positions: Position[];

  @OneToMany(() => Swap, (sw) => sw.userSender)
  swapsSent: Swap[];

  @OneToMany(() => Swap, (sw) => sw.userRecipient)
  swapsReceived: Swap[];
}
