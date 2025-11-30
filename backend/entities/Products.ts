import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  meta_title?: string;

  @Column({ type: 'text', nullable: true })
  specifications?: string;

  @Column({ type: 'text', nullable: true })
  meta_description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  meta_img?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  meta_keywords?: string;

  @Column({ type: 'varchar', length: 255, default: 'active' })
  status?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
