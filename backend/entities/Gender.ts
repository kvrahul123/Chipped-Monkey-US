import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "gender_titles" })
export class Gender {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id?: number;

        @Column({ type: "varchar", length: 255, default: "active" })
    title?: number;

   

    @Column({ type: "varchar", length: 255, default: "active" })
    status?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}
