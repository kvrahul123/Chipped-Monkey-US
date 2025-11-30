import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "pages" })
export class Pages {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id?: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  type?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slug?: string;

  @Column({ type: 'longtext', nullable: true })
  content?: string;

  @Column({ type: 'text', nullable: true })
  faq_content?: string;

  @Column({ type: 'text', nullable: true })
  meta_title?: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  meta_description?: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  keywords?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  meta_image?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
  status?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
