import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id?: number;



  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  type?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  company_name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  company_logo?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  account_type?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  otp?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: 'false' })
  is_sent_otp?: string;

  @Column({ type: 'text', nullable: true })
  slug?: string;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  surf_name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emergency_number?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  date_of_birth?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address_1?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address_2?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address_3?: string;

    @Column({ type: 'text', nullable: true })
  company_address?: string;

  @Column({ type: 'text', nullable: true })
  small_description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
  county?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  country?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  postcode?: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: 'active' })
  status?: string;

  @Column({ type: 'text', nullable: true })
  encrypt_password?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  remember_token?: string;

  @Column({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at?: Date;
}
