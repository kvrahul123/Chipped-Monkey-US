import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('package_payment')
export class Package {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  order_id?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  user_id?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  package_id?: string;

   @Column({ type: 'varchar', length: 255, nullable: true })
   price?: string;
       @Column({ type: 'varchar', length: 255, nullable: true })
   purchased_date?: string;
    
  @Column({ type: 'varchar', length: 255, nullable: true })
  status?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

}
