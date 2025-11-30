import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("whatsapp_message_log")
export class WhatsappMessageLog {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "varchar", length: 20 })
  from_number?: string;

  @Column({ type: "text" })
  message_body?: string;

  @Column({ type: "text", nullable: true })
  response_body?: string;

      @Column({ type: "varchar", length: 255,nullable: true })
      msg_type?: string;
    
  @CreateDateColumn()
  created_at?: Date;
}
