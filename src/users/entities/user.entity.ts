import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MonitoredProductEntity } from '@products/entities/monitored-product.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Relationships:

  @OneToMany(
    (type) => MonitoredProductEntity,
    (monitoredProduct) => monitoredProduct.user,
  )
  products: MonitoredProductEntity[];
}
