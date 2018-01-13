/** Dependencies **/
import { AggregateRoot } from '@nestjs/cqrs';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/** View models **/
import { CreateBrandVM } from '../../models/view/create-brand.vm';
import { UpdateBrandVM } from '../../models/view/update-brand.vm';

@Entity('brands')
export class Brand extends AggregateRoot {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    length: 80,
    nullable: false,
  })
  public name: string;

  @Column({
    length: 80,
    nullable: false,
  })
  public website: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_date',
    nullable: false,
  })
  public createDate: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'update_date',
    nullable: false,
  })
  public updateDate: Date;

  /**
   * Method to create brand.
   *
   * @param data
   */
  public createBrand(data: CreateBrandVM): void {
    this.name = data.name;
    this.website = data.website;
  }

  /**
   * Method to update brand.
   *
   * @param data
   */
  public updateBrand(data: UpdateBrandVM): void {
    if (data.name !== undefined) {
      this.name = data.name;
    }

    if (data.website !== undefined) {
      this.website = data.website;
    }
  }

}
