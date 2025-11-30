import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OrderProducts } from "./OrderProducts";

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  order_id?: string;

  @Column({ type: 'text', nullable: true })
  vendorTxCode?: string;
  

  @Column({ type: 'bigint', nullable: true })
  user_id?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  date?: string;

  @Column({ type: 'bigint', nullable: true })
  phone_number?: number;

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

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  total_amount?: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  discount_amount?: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  tax_amount?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  payment_status?: string;

  
  @Column({ type: 'text', nullable: true })
  payment_encrypted_response?: string | null;
    @Column({ type: 'text', nullable: true })
  payment_response?: string;

  
  @Column({ type: 'varchar', length: 255, nullable: true })
  payment_type?: string;

  
  @Column({ type: 'varchar', length: 255, nullable: true })
  status?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
