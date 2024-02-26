import UserSettingsStore from './user-settings-store'
import { Bot } from '../types'

export const setupSettings = (bot: Bot): Bot => {
  const settingsStore = new UserSettingsStore()

  bot.use(async (context, next) => {
    context.settings = await settingsStore.getSettings(String(context.from?.id))
    next()
  })
  return bot
}