import { 
  Entity, 
  PrimaryColumn,
  Column, 
} from 'typeorm'

@Entity()
export class UserSettings {
  @PrimaryColumn({
    type: 'varchar',
    width: 100,
  })
  userId: string

  @Column({
    type: 'varchar',
    width: 100,
    nullable: true
  })
  currScene: string | null
}