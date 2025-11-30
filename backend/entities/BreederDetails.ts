import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('breeder_details')
export class BreederDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  implanter_type?: string;

  @Column({ nullable: true })
  user_id?: number; // must match type of User.id

  @Column({ nullable: true })
  implanter_pin?: string;

  @Column({ nullable: true })
  breeder_licence_no?: string;

  @Column({ nullable: true })
  breeder_local_authority?: string;

  @Column({ nullable: true })
  dealer_licence_no?: string;

  @Column({ nullable: true })
  dealer_local_authority?: string;

  @Column({ nullable: true })
  local_authority?: string;
}
