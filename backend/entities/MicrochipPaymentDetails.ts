import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity("microchip_payment_details")
export class MicrochipPaymentDetails {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id!: number;

  @Column({ type: "int", nullable: true })
  microchip_order_id!: number | null;


  @Column({ type: "varchar", length: 255, nullable: true })
  microchip_id!: string | null;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  amount!: number | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  status!: string | null;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;
}
