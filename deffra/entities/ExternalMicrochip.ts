import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "external_microchips" })
export class ExternalMicrochip {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id?: number;

  @Column({ type: "varchar", length: 255, default: "active" })
  microchip_number?: string;

  @Column({ type: "varchar", length: 255, default: "active" })
  site_name?: string;

  @Column({ type: "varchar", length: 255, default: "active" })
  status?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at?: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at?: Date;
}
