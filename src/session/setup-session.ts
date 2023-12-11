import process from 'process'
import { CurrentSessions } from './current-sessions'
import { Bot, ChattingType } from '../types'
import { JsonStorage } from './json-storage'

const getPathname = () => `${process.cwd()}/sessions.json`

export const setupSession = (bot: Bot) => {
  const currentSessions = new CurrentSessions(
    { chattingType: ChattingType.TEXT },
    new JsonStorage(getPathname())
  )

  bot.use(async (context, next) => {
    if(!context.session) {
      const userId = String(context.from?.id)
      context.session = await currentSessions.getSession(userId)
    }
    next()
  })
  return bot
}