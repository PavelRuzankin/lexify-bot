import { 
  Entity, 
  PrimaryGeneratedColumn, 
  PrimaryColumn, 
  CreateDateColumn,
  ManyToMany
} from 'typeorm'
import { Dictionary } from './dictionary'

@Entity()
export class Word {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @PrimaryColumn({
    type: 'varchar',
    width: 100
  })
  value: string

  @ManyToMany(() => Dictionary, (dictionary) => dictionary.words)
  dictionaries: Dictionary

  @CreateDateColumn()
  date: string
}