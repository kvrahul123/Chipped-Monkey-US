import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('assigned_microchips')
export class AssignedMicrochip {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id?: number;

@Column({ type: 'int' })
assigned_to!: number;

      @Column({ type: 'int',nullable: true })
  transfer_request_id!: number | null;
  
  @Column({ type: 'varchar', length: 255 })
  order_id!: string;

@Column({ type: 'int', nullable: true })
used_by?: number;

  @Column({ type: 'text', nullable: true })
  microchip_number?: string;

@Column({ type: 'date', nullable: true })
date?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  status?: string;

  @Column({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at?: Date;

}
