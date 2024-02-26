import { UserSettings } from "./user-settings"

export default class UserSettingsStore{
  private _settings = new Map<string, UserSettings>()

  private async _createSettings(userId: string): Promise<UserSettings>  {
    const settings = new UserSettings(userId)
  
    return settings.init()
  }

  async getSettings(userId: string): Promise<UserSettings> {
    let settings = this._settings.get(userId)

    if(!settings) {
      settings = await this._createSettings(userId)
      this._settings.set(userId, settings)
    }

    return settings
  } 
}