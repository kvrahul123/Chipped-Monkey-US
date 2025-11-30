import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum OrderStatus {
  PENDING = "pending",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

@Entity('microchip_orders')
export class MicrochipOrders {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  order_id?: string;

  @Column({ type: 'int', nullable: true })
  user_id?: number;

  @Column({ type: 'int', nullable: true })
  microchip_count?: number;

  @Column({ type: 'date', nullable: true })
  date?: string;

  @Column({ type: 'enum', enum: OrderStatus, nullable: true, default: OrderStatus.PENDING })
  status?: OrderStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}
