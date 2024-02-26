import { Repository } from 'typeorm';
import { BaseSessionEntity } from './types';

export class Session<Entity extends BaseSessionEntity> {
  private _data: Entity | null = null

  constructor(
    readonly userId: string,
    private readonly _repository: Repository<Entity>,
    private readonly _entityCreator: () => Entity
  ) {}

  get data(): Entity | null {
    return this._data
  }

  async init(): Promise<Session<Entity>> {
    // @ts-ignore
    let data = await this._repository.findOneBy({ 
      userId: this.userId
    })

    if(!data) {
      data = this._entityCreator()
      data.userId = this.userId
    }

    this._data = data

    return this
  }

  setData(data: Partial<Entity>): Promise<Session<Entity>>  {
    if(this._data) {
      this._data = Object.assign(this._data, data)
    }
    return this._save()
  } 

  private async _save(): Promise<Session<Entity>> {
    try {
      if(this._data) {
        await this._repository.save(this._data)
      }
    } catch(error) {
      console.error('Error while saving session', error)
    }

    return this
  }
}