import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("transaction_details")
export class TransactionDetails {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "int", nullable: true })
  transactionRequest_id?: number;

  @Column({ type: "decimal", nullable: true })
  amount?: number;

  @Column({ type: "text", nullable: true })
  message?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  date?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  status?: string;


  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at?: Date;
}
