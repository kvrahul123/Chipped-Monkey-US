import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("transaction_request")
export class TransactionRequest {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "int", nullable: true })
  user_id?: number;

  @Column({ type: "text", nullable: true })
  transaction_id?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  sort_code?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  account_number?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  requested_amount?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  bank_name?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  account_holders_name?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  status?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at?: Date;
}
