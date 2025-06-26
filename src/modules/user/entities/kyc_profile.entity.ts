// src/modules/user/entities/kyc-profile.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';

export enum DocumentType {
  PASSPORT = 'passport',
  ID_CARD = 'id_card',
  DRIVER_LICENSE = 'driver_license',
}

export enum VerificationOutcome {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('kyc_profiles')
export class KycProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.kycProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: DocumentType,
    name: 'document_type',
  })
  documentType: DocumentType;

  @Column({ type: 'varchar', length: 100, name: 'document_number' })
  documentNumber: string;

  @Column({ type: 'longtext', name: 'document_front_image', nullable: true })
  documentFrontImage: string | null;

  @Column({ type: 'longtext', name: 'document_back_image', nullable: true })
  documentBackImage: string | null;

  @Column({
    type: 'enum',
    enum: VerificationOutcome,
    default: VerificationOutcome.PENDING,
    name: 'verification_outcome',
  })
  verificationOutcome: VerificationOutcome;

  @Column({ type: 'text', name: 'review_notes', nullable: true })
  reviewNotes: string | null;

  @Column({ type: 'timestamp', name: 'reviewed_at', nullable: true })
  reviewedAt: Date | null;

  @Column({ type: 'varchar', length: 255, name: 'token_id', nullable: true })
  tokenId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
