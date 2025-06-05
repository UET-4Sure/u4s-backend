// src/modules/user/entities/kyc-profile.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
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

  @Column({ type: 'varchar', length: 255, name: 'full_name' })
  fullName: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
    name: 'document_type',
  })
  documentType: DocumentType;

  @Column({ type: 'varchar', length: 100, name: 'document_number' })
  documentNumber: string;

  // If you store images of documents, you might store an S3/IPFS URL or a CID.
  @Column({ type: 'text', name: 'document_front_image_url', nullable: true })
  documentFrontImageUrl: string | null;

  @Column({ type: 'text', name: 'document_back_image_url', nullable: true })
  documentBackImageUrl: string | null;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
