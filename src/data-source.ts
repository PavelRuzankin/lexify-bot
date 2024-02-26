import { DataSource } from 'typeorm'
import config from 'config'
import { Dictionary, Word, UserSettings } from './entity'

export const dataSource = new DataSource({
  type: "postgres",
  host: config.get('POSTGRES_HOST'),
  port: config.get('POSTGRES_PORT'),
  username: config.get('POSTGRES_USER'),
  password: config.get('POSTGRES_PASSWORD'),
  database: config.get('POSTGRES_DB_NAME'),
  synchronize: true,
  logging: true,
  entities: [UserSettings, Dictionary, Word],
  subscribers: [],
  migrations: [],
})

export const initDataSource = () => {
  try {
    return dataSource.initialize()
  } catch(error) {
    console.error("Error while initializing dataSource ")
  }
}

