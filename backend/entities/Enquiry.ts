import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "enquiry" })
export class Enquiry {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id?: number;


    @Column({ type: "varchar", length: 255, nullable: true })
    name?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    email?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    phone_number?: string;



    @Column({ type: "text", nullable: true })
    message?: string;


    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at?: Date;
}
