import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('package_details')
export class PackageDetails {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  package_name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  price?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

}
