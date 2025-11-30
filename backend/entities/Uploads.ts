import { Entity, PrimaryGeneratedColumn, Column,ManyToOne,JoinColumn } from "typeorm";
@Entity('uploads')
export class Uploads {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255,nullable:true })
  file_name?: string;
  @Column({ type: 'varchar', length: 255,nullable:true })
  user_id?: string;
  @Column({ type: 'varchar', length: 255,nullable:true })
  file_size?: string;
  @Column({ type: 'varchar', length: 255,nullable:true })
  file_original_name?: string;



}

