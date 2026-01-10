import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from "typeorm";

@Entity({ name: "user_subscriptions" })
export class Subscription {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id!: number;

  /** App user reference */
  @Index()
  @Column({ type: "bigint", unsigned: true })
  user_id!: number;

  /** Authorize.Net IDs */
  @Index()
  @Column({ type: "varchar", length: 50 })
  customer_profile_id!: string;

  @Index()
  @Column({ type: "varchar", length: 50 })
  payment_profile_id!: string;

  @Index()
  @Column({ type: "varchar", length: 50, nullable: true })
  subscription_id?: string;

  /** Plan / billing info */
  @Column({ type: "varchar", length: 50 })
  plan_name!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @Column({
    type: "enum",
    enum: ["monthly", "yearly", "lifetime"],
  })
  billing_cycle!: "monthly" | "yearly" | "lifetime";

  /** Card display info (safe) */
  @Column({ type: "varchar", length: 4, nullable: true })
  card_last4?: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  card_brand?: string;

  /** Subscription status */
  @Index()
  @Column({
    type: "enum",
    enum: ["pending", "active", "cancelled", "failed"],
    default: "pending",
  })
  status!: "pending" | "active" | "cancelled" | "failed";

  /** Timestamps */
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;
}
