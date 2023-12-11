import { ChattingType } from '../types';
import { SessionData, Storage } from './types';

export class Session {
  userId: string
  chattingType: ChattingType

  private _storage: Storage

  constructor(data: SessionData, storage: Storage) {
    this.userId = data.userId;
    this.chattingType = data.chattingType

    this._storage = storage
  }

  async setChattingType(chattingType: ChattingType): Promise<void> {
    this.chattingType = chattingType
    this._saveData()
  }

  private async _saveData(): Promise<void> {
    await this._storage.set({ 
      userId: this.userId, 
      chattingType: this.chattingType
    })
  }
}