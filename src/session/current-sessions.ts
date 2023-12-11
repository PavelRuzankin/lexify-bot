import { Session } from './session'
import { InitialSessionData, Storage } from './types'

export class CurrentSessions {
  private _currentSessions = new Map<string, Session>()
  private _initialSessionData: InitialSessionData
  private _storage: Storage

  constructor(initialSessionData: InitialSessionData, storage: Storage) {
    this._initialSessionData = initialSessionData
    this._storage = storage
  }

  async getSession(userId: string): Promise<Session> {
    let session = this._currentSessions.get(userId)

    if(!session) {
      session = await this._createSession(userId) 
    }
    
    return session
  }

  private async _createSession(userId: string): Promise<Session> {
    let sessionData = await this._storage.get(userId)
    
    if(!sessionData) {
      sessionData = { userId, ...this._initialSessionData }
      await this._storage.set(sessionData)
    }

    const session = new Session(sessionData, this._storage)
    
    this._currentSessions.set(session.userId, session)
    setTimeout(() => {
      this._currentSessions.delete(session.userId)
    }, 3600000)

    return session
  }
}