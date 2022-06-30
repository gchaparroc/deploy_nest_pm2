import { 
  PrimaryGeneratedColumn, 
  UpdateDateColumn, 
  CreateDateColumn, 
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Customer } from './cutomer.entity';
import { OrderItem } from './order-item.entity'
//import { User } from './../entities/user.entity';
//import { Product } from './../../products/entities/product.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class Order {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customers: Customer;

  @Exclude()
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @Expose()
  get products(){
    if (this.items) {
      return this.items
        .filter((item) => !!item)
        .map((item) => ({
          ...item.product,
          quantity: item.quantity,
          itemId: item.id,
        })); 
    }
    return [];
  }

  @Expose()
  get total(){
    if (this.items) {
      return this.items
        .filter((item) => !!item)
        .reduce((total, item) => {
          const totalItem = item.product.price * item.quantity;
          return total + totalItem;
        }, 0); 
    }
    return [];
  }
}