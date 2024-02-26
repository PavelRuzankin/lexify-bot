import { Repository } from 'typeorm'
import { Session } from "./session"
import { BaseSessionEntity } from './types'

export default class SessionStore<Entity extends BaseSessionEntity> {
  _sessions = new Map<string, Session<Entity>>()

  constructor(
    private readonly _repository: Repository<Entity>,
    private readonly _entityCreator: () => Entity
  ) {}

  private async _createSession(userId: string): Promise<Session<Entity>>  {
    const session = new Session(
      userId,
      this._repository,
      this._entityCreator,
    )
  
    return session.init()
  }

  async getSession(userId: string): Promise<Session<Entity>> {
    let session = this._sessions.get(userId)

    if(!session) {
      session = await this._createSession(userId)
      this._sessions.set(userId, session)
    }

    return session
  } 
}