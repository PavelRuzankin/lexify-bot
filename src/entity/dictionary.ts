import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  ManyToMany,
  JoinTable
} from 'typeorm'
import { Word } from './word'

@Entity()
export class Dictionary {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    type: 'varchar',
    width: 100
  })
  userId: string

  @Column({
    type: 'varchar',
    width: 100
  })
  name: string

  @ManyToMany(() => Word, (word) => word.dictionaries)
  @JoinTable()
  words: Word[]

  @CreateDateColumn()
  date: string
} 