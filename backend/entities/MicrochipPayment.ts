import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity("microchip_payment")
export class MicrochipPayment {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id!: number;

  @Column({ type: "text", nullable: true })
  order_id!: string | null;

   @Column({ type: "int", nullable: true })
   user_id!: number | null;
  
  @Column({ type: "text", nullable: true })
  vendor_id!: string | null;


  @Column({ type: "varchar", length: 255, nullable: true })
  payment_type!: string | null;

  @Column({ type: "text", nullable: true })
  payment_response!: string | null;

  @Column({ type: "text", nullable: true })
  payment_encrypted_response!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  date!: string | null;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  total_amount!: number | null;

  @Column({ type: "int", nullable: true })
  package_id!: number | null;

    @Column({ type: "varchar", length: 255, nullable: true })
  payment_status!: string | null;
  

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
