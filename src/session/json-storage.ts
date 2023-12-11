import { SessionData, Sessions, Storage } from './types'
import { promisify } from 'util'
import { readFile, writeFile } from 'fs'

export class JsonStorage implements Storage {
  private _pathname: string

  constructor(pathname: string) {
    this._pathname = pathname
  }

  async get(id: string): Promise<SessionData | null> {
    const sessions = await this.getAll()
    
    return sessions[id] ?? null
}

  async getAll(): Promise<Sessions> {
    try {
      const json = await promisify(readFile)(this._pathname, 'utf8')
      return json ? JSON.parse(json) : {}
    } catch(err) {
      return this._createFile()
    }
  }

  async set(session: SessionData): Promise<void> {
    try {
      const sessions = await this.getAll();
      sessions[session.userId] = session;
      
      await promisify(writeFile)(this._pathname, JSON.stringify(sessions))
    } catch(err) {
      console.error('Error while saving session data', err)
    }
  }

  private async _createFile(): Promise<Sessions> {
    const sessions = {}

    try {
      await promisify(writeFile)(this._pathname, JSON.stringify(sessions))
    } catch(err) {
      console.error('Error while creating file', err)
    }

    return sessions
  }
}