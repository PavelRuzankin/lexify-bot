
import * as entity from '../entity'
import { dataSource } from '../data-source';

export class UserSettings {
  private _data: entity.UserSettings | null = null;
  private readonly _repository = dataSource.getRepository(entity.UserSettings)

  constructor(readonly userId: string) {}

  get currScene(): entity.UserSettings['currScene'] {
    return this._data?.currScene ?? null
  }

  setCurrScene(scene: string) {
    if(this._data) {
      this._data.currScene = scene
      this._save()
    }
  }

  removeCurrScene() {
    if(this._data) {
      this._data.currScene = null
      this._save()
    }
  }

  async init(): Promise<UserSettings> {
    let data = await this._repository.findOneBy({ 
      userId: this.userId
    })

    if(!data) {
      data = new entity.UserSettings()
      data.userId = this.userId
    }

    this._data = data

    return this
  }

  private async _save(): Promise<UserSettings> {
    try {
      if(this._data) {
        await this._repository.save(this._data)
      }
    } catch(error) {
      console.error('Error while saving settings', error)
    }

    return this
  }
}