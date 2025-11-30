import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity('whatsapp_templateMsg')
export class WhatsappTemplate {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id?: number;



  @Column({ type: 'varchar', length: 255 })
  msg_type!: string;


    @Column({ type: 'varchar', length: 255 })
  label!: string;


  @Column({ type: 'text'})
  message!: string;


  @Column({ type: 'varchar', length: 255, nullable: true, default: 'active' })
  status?: string;

  @Column({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at?: Date;
}
