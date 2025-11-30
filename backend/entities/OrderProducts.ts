import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./Order";

@Entity('order_products')
export class OrderProducts {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  order_id?: string;


  
  @Column({ type: 'varchar', length: 255, nullable: true })
  product_name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  product_qty?: string;

   @Column({ type: 'varchar', length: 255, nullable: true })
   product_price?: string;
    
  @Column({ type: 'varchar', length: 255, nullable: true })
  status?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
