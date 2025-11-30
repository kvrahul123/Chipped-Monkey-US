import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('blogs')
export class Blogs {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id?: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 255 })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  short_description?: string;

  @Column({ type: 'longtext', nullable: true })
  description?: string;

  @Column({ type: 'varchar',length:255, nullable: true })
  image?: string;

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

  @Column({ type: 'time', nullable: true })
  deleted_at?: string;  // stored as time
}
