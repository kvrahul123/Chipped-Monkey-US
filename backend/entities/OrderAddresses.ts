import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('order_addresses')
export class OrderAddresses {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'int', nullable: true })
  user_id?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone_number?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  county?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  country?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pincode?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  status?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at?: Date;
}
