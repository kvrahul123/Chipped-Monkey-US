import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('blog_category')
export class BlogCategory {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id?: number;


  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "int", nullable: true })
  parent_id!: number | null;

  @Column({ type: "varchar", length: 255, unique: true })
  slug!: string;
    
    
  @Column({ type: 'varchar', length: 255, nullable: true })
  meta_title?: string;

  @Column({ type: 'varchar',length:255,nullable: true })
  meta_img?: string;

  @Column({ type: 'text', nullable: true })
  meta_description?: string;

  @Column({ type: 'text', nullable: true })
  meta_keywords?: string;

    
  @Column({ type: 'varchar', length: 255, default: 'active' })
  status!: string;

  @Column({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at?: Date;

}
