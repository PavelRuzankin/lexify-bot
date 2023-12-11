import { ChattingType } from '../types'

export type SessionData = {
  userId: string, 
  chattingType: ChattingType
}

export type Sessions = Record<string, SessionData>

export type InitialSessionData = Omit<SessionData, 'userId'>

export interface Storage {
  get(id: string): Promise<SessionData | null>
  getAll(): Promise<Sessions>
  set(session: SessionData): Promise<void>
}