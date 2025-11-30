import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("implanted_microchip")
export class ImplantedMicrochip {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ type: "int", nullable: true })
  microchip_number?: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  date?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  breeder_name?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  breeder_phone?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  breeder_email?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  status?: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at?: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at?: Date;
}
