import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("implanters_amount")
export class ImplantersAmount {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ type: "int", nullable: true })
  user_id?: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    type?: string;
  
  @Column({ type: "decimal", nullable: true })
  value?: number;


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
