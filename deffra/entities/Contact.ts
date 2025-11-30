import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "contact" })
export class Contact {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id?: number;

    @Column({ type: "int", nullable: true })
    user_id?: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    microchip_number?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    pet_keeper?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    phone_number?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    email?: string;

    @Column({ type: "text", nullable: true })
    address?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    country?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    pet_name?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    pet_status?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    payment_status?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    type?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    breed?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    sex?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    color?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    dob?: string;

    @Column({ type: "text", nullable: true })
    medical_condition?: string;

    @Column({ type: "text", nullable: true })
    markings?: string;

    @Column({ type: "text", nullable: true })
    photo?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    form_type?: string;

    @Column({ type: "varchar", length: 255, default: "active" })
    status?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}
